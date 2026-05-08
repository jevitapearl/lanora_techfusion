package ngrok

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"time"
)

type TunnelResponse struct {
	Tunnels []struct {
		PublicURL string `json:"public_url"`
	} `json:"tunnels"`
}

func StartTunnel(port string) (string, error) {

	cmd := exec.Command(
		"ngrok",
		"http",
		port,
	)

	err := cmd.Start()

	if err != nil {
		return "", err
	}

	// wait ngrok startup
	time.Sleep(3 * time.Second)

	resp, err := http.Get(
		"http://127.0.0.1:4040/api/tunnels",
	)

	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	var tunnelResp TunnelResponse

	err = json.NewDecoder(resp.Body).Decode(
		&tunnelResp,
	)

	if err != nil {
		return "", err
	}

	if len(tunnelResp.Tunnels) == 0 {
		return "", fmt.Errorf("no ngrok tunnels found")
	}

	return tunnelResp.Tunnels[0].PublicURL, nil
}
