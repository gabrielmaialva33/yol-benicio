package handlers

import (
	"strconv"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/adapters/legacy"
	"github.com/gabrielmaialva33/yol-benicio-api/internal/domain/models"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

// TaskHandler handles task-related requests
type TaskHandler struct {
	repo *legacy.TaskRepository
}

// NewTaskHandler creates a new task handler
func NewTaskHandler(db *sqlx.DB) *TaskHandler {
	return &TaskHandler{
		repo: legacy.NewTaskRepository(db),
	}
}

// ListTasks returns a paginated list of tasks
func (h *TaskHandler) ListTasks(c *fiber.Ctx) error {
	filters := new(models.TaskFilters)
	if err := c.QueryParser(filters); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid query parameters",
		})
	}
	
	result, err := h.repo.List(filters)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch tasks",
			"details": err.Error(),
		})
	}
	
	// Convert to frontend expected format
	response := fiber.Map{
		"data": result.Tasks,
		"meta": fiber.Map{
			"total":        result.Total,
			"per_page":     result.PageSize,
			"current_page": result.Page,
			"last_page":    result.TotalPages,
			"first_page":   1,
		},
	}
	
	return c.JSON(response)
}

// GetTask returns a single task by ID
func (h *TaskHandler) GetTask(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}
	
	task, err := h.repo.GetByID(id)
	if err != nil {
		if err.Error() == "task not found" {
			return c.Status(404).JSON(fiber.Map{
				"error": "Task not found",
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch task",
			"details": err.Error(),
		})
	}
	
	return c.JSON(task)
}

// GetTaskStats returns task statistics
func (h *TaskHandler) GetTaskStats(c *fiber.Ctx) error {
	stats, err := h.repo.GetStats()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch task statistics",
			"details": err.Error(),
		})
	}
	
	return c.JSON(stats)
}

// CreateTask creates a new task (not supported in legacy mode)
func (h *TaskHandler) CreateTask(c *fiber.Ctx) error {
	req := new(models.CreateTaskRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	
	// Validate required fields
	if req.Title == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Title is required",
		})
	}
	
	task, err := h.repo.Create(req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create task",
			"details": err.Error(),
		})
	}
	
	return c.Status(201).JSON(task)
}

// UpdateTask updates a task (not supported in legacy mode)
func (h *TaskHandler) UpdateTask(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}
	
	req := new(models.UpdateTaskRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	
	task, err := h.repo.Update(id, req)
	if err != nil {
		if err.Error() == "task not found" {
			return c.Status(404).JSON(fiber.Map{
				"error": "Task not found",
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to update task",
			"details": err.Error(),
		})
	}
	
	return c.JSON(task)
}

// DeleteTask deletes a task (not supported in legacy mode)
func (h *TaskHandler) DeleteTask(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}
	
	err = h.repo.Delete(id)
	if err != nil {
		if err.Error() == "task not found" {
			return c.Status(404).JSON(fiber.Map{
				"error": "Task not found",
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to delete task",
			"details": err.Error(),
		})
	}
	
	return c.JSON(fiber.Map{
		"message": "Task deleted successfully",
	})
}

// GetTasksForFolder returns tasks for a specific folder
func (h *TaskHandler) GetTasksForFolder(c *fiber.Ctx) error {
	folderID, err := strconv.Atoi(c.Params("folder_id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid folder ID",
		})
	}
	
	filters := &models.TaskFilters{
		FolderID: folderID,
		Page:     1,
		PageSize: 50,
	}
	
	// Parse additional query parameters
	if err := c.QueryParser(filters); err == nil {
		filters.FolderID = folderID // Ensure folder ID is not overwritten
	}
	
	result, err := h.repo.List(filters)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch tasks",
			"details": err.Error(),
		})
	}
	
	return c.JSON(result)
}

// GetTasksForClient returns tasks for a specific client
func (h *TaskHandler) GetTasksForClient(c *fiber.Ctx) error {
	clientID, err := strconv.Atoi(c.Params("client_id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid client ID",
		})
	}
	
	filters := &models.TaskFilters{
		ClientID: clientID,
		Page:     1,
		PageSize: 50,
	}
	
	// Parse additional query parameters
	if err := c.QueryParser(filters); err == nil {
		filters.ClientID = clientID // Ensure client ID is not overwritten
	}
	
	result, err := h.repo.List(filters)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch tasks",
			"details": err.Error(),
		})
	}
	
	return c.JSON(result)
}