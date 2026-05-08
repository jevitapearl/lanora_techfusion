package models

type DeployResponse struct {
	Message string `json:"message"`

	ContainerID string `json:"container_id"`

	LocalPort string `json:"local_port"`

	PublicURL string `json:"public_url"`
}