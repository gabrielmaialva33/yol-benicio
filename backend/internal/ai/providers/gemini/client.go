package gemini

import (
	"context"
	"fmt"
	"log"

	"github.com/gabrielmaialva33/yol-benicio-api/pkg/config"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type Client struct {
	client *genai.Client
	model  *genai.GenerativeModel
	config *config.GeminiConfig
}

// NewClient creates a new Gemini client
func NewClient(cfg *config.GeminiConfig) (*Client, error) {
	if cfg.APIKey == "" {
		return nil, fmt.Errorf("Gemini API key is required")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(cfg.APIKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %w", err)
	}

	// Configure the model
	model := client.GenerativeModel(cfg.Model)
	
	// Generation settings
	model.SetTemperature(0.7)
	model.SetTopK(40)
	model.SetTopP(0.95)
	model.SetMaxOutputTokens(2048)

	log.Printf("Gemini client initialized with model: %s", cfg.Model)

	return &Client{
		client: client,
		model:  model,
		config: cfg,
	}, nil
}

// Analyze performs complex analysis with Gemini
func (c *Client) Analyze(ctx context.Context, prompt string, analysisType string) (string, error) {
	// Add specific context based on analysis type
	systemPrompt := c.getSystemPrompt(analysisType)
	fullPrompt := fmt.Sprintf("%s\n\n%s", systemPrompt, prompt)

	resp, err := c.model.GenerateContent(ctx, genai.Text(fullPrompt))
	if err != nil {
		return "", fmt.Errorf("failed to generate content: %w", err)
	}

	if len(resp.Candidates) == 0 {
		return "", fmt.Errorf("no response from Gemini")
	}

	// Extract text from response
	var result string
	for _, part := range resp.Candidates[0].Content.Parts {
		if text, ok := part.(genai.Text); ok {
			result += string(text)
		}
	}

	return result, nil
}

// AnalyzeWithContext performs analysis with additional context
func (c *Client) AnalyzeWithContext(ctx context.Context, prompt string, context []string) (string, error) {
	// Build prompt with context
	fullPrompt := "Contexto:\n"
	for _, item := range context {
		fullPrompt += fmt.Sprintf("- %s\n", item)
	}
	fullPrompt += fmt.Sprintf("\nAnálise solicitada:\n%s", prompt)

	resp, err := c.model.GenerateContent(ctx, genai.Text(fullPrompt))
	if err != nil {
		return "", fmt.Errorf("failed to generate content with context: %w", err)
	}

	if len(resp.Candidates) == 0 {
		return "", fmt.Errorf("no response from Gemini")
	}

	var result string
	for _, part := range resp.Candidates[0].Content.Parts {
		if text, ok := part.(genai.Text); ok {
			result += string(text)
		}
	}

	return result, nil
}

// getSystemPrompt returns the system prompt based on analysis type
func (c *Client) getSystemPrompt(analysisType string) string {
	prompts := map[string]string{
		"risk_assessment": `Você é um advogado especialista brasileiro com 20 anos de experiência em análise de riscos jurídicos.
Analise o caso apresentado considerando:
1. Probabilidade de sucesso (baixa, média, alta)
2. Principais riscos identificados
3. Jurisprudência relevante
4. Estratégias recomendadas
5. Estimativa de tempo e custos
Seja objetivo e forneça uma análise estruturada.`,

		"legal_analysis": `Você é um jurista especializado em direito brasileiro.
Analise o caso considerando:
1. Fundamentos legais aplicáveis
2. Precedentes relevantes
3. Argumentos favoráveis e contrários
4. Recomendações estratégicas
Cite artigos de lei e súmulas quando aplicável.`,

		"document_review": `Você é um especialista em análise de documentos jurídicos.
Ao revisar o documento:
1. Identifique cláusulas problemáticas
2. Sugira melhorias de redação
3. Aponte possíveis riscos legais
4. Verifique conformidade legal
Seja detalhado e preciso.`,

		"default": `Você é um assistente jurídico especializado em direito brasileiro.
Forneça análises claras, objetivas e bem fundamentadas.
Considere sempre o contexto legal brasileiro e as melhores práticas jurídicas.`,
	}

	if prompt, exists := prompts[analysisType]; exists {
		return prompt
	}
	return prompts["default"]
}

// Close closes the Gemini client
func (c *Client) Close() error {
	if c.client != nil {
		return c.client.Close()
	}
	return nil
}