package handlers

import (
	"log"
	"strconv"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/adapters/legacy"
	"github.com/gabrielmaialva33/yol-benicio-api/internal/domain/models"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

type ClientHandler struct {
	db *sqlx.DB
}

func NewClientHandler(db *sqlx.DB) *ClientHandler {
	return &ClientHandler{db: db}
}

// ListClients retorna lista paginada de clientes
func (h *ClientHandler) ListClients(c *fiber.Ctx) error {
	// Pagination parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	perPage, _ := strconv.Atoi(c.Query("per_page", "10"))
	search := c.Query("search", "")
	
	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 100 {
		perPage = 10
	}

	offset := (page - 1) * perPage

	// Query base
	query := `
		SELECT cli_ide, cli_nom, cli_cod, cli_num_doc, cli_dta_inc, cli_dta_alt, cli_obs
		FROM open_clientes
		WHERE 1=1
	`
	countQuery := "SELECT COUNT(*) FROM open_clientes WHERE 1=1"
	args := []interface{}{}

	// Add search if provided
	if search != "" {
		query += " AND (cli_nom ILIKE $1 OR cli_num_doc ILIKE $1)"
		countQuery += " AND (cli_nom ILIKE $1 OR cli_num_doc ILIKE $1)"
		args = append(args, "%"+search+"%")
	}

	// Contar total
	var total int
	if err := h.db.Get(&total, countQuery, args...); err != nil {
		log.Printf("Error counting clients: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to count clients",
		})
	}

	// Add pagination
	if search != "" {
		query += " ORDER BY cli_nom LIMIT $2 OFFSET $3"
		args = append(args, perPage, offset)
	} else {
		query += " ORDER BY cli_nom LIMIT $1 OFFSET $2"
		args = append(args, perPage, offset)
	}

	// Buscar clientes
	var legacyClients []models.LegacyClient
	if err := h.db.Select(&legacyClients, query, args...); err != nil {
		log.Printf("Error fetching clients: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch clients",
		})
	}

	// Convert to domain model
	clients := make([]*models.Client, 0, len(legacyClients))
	for _, lc := range legacyClients {
		client, err := legacy.MapLegacyToClient(lc)
		if err != nil {
			log.Printf("Error mapping client: %v", err)
			continue
		}
		clients = append(clients, client)
	}

	// Calculate pages
	totalPages := (total + perPage - 1) / perPage

	return c.JSON(fiber.Map{
		"data": clients,
		"pagination": fiber.Map{
			"current_page": page,
			"per_page":     perPage,
			"total":        total,
			"total_pages":  totalPages,
		},
		"links": fiber.Map{
			"first": c.BaseURL() + c.Path() + "?page=1&per_page=" + strconv.Itoa(perPage),
			"last":  c.BaseURL() + c.Path() + "?page=" + strconv.Itoa(totalPages) + "&per_page=" + strconv.Itoa(perPage),
		},
	})
}

// GetClient returns a specific client
func (h *ClientHandler) GetClient(c *fiber.Ctx) error {
	id := c.Params("id")

	query := `
		SELECT cli_ide, cli_nom, cli_cod, cli_num_doc, cli_dta_inc, cli_dta_alt, cli_obs
		FROM open_clientes
		WHERE cli_ide = $1
	`

	var legacyClient models.LegacyClient
	if err := h.db.Get(&legacyClient, query, id); err != nil {
		log.Printf("Error fetching client %s: %v", id, err)
		return c.Status(404).JSON(fiber.Map{
			"error": "Client not found",
		})
	}

	client, err := legacy.MapLegacyToClient(legacyClient)
	if err != nil {
		log.Printf("Error mapping client: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to process client",
		})
	}

	return c.JSON(fiber.Map{
		"data": client,
	})
}