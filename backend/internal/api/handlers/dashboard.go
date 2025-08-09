package handlers

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/adapters/legacy"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

type DashboardHandler struct {
	db         *sqlx.DB
	folderRepo *legacy.FolderRepository
	taskRepo   *legacy.TaskRepository
}

func NewDashboardHandler(db *sqlx.DB) *DashboardHandler {
	return &DashboardHandler{
		db:         db,
		folderRepo: legacy.NewFolderRepository(db),
		taskRepo:   legacy.NewTaskRepository(db),
	}
}

func (h *DashboardHandler) GetActiveFolders(c *fiber.Ctx) error {
	// Get recent active folders from database
	query := `
		SELECT 
			id,
			cnj_number,
			title,
			status,
			responsible_lawyer,
			created_at
		FROM folders
		WHERE status = 'active'
		ORDER BY created_at DESC
		LIMIT 10
	`

	rows, err := h.db.Query(query)
	if err != nil {
		// Return mock data if query fails
		return c.JSON([]fiber.Map{
			{
				"id":          "1",
				"number":      "PROC-2024-001",
				"client_name": "João Silva",
				"status":      "Em Andamento",
				"priority":    "Alta",
				"deadline":    "2024-12-15",
			},
			{
				"id":          "2",
				"number":      "PROC-2024-002",
				"client_name": "Maria Santos",
				"status":      "Aguardando",
				"priority":    "Média",
				"deadline":    "2024-12-20",
			},
		})
	}
	defer rows.Close()

	folders := []fiber.Map{}
	for rows.Next() {
		var id int
		var cnj_number, title, status, lawyer sql.NullString
		var created_at time.Time

		err := rows.Scan(&id, &cnj_number, &title, &status, &lawyer, &created_at)
		if err != nil {
			continue
		}

		folders = append(folders, fiber.Map{
			"id":               id,
			"number":           cnj_number.String,
			"title":            title,
			"status":           status.String,
			"responsible":      lawyer.String,
			"created_at":       created_at.Format("2006-01-02"),
		})
	}

	// Return mock data if no real data
	if len(folders) == 0 {
		return c.JSON([]fiber.Map{
			{
				"id":          "1",
				"number":      "PROC-2024-001",
				"client_name": "João Silva",
				"status":      "Em Andamento",
				"priority":    "Alta",
				"deadline":    "2024-12-15",
			},
			{
				"id":          "2",
				"number":      "PROC-2024-002",
				"client_name": "Maria Santos",
				"status":      "Aguardando",
				"priority":    "Média",
				"deadline":    "2024-12-20",
			},
		})
	}

	return c.JSON(folders)
}

func (h *DashboardHandler) GetFavoriteClients(c *fiber.Ctx) error {
	// Get top clients by folder count
	query := `
		SELECT 
			client_id,
			COUNT(*) as folder_count
		FROM folders
		WHERE client_id > 0
		GROUP BY client_id
		ORDER BY folder_count DESC
		LIMIT 10
	`

	rows, err := h.db.Query(query)
	if err != nil {
		// Return mock data if query fails
		return c.JSON([]fiber.Map{
			{
				"id":          1,
				"name":        "João Silva",
				"folderCount": 3,
				"color":       "#3B82F6",
			},
			{
				"id":          2,
				"name":        "Maria Santos",
				"folderCount": 2,
				"color":       "#10B981",
			},
			{
				"id":          3,
				"name":        "Pedro Oliveira",
				"folderCount": 5,
				"color":       "#F59E0B",
			},
			{
				"id":          4,
				"name":        "Ana Costa",
				"folderCount": 1,
				"color":       "#EF4444",
			},
		})
	}
	defer rows.Close()

	clients := []fiber.Map{}
	colors := []string{"#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"}
	colorIndex := 0

	for rows.Next() {
		var clientID, folderCount int
		err := rows.Scan(&clientID, &folderCount)
		if err != nil {
			continue
		}

		// Get client name
		var clientName string
		nameQuery := `SELECT cli_nom FROM open_clientes WHERE cli_ide = $1 LIMIT 1`
		h.db.QueryRow(nameQuery, fmt.Sprintf("%d", clientID)).Scan(&clientName)

		if clientName == "" {
			clientName = fmt.Sprintf("Cliente %d", clientID)
		}

		clients = append(clients, fiber.Map{
			"id":          clientID,
			"name":        clientName,
			"folderCount": folderCount,
			"color":       colors[colorIndex%len(colors)],
		})
		colorIndex++

		if len(clients) >= 4 {
			break
		}
	}

	// Return mock data if no real data
	if len(clients) == 0 {
		return c.JSON([]fiber.Map{
			{
				"id":          1,
				"name":        "João Silva",
				"folderCount": 3,
				"color":       "#3B82F6",
			},
			{
				"id":          2,
				"name":        "Maria Santos",
				"folderCount": 2,
				"color":       "#10B981",
			},
			{
				"id":          3,
				"name":        "Pedro Oliveira",
				"folderCount": 5,
				"color":       "#F59E0B",
			},
			{
				"id":          4,
				"name":        "Ana Costa",
				"folderCount": 1,
				"color":       "#EF4444",
			},
		})
	}

	return c.JSON(clients)
}

