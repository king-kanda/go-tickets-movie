package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nilotic-king/go-ticketing/controllers"
	"github.com/nilotic-king/go-ticketing/middleware"
)

func SetupRoutes(router *gin.Engine) {
	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// API routes
	api := router.Group("/api")
	{
		// Auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
			auth.POST("/logout", controllers.Logout)
			auth.GET("/me", middleware.AuthMiddleware(), controllers.GetMe)
		}

		// Movie routes
		movies := api.Group("/movies")
		{
			movies.GET("", controllers.ListMovies)
			movies.GET("/:id", controllers.GetMovie)

			// Admin only
			movies.POST("", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.CreateMovie)
			movies.PUT("/:id", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.UpdateMovie)
			movies.DELETE("/:id", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.DeleteMovie)
		}

		// Theater routes
		theaters := api.Group("/theaters")
		{
			theaters.GET("", controllers.ListTheaters)
			theaters.GET("/:id", controllers.GetTheater)

			// Admin only
			theaters.POST("", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.CreateTheater)
			theaters.PUT("/:id", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.UpdateTheater)
			theaters.DELETE("/:id", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.DeleteTheater)
		}

		// Showtime routes
		showtimes := api.Group("/showtimes")
		{
			showtimes.GET("", controllers.ListShowtimes)
			showtimes.GET("/:id", controllers.GetShowtime)

			// Admin only
			showtimes.POST("", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.CreateShowtime)
			showtimes.PUT("/:id", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.UpdateShowtime)
			showtimes.DELETE("/:id", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.DeleteShowtime)
		}

		// Booking routes (protected)
		bookings := api.Group("/bookings")
		bookings.Use(middleware.AuthMiddleware())
		{
			bookings.GET("", controllers.ListBookings)
			bookings.GET("/:id", controllers.GetBooking)
			bookings.POST("", controllers.CreateBooking)
			bookings.DELETE("/:id", controllers.CancelBooking)
		}

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
		{
			admin.GET("/stats", controllers.GetDashboardStats)
			admin.GET("/bookings", controllers.ListAllBookings)
		}
	}

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
}
