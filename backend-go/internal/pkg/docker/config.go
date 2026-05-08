package docker

const (
	BasePythonImage = "python:3.11-slim"

	ContainerWorkDir = "/app"

	MaxMemory = 512 * 1024 * 1024 // 512MB

	CPUShares = 512
)