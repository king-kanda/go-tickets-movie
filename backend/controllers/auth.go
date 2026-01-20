package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nilotic-king/go-ticketing/database"
	"github.com/nilotic-king/go-ticketing/models"
	"github.com/nilotic-king/go-ticketing/utils"
)

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Register creates a new user account
func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		utils.ValidationErrorResponse(c, "Email already registered")
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to hash password")
		return
	}

	// Create user
	user := models.User{
		Email:        req.Email,
		PasswordHash: hashedPassword,
		Name:         req.Name,
		Role:         "user",
	}

	if err := database.DB.Create(&user).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to create user")
		return
	}

	// Generate token
	token, err := utils.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate token")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "User registered successfully", gin.H{
		"user":  user,
		"token": token,
	})
}

// Login authenticates a user
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Find user
	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		utils.UnauthorizedResponse(c, "Invalid email or password")
		return
	}

	// Check password
	if err := utils.CheckPassword(user.PasswordHash, req.Password); err != nil {
		utils.UnauthorizedResponse(c, "Invalid email or password")
		return
	}

	// Generate token
	token, err := utils.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate token")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Login successful", gin.H{
		"user":  user,
		"token": token,
	})
}

// GetMe returns current user info
func GetMe(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User info retrieved", user)
}

// Logout handles user logout (client-side token removal)
func Logout(c *gin.Context) {
	utils.SuccessResponse(c, http.StatusOK, "Logout successful", nil)
}
