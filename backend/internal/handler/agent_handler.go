package handler

import (
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

func TestAgent(w http.ResponseWriter, r *http.Request) {
	if r.ParseMultipartForm(10<<20) != nil {
		utils.Error(w, 400, "Cannot parse form")
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		utils.Error(w, 400, "File not received")
		return
	}
	defer file.Close()

	uploadDir := "uploads"
	os.MkdirAll(uploadDir, os.ModePerm)
	filePath := filepath.Join(uploadDir, handler.Filename)
	out, _ := os.Create(filePath)
	io.Copy(out, file)
	out.Close()

	agentName := strings.TrimSuffix(handler.Filename, ".zip")
	startTime := time.Now()
	var runID int

	err = database.DB.QueryRow(`INSERT INTO agent_runs (agent_name, run_status, started_at) VALUES ($1, $2, $3) RETURNING id`, agentName, "running", startTime).Scan(&runID)

	imageName, err := service.BuildDockerImage(filePath)
	if err != nil {
		database.DB.Exec(`UPDATE agent_runs SET run_status=$1, finished_at=$2 WHERE id=$3`, "failed", time.Now(), runID)
		utils.JSON(w, 500, map[string]string{"status": "error", "stage": "build", "error": err.Error()})
		return
	}

	logs, err := service.RunDockerContainer(imageName)
	status := "success"
	if err != nil {
		status = "failed"
	}

	database.DB.Exec(`UPDATE agent_runs SET run_status=$1, finished_at=$2 WHERE id=$3`, status, time.Now(), runID)

	utils.JSON(w, 200, map[string]interface{}{"status": status, "logs": logs})
}

// Add TestAgentStream, TestAgentWS, and DeployAgent logic here following the same pattern
