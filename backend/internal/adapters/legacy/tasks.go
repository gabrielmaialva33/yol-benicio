package legacy

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/domain/models"
	"github.com/jmoiron/sqlx"
)

// TaskRepository handles task database operations
type TaskRepository struct {
	db *sqlx.DB
}

// NewTaskRepository creates a new task repository
func NewTaskRepository(db *sqlx.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

// List returns a paginated list of tasks with filters
func (r *TaskRepository) List(filters *models.TaskFilters) (*models.PaginatedTasks, error) {
	// Default values
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 50
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}
	
	// Build query with filters
	whereConditions := []string{"1=1"}
	args := []interface{}{}
	argCount := 0
	
	// Status filter
	if filters.Status != "" {
		argCount++
		whereConditions = append(whereConditions, fmt.Sprintf("status = $%d", argCount))
		args = append(args, filters.Status)
	}
	
	// Priority filter
	if filters.Priority != "" {
		argCount++
		whereConditions = append(whereConditions, fmt.Sprintf("priority = $%d", argCount))
		args = append(args, filters.Priority)
	}
	
	// Folder ID filter
	if filters.FolderID > 0 {
		argCount++
		whereConditions = append(whereConditions, fmt.Sprintf("folder_id = $%d", argCount))
		args = append(args, filters.FolderID)
	}
	
	// Client ID filter
	if filters.ClientID > 0 {
		argCount++
		whereConditions = append(whereConditions, fmt.Sprintf("client_id = $%d", argCount))
		args = append(args, filters.ClientID)
	}
	
	// Assigned to filter
	if filters.AssignedTo != "" {
		argCount++
		whereConditions = append(whereConditions, fmt.Sprintf("assigned_to ILIKE $%d", argCount))
		args = append(args, "%"+filters.AssignedTo+"%")
	}
	
	// Due date filters
	if filters.DueBefore != "" {
		if t, err := time.Parse("2006-01-02", filters.DueBefore); err == nil {
			argCount++
			whereConditions = append(whereConditions, fmt.Sprintf("due_date <= $%d", argCount))
			args = append(args, t)
		}
	}
	
	if filters.DueAfter != "" {
		if t, err := time.Parse("2006-01-02", filters.DueAfter); err == nil {
			argCount++
			whereConditions = append(whereConditions, fmt.Sprintf("due_date >= $%d", argCount))
			args = append(args, t)
		}
	}
	
	// Search filter
	if filters.Search != "" {
		argCount++
		whereConditions = append(whereConditions, fmt.Sprintf("(title ILIKE $%d OR description ILIKE $%d)", argCount, argCount))
		args = append(args, "%"+filters.Search+"%")
	}
	
	whereClause := strings.Join(whereConditions, " AND ")
	
	// Count total records
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM tasks WHERE %s", whereClause)
	var total int
	err := r.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, fmt.Errorf("error counting tasks: %v", err)
	}
	
	// Calculate pagination
	offset := (filters.Page - 1) * filters.PageSize
	totalPages := (total + filters.PageSize - 1) / filters.PageSize
	
	// Determine sort order
	sortBy := "created_at"
	if filters.SortBy != "" {
		allowedSorts := map[string]bool{
			"id": true, "title": true, "status": true, 
			"priority": true, "due_date": true, 
			"created_at": true, "updated_at": true,
		}
		if allowedSorts[filters.SortBy] {
			sortBy = filters.SortBy
		}
	}
	
	sortOrder := "DESC"
	if filters.SortOrder == "asc" {
		sortOrder = "ASC"
	}
	
	// Build main query
	query := fmt.Sprintf(`
		SELECT 
			id, title, description, status, due_date,
			folder_id, client_id, assigned_to, priority, tags,
			created_at, updated_at
		FROM tasks 
		WHERE %s
		ORDER BY %s %s
		LIMIT $%d OFFSET $%d
	`, whereClause, sortBy, sortOrder, argCount+1, argCount+2)
	
	args = append(args, filters.PageSize, offset)
	
	// Execute query
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("error querying tasks: %v", err)
	}
	defer rows.Close()
	
	tasks := []models.Task{}
	for rows.Next() {
		var task models.Task
		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.DueDate,
			&task.FolderID,
			&task.ClientID,
			&task.AssignedTo,
			&task.Priority,
			&task.Tags,
			&task.CreatedAt,
			&task.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning task: %v", err)
		}
		tasks = append(tasks, task)
	}
	
	return &models.PaginatedTasks{
		Tasks:      tasks,
		Total:      total,
		Page:       filters.Page,
		PageSize:   filters.PageSize,
		TotalPages: totalPages,
	}, nil
}

