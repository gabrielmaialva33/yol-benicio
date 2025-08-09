package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Database DatabaseConfig
	Gemini   GeminiConfig
	NVIDIA   NVIDIAConfig
	JWT      JWTConfig
	Server   ServerConfig
}

type DatabaseConfig struct {
	Host            string
	Port            int
	Name            string
	User            string
	Password        string
	SSLMode         string
	MaxConnections  int
	IdleConnections int
}

type GeminiConfig struct {
	APIKey string
	Model  string
}

type NVIDIAConfig struct {
	APIKey  string
	BaseURL string
	Model   string
}

type JWTConfig struct {
	Secret              string
	Expiry              string
	RefreshTokenExpiry  string
}

type ServerConfig struct {
	Port       string
	CORSOrigin string
	Env        string
}

func Load() *Config {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	return &Config{
		Database: DatabaseConfig{
			Host:            getEnv("DB_HOST", "localhost"),
			Port:            getEnvAsInt("DB_PORT", 5432),
			Name:            getEnv("DB_NAME", "benicio"),
			User:            getEnv("DB_USER", "postgres"),
			Password:        getEnv("DB_PASSWORD", ""),
			SSLMode:         getEnv("DB_SSL_MODE", "disable"),
			MaxConnections:  getEnvAsInt("DB_MAX_CONNECTIONS", 100),
			IdleConnections: getEnvAsInt("DB_IDLE_CONNECTIONS", 10),
		},
		Gemini: GeminiConfig{
			APIKey: getEnv("GEMINI_API_KEY", ""),
			Model:  getEnv("GEMINI_MODEL", "gemini-pro"),
		},
		NVIDIA: NVIDIAConfig{
			APIKey:  getEnv("NVIDIA_API_KEY", ""),
			BaseURL: getEnv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1"),
			Model:   getEnv("NVIDIA_MODEL", "qwen/qwen3-235b-a22b"),
		},
		JWT: JWTConfig{
			Secret:             getEnv("JWT_SECRET", "default-secret-change-in-production"),
			Expiry:             getEnv("JWT_EXPIRY", "15m"),
			RefreshTokenExpiry: getEnv("REFRESH_TOKEN_EXPIRY", "168h"),
		},
		Server: ServerConfig{
			Port:       getEnv("PORT", "8080"),
			CORSOrigin: getEnv("CORS_ORIGIN", "http://localhost:5173"),
			Env:        getEnv("ENV", "development"),
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}