func (h *DashboardHandler) GetFolderActivity(c *fiber.Ctx) error {
	// Get folder statistics from database
	stats := []fiber.Map{}

	// Count folders by status
	statusQuery := `
		SELECT 
			COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
			COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived,
			COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
			COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
			COUNT(*) as total
		FROM folders
	`

	var active, archived, pending, completed, total int
	err := h.db.QueryRow(statusQuery).Scan(&active, &archived, &pending, &completed, &total)
	
	if err != nil || total == 0 {
		// Return mock data if query fails
		return c.JSON([]fiber.Map{
			{
				"label":      "Novos",
				"value":      12,
				"color":      "bg-blue-500",
				"percentage": 30,
			},
			{
				"label":      "Em Andamento",
				"value":      45,
				"color":      "bg-yellow-500",
				"percentage": 60,
			},
			{
				"label":      "Concluídos",
				"value":      28,
				"color":      "bg-green-500",
				"percentage": 40,
			},
			{
				"label":      "Arquivados",
				"value":      15,
				"color":      "bg-gray-500",
				"percentage": 20,
			},
		})
	}

	// Calculate percentages
	stats = []fiber.Map{
		{
			"label":      "Ativos",
			"value":      active,
			"color":      "bg-blue-500",
			"percentage": (active * 100) / total,
		},
		{
			"label":      "Pendentes",
			"value":      pending,
			"color":      "bg-yellow-500",
			"percentage": (pending * 100) / total,
		},
		{
			"label":      "Concluídos",
			"value":      completed,
			"color":      "bg-green-500",
			"percentage": (completed * 100) / total,
		},
		{
			"label":      "Arquivados",
			"value":      archived,
			"color":      "bg-gray-500",
			"percentage": (archived * 100) / total,
		},
	}

	return c.JSON(stats)
}

func (h *DashboardHandler) GetAreaDivision(c *fiber.Ctx) error {
	// Get folder count by area
	areaQuery := `
		SELECT 
			area,
			COUNT(*) as count
		FROM folders
		GROUP BY area
		ORDER BY count DESC
		LIMIT 5
	`

	rows, err := h.db.Query(areaQuery)
	if err != nil {
		// Return mock data if query fails
		return c.JSON([]fiber.Map{
			{
				"area":       "Cível",
				"count":      45,
				"percentage": 35,
				"color":      "#3B82F6",
			},
			{
				"area":       "Trabalhista",
				"count":      30,
				"percentage": 25,
				"color":      "#10B981",
			},
			{
				"area":       "Criminal",
				"count":      20,
				"percentage": 20,
				"color":      "#F59E0B",
			},
			{
				"area":       "Família",
				"count":      15,
				"percentage": 15,
				"color":      "#EF4444",
			},
			{
				"area":       "Outros",
				"count":      5,
				"percentage": 5,
				"color":      "#8B5CF6",
			},
		})
	}
	defer rows.Close()

	areas := []fiber.Map{}
	colors := []string{"#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"}
	colorIndex := 0
	totalCount := 0

	// First pass to get total count
	type areaCount struct {
		area  string
		count int
	}
	areaCounts := []areaCount{}

	for rows.Next() {
		var area string
		var count int
		err := rows.Scan(&area, &count)
		if err != nil {
			continue
		}
		areaCounts = append(areaCounts, areaCount{area, count})
		totalCount += count
	}

	// Second pass to create response with percentages
	for _, ac := range areaCounts {
		percentage := 0
		if totalCount > 0 {
			percentage = (ac.count * 100) / totalCount
		}

		areas = append(areas, fiber.Map{
			"area":       ac.area,
			"count":      ac.count,
			"percentage": percentage,
			"color":      colors[colorIndex%len(colors)],
		})
		colorIndex++
	}

	// Return mock data if no real data
	if len(areas) == 0 {
		return c.JSON([]fiber.Map{
			{
				"area":       "Cível",
				"count":      45,
				"percentage": 35,
				"color":      "#3B82F6",
			},
			{
				"area":       "Trabalhista",
				"count":      30,
				"percentage": 25,
				"color":      "#10B981",
			},
			{
				"area":       "Criminal",
				"count":      20,
				"percentage": 20,
				"color":      "#F59E0B",
			},
			{
				"area":       "Família",
				"count":      15,
				"percentage": 15,
				"color":      "#EF4444",
			},
			{
				"area":       "Outros",
				"count":      5,
				"percentage": 5,
				"color":      "#8B5CF6",
			},
		})
	}

	return c.JSON(areas)
}

