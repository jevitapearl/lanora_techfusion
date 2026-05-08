package service

import (
	"context"
	"errors"
	"io"
	"os/exec"
	"time"
)

func RunDockerContainer(image string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "docker", "run", "--rm", "--memory=256m", "--cpus=0.5", "--pids-limit=100", "--network=none", "--read-only", "--cap-drop=ALL", "--security-opt=no-new-privileges", "--user=1000:1000", image)

	output, err := cmd.CombinedOutput()
	if ctx.Err() == context.DeadlineExceeded {
		return string(output), errors.New("Container killed: execution timeout exceeded")
	}
	return string(output), err
}

func RunDockerContainerStream(image string, send func(string)) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "docker", "run", "--rm", "--memory=256m", "--cpus=0.5", "--pids-limit=100", "--network=none", "--read-only", "--cap-drop=ALL", "--security-opt=no-new-privileges", "--user=1000:1000", image)

	stdout, _ := cmd.StdoutPipe()
	stderr, _ := cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		send("[ERROR] Failed to start container\n")
		return err
	}

	stream := func(pipe io.ReadCloser) {
		buf := make([]byte, 1024)
		for {
			n, err := pipe.Read(buf)
			if n > 0 {
				send(string(buf[:n]))
			}
			if err != nil {
				break
			}
		}
	}

	go stream(stdout)
	go stream(stderr)

	err := cmd.Wait()
	if ctx.Err() == context.DeadlineExceeded {
		send("\n[ERROR] Timeout exceeded\n")
		return errors.New("timeout")
	}
	if err != nil {
		send("\n[ERROR] Container failed\n")
		return err
	}

	send("\n[SUCCESS] Execution completed\n")
	return nil
}
