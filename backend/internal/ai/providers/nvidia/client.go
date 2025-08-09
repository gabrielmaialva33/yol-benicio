package nvidia

import (
	"context"
	"fmt"
	"log"

	"github.com/gabrielmaialva33/yol-benicio-api/pkg/config"
	"github.com/sashabaranov/go-openai"
)

type Client struct {
	client *openai.Client
	model  string
	config *config.NVIDIAConfig
}

// NewClient creates a new NVIDIA client (OpenAI-compatible)
func NewClient(cfg *config.NVIDIAConfig) (*Client, error) {
	if cfg.APIKey == "" {
		return nil, fmt.Errorf("NVIDIA API key is required")
	}

	// Configure client with custom base URL
	config := openai.DefaultConfig(cfg.APIKey)
	config.BaseURL = cfg.BaseURL

	client := openai.NewClientWithConfig(config)

	log.Printf("NVIDIA client initialized with model: %s", cfg.Model)

	return &Client{
		client: client,
		model:  cfg.Model,
		config: cfg,
	}, nil
}

// QuickProcess performs quick processing with NVIDIA
func (c *Client) QuickProcess(ctx context.Context, prompt string) (string, error) {
	log.Printf("NVIDIA QuickProcess called with prompt: %s", prompt[:min(50, len(prompt))])
	
	resp, err := c.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: c.model,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "Você é um assistente jurídico eficiente. Responda de forma clara e objetiva.",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		Temperature: 0.5,
		MaxTokens:   1000,
	})

	if err != nil {
		log.Printf("NVIDIA API error: %v", err)
		return "", fmt.Errorf("failed to create completion: %w", err)
	}

	if len(resp.Choices) == 0 {
		log.Printf("NVIDIA empty response: %+v", resp)
		return "", fmt.Errorf("no response from NVIDIA")
	}

	result := resp.Choices[0].Message.Content
	log.Printf("NVIDIA response: %s", result[:min(100, len(result))])
	return result, nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// ExtractData performs structured data extraction
func (c *Client) ExtractData(ctx context.Context, text string, fields []string) (map[string]string, error) {
	// Build prompt for extraction
	prompt := fmt.Sprintf(`Extraia os seguintes campos do texto abaixo:
%v

Texto:
%s

Retorne em formato JSON com os campos solicitados.`, fields, text)

	resp, err := c.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: c.model,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "Você é um especialista em extração de dados. Retorne sempre em formato JSON válido.",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		Temperature: 0.3, // Lower temperature for more precise extraction
		MaxTokens:   500,
	})

	if err != nil {
		return nil, fmt.Errorf("failed to extract data: %w", err)
	}

	if len(resp.Choices) == 0 {
		return nil, fmt.Errorf("no response from NVIDIA")
	}

	// For now, return as string
	// TODO: Implement JSON parser
	result := make(map[string]string)
	result["raw"] = resp.Choices[0].Message.Content
	
	return result, nil
}

// Summarize creates quick summaries
func (c *Client) Summarize(ctx context.Context, text string, maxWords int) (string, error) {
	prompt := fmt.Sprintf("Resuma o seguinte texto em no máximo %d palavras:\n\n%s", maxWords, text)
	log.Printf("NVIDIA Summarize called with text length: %d, max words: %d, model: %s", len(text), maxWords, c.model)

	resp, err := c.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: c.model,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "Você é um especialista em criar resumos concisos e informativos em português brasileiro.",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		Temperature: 0.5,
		MaxTokens:   500,
	})

	if err != nil {
		log.Printf("NVIDIA Summarize error: %v", err)
		return "", fmt.Errorf("failed to summarize: %w", err)
	}

	log.Printf("NVIDIA API Response: %+v", resp)

	if len(resp.Choices) == 0 {
		log.Printf("NVIDIA Summarize empty choices array")
		return "", fmt.Errorf("no response from NVIDIA")
	}

	result := resp.Choices[0].Message.Content
	
	// Check if content is empty
	if result == "" {
		log.Printf("NVIDIA returned empty content, full response: %+v", resp.Choices[0])
		// Try to use QuickProcess as fallback
		log.Printf("Attempting fallback with QuickProcess")
		return c.QuickProcess(ctx, prompt)
	}
	
	log.Printf("NVIDIA Summarize success, response: %s", result[:min(200, len(result))])
	return result, nil
}

// ClassifyDocument classifies document types
func (c *Client) ClassifyDocument(ctx context.Context, text string) (string, error) {
	categories := []string{
		"Petição Inicial",
		"Contestação",
		"Sentença",
		"Acórdão",
		"Recurso",
		"Contrato",
		"Procuração",
		"Certidão",
		"Ofício",
		"Outros",
	}

	// Limit text for classification
	textPreview := text
	if len(text) > 500 {
		textPreview = text[:500]
	}
	
	log.Printf("NVIDIA ClassifyDocument called with text length: %d, model: %s", len(text), c.model)
	
	prompt := fmt.Sprintf(`Classifique o documento abaixo em uma das seguintes categorias:
%v

Documento:
%s

Retorne apenas a categoria.`, categories, textPreview)

	resp, err := c.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: c.model,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "Você é um especialista em classificação de documentos jurídicos brasileiros.",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		Temperature: 0.3,
		MaxTokens:   20,
	})

	if err != nil {
		log.Printf("NVIDIA ClassifyDocument error: %v", err)
		return "", fmt.Errorf("failed to classify document: %w", err)
	}

	log.Printf("NVIDIA ClassifyDocument response: %+v", resp)

	if len(resp.Choices) == 0 {
		log.Printf("NVIDIA ClassifyDocument empty choices")
		return "", fmt.Errorf("no response from NVIDIA")
	}

	result := resp.Choices[0].Message.Content
	
	if result == "" {
		log.Printf("NVIDIA ClassifyDocument returned empty content")
		// Try with QuickProcess as fallback
		return c.QuickProcess(ctx, prompt)
	}
	
	log.Printf("NVIDIA ClassifyDocument success: %s", result)
	return result, nil
}

// Stream performs processing with streaming
func (c *Client) Stream(ctx context.Context, prompt string) (*openai.ChatCompletionStream, error) {
	stream, err := c.client.CreateChatCompletionStream(ctx, openai.ChatCompletionRequest{
		Model: c.model,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		Temperature: 0.7,
		MaxTokens:   1000,
		Stream:      true,
	})

	if err != nil {
		return nil, fmt.Errorf("failed to create stream: %w", err)
	}

	return stream, nil
}