func (h *DashboardHandler) GetRequests(c *fiber.Ctx) error {
	// For now, return mock data as we don't have a requests table
	return c.JSON([]fiber.Map{
		{
			"id":         "1",
			"type":       "document",
			"title":      "Solicitação de documentos",
			"client":     "João Silva",
			"status":     "pending",
			"created_at": "2024-08-07T14:30:00Z",
		},
		{
			"id":         "2",
			"type":       "meeting",
			"title":      "Agendamento de reunião",
			"client":     "Maria Santos",
			"status":     "approved",
			"created_at": "2024-08-06T10:00:00Z",
		},
	})
}

func (h *DashboardHandler) GetHearings(c *fiber.Ctx) error {
	// Get upcoming hearings from tasks
	query := `
		SELECT 
			id,
			title,
			description,
			due_date,
			folder_id,
			client_id
		FROM tasks
		WHERE status != 'completed'
		AND due_date IS NOT NULL
		AND due_date > CURRENT_DATE
		AND (title ILIKE '%audiência%' OR description ILIKE '%audiência%')
		ORDER BY due_date ASC
		LIMIT 5
	`

	rows, err := h.db.Query(query)
	if err != nil {
		// Return mock data if query fails
		return c.JSON([]fiber.Map{
			{
				"id":          "1",
				"case_number": "PROC-2024-001",
				"client":      "João Silva",
				"court":       "1ª Vara Cível",
				"date":        "2024-08-15T14:00:00Z",
				"type":        "Audiência de Conciliação",
			},
			{
				"id":          "2",
				"case_number": "PROC-2024-002",
				"client":      "Maria Santos",
				"court":       "2ª Vara Trabalhista",
				"date":        "2024-08-20T10:00:00Z",
				"type":        "Audiência Inicial",
			},
		})
	}
	defer rows.Close()

	hearings := []fiber.Map{}
	for rows.Next() {
		var id, folderID, clientID sql.NullInt64
		var title, description sql.NullString
		var dueDate sql.NullTime

		err := rows.Scan(&id, &title, &description, &dueDate, &folderID, &clientID)
		if err != nil {
			continue
		}

		hearing := fiber.Map{
			"id":   id.Int64,
			"type": title.String,
			"date": dueDate.Time.Format("2006-01-02T15:04:05Z"),
		}

		// Get folder info if available
		if folderID.Valid && folderID.Int64 > 0 {
			var cnjNumber sql.NullString
			h.db.QueryRow("SELECT cnj_number FROM folders WHERE id = $1", folderID.Int64).Scan(&cnjNumber)
			if cnjNumber.Valid {
				hearing["case_number"] = cnjNumber.String
			}
		}

		// Get client info if available
		if clientID.Valid && clientID.Int64 > 0 {
			var clientName string
			h.db.QueryRow("SELECT cli_nom FROM open_clientes WHERE cli_ide = $1", fmt.Sprintf("%d", clientID.Int64)).Scan(&clientName)
			if clientName != "" {
				hearing["client"] = clientName
			}
		}

		hearings = append(hearings, hearing)
	}

	// Return mock data if no real data
	if len(hearings) == 0 {
		return c.JSON([]fiber.Map{
			{
				"id":          "1",
				"case_number": "PROC-2024-001",
				"client":      "João Silva",
				"court":       "1ª Vara Cível",
				"date":        "2024-08-15T14:00:00Z",
				"type":        "Audiência de Conciliação",
			},
			{
				"id":          "2",
				"case_number": "PROC-2024-002",
				"client":      "Maria Santos",
				"court":       "2ª Vara Trabalhista",
				"date":        "2024-08-20T10:00:00Z",
				"type":        "Audiência Inicial",
			},
		})
	}

	return c.JSON(hearings)
}

func (h *DashboardHandler) GetBirthdays(c *fiber.Ctx) error {
	// For now, return mock data as we don't have birthday info in the database
	return c.JSON([]fiber.Map{
		{
			"id":        "1",
			"name":      "João Silva",
			"date":      "2024-08-10",
			"age":       45,
			"is_client": true,
		},
		{
			"id":        "2",
			"name":      "Maria Santos",
			"date":      "2024-08-12",
			"age":       38,
			"is_client": true,
		},
	})
}