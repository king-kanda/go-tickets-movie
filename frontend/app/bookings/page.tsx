'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Booking } from '@/types';

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const response = await api.getBookings();
    if (response.success && response.data) {
      setBookings(response.data);
    }
    setLoading(false);
  };

  const handleCancelBooking = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    const response = await api.cancelBooking(id);
    if (response.success) {
      alert('Booking cancelled successfully');
      loadBookings();
    } else {
      alert(response.error || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          You haven&apos;t made any bookings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {booking.showtime?.movie?.title}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Theater:</span>{' '}
                      {booking.showtime?.theater?.name} ({booking.showtime?.theater?.location})
                    </p>
                    <p>
                      <span className="font-medium">Showtime:</span>{' '}
                      {booking.showtime?.start_time &&
                        new Date(booking.showtime.start_time).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Seats:</span> {booking.seats_booked}
                    </p>
                    <p>
                      <span className="font-medium">Total Price:</span> ${booking.total_price.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Booking Date:</span>{' '}
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
