package utils

import (
	"os"
	"path/filepath"
)

func FindProjectRoot(
	workspacePath string,
) string {

	var detectedRoot string

	filepath.Walk(
		workspacePath,

		func(
			path string,
			info os.FileInfo,
			err error,
		) error {

			if err != nil {
				return nil
			}

			// detect requirements.txt
			if info.Name() == "requirements.txt" {

				detectedRoot = filepath.Dir(path)
			}

			return nil
		},
	)

	// fallback
	if detectedRoot == "" {
		return workspacePath
	}

	return detectedRoot
}