// GetByID returns a task by ID
func (r *TaskRepository) GetByID(id int) (*models.Task, error) {
	query := `
		SELECT 
			id, title, description, status, due_date,
			folder_id, client_id, assigned_to, priority, tags,
			created_at, updated_at
		FROM tasks 
		WHERE id = $1
	`
	
	var task models.Task
	err := r.db.QueryRow(query, id).Scan(
		&task.ID,
		&task.Title,
		&task.Description,
		&task.Status,
		&task.DueDate,
		&task.FolderID,
		&task.ClientID,
		&task.AssignedTo,
		&task.Priority,
		&task.Tags,
		&task.CreatedAt,
		&task.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("task not found")
	}
	if err != nil {
		return nil, fmt.Errorf("error getting task: %v", err)
	}
	
	return &task, nil
}

// GetStats returns task statistics
func (r *TaskRepository) GetStats() (*models.TaskStats, error) {
	stats := &models.TaskStats{
		ByPriority: make(map[string]int),
	}
	
	// Get total count
	err := r.db.QueryRow("SELECT COUNT(*) FROM tasks").Scan(&stats.Total)
	if err != nil {
		return nil, fmt.Errorf("error getting total tasks: %v", err)
	}
	
	// Get counts by status
	statusQuery := `
		SELECT 
			COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
			COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
			COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
		FROM tasks
	`
	err = r.db.QueryRow(statusQuery).Scan(&stats.Pending, &stats.InProgress, &stats.Completed)
	if err != nil {
		return nil, fmt.Errorf("error getting status counts: %v", err)
	}
	
	// Get overdue count
	overdueQuery := `
		SELECT COUNT(*) FROM tasks 
		WHERE status != 'completed' 
		AND due_date IS NOT NULL 
		AND due_date < CURRENT_DATE
	`
	err = r.db.QueryRow(overdueQuery).Scan(&stats.Overdue)
	if err != nil {
		return nil, fmt.Errorf("error getting overdue count: %v", err)
	}
	
	// Get due today count
	dueTodayQuery := `
		SELECT COUNT(*) FROM tasks 
		WHERE status != 'completed' 
		AND due_date IS NOT NULL 
		AND DATE(due_date) = CURRENT_DATE
	`
	err = r.db.QueryRow(dueTodayQuery).Scan(&stats.DueToday)
	if err != nil {
		return nil, fmt.Errorf("error getting due today count: %v", err)
	}
	
	// Get due this week count
	dueThisWeekQuery := `
		SELECT COUNT(*) FROM tasks 
		WHERE status != 'completed' 
		AND due_date IS NOT NULL 
		AND due_date >= CURRENT_DATE 
		AND due_date <= CURRENT_DATE + INTERVAL '7 days'
	`
	err = r.db.QueryRow(dueThisWeekQuery).Scan(&stats.DueThisWeek)
	if err != nil {
		return nil, fmt.Errorf("error getting due this week count: %v", err)
	}
	
	// Get counts by priority
	priorityQuery := `
		SELECT priority, COUNT(*) 
		FROM tasks 
		GROUP BY priority
	`
	rows, err := r.db.Query(priorityQuery)
	if err != nil {
		return nil, fmt.Errorf("error getting priority counts: %v", err)
	}
	defer rows.Close()
	
	for rows.Next() {
		var priority string
		var count int
		if err := rows.Scan(&priority, &count); err == nil {
			stats.ByPriority[priority] = count
		}
	}
	
	return stats, nil
}

// Create creates a new task (not implemented for legacy DB)
func (r *TaskRepository) Create(req *models.CreateTaskRequest) (*models.Task, error) {
	// Since we're using a view on legacy data, we can't create new tasks
	// This would require inserting into the original open_agendas table
	return nil, fmt.Errorf("creating tasks is not supported in legacy mode")
}

// Update updates a task (not implemented for legacy DB)
func (r *TaskRepository) Update(id int, req *models.UpdateTaskRequest) (*models.Task, error) {
	// Since we're using a view on legacy data, we can't update tasks
	// This would require updating the original open_agendas table
	return nil, fmt.Errorf("updating tasks is not supported in legacy mode")
}

// Delete deletes a task (not implemented for legacy DB)
func (r *TaskRepository) Delete(id int) error {
	// Since we're using a view on legacy data, we can't delete tasks
	// This would require deleting from the original open_agendas table
	return fmt.Errorf("deleting tasks is not supported in legacy mode")
}