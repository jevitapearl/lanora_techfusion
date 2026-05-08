package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

var SECRET_KEY = []byte("your-secret-key")

type contextKey string

const UserEmailKey contextKey = "userEmail"

func JWTAuth(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			http.Error(w, "Missing Authorization Header", http.StatusUnauthorized)
			return
		}

		// Expecting format:
		// Authorization: Bearer <token>

		parts := strings.Split(authHeader, " ")

		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid Authorization Format", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

			// Validate signing method
			_, ok := token.Method.(*jwt.SigningMethodHMAC)

			if !ok {
				return nil, jwt.ErrSignatureInvalid
			}

			return SECRET_KEY, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)

		if !ok {
			http.Error(w, "Invalid Claims", http.StatusUnauthorized)
			return
		}

		email, ok := claims["email"].(string)

		if !ok {
			http.Error(w, "Invalid Email Claim", http.StatusUnauthorized)
			return
		}

		// Store email in request context
		ctx := context.WithValue(r.Context(), UserEmailKey, email)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}