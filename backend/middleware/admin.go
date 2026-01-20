package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/nilotic-king/go-ticketing/utils"
)

// AdminMiddleware checks if user has admin role
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("user_role")
		if !exists {
			utils.UnauthorizedResponse(c, "User role not found")
			c.Abort()
			return
		}

		if role != "admin" {
			utils.ErrorResponse(c, 403, "Access denied. Admin privileges required")
			c.Abort()
			return
		}

		c.Next()
	}
}
