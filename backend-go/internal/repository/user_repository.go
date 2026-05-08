// ONLY database queries.
// NO business logic.


package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/lanora/backend/internal/models"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) CreateUser(
	user *models.User,
) error {

	query := `
	INSERT INTO users (
		name,
		email,
		password
	)
	VALUES ($1, $2, $3)
	RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	err := r.db.QueryRow(
		ctx,
		query,
		user.Name,
		user.Email,
		user.Password,
	).Scan(
		&user.ID,
		&user.CreatedAt,
	)

	return err
}

func (r *UserRepository) GetUserByEmail(
	email string,
) (*models.User, error) {

	query := `
	SELECT
		id,
		name,
		email,
		password,
		created_at
	FROM users
	WHERE email = $1
	`

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	user := &models.User{}

	err := r.db.QueryRow(
		ctx,
		query,
		email,
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}


// Repository ONLY interacts with DB.
// Notice:
//  No JWT
//  No hashing
//  No HTTP
// PURE database layer.