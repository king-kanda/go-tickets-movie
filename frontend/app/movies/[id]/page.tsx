'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Movie, Showtime } from '@/types';

export default function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingShowtime, setBookingShowtime] = useState<number | null>(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    loadMovieAndShowtimes();
  }, [resolvedParams.id]);

  const loadMovieAndShowtimes = async () => {
    setLoading(true);
    const [movieRes, showtimesRes] = await Promise.all([
      api.getMovie(parseInt(resolvedParams.id)),
      api.getShowtimes({ movie_id: parseInt(resolvedParams.id) }),
    ]);

    if (movieRes.success && movieRes.data) {
      setMovie(movieRes.data);
    }

    if (showtimesRes.success && showtimesRes.data) {
      setShowtimes(showtimesRes.data);
    }

    setLoading(false);
  };

  const handleBooking = async (showtimeId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setBookingLoading(true);
    const response = await api.createBooking(showtimeId, seatsToBook);

    if (response.success) {
      alert('Booking successful!');
      setBookingShowtime(null);
      setSeatsToBook(1);
      loadMovieAndShowtimes();
    } else {
      alert(response.error || 'Booking failed');
    }

    setBookingLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Movie not found</div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No Poster</div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{movie.title}</h1>

          <div className="flex gap-4 mb-4 text-sm text-gray-600">
            <span className="bg-gray-200 px-3 py-1 rounded">{movie.rating}</span>
            <span className="bg-gray-200 px-3 py-1 rounded">{movie.genre}</span>
            <span className="bg-gray-200 px-3 py-1 rounded">{movie.duration} min</span>
          </div>

          <p className="text-gray-700 mb-8">{movie.description}</p>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Showtimes</h2>

            {showtimes.length === 0 ? (
              <p className="text-gray-600">No showtimes available for this movie.</p>
            ) : (
              <div className="space-y-4">
                {showtimes.map((showtime) => (
                  <div key={showtime.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{showtime.theater?.name}</p>
                        <p className="text-sm text-gray-600">{showtime.theater?.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${showtime.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{showtime.available_seats} seats left</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        {new Date(showtime.start_time).toLocaleString()}
                      </div>

                      {bookingShowtime === showtime.id ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            min="1"
                            max={showtime.available_seats}
                            value={seatsToBook}
                            onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border rounded"
                          />
                          <button
                            onClick={() => handleBooking(showtime.id)}
                            disabled={bookingLoading}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {bookingLoading ? 'Booking...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setBookingShowtime(null)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setBookingShowtime(showtime.id)}
                          disabled={showtime.available_seats === 0}
                          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {showtime.available_seats === 0 ? 'Sold Out' : 'Book Now'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
