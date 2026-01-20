package models

import (
	"time"

	"gorm.io/gorm"
)

type Movie struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `gorm:"type:text" json:"description"`
	Duration    int            `gorm:"not null" json:"duration"` // in minutes
	Genre       string         `json:"genre"`
	Rating      string         `json:"rating"` // e.g., PG, PG-13, R
	PosterURL   string         `json:"poster_url"`
	ReleaseDate time.Time      `json:"release_date"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	Showtimes   []Showtime     `gorm:"foreignKey:MovieID" json:"showtimes,omitempty"`
}
