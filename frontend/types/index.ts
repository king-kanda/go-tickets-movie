export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  genre: string;
  rating: string;
  poster_url: string;
  release_date: string;
  created_at: string;
  updated_at: string;
  showtimes?: Showtime[];
}

export interface Theater {
  id: number;
  name: string;
  location: string;
  total_seats: number;
  created_at: string;
  updated_at: string;
  showtimes?: Showtime[];
}

export interface Showtime {
  id: number;
  movie_id: number;
  movie?: Movie;
  theater_id: number;
  theater?: Theater;
  start_time: string;
  end_time: string;
  price: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  user?: User;
  showtime_id: number;
  showtime?: Showtime;
  seats_booked: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_movies: number;
  total_theaters: number;
  total_showtimes: number;
  total_bookings: number;
  total_revenue: number;
  total_users: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
