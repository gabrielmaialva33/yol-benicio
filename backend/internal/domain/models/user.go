package models

import (
	"time"
)

// User represents a system user
type User struct {
	ID           int       `json:"id" db:"id"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	FullName     string    `json:"full_name" db:"full_name"`
	Role         string    `json:"role" db:"role"`
	ClientID     *string   `json:"client_id,omitempty" db:"client_id"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// UserRole constants
const (
	RoleAdmin  = "admin"
	RoleLawyer = "lawyer"
	RoleClient = "client"
)

// HasRole checks if user has a specific role
func (u *User) HasRole(role string) bool {
	return u.Role == role
}

// IsAdmin checks if user is an admin
func (u *User) IsAdmin() bool {
	return u.Role == RoleAdmin
}

// IsLawyer checks if user is a lawyer
func (u *User) IsLawyer() bool {
	return u.Role == RoleLawyer
}

// IsClient checks if user is a client
func (u *User) IsClient() bool {
	return u.Role == RoleClient
}

// CanAccessClient checks if user can access a specific client's data
func (u *User) CanAccessClient(clientID string) bool {
	// Admins and lawyers can access any client
	if u.IsAdmin() || u.IsLawyer() {
		return true
	}
	
	// Clients can only access their own data
	if u.IsClient() && u.ClientID != nil {
		return *u.ClientID == clientID
	}
	
	return false
}