package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"

)

type Config struct {
	Port string

	DBHost		string
	DBPort		string
	DBUser		string
	DBPassword	string
	DBName		string

	JWTSecret	string
}


func LoadConfig() *Config {
	err := godotenv.Load()

	if err != nil {
		log.Println(".env file not found")
	}

	return &Config{
		Port: getEnv("PORT", "8080"),

		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "postgres"),
		DBName:     getEnv("DB_NAME", "lanora"),

		JWTSecret: getEnv("JWT_SECRET", "supersecret"),
	}
}

func getEnv(key string, fallback string) string {

	value := os.Getenv(key)

	if value == "" {
		return fallback
	}

	return value
}

// LoadConfig()
//     ↓
// Read .env
//     ↓
// Store inside Config struct
//     ↓
// Used across application