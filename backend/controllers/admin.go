package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nilotic-king/go-ticketing/database"
	"github.com/nilotic-king/go-ticketing/models"
	"github.com/nilotic-king/go-ticketing/utils"
)

type DashboardStats struct {
	TotalMovies    int64   `json:"total_movies"`
	TotalTheaters  int64   `json:"total_theaters"`
	TotalShowtimes int64   `json:"total_showtimes"`
	TotalBookings  int64   `json:"total_bookings"`
	TotalRevenue   float64 `json:"total_revenue"`
	TotalUsers     int64   `json:"total_users"`
}

// GetDashboardStats retrieves dashboard statistics
func GetDashboardStats(c *gin.Context) {
	var stats DashboardStats

	database.DB.Model(&models.Movie{}).Count(&stats.TotalMovies)
	database.DB.Model(&models.Theater{}).Count(&stats.TotalTheaters)
	database.DB.Model(&models.Showtime{}).Count(&stats.TotalShowtimes)
	database.DB.Model(&models.Booking{}).Where("status = ?", "confirmed").Count(&stats.TotalBookings)
	database.DB.Model(&models.User{}).Count(&stats.TotalUsers)

	// Calculate total revenue
	database.DB.Model(&models.Booking{}).
		Where("status = ?", "confirmed").
		Select("COALESCE(SUM(total_price), 0)").
		Scan(&stats.TotalRevenue)

	utils.SuccessResponse(c, http.StatusOK, "Dashboard stats retrieved successfully", stats)
}

// ListAllBookings retrieves all bookings (admin only)
func ListAllBookings(c *gin.Context) {
	var bookings []models.Booking

	if err := database.DB.
		Preload("User").
		Preload("Showtime.Movie").
		Preload("Showtime.Theater").
		Order("created_at desc").
		Find(&bookings).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve bookings")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "All bookings retrieved successfully", bookings)
}
