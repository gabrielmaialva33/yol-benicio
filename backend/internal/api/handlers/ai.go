package handlers

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/gabrielmaialva33/yol-benicio-api/internal/ai/providers/gemini"
	"github.com/gabrielmaialva33/yol-benicio-api/internal/ai/providers/nvidia"
	"github.com/gofiber/fiber/v2"
)

type AIHandler struct {
	geminiClient *gemini.Client
	nvidiaClient *nvidia.Client
}

func NewAIHandler(geminiClient *gemini.Client, nvidiaClient *nvidia.Client) *AIHandler {
	return &AIHandler{
		geminiClient: geminiClient,
		nvidiaClient: nvidiaClient,
	}
}

// AnalyzeCase performs complex case analysis with Gemini
func (h *AIHandler) AnalyzeCase(c *fiber.Ctx) error {
	var req struct {
		Text         string   `json:"text"`
		AnalysisType string   `json:"analysis_type"`
		Context      []string `json:"context,omitempty"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Text == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Text is required",
		})
	}

	// Default analysis type
	if req.AnalysisType == "" {
		req.AnalysisType = "legal_analysis"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Use Gemini for complex analysis
	result, err := h.geminiClient.Analyze(ctx, req.Text, req.AnalysisType)
	if err != nil {
		log.Printf("Error analyzing case with Gemini: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to analyze case",
		})
	}

	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"analysis":      result,
			"analysis_type": req.AnalysisType,
			"provider":      "gemini",
			"timestamp":     time.Now().Unix(),
		},
	})
}

// QuickSummary creates quick summary with NVIDIA (with Gemini fallback)
func (h *AIHandler) QuickSummary(c *fiber.Ctx) error {
	var req struct {
		Text     string `json:"text"`
		MaxWords int    `json:"max_words,omitempty"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Text == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Text is required",
		})
	}

	if req.MaxWords == 0 {
		req.MaxWords = 100
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Try NVIDIA first
	provider := "nvidia"
	result, err := h.nvidiaClient.Summarize(ctx, req.Text, req.MaxWords)
	
	// If NVIDIA fails, use Gemini as fallback
	if err != nil {
		log.Printf("NVIDIA failed, trying Gemini fallback: %v", err)
		provider = "gemini"
		
		prompt := fmt.Sprintf("Resuma o seguinte texto em no máximo %d palavras:\n\n%s", req.MaxWords, req.Text)
		result, err = h.geminiClient.Analyze(ctx, prompt, "default")
		
		if err != nil {
			log.Printf("Both NVIDIA and Gemini failed: %v", err)
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to create summary",
			})
		}
	}

	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"summary":   result,
			"provider":  provider,
			"timestamp": time.Now().Unix(),
		},
	})
}

// ExtractData extracts structured data with NVIDIA
func (h *AIHandler) ExtractData(c *fiber.Ctx) error {
	var req struct {
		Text   string   `json:"text"`
		Fields []string `json:"fields"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Text == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Text is required",
		})
	}

	if len(req.Fields) == 0 {
		// Default fields for legal documents
		req.Fields = []string{
			"número do processo",
			"partes envolvidas",
			"valor da causa",
			"data",
			"tipo de ação",
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	result, err := h.nvidiaClient.ExtractData(ctx, req.Text, req.Fields)
	if err != nil {
		log.Printf("Error extracting data with NVIDIA: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to extract data",
		})
	}

	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"extracted_data": result,
			"provider":       "nvidia",
			"timestamp":      time.Now().Unix(),
		},
	})
}

// ClassifyDocument classifies document type
func (h *AIHandler) ClassifyDocument(c *fiber.Ctx) error {
	var req struct {
		Text string `json:"text"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Text == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Text is required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	result, err := h.nvidiaClient.ClassifyDocument(ctx, req.Text)
	if err != nil {
		log.Printf("Error classifying document: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to classify document",
		})
	}

	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"classification": result,
			"provider":       "nvidia",
			"timestamp":      time.Now().Unix(),
		},
	})
}

// HealthCheck checks the status of AI providers
func (h *AIHandler) HealthCheck(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	healthStatus := fiber.Map{
		"gemini": fiber.Map{
			"status": "unknown",
			"error":  nil,
		},
		"nvidia": fiber.Map{
			"status": "unknown",
			"error":  nil,
		},
		"timestamp": time.Now().Unix(),
	}

	// Test Gemini
	if h.geminiClient != nil {
		_, err := h.geminiClient.Analyze(ctx, "test", "default")
		if err == nil {
			healthStatus["gemini"].(fiber.Map)["status"] = "healthy"
		} else {
			healthStatus["gemini"].(fiber.Map)["status"] = "unhealthy"
			healthStatus["gemini"].(fiber.Map)["error"] = err.Error()
		}
	}

	// Test NVIDIA
	if h.nvidiaClient != nil {
		_, err := h.nvidiaClient.QuickProcess(ctx, "test")
		if err == nil {
			healthStatus["nvidia"].(fiber.Map)["status"] = "healthy"
		} else {
			healthStatus["nvidia"].(fiber.Map)["status"] = "unhealthy"
			healthStatus["nvidia"].(fiber.Map)["error"] = err.Error()
		}
	}

	return c.JSON(fiber.Map{
		"data": healthStatus,
	})
}

// SmartProcess decides which provider to use based on complexity
func (h *AIHandler) SmartProcess(c *fiber.Ctx) error {
	var req struct {
		Text       string `json:"text"`
		Task       string `json:"task"` // analyze, summarize, extract, classify
		Complexity int    `json:"complexity,omitempty"` // 1-10
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Text == "" || req.Task == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Text and task are required",
		})
	}

	// Decide which provider to use
	useGemini := req.Complexity > 7 || req.Task == "analyze"
	
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	var result string
	var provider string
	var err error

	if useGemini {
		// Use Gemini for complex tasks
		provider = "gemini"
		result, err = h.geminiClient.Analyze(ctx, req.Text, "default")
	} else {
		// Use NVIDIA for simple tasks
		provider = "nvidia"
		result, err = h.nvidiaClient.QuickProcess(ctx, req.Text)
	}

	if err != nil {
		log.Printf("Error in smart process: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to process request",
		})
	}

	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"result":     result,
			"task":       req.Task,
			"complexity": req.Complexity,
			"provider":   provider,
			"timestamp":  time.Now().Unix(),
		},
	})
}