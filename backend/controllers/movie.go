package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nilotic-king/go-ticketing/database"
	"github.com/nilotic-king/go-ticketing/models"
	"github.com/nilotic-king/go-ticketing/utils"
)

type MovieRequest struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	Duration    int       `json:"duration" binding:"required"`
	Genre       string    `json:"genre"`
	Rating      string    `json:"rating"`
	PosterURL   string    `json:"poster_url"`
	ReleaseDate time.Time `json:"release_date"`
}

// ListMovies retrieves all movies
func ListMovies(c *gin.Context) {
	var movies []models.Movie

	if err := database.DB.Find(&movies).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve movies")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Movies retrieved successfully", movies)
}

// GetMovie retrieves a single movie by ID
func GetMovie(c *gin.Context) {
	id := c.Param("id")

	var movie models.Movie
	if err := database.DB.Preload("Showtimes").First(&movie, id).Error; err != nil {
		utils.NotFoundResponse(c, "Movie not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Movie retrieved successfully", movie)
}

// CreateMovie creates a new movie (admin only)
func CreateMovie(c *gin.Context) {
	var req MovieRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	movie := models.Movie{
		Title:       req.Title,
		Description: req.Description,
		Duration:    req.Duration,
		Genre:       req.Genre,
		Rating:      req.Rating,
		PosterURL:   req.PosterURL,
		ReleaseDate: req.ReleaseDate,
	}

	if err := database.DB.Create(&movie).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to create movie")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Movie created successfully", movie)
}

// UpdateMovie updates a movie (admin only)
func UpdateMovie(c *gin.Context) {
	id := c.Param("id")

	var movie models.Movie
	if err := database.DB.First(&movie, id).Error; err != nil {
		utils.NotFoundResponse(c, "Movie not found")
		return
	}

	var req MovieRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	movie.Title = req.Title
	movie.Description = req.Description
	movie.Duration = req.Duration
	movie.Genre = req.Genre
	movie.Rating = req.Rating
	movie.PosterURL = req.PosterURL
	movie.ReleaseDate = req.ReleaseDate

	if err := database.DB.Save(&movie).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to update movie")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Movie updated successfully", movie)
}

// DeleteMovie deletes a movie (admin only)
func DeleteMovie(c *gin.Context) {
	id := c.Param("id")

	var movie models.Movie
	if err := database.DB.First(&movie, id).Error; err != nil {
		utils.NotFoundResponse(c, "Movie not found")
		return
	}

	if err := database.DB.Delete(&movie).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to delete movie")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Movie deleted successfully", nil)
}
