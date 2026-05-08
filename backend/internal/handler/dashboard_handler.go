package handler

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strconv"
	"strings"

	"lanora_techfusion/internal/database"
	"lanora_techfusion/internal/models"
	"lanora_techfusion/internal/utils"
)

func DashboardHandler(w http.ResponseWriter, r *http.Request) {
	var resp models.DashboardResponse
	err := database.DB.QueryRow(`
		SELECT COUNT(*) FILTER (WHERE status='running'), COALESCE(SUM(runtime_seconds),0), COUNT(*) FILTER (WHERE status='active')
		FROM sandboxes
	`).Scan(&resp.ActiveSandboxes, &resp.TotalRuntime, &resp.ActiveAgents)

	if err != nil {
		utils.Error(w, 500, err.Error())
		return
	}
	utils.JSON(w, 200, resp)
}

func AgentProxy(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/agent/")
	id, _ := strconv.Atoi(idStr)
	var port int

	err := database.DB.QueryRow(`SELECT port FROM agent_runs WHERE id=$1`, id).Scan(&port)
	if err != nil {
		utils.Error(w, 404, "Agent not found")
		return
	}

	target := fmt.Sprintf("http://localhost:%d", port)
	remote, _ := url.Parse(target)
	proxy := httputil.NewSingleHostReverseProxy(remote)
	proxy.ServeHTTP(w, r)
}

// ... existing DashboardHandler and AgentProxy ...

func SandboxesHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query(`SELECT id, name, status, runtime_seconds, storage_mb FROM sandboxes`)
	if err != nil {
		utils.Error(w, 500, err.Error())
		return
	}
	defer rows.Close()

	var sandboxes []models.Sandbox
	for rows.Next() {
		var s models.Sandbox
		rows.Scan(&s.ID, &s.Name, &s.Status, &s.Runtime, &s.Storage)
		sandboxes = append(sandboxes, s)
	}
	utils.JSON(w, 200, sandboxes)
}

func HistoryHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query(`SELECT id, agent_name, run_status, started_at FROM agent_runs ORDER BY started_at DESC`)
	if err != nil {
		utils.Error(w, 500, err.Error())
		return
	}
	defer rows.Close()

	var history []models.RunHistory
	for rows.Next() {
		var h models.RunHistory
		rows.Scan(&h.ID, &h.AgentName, &h.Status, &h.StartedAt)
		history = append(history, h)
	}
	utils.JSON(w, 200, history)
}
