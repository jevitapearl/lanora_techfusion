package handler

import (
	"net/http"

	"github.com/lanora/backend/internal/service"
	"github.com/lanora/backend/internal/utils"
)

type AgentHandler struct {
	agentService *service.AgentService
}

func NewAgentHandler(
	agentService *service.AgentService,
) *AgentHandler {

	return &AgentHandler{
		agentService: agentService,
	}
}

func (h *AgentHandler) TestAgent(
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

	response, err := h.agentService.TestAgent(
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

	utils.WriteJSON(
		w,
		http.StatusOK,
		response,
	)
}