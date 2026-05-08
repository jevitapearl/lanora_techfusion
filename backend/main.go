package main

import (
	"fmt"
	"net/http"

	"lanora_techfusion/internal/database"
	"lanora_techfusion/internal/handler"
	"lanora_techfusion/internal/middleware"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	database.Connect()

	mux := http.NewServeMux()

	// Auth
	mux.HandleFunc("/api/register", handler.Register)
	mux.HandleFunc("/api/login", handler.Login)

	// Auth protected
	mux.Handle("/api/test-agent", middleware.JWTAuth(http.HandlerFunc(handler.TestAgent)))
	// mux.Handle("/api/deploy-agent", middleware.JWTAuth(http.HandlerFunc(handler.DeployAgent)))

	// Dashboard
	mux.Handle("/api/dashboard", middleware.JWTAuth(http.HandlerFunc(handler.DashboardHandler)))
	mux.HandleFunc("/agent/", handler.AgentProxy)

	fmt.Println("Server started at :5000")
	http.ListenAndServe(":5000", enableCORS(mux))
}
