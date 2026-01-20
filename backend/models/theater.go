package models

import (
	"time"

	"gorm.io/gorm"
)

type Theater struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Name       string         `gorm:"not null" json:"name"`
	Location   string         `gorm:"not null" json:"location"`
	TotalSeats int            `gorm:"not null" json:"total_seats"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
	Showtimes  []Showtime     `gorm:"foreignKey:TheaterID" json:"showtimes,omitempty"`
}
