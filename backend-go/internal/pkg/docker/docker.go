package docker

import (
	"context"
	//"io"
	"path/filepath"
	"time"
	"bytes"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
)

type ExecutionResult struct {
	Logs string
}

func RunPythonAgent(
	workspacePath string,
) (*ExecutionResult, error) {

	ctx := context.Background()

	// absolute path required for docker mounts
	absoluteWorkspacePath, err := filepath.Abs(
		workspacePath,
	)

	if err != nil {
		return nil, err
	}

	// docker client
	cli, err := client.NewClientWithOpts(
		client.FromEnv,
		client.WithAPIVersionNegotiation(),
	)

	if err != nil {
		return nil, err
	}

	// create isolated sandbox container
	resp, err := cli.ContainerCreate(
		ctx,

		&container.Config{
			Image: BasePythonImage,

			WorkingDir: ContainerWorkDir,

			Cmd: []string{
				"sh",
				"-c",
				"pip install --root-user-action=ignore --no-cache-dir -r requirements.txt && python main.py",
			},

			Tty: false,
		},

		&container.HostConfig{

			// remove automatically after stop
			//AutoRemove: true,

			// disable internet access
			NetworkMode: "none",

			// sandbox resource limits
			Resources: container.Resources{
				Memory: MaxMemory,

				CPUShares: CPUShares,
			},

			// mount extracted project
			Mounts: []mount.Mount{
				{
					Type: mount.TypeBind,

					Source: absoluteWorkspacePath,

					Target: ContainerWorkDir,
				},
			},
		},

		nil,
		nil,
		"",
	)

	if err != nil {
		return nil, err
	}

	containerID := resp.ID

	// start container
	err = cli.ContainerStart(
		ctx,
		containerID,
		container.StartOptions{},
	)

	if err != nil {
		return nil, err
	}

	// wait until execution completes
	statusCh, errCh := cli.ContainerWait(
		ctx,
		containerID,
		container.WaitConditionNotRunning,
	)

	select {

	case err := <-errCh:
		if err != nil {
			return nil, err
		}

	case <-statusCh:
	}

	// collect logs
	logReader, err := cli.ContainerLogs(
		ctx,
		containerID,
		container.LogsOptions{
			ShowStdout: true,
			ShowStderr: true,
		},
	)

	if err != nil {
		return nil, err
	}

	defer logReader.Close()

	// new log code 
	var stdout bytes.Buffer
var stderr bytes.Buffer

_, err = stdcopy.StdCopy(
	&stdout,
	&stderr,
	logReader,
)

if err != nil {
	return nil, err
}

cleanLogs := stdout.String() + stderr.String()


	// stop container gracefully
timeout := 2 * time.Second

	cli.ContainerStop(
		ctx,
		containerID,
		container.StopOptions{
			Timeout: &[]int{
				int(timeout.Seconds()),
			}[0],
		},
	)

	// remove container manually
	cli.ContainerRemove(
		ctx,
		containerID,
		container.RemoveOptions{
			Force: true,
		},
	)

	if err != nil {
		return nil, err
	}

	return &ExecutionResult{
		Logs: cleanLogs,
	}, nil
}