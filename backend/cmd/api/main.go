package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/adapters/legacy"
	"github.com/gabrielmaialva33/yol-benicio-api/internal/ai/providers/gemini"
	"github.com/gabrielmaialva33/yol-benicio-api/internal/ai/providers/nvidia"
	"github.com/gabrielmaialva33/yol-benicio-api/internal/api/handlers"
	"github.com/gabrielmaialva33/yol-benicio-api/internal/api/middleware"
	"github.com/gabrielmaialva33/yol-benicio-api/pkg/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Conectar ao banco de dados
	db, err := legacy.NewDatabase(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Inicializar providers de AI
	var geminiClient *gemini.Client
	var nvidiaClient *nvidia.Client

	// Tentar inicializar Gemini
	if cfg.Gemini.APIKey != "" {
		geminiClient, err = gemini.NewClient(&cfg.Gemini)
		if err != nil {
			log.Printf("Warning: Failed to initialize Gemini client: %v", err)
		}
	} else {
		log.Println("Warning: Gemini API key not configured")
	}

	// Tentar inicializar NVIDIA
	if cfg.NVIDIA.APIKey != "" {
		nvidiaClient, err = nvidia.NewClient(&cfg.NVIDIA)
		if err != nil {
			log.Printf("Warning: Failed to initialize NVIDIA client: %v", err)
		}
	} else {
		log.Println("Warning: NVIDIA API key not configured")
	}

	// Create Fiber application
	app := fiber.New(fiber.Config{
		AppName:      "YOL-Benicio API",
		ErrorHandler: customErrorHandler,
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.Server.CORSOrigin,
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	}))

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"service": "yol-benicio-api",
			"version": "1.0.0",
		})
	})

	// Inicializar handlers
	authHandler := handlers.NewAuthHandler(db, cfg)
	clientHandler := handlers.NewClientHandler(db.DB)
	dashboardHandler := handlers.NewDashboardHandler(db.DB)
	folderHandler := handlers.NewFolderHandler(db.DB)
	taskHandler := handlers.NewTaskHandler(db.DB)
	var aiHandler *handlers.AIHandler
	if geminiClient != nil || nvidiaClient != nil {
		aiHandler = handlers.NewAIHandler(geminiClient, nvidiaClient)
	}

	// API Routes
	api := app.Group("/api")

	// Auth endpoints (public)
	auth := api.Group("/auth")
	auth.Post("/login", authHandler.Login)
	auth.Post("/refresh", authHandler.Refresh)
	auth.Post("/logout", authHandler.Logout)
	
	// Protected auth endpoint
	auth.Get("/me", middleware.JWTMiddleware(cfg.JWT.Secret), authHandler.Me)

	// Temporarily disable JWT middleware for development
	// TODO: Re-enable JWT protection once frontend token management is implemented
	
	// Clients endpoints
	api.Get("/clients", clientHandler.ListClients)
	api.Get("/clients/:id", clientHandler.GetClient)

	// Dashboard endpoints
	dashboard := api.Group("/dashboard")
	dashboard.Get("/active-folders", dashboardHandler.GetActiveFolders)
	dashboard.Get("/favorite-clients", dashboardHandler.GetFavoriteClients)
	
	// Other dashboard-related endpoints
	api.Get("/folder-activity", dashboardHandler.GetFolderActivity)
	api.Get("/area-division", dashboardHandler.GetAreaDivision)
	api.Get("/requests", dashboardHandler.GetRequests)
	api.Get("/hearings", dashboardHandler.GetHearings)
	api.Get("/birthdays", dashboardHandler.GetBirthdays)

	// AI endpoints (optional)
	if aiHandler != nil {
		ai := api.Group("/ai")
		ai.Get("/health", aiHandler.HealthCheck)
		ai.Post("/analyze-case", aiHandler.AnalyzeCase)
		ai.Post("/quick-summary", aiHandler.QuickSummary)
		ai.Post("/extract-data", aiHandler.ExtractData)
		ai.Post("/classify-document", aiHandler.ClassifyDocument)
		ai.Post("/smart-process", aiHandler.SmartProcess)
	}

	// Folders endpoints
	api.Get("/folders", folderHandler.ListFolders)
	api.Get("/folders/stats", folderHandler.GetFolderStats)
	api.Get("/folders/:id", folderHandler.GetFolder)
	api.Post("/folders", folderHandler.CreateFolder)
	api.Put("/folders/:id", folderHandler.UpdateFolder)
	api.Delete("/folders/:id", folderHandler.DeleteFolder)
	api.Patch("/folders/:id/favorite", folderHandler.ToggleFavorite)
	api.Get("/folders/consultation/:id", folderHandler.GetFolderForConsultation)
	
	// Tasks endpoints
	api.Get("/tasks", taskHandler.ListTasks)
	api.Get("/tasks/stats", taskHandler.GetTaskStats)
	api.Get("/tasks/:id", taskHandler.GetTask)
	api.Post("/tasks", taskHandler.CreateTask)
	api.Put("/tasks/:id", taskHandler.UpdateTask)
	api.Delete("/tasks/:id", taskHandler.DeleteTask)
	api.Get("/folders/:folder_id/tasks", taskHandler.GetTasksForFolder)
	api.Get("/clients/:client_id/tasks", taskHandler.GetTasksForClient)

	// Graceful shutdown
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
		<-sigChan

		log.Println("Shutting down server...")
		if err := app.Shutdown(); err != nil {
			log.Printf("Server shutdown error: %v", err)
		}
		
		// Fechar clientes AI
		if geminiClient != nil {
			geminiClient.Close()
		}
	}()

	// Iniciar servidor
	port := cfg.Server.Port
	log.Printf("Server starting on port %s", port)
	log.Printf("Environment: %s", cfg.Server.Env)
	log.Printf("CORS Origin: %s", cfg.Server.CORSOrigin)
	
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal Server Error"

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
		message = e.Message
	}

	return c.Status(code).JSON(fiber.Map{
		"error": message,
		"code":  code,
	})
}