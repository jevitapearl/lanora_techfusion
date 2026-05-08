package handler

import (
	"net/http"

	"github.com/lanora/backend/internal/service"
	"github.com/lanora/backend/internal/utils"
)

type DeployHandler struct {
	deployService *service.DeployService
}

func NewDeployHandler(
	deployService *service.DeployService,
) *DeployHandler {

	return &DeployHandler{
		deployService: deployService,
	}
}

func (h *DeployHandler) DeployAgent(
	w http.ResponseWriter,
	r *http.Request,
) {

	file, header, err := r.FormFile("file")

	if err != nil {

		utils.WriteError(
			w,
			http.StatusBadRequest,
			"file upload required",
		)

		return
	}

	defer file.Close()

	workspacePath, err := utils.PrepareWorkspace(
		file,
		header,
	)

	if err != nil {

		utils.WriteError(
			w,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	response, err := h.deployService.DeployAgent(
		workspacePath,
	)

	if err != nil {

		utils.WriteError(
			w,
			http.StatusInternalServerError,
			err.Error(),
		)

		return
	}

	utils.WriteJSON(
		w,
		http.StatusOK,
		response,
	)
}
