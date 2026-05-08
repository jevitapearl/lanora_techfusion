package service

import (
	"database/sql"
	"errors"
	"time"

	"lanora_techfusion/internal/database"
	"lanora_techfusion/internal/middleware"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(email string, password string) error {

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return err
	}

	_, err = database.DB.Exec(
		"INSERT INTO users (email, password) VALUES ($1, $2)",
		email,
		string(hashedPassword),
	)

	return err
}

func LoginUser(email string, password string) (string, error) {

	var storedPassword string

	err := database.DB.QueryRow(
		"SELECT password FROM users WHERE email=$1",
		email,
	).Scan(&storedPassword)

	if err == sql.ErrNoRows {
		return "", errors.New("user not found")
	}

	if err != nil {
		return "", err
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(storedPassword),
		[]byte(password),
	)

	if err != nil {
		return "", errors.New("invalid password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"iat":   time.Now().Unix(),
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString(middleware.SECRET_KEY)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
