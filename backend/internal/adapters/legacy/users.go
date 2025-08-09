package legacy

import (
	"database/sql"
	"fmt"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/domain/models"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

// UserRepository handles user database operations
type UserRepository struct {
	db *sqlx.DB
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{db: db}
}

// FindByEmail finds a user by email
func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, full_name, role, client_id, is_active, created_at, updated_at
		FROM users
		WHERE email = $1 AND is_active = true
		LIMIT 1
	`
	
	var user models.User
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.FullName,
		&user.Role,
		&user.ClientID,
		&user.IsActive,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	
	return &user, nil
}

// FindByID finds a user by ID
func (r *UserRepository) FindByID(id int) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, full_name, role, client_id, is_active, created_at, updated_at
		FROM users
		WHERE id = $1 AND is_active = true
		LIMIT 1
	`
	
	var user models.User
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.FullName,
		&user.Role,
		&user.ClientID,
		&user.IsActive,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	
	return &user, nil
}

// Create creates a new user
func (r *UserRepository) Create(user *models.User) error {
	// Hash password before saving
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("error hashing password: %v", err)
	}
	
	query := `
		INSERT INTO users (email, password_hash, full_name, role, client_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`
	
	err = r.db.QueryRow(
		query,
		user.Email,
		string(hashedPassword),
		user.FullName,
		user.Role,
		user.ClientID,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
	
	if err != nil {
		return fmt.Errorf("error creating user: %v", err)
	}
	
	user.IsActive = true
	return nil
}

// Update updates a user
func (r *UserRepository) Update(user *models.User) error {
	query := `
		UPDATE users
		SET email = $1, full_name = $2, role = $3, client_id = $4, updated_at = CURRENT_TIMESTAMP
		WHERE id = $5
		RETURNING updated_at
	`
	
	err := r.db.QueryRow(
		query,
		user.Email,
		user.FullName,
		user.Role,
		user.ClientID,
		user.ID,
	).Scan(&user.UpdatedAt)
	
	if err != nil {
		return fmt.Errorf("error updating user: %v", err)
	}
	
	return nil
}

// UpdatePassword updates a user's password
func (r *UserRepository) UpdatePassword(userID int, newPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("error hashing password: %v", err)
	}
	
	query := `
		UPDATE users
		SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
	`
	
	_, err = r.db.Exec(query, string(hashedPassword), userID)
	if err != nil {
		return fmt.Errorf("error updating password: %v", err)
	}
	
	return nil
}

// ValidatePassword validates a user's password
func (r *UserRepository) ValidatePassword(user *models.User, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	return err == nil
}