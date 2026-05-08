package models

type User struct {
	ID       uint   `json:"id"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}