package models

import (
	"encoding/json"
)

// MarshalJSON custom marshaller for Folder to handle SQL null types
func (f Folder) MarshalJSON() ([]byte, error) {
	type Alias Folder
	
	// Create a clean version with proper JSON types
	clean := struct {
		ID                int         `json:"id"`
		CNJNumber         *string     `json:"cnj_number,omitempty"`
		Title             string      `json:"title"`
		Description       *string     `json:"description,omitempty"`
		Status            string      `json:"status"`
		Area              string      `json:"area"`
		SubArea           *string     `json:"sub_area,omitempty"`
		Court             *string     `json:"court,omitempty"`
		Forum             *string     `json:"forum,omitempty"`
		CourtDivision     *string     `json:"court_division,omitempty"`
		ActiveParty       *string     `json:"active_party,omitempty"`
		PassiveParty      *string     `json:"passive_party,omitempty"`
		ObjectDescription *string     `json:"object_description,omitempty"`
		Value             *float64    `json:"value,omitempty"`
		ClientID          int         `json:"client_id"`
		Client            *Client     `json:"client,omitempty"`
		ResponsibleLawyer string      `json:"responsible_lawyer"`
		Phase             string      `json:"phase"`
		IsSpecial         bool        `json:"is_special"`
		HasInjunction     bool        `json:"has_injunction"`
		Prognosis         *string     `json:"prognosis,omitempty"`
		IsFavorite        bool        `json:"is_favorite"`
		DocumentsCount    int         `json:"documents_count"`
		TasksCount        int         `json:"tasks_count"`
		HearingsCount     int         `json:"hearings_count"`
		CreatedAt         *string     `json:"created_at,omitempty"`
		UpdatedAt         *string     `json:"updated_at,omitempty"`
	}{
		ID:                f.ID,
		Title:             f.Title,
		Status:            f.Status,
		Area:              f.Area,
		ClientID:          f.ClientID,
		Client:            f.Client,
		ResponsibleLawyer: f.ResponsibleLawyer,
		Phase:             f.Phase,
		IsSpecial:         f.IsSpecial,
		HasInjunction:     f.HasInjunction,
		IsFavorite:        f.IsFavorite,
		DocumentsCount:    f.DocumentsCount,
		TasksCount:        f.TasksCount,
		HearingsCount:     f.HearingsCount,
	}
	
	// Handle nullable string fields
	if f.CNJNumber.Valid && f.CNJNumber.String != "" && f.CNJNumber.String != "NULL" {
		clean.CNJNumber = &f.CNJNumber.String
	}
	if f.Description.Valid && f.Description.String != "" {
		clean.Description = &f.Description.String
	}
	if f.SubArea.Valid && f.SubArea.String != "" {
		clean.SubArea = &f.SubArea.String
	}
	if f.Court.Valid && f.Court.String != "" {
		clean.Court = &f.Court.String
	}
	if f.Forum.Valid && f.Forum.String != "" {
		clean.Forum = &f.Forum.String
	}
	if f.CourtDivision.Valid && f.CourtDivision.String != "" {
		clean.CourtDivision = &f.CourtDivision.String
	}
	if f.ActiveParty.Valid && f.ActiveParty.String != "" {
		clean.ActiveParty = &f.ActiveParty.String
	}
	if f.PassiveParty.Valid && f.PassiveParty.String != "" {
		clean.PassiveParty = &f.PassiveParty.String
	}
	if f.ObjectDescription.Valid && f.ObjectDescription.String != "" {
		clean.ObjectDescription = &f.ObjectDescription.String
	}
	if f.Prognosis.Valid && f.Prognosis.String != "" {
		clean.Prognosis = &f.Prognosis.String
	}
	
	// Handle nullable float
	if f.Value.Valid && f.Value.Float64 > 0 {
		clean.Value = &f.Value.Float64
	}
	
	// Handle nullable times
	if f.CreatedAt.Valid {
		timeStr := f.CreatedAt.Time.Format("2006-01-02T15:04:05Z")
		clean.CreatedAt = &timeStr
	}
	if f.UpdatedAt.Valid {
		timeStr := f.UpdatedAt.Time.Format("2006-01-02T15:04:05Z")
		clean.UpdatedAt = &timeStr
	}
	
	return json.Marshal(clean)
}