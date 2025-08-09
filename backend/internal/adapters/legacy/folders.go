package legacy

import (
	"database/sql"
	"fmt"
	"math"
	"strings"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/domain/models"
	"github.com/jmoiron/sqlx"
)

// FolderRepository handles folder database operations
type FolderRepository struct {
	db *sqlx.DB
}

// NewFolderRepository creates a new folder repository
func NewFolderRepository(db *sqlx.DB) *FolderRepository {
	return &FolderRepository{db: db}
}

// List returns paginated folders with filters
func (r *FolderRepository) List(filters *models.FolderFilters) (*models.PaginatedFolders, error) {
	filters.SetDefaults()
	
	// Base query using the folders view
	baseQuery := `
		SELECT 
			id, cnj_number, COALESCE(cnj_number, 'Processo ' || id::text) as title,
			object_description as description, status, area, sub_area,
			court, forum, court_division, active_party, passive_party,
			object_description, value, client_id, responsible_lawyer,
			phase, is_special, has_injunction, prognosis, false as is_favorite,
			created_at, updated_at
		FROM folders
		WHERE 1=1
	`
	
	countQuery := "SELECT COUNT(*) FROM folders WHERE 1=1"
	args := []interface{}{}
	argCount := 0
	
	// Build WHERE conditions
	conditions := []string{}
	countConditions := []string{}
	
	if filters.ClientID != nil {
		argCount++
		conditions = append(conditions, fmt.Sprintf("client_id = $%d", argCount))
		countConditions = append(countConditions, fmt.Sprintf("client_id = $%d", argCount))
		args = append(args, *filters.ClientID)
	}
	
	if filters.Status != nil {
		argCount++
		conditions = append(conditions, fmt.Sprintf("status = $%d", argCount))
		countConditions = append(countConditions, fmt.Sprintf("status = $%d", argCount))
		args = append(args, *filters.Status)
	}
	
	if filters.Area != nil {
		argCount++
		conditions = append(conditions, fmt.Sprintf("area = $%d", argCount))
		countConditions = append(countConditions, fmt.Sprintf("area = $%d", argCount))
		args = append(args, *filters.Area)
	}
	
	if filters.Search != nil && *filters.Search != "" {
		argCount++
		searchCondition := fmt.Sprintf(`(
			cnj_number ILIKE $%d OR 
			responsible_lawyer ILIKE $%d OR 
			active_party ILIKE $%d OR 
			passive_party ILIKE $%d OR
			object_description ILIKE $%d
		)`, argCount, argCount, argCount, argCount, argCount)
		conditions = append(conditions, searchCondition)
		countConditions = append(countConditions, searchCondition)
		args = append(args, "%"+*filters.Search+"%")
	}
	
	// Add conditions to queries
	if len(conditions) > 0 {
		baseQuery += " AND " + strings.Join(conditions, " AND ")
		countQuery += " AND " + strings.Join(countConditions, " AND ")
	}
	
	// Get total count
	var total int
	countArgs := make([]interface{}, len(args))
	copy(countArgs, args)
	err := r.db.Get(&total, countQuery, countArgs...)
	if err != nil {
		return nil, fmt.Errorf("error counting folders: %v", err)
	}
	
	// Add sorting and pagination
	baseQuery += fmt.Sprintf(" ORDER BY %s %s", filters.SortBy, filters.Order)
	baseQuery += fmt.Sprintf(" LIMIT %d OFFSET %d", filters.PerPage, (filters.Page-1)*filters.PerPage)
	
	// Execute query
	folders := []models.Folder{}
	err = r.db.Select(&folders, baseQuery, args...)
	if err != nil {
		return nil, fmt.Errorf("error listing folders: %v", err)
	}
	
	// Calculate pagination metadata
	lastPage := int(math.Ceil(float64(total) / float64(filters.PerPage)))
	
	result := &models.PaginatedFolders{
		Data: folders,
		Meta: models.PaginationMeta{
			Total:        total,
			PerPage:      filters.PerPage,
			CurrentPage:  filters.Page,
			LastPage:     lastPage,
			FirstPage:    1,
			FirstPageURL: fmt.Sprintf("/api/folders?page=1&per_page=%d", filters.PerPage),
			LastPageURL:  fmt.Sprintf("/api/folders?page=%d&per_page=%d", lastPage, filters.PerPage),
		},
	}
	
	// Add next/prev URLs if applicable
	if filters.Page < lastPage {
		result.Meta.NextPageURL = fmt.Sprintf("/api/folders?page=%d&per_page=%d", filters.Page+1, filters.PerPage)
	}
	if filters.Page > 1 {
		result.Meta.PrevPageURL = fmt.Sprintf("/api/folders?page=%d&per_page=%d", filters.Page-1, filters.PerPage)
	}
	
	return result, nil
}

