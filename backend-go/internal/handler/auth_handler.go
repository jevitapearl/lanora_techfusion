// HTTP layer ONLY.

package handler

import (
	"encoding/json"
	"net/http"

	"github.com/lanora/backend/internal/models"
	"github.com/lanora/backend/internal/service"
	"github.com/lanora/backend/internal/utils"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(
	authService *service.AuthService,
) *AuthHandler {

	return &AuthHandler{
		authService: authService,
	}
}

func (h *AuthHandler) Register(
	w http.ResponseWriter,
	r *http.Request,
) {

	var req models.RegisterRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		utils.WriteError(
			w,
			http.StatusBadRequest,
			"invalid request body",
		)
		return
	}

	response, err := h.authService.Register(&req)

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
		http.StatusCreated,
		response,
	)
}

func (h *AuthHandler) Login(
	w http.ResponseWriter,
	r *http.Request,
) {

	var req models.LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		utils.WriteError(
			w,
			http.StatusBadRequest,
			"invalid request body",
		)
		return
	}

	response, err := h.authService.Login(&req)

	if err != nil {
		utils.WriteError(
			w,
			http.StatusUnauthorized,
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

//flow
// Decode Request
//     ↓
// Call Service
//     ↓
// Return JSON Response