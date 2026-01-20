package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nilotic-king/go-ticketing/database"
	"github.com/nilotic-king/go-ticketing/models"
	"github.com/nilotic-king/go-ticketing/utils"
	"gorm.io/gorm"
)

type BookingRequest struct {
	ShowtimeID  uint `json:"showtime_id" binding:"required"`
	SeatsBooked int  `json:"seats_booked" binding:"required,min=1"`
}

// ListBookings retrieves all bookings for the current user
func ListBookings(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var bookings []models.Booking
	if err := database.DB.
		Preload("Showtime.Movie").
		Preload("Showtime.Theater").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&bookings).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve bookings")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Bookings retrieved successfully", bookings)
}

// GetBooking retrieves a single booking by ID
func GetBooking(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	var booking models.Booking
	if err := database.DB.
		Preload("Showtime.Movie").
		Preload("Showtime.Theater").
		Where("id = ? AND user_id = ?", id, userID).
		First(&booking).Error; err != nil {
		utils.NotFoundResponse(c, "Booking not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Booking retrieved successfully", booking)
}

// CreateBooking creates a new booking
func CreateBooking(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req BookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Start a transaction
	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Get showtime with lock
	var showtime models.Showtime
	if err := tx.Clauses(gorm.Locking{Strength: "UPDATE"}).
		First(&showtime, req.ShowtimeID).Error; err != nil {
		tx.Rollback()
		utils.NotFoundResponse(c, "Showtime not found")
		return
	}

	// Check seat availability
	if showtime.AvailableSeats < req.SeatsBooked {
		tx.Rollback()
		utils.ValidationErrorResponse(c, "Not enough seats available")
		return
	}

	// Calculate total price
	totalPrice := float64(req.SeatsBooked) * showtime.Price

	// Create booking
	booking := models.Booking{
		UserID:      userID.(uint),
		ShowtimeID:  req.ShowtimeID,
		SeatsBooked: req.SeatsBooked,
		TotalPrice:  totalPrice,
		Status:      "confirmed",
	}

	if err := tx.Create(&booking).Error; err != nil {
		tx.Rollback()
		utils.InternalServerErrorResponse(c, "Failed to create booking")
		return
	}

	// Update available seats
	showtime.AvailableSeats -= req.SeatsBooked
	if err := tx.Save(&showtime).Error; err != nil {
		tx.Rollback()
		utils.InternalServerErrorResponse(c, "Failed to update showtime")
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to complete booking")
		return
	}

	// Load relationships
	database.DB.Preload("Showtime.Movie").Preload("Showtime.Theater").First(&booking, booking.ID)

	utils.SuccessResponse(c, http.StatusCreated, "Booking created successfully", booking)
}

// CancelBooking cancels a booking (soft delete)
func CancelBooking(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	// Start a transaction
	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Get booking
	var booking models.Booking
	if err := tx.Where("id = ? AND user_id = ?", id, userID).First(&booking).Error; err != nil {
		tx.Rollback()
		utils.NotFoundResponse(c, "Booking not found")
		return
	}

	// Check if already cancelled
	if booking.Status == "cancelled" {
		tx.Rollback()
		utils.ValidationErrorResponse(c, "Booking already cancelled")
		return
	}

	// Get showtime
	var showtime models.Showtime
	if err := tx.First(&showtime, booking.ShowtimeID).Error; err != nil {
		tx.Rollback()
		utils.NotFoundResponse(c, "Showtime not found")
		return
	}

	// Update booking status
	booking.Status = "cancelled"
	if err := tx.Save(&booking).Error; err != nil {
		tx.Rollback()
		utils.InternalServerErrorResponse(c, "Failed to cancel booking")
		return
	}

	// Return seats to showtime
	showtime.AvailableSeats += booking.SeatsBooked
	if err := tx.Save(&showtime).Error; err != nil {
		tx.Rollback()
		utils.InternalServerErrorResponse(c, "Failed to update showtime")
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to cancel booking")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Booking cancelled successfully", booking)
}
