# Movie Ticket Booking System

A full-stack movie ticket booking system built with Go (Gin framework) and Next.js, demonstrating CRUD operations and REST API design.

## Tech Stack

### Backend
- **Go 1.24** - Programming language
- **Gin** - Web framework
- **GORM** - ORM for database operations
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

## Features

### User Features
- Browse available movies with posters and details
- View movie information (genre, rating, duration, description)
- See available showtimes for each movie
- Book tickets for showtimes
- View and cancel bookings
- User authentication (register/login)

### Admin Features
- Dashboard with statistics (movies, theaters, bookings, revenue)
- Full CRUD operations for movies
- Full CRUD operations for theaters
- Full CRUD operations for showtimes
- View all bookings across the system
- Role-based access control

## Database Schema

The system uses 5 main tables:
- **users** - User accounts (email, password, role)
- **movies** - Movie information
- **theaters** - Theater locations and capacity
- **showtimes** - Movie schedules with pricing
- **bookings** - User ticket bookings

## REST API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Movies
- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)

### Theaters
- `GET /api/theaters` - List all theaters
- `GET /api/theaters/:id` - Get theater details
- `POST /api/theaters` - Create theater (admin only)
- `PUT /api/theaters/:id` - Update theater (admin only)
- `DELETE /api/theaters/:id` - Delete theater (admin only)

### Showtimes
- `GET /api/showtimes` - List showtimes (with filters)
- `GET /api/showtimes/:id` - Get showtime details
- `POST /api/showtimes` - Create showtime (admin only)
- `PUT /api/showtimes/:id` - Update showtime (admin only)
- `DELETE /api/showtimes/:id` - Delete showtime (admin only)

### Bookings
- `GET /api/bookings` - List user's bookings (protected)
- `GET /api/bookings/:id` - Get booking details (protected)
- `POST /api/bookings` - Create booking (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin only)
- `GET /api/admin/bookings` - List all bookings (admin only)

## Installation & Setup

### Prerequisites
- Go 1.24 or higher
- Node.js 18 or higher
- npm or yarn

### Quick Start (Recommended)

Use the provided startup scripts to run both servers with a single command:

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```bat
start.bat
```

**Development Mode (with live logs):**
```bash
./start-dev.sh
```

**Stop All Servers:**
```bash
./stop.sh
```

The scripts will:
- ✅ Check prerequisites
- ✅ Install dependencies automatically
- ✅ Start both backend and frontend servers
- ✅ Display access URLs and admin credentials
- ✅ Handle graceful shutdown on Ctrl+C

### Manual Setup

If you prefer to start servers manually:

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Go dependencies:
```bash
go mod download
```

3. Run the backend server:
```bash
go run main.go
```

The backend will start on `http://localhost:8080`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Default Credentials

### Admin Account
- Email: `admin@ticketing.com`
- Password: `admin123`

### Sample Data
The system automatically seeds sample data on first run:
- 3 movies (The Shawshank Redemption, The Dark Knight, Inception)
- 3 theaters (Grand Cinema Hall 1, Grand Cinema Hall 2, Royal Theater)
- 4 showtimes for today

## Project Structure

```
go-ticketing/
├── backend/
│   ├── config/          # Configuration
│   ├── controllers/     # Request handlers
│   ├── database/        # DB connection & migrations
│   ├── middleware/      # Auth & admin middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── main.go          # Entry point
├── frontend/
│   ├── app/             # Next.js pages
│   │   ├── admin/       # Admin panel
│   │   ├── bookings/    # User bookings
│   │   ├── login/       # Login page
│   │   ├── register/    # Register page
│   │   └── movies/      # Movie details
│   ├── components/      # React components
│   ├── lib/             # API client
│   └── types/           # TypeScript types
└── README.md
```

## Key Implementation Details

### CRUD Operations
All entities (Movies, Theaters, Showtimes, Bookings) implement full CRUD:
- **Create** - Add new records
- **Read** - List and view details
- **Update** - Edit existing records
- **Delete** - Remove records

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Role-based access control (user/admin)

### Database Relationships
- One-to-Many: Movie → Showtimes, Theater → Showtimes, User → Bookings
- Foreign key constraints ensure data integrity
- Preloading relationships for efficient queries

### Transaction Handling
- Booking creation uses database transactions
- Ensures seat availability is checked and updated atomically
- Prevents race conditions in concurrent bookings

### Error Handling
- Standard API response format
- Proper HTTP status codes
- Client-side error display
- Form validation

## Development Notes

### Backend
- Uses Gin for high-performance HTTP routing
- GORM provides ORM with migrations
- SQLite for easy setup (production should use PostgreSQL/MySQL)
- CORS configured for frontend communication

### Frontend
- Next.js App Router with client-side rendering where needed
- TypeScript for type safety
- Tailwind CSS for responsive design
- LocalStorage for JWT token persistence

## Future Enhancements

Potential improvements:
- Payment integration (Stripe, PayPal)
- Seat selection with visual seat map
- Email notifications for bookings
- Search and filtering for movies
- User reviews and ratings
- QR code tickets
- Multi-language support
- Dark mode

## License

This project is created for educational purposes to demonstrate CRUD operations and REST API design with Go and Next.js.

---
