// backend-go/handlers/chat.go
package handlers

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type ChatContext struct {
	TodayAppointments int      `json:"todayAppointments"`
	MonthRevenue      float64  `json:"monthRevenue"`
	PendingPayables   int      `json:"pendingPayables"`
	TopClients        []string `json:"topClients"`
	CurrentPage       string   `json:"currentPage"`
}

type ChatRequest struct {
	Message string      `json:"message" binding:"required"`
	Context ChatContext `json:"context"`
}

type ClaudeMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ClaudeRequest struct {
	Model     string          `json:"model"`
	MaxTokens int             `json:"max_tokens"`
	System    string          `json:"system"`
	Messages  []ClaudeMessage `json:"messages"`
	Stream    bool            `json:"stream"`
}

func buildSystemPrompt(ctx ChatContext) string {
	return fmt.Sprintf(`Você é o assistente do PulseFlow, um SaaS de gestão de negócios.
Seja conciso e direto. Responda em português brasileiro.

Dados atuais do sistema:
- Agendamentos hoje: %d
- Receita do mês: R$ %.2f
- Contas pendentes: %d
- Clientes em destaque: %v
- Página atual: %s

Responda sobre o negócio com base nesses dados quando relevante. Para perguntas gerais, responda normalmente.`,
		ctx.TodayAppointments,
		ctx.MonthRevenue,
		ctx.PendingPayables,
		ctx.TopClients,
		ctx.CurrentPage,
	)
}

func Chat(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "requisição inválida"})
		return
	}

	claudeReq := ClaudeRequest{
		Model:     "claude-haiku-4-5-20251001",
		MaxTokens: 1024,
		System:    buildSystemPrompt(req.Context),
		Messages:  []ClaudeMessage{{Role: "user", Content: req.Message}},
		Stream:    true,
	}

	body, _ := json.Marshal(claudeReq)
	httpReq, _ := http.NewRequestWithContext(c.Request.Context(), "POST",
		"https://api.anthropic.com/v1/messages", bytes.NewReader(body))
	httpReq.Header.Set("x-api-key", os.Getenv("CLAUDE_API_KEY"))
	httpReq.Header.Set("anthropic-version", "2023-06-01")
	httpReq.Header.Set("content-type", "application/json")

	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "erro ao conectar Claude API"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var apiErr map[string]any
		bodyBytes, _ := io.ReadAll(resp.Body)
		if jsonErr := json.Unmarshal(bodyBytes, &apiErr); jsonErr == nil {
			c.JSON(resp.StatusCode, gin.H{"error": apiErr})
		} else {
			c.JSON(resp.StatusCode, gin.H{"error": fmt.Sprintf("Claude API retornou status %d", resp.StatusCode)})
		}
		return
	}

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Transfer-Encoding", "chunked")

	flusher, ok := c.Writer.(http.Flusher)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "streaming não suportado"})
		return
	}

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" || !bytes.HasPrefix([]byte(line), []byte("data: ")) {
			continue
		}
		data := line[6:]
		if data == "[DONE]" {
			fmt.Fprintf(c.Writer, "data: [DONE]\n\n")
			flusher.Flush()
			break
		}
		var event map[string]any
		if err := json.Unmarshal([]byte(data), &event); err != nil {
			continue
		}
		if event["type"] == "content_block_delta" {
			delta, _ := event["delta"].(map[string]any)
			if text, ok := delta["text"].(string); ok {
				payload, _ := json.Marshal(map[string]string{"text": text})
				fmt.Fprintf(c.Writer, "data: %s\n\n", payload)
				flusher.Flush()
			}
		}
		if event["type"] == "message_stop" {
			fmt.Fprintf(c.Writer, "data: [DONE]\n\n")
			flusher.Flush()
			break
		}
	}
	io.Copy(io.Discard, resp.Body)
}
