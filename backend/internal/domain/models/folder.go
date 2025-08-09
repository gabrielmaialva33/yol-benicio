package models

import (
	"database/sql"
)

// Folder represents a legal case/process
type Folder struct {
	ID                int             `json:"id" db:"id"`
	CNJNumber         sql.NullString  `json:"cnj_number,omitempty" db:"cnj_number"`       // CNJ number
	Title             string          `json:"title" db:"title"`                           // Case title  
	Description       sql.NullString  `json:"description,omitempty" db:"description"`     // Case description
	Status            string          `json:"status" db:"status"`                         // active, archived, etc
	Area              string          `json:"area" db:"area"`                             // Legal area
	SubArea           sql.NullString  `json:"sub_area,omitempty" db:"sub_area"`          // Sub area
	Court             sql.NullString  `json:"court,omitempty" db:"court"`                // Court/Comarca
	Forum             sql.NullString  `json:"forum,omitempty" db:"forum"`                // Forum/Foro
	CourtDivision     sql.NullString  `json:"court_division,omitempty" db:"court_division"` // Vara
	ActiveParty       sql.NullString  `json:"active_party,omitempty" db:"active_party"`  // Polo ativo
	PassiveParty      sql.NullString  `json:"passive_party,omitempty" db:"passive_party"` // Polo passivo
	ObjectDescription sql.NullString  `json:"object_description,omitempty" db:"object_description"`
	Value             sql.NullFloat64 `json:"value,omitempty" db:"value"`                // Case value
	ClientID          int             `json:"client_id" db:"client_id"`                  // Associated client
	Client            *Client         `json:"client,omitempty"`                          // Client data
	ResponsibleLawyer string          `json:"responsible_lawyer" db:"responsible_lawyer"` // Responsible lawyer
	Phase             string          `json:"phase" db:"phase"`                          // Process phase
	IsSpecial         bool            `json:"is_special" db:"is_special"`                // Special case flag
	HasInjunction     bool            `json:"has_injunction" db:"has_injunction"`        // Liminar flag
	Prognosis         sql.NullString  `json:"prognosis,omitempty" db:"prognosis"`        // Risk assessment
	IsFavorite        bool            `json:"is_favorite" db:"is_favorite"`              // Favorite flag
	DocumentsCount    int             `json:"documents_count"`                           // Document count
	TasksCount        int             `json:"tasks_count"`                                // Task count
	HearingsCount     int             `json:"hearings_count"`                            // Hearing count
	CreatedAt         sql.NullTime    `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt         sql.NullTime    `json:"updated_at,omitempty" db:"updated_at"`
}

// FolderStatus constants
const (
	FolderStatusActive    = "active"
	FolderStatusCompleted = "completed"
	FolderStatusPending   = "pending"
	FolderStatusCancelled = "cancelled"
	FolderStatusArchived  = "archived"
)

// FolderArea constants
const (
	FolderAreaCivil          = "Cível"
	FolderAreaLabor          = "Trabalhista"
	FolderAreaCriminal       = "Criminal"
	FolderAreaFamily         = "Família"
	FolderAreaTax            = "Tributário"
	FolderAreaAdministrative = "Administrativo"
)

// FolderFilters for listing folders
type FolderFilters struct {
	ClientID      *int    `query:"client_id"`
	Status        *string `query:"status"`
	Area          *string `query:"area"`
	Search        *string `query:"search"`
	IsFavorite    *bool   `query:"is_favorite"`
	ResponsibleID *int    `query:"responsible_id"`
	DateFrom      *string `query:"date_from"`
	DateTo        *string `query:"date_to"`
	Page          int     `query:"page"`
	PerPage       int     `query:"per_page"`
	SortBy        string  `query:"sort_by"`
	Order         string  `query:"order"`
}

// SetDefaults sets default values for pagination
func (f *FolderFilters) SetDefaults() {
	if f.Page <= 0 {
		f.Page = 1
	}
	if f.PerPage <= 0 {
		f.PerPage = 10
	}
	if f.PerPage > 100 {
		f.PerPage = 100
	}
	if f.SortBy == "" {
		f.SortBy = "created_at"
	}
	if f.Order == "" {
		f.Order = "desc"
	}
}

// PaginatedFolders response
type PaginatedFolders struct {
	Data []Folder       `json:"data"`
	Meta PaginationMeta `json:"meta"`
}

// PaginationMeta contains pagination metadata
type PaginationMeta struct {
	Total        int    `json:"total"`
	PerPage      int    `json:"per_page"`
	CurrentPage  int    `json:"current_page"`
	LastPage     int    `json:"last_page"`
	FirstPage    int    `json:"first_page"`
	FirstPageURL string `json:"first_page_url"`
	LastPageURL  string `json:"last_page_url"`
	NextPageURL  string `json:"next_page_url,omitempty"`
	PrevPageURL  string `json:"previous_page_url,omitempty"`
}