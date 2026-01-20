package models

import (
	"time"

	"gorm.io/gorm"
)

type Showtime struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	MovieID        uint           `gorm:"not null" json:"movie_id"`
	Movie          Movie          `gorm:"foreignKey:MovieID" json:"movie,omitempty"`
	TheaterID      uint           `gorm:"not null" json:"theater_id"`
	Theater        Theater        `gorm:"foreignKey:TheaterID" json:"theater,omitempty"`
	StartTime      time.Time      `gorm:"not null" json:"start_time"`
	EndTime        time.Time      `gorm:"not null" json:"end_time"`
	Price          float64        `gorm:"not null" json:"price"`
	AvailableSeats int            `gorm:"not null" json:"available_seats"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
	Bookings       []Booking      `gorm:"foreignKey:ShowtimeID" json:"bookings,omitempty"`
}
