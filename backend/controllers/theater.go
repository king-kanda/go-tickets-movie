package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nilotic-king/go-ticketing/database"
	"github.com/nilotic-king/go-ticketing/models"
	"github.com/nilotic-king/go-ticketing/utils"
)

type TheaterRequest struct {
	Name       string `json:"name" binding:"required"`
	Location   string `json:"location" binding:"required"`
	TotalSeats int    `json:"total_seats" binding:"required"`
}

// ListTheaters retrieves all theaters
func ListTheaters(c *gin.Context) {
	var theaters []models.Theater

	if err := database.DB.Find(&theaters).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve theaters")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Theaters retrieved successfully", theaters)
}

// GetTheater retrieves a single theater by ID
func GetTheater(c *gin.Context) {
	id := c.Param("id")

	var theater models.Theater
	if err := database.DB.Preload("Showtimes").First(&theater, id).Error; err != nil {
		utils.NotFoundResponse(c, "Theater not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Theater retrieved successfully", theater)
}

// CreateTheater creates a new theater (admin only)
func CreateTheater(c *gin.Context) {
	var req TheaterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	theater := models.Theater{
		Name:       req.Name,
		Location:   req.Location,
		TotalSeats: req.TotalSeats,
	}

	if err := database.DB.Create(&theater).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to create theater")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Theater created successfully", theater)
}

// UpdateTheater updates a theater (admin only)
func UpdateTheater(c *gin.Context) {
	id := c.Param("id")

	var theater models.Theater
	if err := database.DB.First(&theater, id).Error; err != nil {
		utils.NotFoundResponse(c, "Theater not found")
		return
	}

	var req TheaterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	theater.Name = req.Name
	theater.Location = req.Location
	theater.TotalSeats = req.TotalSeats

	if err := database.DB.Save(&theater).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to update theater")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Theater updated successfully", theater)
}

// DeleteTheater deletes a theater (admin only)
func DeleteTheater(c *gin.Context) {
	id := c.Param("id")

	var theater models.Theater
	if err := database.DB.First(&theater, id).Error; err != nil {
		utils.NotFoundResponse(c, "Theater not found")
		return
	}

	if err := database.DB.Delete(&theater).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to delete theater")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Theater deleted successfully", nil)
}
