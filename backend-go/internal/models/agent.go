package models

type TestAgentResponse struct {
	Message string `json:"message"`

	ProjectPath string `json:"project_path"`

	Logs string `json:"logs"`
}

