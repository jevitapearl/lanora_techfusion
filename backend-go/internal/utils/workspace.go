package utils

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

func PrepareWorkspace(
	file multipart.File,
	header *multipart.FileHeader,
) (string, error) {

	ext := filepath.Ext(header.Filename)

	if ext != ".zip" {
		return "", fmt.Errorf("only zip files allowed")
	}

	projectID := uuid.New().String()

	zipPath := filepath.Join(
		"uploads",
		projectID+".zip",
	)

	dst, err := os.Create(zipPath)

	if err != nil {
		return "", err
	}

	defer dst.Close()

	_, err = io.Copy(dst, file)

	if err != nil {
		return "", err
	}

	workspacePath := filepath.Join(
		"workspaces",
		projectID,
	)

	err = os.MkdirAll(
		workspacePath,
		os.ModePerm,
	)

	if err != nil {
		return "", err
	}

	err = ExtractZip(
		zipPath,
		workspacePath,
	)

	if err != nil {
		return "", err
	}

	projectRoot := FindProjectRoot(
		workspacePath,
	)

	return projectRoot, nil
}