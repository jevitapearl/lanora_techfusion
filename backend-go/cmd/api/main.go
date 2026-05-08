package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/lanora/backend/internal/app"
	"github.com/lanora/backend/internal/config"
	"github.com/lanora/backend/internal/database"
	"github.com/lanora/backend/internal/router"
)

func main() {

	// Load Config
	cfg := config.LoadConfig()

	// Database Connection
	db, err := database.NewPostgresConnection(cfg)

	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	// Create Application
	application := app.NewApplication(db, cfg)

	// Setup Router
	r := router.SetupRouter(application)

	// HTTP Server
	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	// Run Server
	go func() {

		log.Println(" Server running on port", cfg.Port)

		if err := server.ListenAndServe(); err != nil &&
			err != http.ErrServerClosed {

			log.Fatal(err)
		}
	}()

	// Graceful Shutdown
	stop := make(chan os.Signal, 1)

	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	<-stop

	log.Println(" Shutting down server...")

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("shutdown failed:", err)
	}

	log.Println(" Server exited properly")
}

// Flow 

// main()
//   ↓
// Load Config
//   ↓
// Connect DB
//   ↓
// Create App Container
//   ↓
// Setup Router
//   ↓
// Start HTTP Server
//   ↓
// Wait for OS Signal
//   ↓
// Graceful Shutdown