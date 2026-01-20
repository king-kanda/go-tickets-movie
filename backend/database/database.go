package database

import (
	"log"
	"time"

	"github.com/nilotic-king/go-ticketing/models"
	"github.com/nilotic-king/go-ticketing/utils"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Connect initializes the database connection
func Connect(dbPath string) error {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return err
	}

	log.Println("Database connected successfully")
	return nil
}

// Migrate runs auto-migrations for all models
func Migrate() error {
	err := DB.AutoMigrate(
		&models.User{},
		&models.Movie{},
		&models.Theater{},
		&models.Showtime{},
		&models.Booking{},
	)
	if err != nil {
		return err
	}

	log.Println("Database migrations completed")
	return nil
}

// SeedData creates initial data for testing
func SeedData() error {
	// Check if admin user exists
	var adminCount int64
	DB.Model(&models.User{}).Where("role = ?", "admin").Count(&adminCount)

	if adminCount == 0 {
		// Create admin user
		hashedPassword, err := utils.HashPassword("admin123")
		if err != nil {
			return err
		}

		admin := models.User{
			Email:        "admin@ticketing.com",
			PasswordHash: hashedPassword,
			Name:         "Admin User",
			Role:         "admin",
		}
		if err := DB.Create(&admin).Error; err != nil {
			return err
		}
		log.Println("Admin user created: admin@ticketing.com / admin123")
	}

	// Check if we have any movies
	var movieCount int64
	DB.Model(&models.Movie{}).Count(&movieCount)

	if movieCount == 0 {
		// Create sample movies
		movies := []models.Movie{
			{
				Title:       "The Shawshank Redemption",
				Description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
				Duration:    142,
				Genre:       "Drama",
				Rating:      "R",
				PosterURL:   "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
				ReleaseDate: time.Date(1994, 9, 23, 0, 0, 0, 0, time.UTC),
			},
			{
				Title:       "The Dark Knight",
				Description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
				Duration:    152,
				Genre:       "Action",
				Rating:      "PG-13",
				PosterURL:   "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
				ReleaseDate: time.Date(2008, 7, 18, 0, 0, 0, 0, time.UTC),
			},
			{
				Title:       "Inception",
				Description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
				Duration:    148,
				Genre:       "Sci-Fi",
				Rating:      "PG-13",
				PosterURL:   "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
				ReleaseDate: time.Date(2010, 7, 16, 0, 0, 0, 0, time.UTC),
			},
		}

		for _, movie := range movies {
			if err := DB.Create(&movie).Error; err != nil {
				return err
			}
		}
		log.Println("Sample movies created")
	}

	// Check if we have any theaters
	var theaterCount int64
	DB.Model(&models.Theater{}).Count(&theaterCount)

	if theaterCount == 0 {
		// Create sample theaters
		theaters := []models.Theater{
			{Name: "Grand Cinema Hall 1", Location: "Downtown Plaza", TotalSeats: 150},
			{Name: "Grand Cinema Hall 2", Location: "Downtown Plaza", TotalSeats: 120},
			{Name: "Royal Theater", Location: "Uptown District", TotalSeats: 200},
		}

		for _, theater := range theaters {
			if err := DB.Create(&theater).Error; err != nil {
				return err
			}
		}
		log.Println("Sample theaters created")
	}

	// Check if we have any showtimes
	var showtimeCount int64
	DB.Model(&models.Showtime{}).Count(&showtimeCount)

	if showtimeCount == 0 {
		// Create sample showtimes for today and tomorrow
		var movies []models.Movie
		var theaters []models.Theater
		DB.Find(&movies)
		DB.Find(&theaters)

		if len(movies) > 0 && len(theaters) > 0 {
			now := time.Now()
			showtimes := []models.Showtime{
				{
					MovieID:        movies[0].ID,
					TheaterID:      theaters[0].ID,
					StartTime:      time.Date(now.Year(), now.Month(), now.Day(), 14, 0, 0, 0, now.Location()),
					EndTime:        time.Date(now.Year(), now.Month(), now.Day(), 16, 30, 0, 0, now.Location()),
					Price:          12.50,
					AvailableSeats: 150,
				},
				{
					MovieID:        movies[0].ID,
					TheaterID:      theaters[0].ID,
					StartTime:      time.Date(now.Year(), now.Month(), now.Day(), 19, 0, 0, 0, now.Location()),
					EndTime:        time.Date(now.Year(), now.Month(), now.Day(), 21, 30, 0, 0, now.Location()),
					Price:          15.00,
					AvailableSeats: 150,
				},
				{
					MovieID:        movies[1].ID,
					TheaterID:      theaters[1].ID,
					StartTime:      time.Date(now.Year(), now.Month(), now.Day(), 15, 0, 0, 0, now.Location()),
					EndTime:        time.Date(now.Year(), now.Month(), now.Day(), 17, 30, 0, 0, now.Location()),
					Price:          13.00,
					AvailableSeats: 120,
				},
				{
					MovieID:        movies[2].ID,
					TheaterID:      theaters[2].ID,
					StartTime:      time.Date(now.Year(), now.Month(), now.Day(), 18, 0, 0, 0, now.Location()),
					EndTime:        time.Date(now.Year(), now.Month(), now.Day(), 20, 30, 0, 0, now.Location()),
					Price:          14.00,
					AvailableSeats: 200,
				},
			}

			for _, showtime := range showtimes {
				if err := DB.Create(&showtime).Error; err != nil {
					return err
				}
			}
			log.Println("Sample showtimes created")
		}
	}

	return nil
}
