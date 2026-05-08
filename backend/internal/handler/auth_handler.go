package handler

import (
	"encoding/json"
	"net/http"

	"lanora_techfusion/internal/models"
	"lanora_techfusion/internal/service"
	"lanora_techfusion/internal/utils"
)

func Register(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		utils.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.RegisterRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		utils.Error(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	if req.Email == "" || req.Password == "" {
		utils.Error(w, http.StatusBadRequest, "Missing fields")
		return
	}

	err = service.RegisterUser(req.Email, req.Password)

	if err != nil {
		utils.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.JSON(w, http.StatusCreated, map[string]string{
		"message": "User registered successfully",
	})
}

func Login(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		utils.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		utils.Error(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	token, err := service.LoginUser(req.Email, req.Password)

	if err != nil {
		utils.Error(w, http.StatusUnauthorized, err.Error())
		return
	}

	utils.JSON(w, http.StatusOK, map[string]string{
		"token": token,
	})
}
