// | Concept             | Why Important           |
// | ------------------- | ----------------------- |
// | JWT validation      | Auth security           |
// | Middleware chaining | Production architecture |
// | Context injection   | Request-scoped data     |
// | Protected routes    | Authorization           |
// | Token parsing       | Identity extraction     |


package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(
	userID string,
	secret string,
) (string, error) {

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp": time.Now().
			Add(24 * time.Hour).
			Unix(),
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)

	return token.SignedString([]byte(secret))
}

func ValidateJWT(
	tokenString string,
	secret string,
) (string, error) {

	token, err := jwt.Parse(
		tokenString,
		func(token *jwt.Token) (interface{}, error) {

			return []byte(secret), nil
		},
	)

	if err != nil || !token.Valid {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return "", err
	}

	userID, ok := claims["user_id"].(string)

	if !ok {
		return "", err
	}

	return userID, nil
}


//flow
// User Login
//    ↓
// Generate token
//    ↓
// Send token to client
//    ↓
// Client stores token
//    ↓
// Protected APIs use token