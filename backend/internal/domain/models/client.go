package models

import "time"

// Client representa um cliente no sistema
type Client struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Document     string    `json:"document"`
	DocumentType string    `json:"document_type"` // CPF ou CNPJ
	Email        string    `json:"email,omitempty"`
	Phone        string    `json:"phone,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	FoldersCount int       `json:"folders_count,omitempty"`
	Active       bool      `json:"active"`
	Metadata     Metadata  `json:"metadata,omitempty"`
}

type Metadata struct {
	Type          string `json:"type,omitempty"`           // individual ou company
	Birthday      string `json:"birthday,omitempty"`
	ContactPerson string `json:"contact_person,omitempty"`
	Notes         string `json:"notes,omitempty"`
}

// LegacyClient mapeia a estrutura da tabela open_clientes
type LegacyClient struct {
	CliIde    string `db:"cli_ide"`
	CliNom    string `db:"cli_nom"`
	CliCod    string `db:"cli_cod"`
	CliNumDoc string `db:"cli_num_doc"`
	CliDtaInc string `db:"cli_dta_inc"`
	CliDtaAlt string `db:"cli_dta_alt"`
	CliObs    string `db:"cli_obs"`
}