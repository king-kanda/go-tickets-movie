package models

import (
	"time"

	"gorm.io/gorm"
)

type Booking struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	UserID      uint           `gorm:"not null" json:"user_id"`
	User        User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	ShowtimeID  uint           `gorm:"not null" json:"showtime_id"`
	Showtime    Showtime       `gorm:"foreignKey:ShowtimeID" json:"showtime,omitempty"`
	SeatsBooked int            `gorm:"not null" json:"seats_booked"`
	TotalPrice  float64        `gorm:"not null" json:"total_price"`
	Status      string         `gorm:"default:confirmed" json:"status"` // confirmed or cancelled
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
