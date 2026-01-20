import type { ApiResponse, User, Movie, Theater, Showtime, Booking, DashboardStats } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
    });

    return response.json();
  }

  // Auth
  async register(email: string, password: string, name: string) {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Movies
  async getMovies() {
    return this.request<Movie[]>('/movies');
  }

  async getMovie(id: number) {
    return this.request<Movie>(`/movies/${id}`);
  }

  async createMovie(data: Partial<Movie>) {
    return this.request<Movie>('/movies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMovie(id: number, data: Partial<Movie>) {
    return this.request<Movie>(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMovie(id: number) {
    return this.request(`/movies/${id}`, { method: 'DELETE' });
  }

  // Theaters
  async getTheaters() {
    return this.request<Theater[]>('/theaters');
  }

  async getTheater(id: number) {
    return this.request<Theater>(`/theaters/${id}`);
  }

  async createTheater(data: Partial<Theater>) {
    return this.request<Theater>('/theaters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTheater(id: number, data: Partial<Theater>) {
    return this.request<Theater>(`/theaters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTheater(id: number) {
    return this.request(`/theaters/${id}`, { method: 'DELETE' });
  }

  // Showtimes
  async getShowtimes(params?: { movie_id?: number; theater_id?: number; date?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.movie_id) searchParams.append('movie_id', params.movie_id.toString());
    if (params?.theater_id) searchParams.append('theater_id', params.theater_id.toString());
    if (params?.date) searchParams.append('date', params.date);

    const query = searchParams.toString();
    return this.request<Showtime[]>(`/showtimes${query ? `?${query}` : ''}`);
  }

  async getShowtime(id: number) {
    return this.request<Showtime>(`/showtimes/${id}`);
  }

  async createShowtime(data: Partial<Showtime>) {
    return this.request<Showtime>('/showtimes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateShowtime(id: number, data: Partial<Showtime>) {
    return this.request<Showtime>(`/showtimes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteShowtime(id: number) {
    return this.request(`/showtimes/${id}`, { method: 'DELETE' });
  }

  // Bookings
  async getBookings() {
    return this.request<Booking[]>('/bookings');
  }

  async getBooking(id: number) {
    return this.request<Booking>(`/bookings/${id}`);
  }

  async createBooking(showtime_id: number, seats_booked: number) {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify({ showtime_id, seats_booked }),
    });
  }

  async cancelBooking(id: number) {
    return this.request<Booking>(`/bookings/${id}`, { method: 'DELETE' });
  }

  // Admin
  async getDashboardStats() {
    return this.request<DashboardStats>('/admin/stats');
  }

  async getAllBookings() {
    return this.request<Booking[]>('/admin/bookings');
  }
}

export const api = new ApiClient();
