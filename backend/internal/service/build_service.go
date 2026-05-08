package service

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/google/uuid"
)

func BuildDockerImage(zipPath string) (string, error) {
	reader, err := zip.OpenReader(zipPath)
	if err != nil {
		return "", err
	}
	defer reader.Close()

	id := uuid.NewString()
	baseDir := filepath.Dir(zipPath)
	extractDir := filepath.Join(baseDir, id)
	os.MkdirAll(extractDir, 0755)

	for _, f := range reader.File {
		if err := unzipFile(f, extractDir); err != nil {
			return "", err
		}
	}

	projectDir := findProjectRoot(extractDir)
	return buildImage(projectDir, id)
}

func findProjectRoot(extractDir string) string {
	if _, err := os.Stat(filepath.Join(extractDir, "requirements.txt")); err == nil {
		return extractDir
	}
	entries, _ := os.ReadDir(extractDir)
	for _, e := range entries {
		if e.IsDir() {
			candidate := filepath.Join(extractDir, e.Name())
			if _, err := os.Stat(filepath.Join(candidate, "requirements.txt")); err == nil {
				return candidate
			}
		}
	}
	return extractDir
}

func buildImage(projectDir string, id string) (string, error) {
	imageName := "agent-" + id
	dockerfile := "FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD [\"python\",\"main.py\"]"

	os.WriteFile(filepath.Join(projectDir, "Dockerfile"), []byte(dockerfile), 0644)

	cmd := exec.Command("docker", "build", "-t", imageName, ".")
	cmd.Dir = projectDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("docker build failed:\n%s", string(output))
	}

	return imageName, nil
}

func unzipFile(file *zip.File, extractDir string) error {
	filePath := filepath.Join(extractDir, file.Name)
	if file.FileInfo().IsDir() {
		return os.MkdirAll(filePath, 0755)
	}

	os.MkdirAll(filepath.Dir(filePath), 0755)
	destFile, _ := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	defer destFile.Close()
	srcFile, _ := file.Open()
	defer srcFile.Close()
	io.Copy(destFile, srcFile)
	return nil
}
