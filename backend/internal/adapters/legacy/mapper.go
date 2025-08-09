package legacy

import (
	"strconv"
	"strings"
	"time"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/domain/models"
)

// MapLegacyToClient converte LegacyClient para Client
func MapLegacyToClient(legacy models.LegacyClient) (*models.Client, error) {
	id, err := strconv.Atoi(legacy.CliIde)
	if err != nil {
		id = 0
	}

	createdAt, _ := parseDateTime(legacy.CliDtaInc)
	updatedAt, _ := parseDateTime(legacy.CliDtaAlt)

	// Detect document type (CPF or CNPJ)
	docType := "CPF"
	if strings.Contains(legacy.CliNumDoc, "/") {
		docType = "CNPJ"
	}

	return &models.Client{
		ID:           id,
		Name:         strings.TrimSpace(legacy.CliNom),
		Document:     strings.TrimSpace(legacy.CliNumDoc),
		DocumentType: docType,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		Active:       true,
		Metadata: models.Metadata{
			Type:  getClientType(docType),
			Notes: strings.TrimSpace(legacy.CliObs),
		},
	}, nil
}

// MapClientToLegacy converte Client para LegacyClient
func MapClientToLegacy(client *models.Client) models.LegacyClient {
	return models.LegacyClient{
		CliIde:    strconv.Itoa(client.ID),
		CliNom:    client.Name,
		CliNumDoc: client.Document,
		CliObs:    client.Metadata.Notes,
		CliDtaInc: client.CreatedAt.Format("2006-01-02 15:04:05.000"),
		CliDtaAlt: client.UpdatedAt.Format("2006-01-02 15:04:05.000"),
	}
}

// MapLegacyToFolder is not used currently since we're using views
// func MapLegacyToFolder(legacy models.LegacyFolder) (*models.Folder, error) {
// 	// Implementation removed - using database views instead
// 	return nil, nil
// }

// Helper functions
func parseDateTime(dateStr string) (time.Time, error) {
	if dateStr == "" {
		return time.Now(), nil
	}

	// Try different formats
	formats := []string{
		"2006-01-02 15:04:05.000",
		"2006-01-02 15:04:05",
		"2006-01-02",
	}

	for _, format := range formats {
		if t, err := time.Parse(format, dateStr); err == nil {
			return t, nil
		}
	}

	return time.Now(), nil
}

func getClientType(docType string) string {
	if docType == "CPF" {
		return "individual"
	}
	return "company"
}