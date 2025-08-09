package models

import (
	"encoding/json"
)

// MarshalJSON custom marshaller for Task to handle SQL null types
func (t Task) MarshalJSON() ([]byte, error) {
	type Alias Task
	
	// Create a clean version with proper JSON types
	clean := struct {
		ID          int     `json:"id"`
		Title       string  `json:"title"`
		Description *string `json:"description,omitempty"`
		Status      string  `json:"status"`
		DueDate     *string `json:"due_date,omitempty"`
		FolderID    *int    `json:"folder_id,omitempty"`
		ClientID    *int    `json:"client_id,omitempty"`
		AssignedTo  string  `json:"assigned_to"`
		Priority    string  `json:"priority"`
		Tags        *string `json:"tags,omitempty"`
		CreatedAt   string  `json:"created_at"`
		UpdatedAt   string  `json:"updated_at"`
		Folder      *Folder `json:"folder,omitempty"`
		Client      *Client `json:"client,omitempty"`
	}{
		ID:         t.ID,
		Title:      t.Title,
		Status:     t.Status,
		AssignedTo: t.AssignedTo,
		Priority:   t.Priority,
		CreatedAt:  t.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt:  t.UpdatedAt.Format("2006-01-02T15:04:05Z"),
		Folder:     t.Folder,
		Client:     t.Client,
	}
	
	// Handle nullable fields
	if t.Description.Valid && t.Description.String != "" {
		clean.Description = &t.Description.String
	}
	
	if t.DueDate.Valid {
		dateStr := t.DueDate.Time.Format("2006-01-02T15:04:05Z")
		clean.DueDate = &dateStr
	}
	
	if t.FolderID.Valid && t.FolderID.Int64 > 0 {
		folderID := int(t.FolderID.Int64)
		clean.FolderID = &folderID
	}
	
	if t.ClientID.Valid && t.ClientID.Int64 > 0 {
		clientID := int(t.ClientID.Int64)
		clean.ClientID = &clientID
	}
	
	if t.Tags.Valid && t.Tags.String != "" {
		clean.Tags = &t.Tags.String
	}
	
	return json.Marshal(clean)
}