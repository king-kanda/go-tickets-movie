package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nilotic-king/go-ticketing/database"
	"github.com/nilotic-king/go-ticketing/models"
	"github.com/nilotic-king/go-ticketing/utils"
)

type ShowtimeRequest struct {
	MovieID        uint      `json:"movie_id" binding:"required"`
	TheaterID      uint      `json:"theater_id" binding:"required"`
	StartTime      time.Time `json:"start_time" binding:"required"`
	EndTime        time.Time `json:"end_time" binding:"required"`
	Price          float64   `json:"price" binding:"required"`
	AvailableSeats int       `json:"available_seats" binding:"required"`
}

// ListShowtimes retrieves all showtimes with optional filters
func ListShowtimes(c *gin.Context) {
	var showtimes []models.Showtime

	query := database.DB.Preload("Movie").Preload("Theater")

	// Filter by movie_id
	if movieID := c.Query("movie_id"); movieID != "" {
		query = query.Where("movie_id = ?", movieID)
	}

	// Filter by theater_id
	if theaterID := c.Query("theater_id"); theaterID != "" {
		query = query.Where("theater_id = ?", theaterID)
	}

	// Filter by date
	if date := c.Query("date"); date != "" {
		parsedDate, err := time.Parse("2006-01-02", date)
		if err == nil {
			startOfDay := parsedDate
			endOfDay := parsedDate.Add(24 * time.Hour)
			query = query.Where("start_time >= ? AND start_time < ?", startOfDay, endOfDay)
		}
	}

	if err := query.Find(&showtimes).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve showtimes")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Showtimes retrieved successfully", showtimes)
}

// GetShowtime retrieves a single showtime by ID
func GetShowtime(c *gin.Context) {
	id := c.Param("id")

	var showtime models.Showtime
	if err := database.DB.Preload("Movie").Preload("Theater").First(&showtime, id).Error; err != nil {
		utils.NotFoundResponse(c, "Showtime not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Showtime retrieved successfully", showtime)
}

// CreateShowtime creates a new showtime (admin only)
func CreateShowtime(c *gin.Context) {
	var req ShowtimeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Verify movie exists
	var movie models.Movie
	if err := database.DB.First(&movie, req.MovieID).Error; err != nil {
		utils.ValidationErrorResponse(c, "Movie not found")
		return
	}

	// Verify theater exists
	var theater models.Theater
	if err := database.DB.First(&theater, req.TheaterID).Error; err != nil {
		utils.ValidationErrorResponse(c, "Theater not found")
		return
	}

	showtime := models.Showtime{
		MovieID:        req.MovieID,
		TheaterID:      req.TheaterID,
		StartTime:      req.StartTime,
		EndTime:        req.EndTime,
		Price:          req.Price,
		AvailableSeats: req.AvailableSeats,
	}

	if err := database.DB.Create(&showtime).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to create showtime")
		return
	}

	// Load relationships
	database.DB.Preload("Movie").Preload("Theater").First(&showtime, showtime.ID)

	utils.SuccessResponse(c, http.StatusCreated, "Showtime created successfully", showtime)
}

// UpdateShowtime updates a showtime (admin only)
func UpdateShowtime(c *gin.Context) {
	id := c.Param("id")

	var showtime models.Showtime
	if err := database.DB.First(&showtime, id).Error; err != nil {
		utils.NotFoundResponse(c, "Showtime not found")
		return
	}

	var req ShowtimeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	showtime.MovieID = req.MovieID
	showtime.TheaterID = req.TheaterID
	showtime.StartTime = req.StartTime
	showtime.EndTime = req.EndTime
	showtime.Price = req.Price
	showtime.AvailableSeats = req.AvailableSeats

	if err := database.DB.Save(&showtime).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to update showtime")
		return
	}

	// Load relationships
	database.DB.Preload("Movie").Preload("Theater").First(&showtime, showtime.ID)

	utils.SuccessResponse(c, http.StatusOK, "Showtime updated successfully", showtime)
}

// DeleteShowtime deletes a showtime (admin only)
func DeleteShowtime(c *gin.Context) {
	id := c.Param("id")

	var showtime models.Showtime
	if err := database.DB.First(&showtime, id).Error; err != nil {
		utils.NotFoundResponse(c, "Showtime not found")
		return
	}

	if err := database.DB.Delete(&showtime).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to delete showtime")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Showtime deleted successfully", nil)
}
