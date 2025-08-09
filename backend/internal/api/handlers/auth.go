package handlers

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gabrielmaialva33/yol-benicio-api/internal/adapters/legacy"
	"github.com/gabrielmaialva33/yol-benicio-api/pkg/config"
)

type AuthHandler struct {
	db       *legacy.Database
	userRepo *legacy.UserRepository
	config   *config.Config
}

func NewAuthHandler(db *legacy.Database, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		db:       db,
		userRepo: legacy.NewUserRepository(db.DB),
		config:   cfg,
	}
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type LoginResponse struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refreshToken"`
	User         User   `json:"user"`
}

type User struct {
	ID       string  `json:"id"`
	Email    string  `json:"email"`
	Name     string  `json:"name"`
	Role     string  `json:"role"`
	ClientID *string `json:"clientId,omitempty"`
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// First, try to find the user in the database
	user, err := h.userRepo.FindByEmail(req.Email)
	if err != nil {
		// If user not found in database, check for test credentials
		if req.Email == "test@benicio.com.br" && req.Password == "benicio123" {
			// Create test user response
			testUser := User{
				ID:    "1",
				Email: req.Email,
				Name:  "Test User",
				Role:  "admin",
			}
			return h.generateTokenResponse(c, testUser)
		}
		
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// Validate password
	if !h.userRepo.ValidatePassword(user, req.Password) {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// Check if user is active
	if !user.IsActive {
		return c.Status(403).JSON(fiber.Map{
			"error": "Account is disabled",
		})
	}

	// Create user response object
	userResponse := User{
		ID:       strconv.Itoa(user.ID),
		Email:    user.Email,
		Name:     user.FullName,
		Role:     user.Role,
		ClientID: user.ClientID,
	}

	return h.generateTokenResponse(c, userResponse)
}

func (h *AuthHandler) generateTokenResponse(c *fiber.Ctx, user User) error {
	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":   user.ID,
		"email":     user.Email,
		"role":      user.Role,
		"client_id": user.ClientID,
		"exp":       time.Now().Add(15 * time.Minute).Unix(),
		"iat":       time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(h.config.JWT.Secret))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	// Generate refresh token
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"type":    "refresh",
		"exp":     time.Now().Add(168 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	})

	refreshTokenString, err := refreshToken.SignedString([]byte(h.config.JWT.Secret))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to generate refresh token",
		})
	}

	return c.JSON(LoginResponse{
		Token:        tokenString,
		RefreshToken: refreshTokenString,
		User:         user,
	})
}

func (h *AuthHandler) Me(c *fiber.Ctx) error {
	// Get user ID from JWT context (set by middleware)
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// Parse user ID
	id, err := strconv.Atoi(fmt.Sprintf("%v", userID))
	if err != nil {
		// Handle test user case
		if fmt.Sprintf("%v", userID) == "1" {
			return c.JSON(User{
				ID:    "1",
				Email: "test@benicio.com.br",
				Name:  "Test User",
				Role:  "admin",
			})
		}
		
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	// Find user in database
	user, err := h.userRepo.FindByID(id)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.JSON(User{
		ID:       strconv.Itoa(user.ID),
		Email:    user.Email,
		Name:     user.FullName,
		Role:     user.Role,
		ClientID: user.ClientID,
	})
}

func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	// Get refresh token from request
	refreshToken := c.Get("Authorization")
	if refreshToken == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Refresh token required",
		})
	}

	// Remove "Bearer " prefix if present
	if len(refreshToken) > 7 && refreshToken[:7] == "Bearer " {
		refreshToken = refreshToken[7:]
	}

	// Parse and validate refresh token
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(h.config.JWT.Secret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid refresh token",
		})
	}

	// Extract claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	// Check if it's a refresh token
	tokenType, _ := claims["type"].(string)
	if tokenType != "refresh" {
		return c.Status(401).JSON(fiber.Map{
			"error": "Not a refresh token",
		})
	}

	// Get user ID from claims
	userID, _ := claims["user_id"].(string)

	// Find user in database
	id, _ := strconv.Atoi(userID)
	user, err := h.userRepo.FindByID(id)
	if err != nil {
		// Handle test user case
		if userID == "1" {
			testUser := User{
				ID:    "1",
				Email: "test@benicio.com.br",
				Name:  "Test User",
				Role:  "admin",
			}
			return h.generateTokenResponse(c, testUser)
		}
		
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Generate new tokens
	userResponse := User{
		ID:       strconv.Itoa(user.ID),
		Email:    user.Email,
		Name:     user.FullName,
		Role:     user.Role,
		ClientID: user.ClientID,
	}

	return h.generateTokenResponse(c, userResponse)
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	// In a production system, you would:
	// 1. Add the token to a blacklist
	// 2. Clear any server-side sessions
	// 3. Invalidate refresh tokens

	return c.JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}