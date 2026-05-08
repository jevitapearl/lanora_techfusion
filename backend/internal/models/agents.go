package models

type TestAgentRequest struct {
	Image string `json:"image"`
}

type DashboardResponse struct {
	ActiveSandboxes int `json:"active_sandboxes"`
	TotalRuntime    int `json:"total_runtime"`
	ActiveAgents    int `json:"active_agents"`
}

type Sandbox struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Status  string `json:"status"`
	Runtime int    `json:"runtime"`
	Storage int    `json:"storage"`
}

type RunHistory struct {
	ID        int    `json:"id"`
	AgentName string `json:"agent_name"`
	Status    string `json:"status"`
	StartedAt string `json:"started_at"`
}

type ResourceUsage struct {
	MemoryMB int `json:"memory_mb"`
	Runtime  int `json:"runtime"`
	Tokens   int `json:"tokens"`
	GPU      int `json:"gpu"`
}
