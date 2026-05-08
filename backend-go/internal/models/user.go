// This file represents:
//  Database model
//  User entity

package models

import "time"

type User struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`				//Never expose password in API response
	CreatedAt time.Time `json:"created_at"`
}
