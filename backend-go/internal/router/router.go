// Creates chi router
// Applies middleware
// Registers routes

package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/lanora/backend/internal/middleware"

	"github.com/lanora/backend/internal/app"
)

func SetupRouter(app *app.Application) http.Handler {

	r := chi.NewRouter()

	// CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
		},
		AllowedHeaders: []string{"*"},
	}))

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Lanora Backend Running"))
	})


	r.Route("/auth", func(r chi.Router) {

		r.Post("/register", app.AuthHandler.Register)

		r.Post("/login", app.AuthHandler.Login)
	})

	r.Route("/api", func(r chi.Router) {

		r.Use(
			middleware.AuthMiddleware(
				app.Config.JWTSecret,
			),
		)

		r.Post(
			"/agent/test",
			app.AgentHandler.TestAgent,
		)

		r.Post(
			"/agent/deploy",
			app.DeployHandler.DeployAgent,
		)

		r.Get("/me", app.UserHandler.Me)


	})

	return r
}


// WHY HEALTH ROUTE?
// Used for:
//  Server testing
//  Docker checks
//  Kubernetes health probes
//  Load balancer checks