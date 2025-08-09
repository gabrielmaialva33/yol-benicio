package models

import (
	"database/sql"
	"time"
)

// Task represents a task/agenda item in the system
type Task struct {
	ID          int            `json:"id" db:"id"`
	Title       string         `json:"title" db:"title"`
	Description sql.NullString `json:"description,omitempty" db:"description"`
	Status      string         `json:"status" db:"status"` // pending, in_progress, completed
	DueDate     sql.NullTime   `json:"due_date,omitempty" db:"due_date"`
	FolderID    sql.NullInt64  `json:"folder_id,omitempty" db:"folder_id"`
	ClientID    sql.NullInt64  `json:"client_id,omitempty" db:"client_id"`
	AssignedTo  string         `json:"assigned_to" db:"assigned_to"`
	Priority    string         `json:"priority" db:"priority"` // low, normal, high, urgent
	Tags        sql.NullString `json:"tags,omitempty" db:"tags"`
	CreatedAt   time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at" db:"updated_at"`
	
	// Relations
	Folder *Folder `json:"folder,omitempty"`
	Client *Client `json:"client,omitempty"`
}

// TaskFilters represents filters for task queries
type TaskFilters struct {
	Status     string `query:"status"`
	Priority   string `query:"priority"`
	FolderID   int    `query:"folder_id"`
	ClientID   int    `query:"client_id"`
	AssignedTo string `query:"assigned_to"`
	DueBefore  string `query:"due_before"`
	DueAfter   string `query:"due_after"`
	Search     string `query:"search"`
	Page       int    `query:"page"`
	PageSize   int    `query:"page_size"`
	SortBy     string `query:"sort_by"`
	SortOrder  string `query:"sort_order"`
}

// PaginatedTasks represents paginated task results
type PaginatedTasks struct {
	Tasks      []Task `json:"tasks"`
	Total      int    `json:"total"`
	Page       int    `json:"page"`
	PageSize   int    `json:"page_size"`
	TotalPages int    `json:"total_pages"`
}

// TaskStats represents task statistics
type TaskStats struct {
	Total       int            `json:"total"`
	Pending     int            `json:"pending"`
	InProgress  int            `json:"in_progress"`
	Completed   int            `json:"completed"`
	Overdue     int            `json:"overdue"`
	DueToday    int            `json:"due_today"`
	DueThisWeek int            `json:"due_this_week"`
	ByPriority  map[string]int `json:"by_priority"`
}

// CreateTaskRequest represents the request to create a new task
type CreateTaskRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	Status      string `json:"status"`
	DueDate     string `json:"due_date"`
	FolderID    int    `json:"folder_id"`
	ClientID    int    `json:"client_id"`
	AssignedTo  string `json:"assigned_to"`
	Priority    string `json:"priority"`
	Tags        string `json:"tags"`
}

// UpdateTaskRequest represents the request to update a task
type UpdateTaskRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	DueDate     string `json:"due_date"`
	FolderID    int    `json:"folder_id"`
	ClientID    int    `json:"client_id"`
	AssignedTo  string `json:"assigned_to"`
	Priority    string `json:"priority"`
	Tags        string `json:"tags"`
}