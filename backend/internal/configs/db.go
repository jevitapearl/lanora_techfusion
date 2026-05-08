package configs

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// env
const (
	host     = "localhost"
	port     = 5433
	user     = "jevita"
	password = "jevita@12345"
	dbname   = "lanora"
)

// Connect opens DB connection
func Connect() {
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host,
		port,
		user,
		password,
		dbname,
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	DB = database

	fmt.Println("Successfully connected to PostgreSQL")
}

// GetDB returns active DB instance
func GetDB() *gorm.DB {
	return DB
}