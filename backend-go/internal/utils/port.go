package utils

import (
	"fmt"
	"net"
)

func GetFreePort() (string, error) {

	addr, err := net.ResolveTCPAddr(
		"tcp",
		"localhost:0",
	)

	if err != nil {
		return "", err
	}

	listener, err := net.ListenTCP(
		"tcp",
		addr,
	)

	if err != nil {
		return "", err
	}

	defer listener.Close()

	port := listener.Addr().(*net.TCPAddr).Port

	return fmt.Sprintf("%d", port), nil
}