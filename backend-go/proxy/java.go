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
		target, _ := url.Parse(javaURL)
		proxy := httputil.NewSingleHostReverseProxy(target)
		proxy.Director = func(req *http.Request) {
			req.URL.Scheme = target.Scheme
			req.URL.Host = target.Host
			req.Host = target.Host
		}
		proxy.ServeHTTP(c.Writer, c.Request)
	}
}
