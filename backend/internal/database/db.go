package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

const (
	host     = "localhost"
	port     = 5433
	user     = "jevita"
	password = "jevita@12345"
	dbname   = "lanora"
)

func Connect() {

	psqlInfo := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host,
		port,
		user,
		password,
		dbname,
	)

	db, err := sql.Open("postgres", psqlInfo)

	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	err = db.Ping()

	if err != nil {
		log.Fatal("Database unreachable:", err)
	}

	DB = db

	fmt.Println("Connected to PostgreSQL")
}
