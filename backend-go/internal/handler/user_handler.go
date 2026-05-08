package handler

import (
	"net/http"

	"github.com/lanora/backend/internal/utils"
)

type UserHandler struct{}

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

func (h *UserHandler) Me(
	w http.ResponseWriter,
	r *http.Request,
) {

	userID := r.Context().
		Value(utils.UserIDKey)

	utils.WriteJSON(
		w,
		http.StatusOK,
		map[string]interface{}{
			"message": "protected route accessed",
			"user_id": userID,
		},
	)
}

// Middleware works
//  JWT validation works
//  Context injection works