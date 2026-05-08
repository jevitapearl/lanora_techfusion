package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/lanora/backend/internal/utils"
)

func AuthMiddleware(
	jwtSecret string,
) func(http.Handler) http.Handler {

	return func(next http.Handler) http.Handler {

		return http.HandlerFunc(func(
			w http.ResponseWriter,
			r *http.Request,
		) {

			authHeader := r.Header.Get("Authorization")

			if authHeader == "" {

				utils.WriteError(
					w,
					http.StatusUnauthorized,
					"missing authorization header",
				)

				return
			}

			tokenParts := strings.Split(authHeader, " ")

			if len(tokenParts) != 2 {

				utils.WriteError(
					w,
					http.StatusUnauthorized,
					"invalid authorization format",
				)

				return
			}

			tokenString := tokenParts[1]

			userID, err := utils.ValidateJWT(
				tokenString,
				jwtSecret,
			)

			if err != nil {

				utils.WriteError(
					w,
					http.StatusUnauthorized,
					"invalid token",
				)

				return
			}

			ctx := context.WithValue(
				r.Context(),
				utils.UserIDKey,
				userID,
			)

			next.ServeHTTP(
				w,
				r.WithContext(ctx),
			)
		})
	}
}