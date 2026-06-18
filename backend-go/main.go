// backend-go/main.go
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"pulseflow-gateway/handlers"
	"pulseflow-gateway/middleware"
	"pulseflow-gateway/models"
	"pulseflow-gateway/proxy"
)

func corsMiddleware() gin.HandlerFunc {
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:5173" // safe default for dev
	}
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", allowedOrigin)
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func main() {
	godotenv.Load()
	models.InitDB()

	secret := os.Getenv("JWT_SECRET")
	if len(secret) < 32 {
		log.Fatal("JWT_SECRET must be at least 32 characters")
	}

	r := gin.Default()
	r.Use(corsMiddleware())

	// Public
	r.POST("/auth/login", handlers.Login)
	r.POST("/auth/refresh", handlers.Refresh)
	r.POST("/auth/logout", handlers.Logout)

	// Protected
	protected := r.Group("/")
	protected.Use(middleware.JWTAuth())
	{
		protected.POST("/chat", handlers.Chat)
		protected.Any("/api/*path", proxy.JavaProxy())
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