// FindByID finds a folder by ID
func (r *FolderRepository) FindByID(id int) (*models.Folder, error) {
	query := `
		SELECT 
			id, cnj_number, COALESCE(cnj_number, 'Processo ' || id::text) as title,
			object_description as description, status, area, sub_area,
			court, forum, court_division, active_party, passive_party,
			object_description, value, client_id, responsible_lawyer,
			phase, is_special, has_injunction, prognosis, false as is_favorite,
			created_at, updated_at
		FROM folders
		WHERE id = $1
		LIMIT 1
	`
	
	var folder models.Folder
	err := r.db.Get(&folder, query, id)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("folder not found")
	}
	if err != nil {
		return nil, fmt.Errorf("error finding folder: %v", err)
	}
	
	// Get client information
	clientQuery := `
		SELECT cli_ide::INTEGER as id, cli_nom as name, cli_num_doc as document
		FROM open_clientes
		WHERE cli_ide = $1::TEXT
		LIMIT 1
	`
	
	var client models.Client
	err = r.db.Get(&client, clientQuery, folder.ClientID)
	if err == nil {
		folder.Client = &client
	}
	
	// Get counts (tasks, documents, hearings)
	// For now, return static counts - will be implemented with real queries later
	folder.TasksCount = 0
	folder.DocumentsCount = 0
	folder.HearingsCount = 0
	
	return &folder, nil
}

// Create creates a new folder
func (r *FolderRepository) Create(folder *models.Folder) error {
	// Since we're using a view, we need to insert into the actual table
	// For now, return an error as tabela_open_processos is empty
	return fmt.Errorf("folder creation not implemented - legacy table structure")
}

// Update updates a folder
func (r *FolderRepository) Update(folder *models.Folder) error {
	// Since we're using a view, we need to update the actual table
	// For now, return an error as tabela_open_processos is empty
	return fmt.Errorf("folder update not implemented - legacy table structure")
}

// Delete deletes a folder
func (r *FolderRepository) Delete(id int) error {
	// Since we're using a view, we need to delete from the actual table
	// For now, return an error as tabela_open_processos is empty
	return fmt.Errorf("folder deletion not implemented - legacy table structure")
}

// ToggleFavorite toggles the favorite status of a folder
func (r *FolderRepository) ToggleFavorite(id int, userID int) error {
	// This would require a separate favorites table
	// For now, return success
	return nil
}

// GetStats returns folder statistics
func (r *FolderRepository) GetStats(clientID *int) (map[string]interface{}, error) {
	stats := map[string]interface{}{
		"total":          0,
		"active":         0,
		"completed":      0,
		"pending":        0,
		"newThisMonth":   0,
		"by_status":      []map[string]interface{}{},
		"by_area":        []map[string]interface{}{},
		"favorites":      0,
	}
	
	// Total folders
	totalQuery := "SELECT COUNT(*) FROM folders"
	args := []interface{}{}
	if clientID != nil {
		totalQuery += " WHERE client_id = $1"
		args = append(args, *clientID)
	}
	
	var total int
	err := r.db.Get(&total, totalQuery, args...)
	if err == nil {
		stats["total"] = total
	}
	
	// By status
	statusQuery := `
		SELECT status, COUNT(*) as count
		FROM folders
		GROUP BY status
	`
	
	type StatusCount struct {
		Status string `db:"status"`
		Count  int    `db:"count"`
	}
	
	var statusCounts []StatusCount
	err = r.db.Select(&statusCounts, statusQuery)
	if err == nil {
		for _, sc := range statusCounts {
			if sc.Status == "active" {
				stats["active"] = sc.Count
			} else if sc.Status == "completed" {
				stats["completed"] = sc.Count
			} else if sc.Status == "pending" {
				stats["pending"] = sc.Count
			}
		}
		
		// Convert to array format for frontend
		statusArray := []map[string]interface{}{}
		for _, sc := range statusCounts {
			statusArray = append(statusArray, map[string]interface{}{
				"status": sc.Status,
				"count":  sc.Count,
			})
		}
		stats["by_status"] = statusArray
	}
	
	// By area
	areaQuery := `
		SELECT area, COUNT(*) as count
		FROM folders
		GROUP BY area
		ORDER BY count DESC
		LIMIT 5
	`
	
	type AreaCount struct {
		Area  string `db:"area"`
		Count int    `db:"count"`
	}
	
	var areaCounts []AreaCount
	err = r.db.Select(&areaCounts, areaQuery)
	if err == nil {
		areaArray := []map[string]interface{}{}
		colors := []string{"#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"}
		for i, ac := range areaCounts {
			color := "#6B7280"
			if i < len(colors) {
				color = colors[i]
			}
			areaArray = append(areaArray, map[string]interface{}{
				"area":  ac.Area,
				"count": ac.Count,
				"color": color,
			})
		}
		stats["by_area"] = areaArray
	}
	
	// New this month - simplified query
	stats["newThisMonth"] = 0
	
	return stats, nil
}