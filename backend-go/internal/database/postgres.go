// Creates PostgreSQL connection
// Uses connection pooling
// Verifies DB health
// Returns reusable DB pool

package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/lanora/backend/internal/config"
)

func NewPostgresConnection(cfg *config.Config) (*pgxpool.Pool, error) {

	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBName,
	)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db, err := pgxpool.New(ctx, dsn)

	if err != nil {
		return nil, err
	}

	err = db.Ping(ctx)

	if err != nil {
		return nil, err
	}

	log.Println(" Database connected")

	return db, nil
}

// concepts 

// Connection Pooling 
// Context Timeout
