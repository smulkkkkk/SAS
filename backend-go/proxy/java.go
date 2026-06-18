// backend-go/proxy/java.go
package proxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/gin-gonic/gin"
)

func JavaProxy() gin.HandlerFunc {
	return func(c *gin.Context) {
		javaURL := os.Getenv("JAVA_URL")
		if javaURL == "" {
			javaURL = "http://localhost:8081"
		}
		target, err := url.Parse(javaURL)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid JAVA_URL"})
			return
		}
		proxy := httputil.NewSingleHostReverseProxy(target)
		// Let the default Director handle path + query; only fix the Host header
		defaultDirector := proxy.Director
		proxy.Director = func(req *http.Request) {
			defaultDirector(req)
			req.Host = target.Host
		}
		proxy.ServeHTTP(c.Writer, c.Request)
	}
}
