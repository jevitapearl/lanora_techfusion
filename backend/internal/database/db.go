package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// Use a single source of truth for config
const (
	Host     = "localhost"
	Port     = 5433
	User     = "jevita"
	Password = "jevita@12345"
	DBName   = "lanora"
)

func Connect() {
	psqlInfo := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		Host, Port, User, Password, DBName,
	)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Database unreachable:", err)
	}

	DB = db
	fmt.Println("Connected to PostgreSQL via sql.DB")
}
