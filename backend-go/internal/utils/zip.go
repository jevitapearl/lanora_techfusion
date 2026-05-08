package utils

import (
	"archive/zip"
	"io"
	"os"
	"path/filepath"
)

func ExtractZip(
	src string,
	dest string,
) error {

	reader, err := zip.OpenReader(src)

	if err != nil {
		return err
	}

	defer reader.Close()

	for _, file := range reader.File {

		filePath := filepath.Join(
			dest,
			file.Name,
		)

		// create directories
		if file.FileInfo().IsDir() {

			os.MkdirAll(
				filePath,
				os.ModePerm,
			)

			continue
		}

		// create parent dirs
		os.MkdirAll(
			filepath.Dir(filePath),
			os.ModePerm,
		)

		dstFile, err := os.Create(filePath)

		if err != nil {
			return err
		}

		srcFile, err := file.Open()

		if err != nil {
			dstFile.Close()
			return err
		}

		_, err = io.Copy(dstFile, srcFile)

		dstFile.Close()
		srcFile.Close()

		if err != nil {
			return err
		}
	}

	return nil
}