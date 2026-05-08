package docker

import (
	"context"
	"fmt"
	"path/filepath"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	"github.com/lanora/backend/internal/utils"
)

type DeploymentResult struct {
	ContainerID string
	Port string
}

func DeployPythonAgent(
	workspacePath string,
) (*DeploymentResult, error) {

	ctx := context.Background()

	absoluteWorkspacePath, err := filepath.Abs(
		workspacePath,
	)

	if err != nil {
		return nil, err
	}

	cli, err := client.NewClientWithOpts(
		client.FromEnv,
		client.WithAPIVersionNegotiation(),
	)

	if err != nil {
		return nil, err
	}

	hostPort, err := utils.GetFreePort()

	if err != nil {
		return nil, err
	}

	resp, err := cli.ContainerCreate(
		ctx,

		&container.Config{
			Image: BasePythonImage,

			WorkingDir: ContainerWorkDir,

			ExposedPorts: nat.PortSet{
				"8000/tcp": struct{}{},
			},

			Cmd: []string{
				"sh",
				"-c",
				"pip install --root-user-action=ignore --no-cache-dir -r requirements.txt && python main.py",
			},
		},

		&container.HostConfig{

			PortBindings: nat.PortMap{
				"8000/tcp": []nat.PortBinding{
					{
						HostIP: "0.0.0.0",
						HostPort: hostPort,
					},
				},
			},

			Resources: container.Resources{
				Memory: MaxMemory,
				CPUShares: CPUShares,
			},

			Mounts: []mount.Mount{
				{
					Type: mount.TypeBind,

					Source: absoluteWorkspacePath,

					Target: ContainerWorkDir,
				},
			},
		},

		&network.NetworkingConfig{},
		nil,
		"",
	)

	if err != nil {
		return nil, err
	}

	containerID := resp.ID

	err = cli.ContainerStart(
		ctx,
		containerID,
		container.StartOptions{},
	)

	if err != nil {
		return nil, err
	}

	fmt.Println("Deployment Container Started:", containerID)

	return &DeploymentResult{
		ContainerID: containerID,
		Port: hostPort,
	}, nil
}