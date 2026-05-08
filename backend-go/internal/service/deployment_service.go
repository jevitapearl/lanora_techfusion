package service

import (
	dockerpkg "github.com/lanora/backend/internal/pkg/docker"
	ngrokpkg "github.com/lanora/backend/internal/pkg/ngrok"
	"github.com/lanora/backend/internal/models"
)

type DeployService struct{}

func NewDeployService() *DeployService {
	return &DeployService{}
}

func (s *DeployService) DeployAgent(
	projectRoot string,
) (*models.DeployResponse, error) {

	deployment, err := dockerpkg.DeployPythonAgent(
		projectRoot,
	)

	if err != nil {
		return nil, err
	}

	publicURL, err := ngrokpkg.StartTunnel(
		deployment.Port,
	)

	if err != nil {
		return nil, err
	}

	return &models.DeployResponse{
		Message: "agent deployed successfully",

		ContainerID: deployment.ContainerID,

		LocalPort: deployment.Port,

		PublicURL: publicURL,
	}, nil
}