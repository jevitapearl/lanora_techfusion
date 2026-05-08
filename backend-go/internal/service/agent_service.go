package service

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"

	"github.com/lanora/backend/internal/models"
	"github.com/lanora/backend/internal/utils"
	dockerpkg "github.com/lanora/backend/internal/pkg/docker"
)

type AgentService struct{}

func NewAgentService() *AgentService {
	return &AgentService{}
}

func (s *AgentService) TestAgent(
	file multipart.File,
	header *multipart.FileHeader,
) (*models.TestAgentResponse, error) {

	// validate zip
	ext := filepath.Ext(header.Filename)

	if ext != ".zip" {
		return nil, fmt.Errorf(
			"only zip files allowed",
		)
	}

	// unique project id
	projectID := uuid.New().String()

	zipPath := filepath.Join(
		"uploads",
		projectID+".zip",
	)

	// save zip
	dst, err := os.Create(zipPath)

	if err != nil {
		return nil, err
	}

	defer dst.Close()

	_, err = io.Copy(dst, file)

	if err != nil {
		return nil, err
	}

	// workspace path
	workspacePath := filepath.Join(
		"workspaces",
		projectID,
	)

	err = os.MkdirAll(
		workspacePath,
		os.ModePerm,
	)

	if err != nil {
		return nil, err
	}

	// extract zip
	err = utils.ExtractZip(
		zipPath,
		workspacePath,
	)

	// adding the code for the project path (finding) reference for the utils/project.go
	projectRoot := utils.FindProjectRoot(
	workspacePath,
	)

	fmt.Println("Detected Project Root:", projectRoot)

	if err != nil {
		return nil, err
	}

	time.Sleep(1 * time.Second)

	result, err := dockerpkg.RunPythonAgent(
		projectRoot,
	)

	if err != nil {
		return nil, err
	}

	return &models.TestAgentResponse{
		Message: "agent executed successfully",

		ProjectPath: workspacePath,

		Logs: result.Logs,
	}, nil
}


// FLOW

// only Validation and workflow and extraction perfect task manager is happening

// no http handling
