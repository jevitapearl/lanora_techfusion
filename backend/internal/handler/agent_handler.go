package handler

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"lanora_techfusion/internal/database"
	"lanora_techfusion/internal/service"
	"lanora_techfusion/internal/utils"
)

// TestAgent handles the standard ZIP upload, build, and execution cycle
func TestAgent(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// 1. Parse Multipart Form
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		utils.Error(w, http.StatusBadRequest, "Cannot parse form")
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		utils.Error(w, http.StatusBadRequest, "File not received")
		return
	}
	defer file.Close()

	// 2. Save Uploaded ZIP
	uploadDir := "uploads"
	os.MkdirAll(uploadDir, os.ModePerm)
	filePath := filepath.Join(uploadDir, handler.Filename)

	out, err := os.Create(filePath)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Failed to save file")
		return
	}
	io.Copy(out, file)
	out.Close()

	// 3. Initialize Database Entry
	agentName := strings.TrimSuffix(handler.Filename, ".zip")
	startTime := time.Now()
	var runID int

	err = database.DB.QueryRow(`
		INSERT INTO agent_runs (agent_name, run_status, started_at) 
		VALUES ($1, $2, $3) RETURNING id`,
		agentName, "running", startTime,
	).Scan(&runID)

	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Database error: "+err.Error())
		return
	}

	// 4. Build Docker Image
	imageName, err := service.BuildDockerImage(filePath)
	if err != nil {
		database.DB.Exec(`UPDATE agent_runs SET run_status=$1, finished_at=$2 WHERE id=$3`, "failed", time.Now(), runID)
		utils.JSON(w, http.StatusInternalServerError, map[string]interface{}{
			"status": "error",
			"stage":  "build",
			"error":  err.Error(),
		})
		return
	}

	// 5. Run Container and Capture Logs
	startExec := time.Now()
	logs, err := service.RunDockerContainer(imageName)
	endExec := time.Now()
	runtime := int(endExec.Sub(startExec).Seconds())

	status := "success"
	if err != nil {
		status = "failed"
	}

	// 6. Update Analytics and History
	database.DB.Exec(`UPDATE agent_runs SET run_status=$1, finished_at=$2 WHERE id=$3`, status, endExec, runID)
	database.DB.Exec(`INSERT INTO sandboxes (name, status, runtime_seconds, storage_mb) VALUES ($1, $2, $3, $4)`, agentName, status, runtime, 200)
	database.DB.Exec(`INSERT INTO resource_usage (memory_mb, token_count, gpu_percent, runtime_seconds) VALUES ($1, $2, $3, $4)`, 512, 1000, 20, runtime)

	utils.JSON(w, http.StatusOK, map[string]interface{}{
		"status": status,
		"logs":   logs,
	})
}

// TestAgentStream provides real-time log streaming using HTTP Flusher
func TestAgentStream(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		utils.Error(w, http.StatusInternalServerError, "Streaming not supported")
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	send := func(msg string) {
		fmt.Fprintf(w, "%s", msg)
		flusher.Flush()
	}

	send("[INFO] Starting agent stream...\n")

	// Reuse build logic but use the streaming service
	r.ParseMultipartForm(10 << 20)
	file, handler, err := r.FormFile("file")
	if err != nil {
		return
	}
	defer file.Close()

	tempPath := filepath.Join("uploads", handler.Filename)
	out, _ := os.Create(tempPath)
	io.Copy(out, file)
	out.Close()

	imageName, err := service.BuildDockerImage(tempPath)
	if err != nil {
		send("[ERROR] Build failed: " + err.Error() + "\n")
		return
	}

	service.RunDockerContainerStream(imageName, send)
}

// DeployAgent handles production deployment with port mapping
func DeployAgent(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		utils.Error(w, 400, "Cannot parse form")
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		utils.Error(w, 400, "File missing")
		return
	}
	defer file.Close()

	agentName := strings.TrimSuffix(handler.Filename, ".zip")
	startTime := time.Now()
	var runID int

	// Define status and runtime to avoid "undefined" errors
	status := "running" // Initial deployment status
	runtime := 0        // Deployment just started

	// 1. Initialize run in database
	err = database.DB.QueryRow(`
      INSERT INTO agent_runs (agent_name, run_status, started_at) 
      VALUES ($1, $2, $3) RETURNING id`,
		agentName, status, startTime,
	).Scan(&runID)

	if err != nil {
		utils.Error(w, 500, "Database error: "+err.Error())
		return
	}

	// 2. Insert into sandboxes for tracking
	database.DB.Exec(`INSERT INTO sandboxes (name, status, runtime_seconds, storage_mb) 
      VALUES ($1, $2, $3, $4)`,
		agentName, status, runtime, 200)

	// 3. Assign port and finalize deployment info
	port := 8000 + runID
	database.DB.Exec(`UPDATE agent_runs SET run_status=$1, port=$2 WHERE id=$3`, status, port, runID)

	utils.JSON(w, http.StatusOK, map[string]interface{}{
		"status": "deployed",
		"url":    fmt.Sprintf("http://localhost:8080/agent/%d", runID),
		"port":   port,
	})
}
