// Dependency Injection Container
// It stores:
//  Database
//  Logger
//  Handlers
//  Services

package app

import (
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lanora/backend/internal/handler"
	"github.com/lanora/backend/internal/repository"
	"github.com/lanora/backend/internal/service"
	"github.com/lanora/backend/internal/config"
)

type Application struct {
	DB     *pgxpool.Pool
	Logger *slog.Logger
	AuthHandler *handler.AuthHandler
	UserHandler *handler.UserHandler
	Config *config.Config
	AgentHandler *handler.AgentHandler
	DeployHandler *handler.DeployHandler
}

func NewApplication( db *pgxpool.Pool, cfg *config.Config,) *Application {

	logger := slog.New(
		slog.NewJSONHandler(os.Stdout, nil),
	)
	userRepo := repository.NewUserRepository(db)

	authService := service.NewAuthService(
		userRepo,
		cfg.JWTSecret,
	)

	authHandler := handler.NewAuthHandler(
		authService,
	)

	userHandler := handler.NewUserHandler()

	agentService := service.NewAgentService()

	agentHanlder := handler.NewAgentHandler(
		agentService,
	)

	deployService := service.NewDeployService()

	deployHandler := handler.NewDeployHandler(
		deployService,
	)


	return &Application{
		DB:     db,

		Logger: logger,

		AuthHandler: authHandler,

		UserHandler: userHandler,

		Config: cfg,

		AgentHandler: agentHanlder,

		DeployHandler: deployHandler,

	}
}
