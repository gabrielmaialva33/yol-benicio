package handlers

import (
	"strconv"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/adapters/legacy"
	"github.com/gabrielmaialva33/yol-benicio-api/internal/domain/models"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

// FolderHandler handles folder-related requests
type FolderHandler struct {
	repo *legacy.FolderRepository
}

// NewFolderHandler creates a new folder handler
func NewFolderHandler(db *sqlx.DB) *FolderHandler {
	return &FolderHandler{
		repo: legacy.NewFolderRepository(db),
	}
}

// ListFolders returns a paginated list of folders
func (h *FolderHandler) ListFolders(c *fiber.Ctx) error {
	// Parse query parameters
	filters := new(models.FolderFilters)
	if err := c.QueryParser(filters); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid query parameters",
		})
	}
	
	// Get folders from repository
	result, err := h.repo.List(filters)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to list folders",
			"details": err.Error(),
		})
	}
	
	// Return paginated response
	return c.JSON(result)
}

// GetFolder returns a single folder by ID
func (h *FolderHandler) GetFolder(c *fiber.Ctx) error {
	// Parse ID from URL
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid folder ID",
		})
	}
	
	// Get folder from repository
	folder, err := h.repo.FindByID(id)
	if err != nil {
		if err.Error() == "folder not found" {
			return c.Status(404).JSON(fiber.Map{
				"error": "Folder not found",
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to get folder",
			"details": err.Error(),
		})
	}
	
	return c.JSON(folder)
}

// GetFolderForConsultation returns folder details for client consultation
func (h *FolderHandler) GetFolderForConsultation(c *fiber.Ctx) error {
	// Parse ID from URL
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid folder ID",
		})
	}
	
	// Get folder from repository
	folder, err := h.repo.FindByID(id)
	if err != nil {
		if err.Error() == "folder not found" {
			return c.Status(404).JSON(fiber.Map{
				"error": "Folder not found",
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to get folder",
			"details": err.Error(),
		})
	}
	
	// For consultation, we might want to filter sensitive information
	// based on user role (implement later with JWT middleware)
	
	return c.JSON(folder)
}

// CreateFolder creates a new folder
func (h *FolderHandler) CreateFolder(c *fiber.Ctx) error {
	// Parse request body
	var folder models.Folder
	if err := c.BodyParser(&folder); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	
	// Create folder
	err := h.repo.Create(&folder)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create folder",
			"details": err.Error(),
		})
	}
	
	return c.Status(201).JSON(folder)
}

// UpdateFolder updates an existing folder
func (h *FolderHandler) UpdateFolder(c *fiber.Ctx) error {
	// Parse ID from URL
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid folder ID",
		})
	}
	
	// Parse request body
	var folder models.Folder
	if err := c.BodyParser(&folder); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	
	// Set ID from URL
	folder.ID = id
	
	// Update folder
	err = h.repo.Update(&folder)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to update folder",
			"details": err.Error(),
		})
	}
	
	return c.JSON(folder)
}

// DeleteFolder deletes a folder
func (h *FolderHandler) DeleteFolder(c *fiber.Ctx) error {
	// Parse ID from URL
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid folder ID",
		})
	}
	
	// Delete folder
	err = h.repo.Delete(id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to delete folder",
			"details": err.Error(),
		})
	}
	
	return c.JSON(fiber.Map{
		"message": "Folder deleted successfully",
	})
}

// ToggleFavorite toggles the favorite status of a folder
func (h *FolderHandler) ToggleFavorite(c *fiber.Ctx) error {
	// Parse ID from URL
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid folder ID",
		})
	}
	
	// Get user ID from context (will be set by JWT middleware)
	userID := 1 // Hardcoded for now, will get from JWT context
	
	// Toggle favorite
	err = h.repo.ToggleFavorite(id, userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to toggle favorite",
			"details": err.Error(),
		})
	}
	
	return c.JSON(fiber.Map{
		"message": "Favorite toggled successfully",
	})
}

// GetFolderStats returns folder statistics
func (h *FolderHandler) GetFolderStats(c *fiber.Ctx) error {
	// Parse client ID from query if provided
	var clientID *int
	if clientIDStr := c.Query("client_id"); clientIDStr != "" {
		id, err := strconv.Atoi(clientIDStr)
		if err == nil {
			clientID = &id
		}
	}
	
	// Get stats from repository
	stats, err := h.repo.GetStats(clientID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to get folder stats",
			"details": err.Error(),
		})
	}
	
	return c.JSON(fiber.Map{
		"data": stats,
	})
}