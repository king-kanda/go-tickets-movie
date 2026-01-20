'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Showtime, Movie, Theater } from '@/types';

export default function AdminShowtimes() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [formData, setFormData] = useState({
    movie_id: 0,
    theater_id: 0,
    start_time: '',
    end_time: '',
    price: 0,
    available_seats: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [showtimesRes, moviesRes, theatersRes] = await Promise.all([
      api.getShowtimes(),
      api.getMovies(),
      api.getTheaters(),
    ]);

    if (showtimesRes.success && showtimesRes.data) {
      setShowtimes(showtimesRes.data);
    }
    if (moviesRes.success && moviesRes.data) {
      setMovies(moviesRes.data);
    }
    if (theatersRes.success && theatersRes.data) {
      setTheaters(theatersRes.data);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      movie_id: parseInt(formData.movie_id.toString()),
      theater_id: parseInt(formData.theater_id.toString()),
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      price: parseFloat(formData.price.toString()),
      available_seats: parseInt(formData.available_seats.toString()),
    };

    const response = editingShowtime
      ? await api.updateShowtime(editingShowtime.id, data)
      : await api.createShowtime(data);

    if (response.success) {
      alert(editingShowtime ? 'Showtime updated successfully' : 'Showtime created successfully');
      setShowForm(false);
      setEditingShowtime(null);
      resetForm();
      loadData();
    } else {
      alert(response.error || 'Operation failed');
    }
  };

  const handleEdit = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setFormData({
      movie_id: showtime.movie_id,
      theater_id: showtime.theater_id,
      start_time: new Date(showtime.start_time).toISOString().slice(0, 16),
      end_time: new Date(showtime.end_time).toISOString().slice(0, 16),
      price: showtime.price,
      available_seats: showtime.available_seats,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this showtime?')) return;

    const response = await api.deleteShowtime(id);
    if (response.success) {
      alert('Showtime deleted successfully');
      loadData();
    } else {
      alert(response.error || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      movie_id: 0,
      theater_id: 0,
      start_time: '',
      end_time: '',
      price: 0,
      available_seats: 0,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Showtimes</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingShowtime(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Showtime'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingShowtime ? 'Edit Showtime' : 'Add New Showtime'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Movie</label>
              <select
                required
                className="w-full border rounded px-3 py-2"
                value={formData.movie_id}
                onChange={(e) => setFormData({ ...formData, movie_id: parseInt(e.target.value) })}
              >
                <option value="0">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theater</label>
              <select
                required
                className="w-full border rounded px-3 py-2"
                value={formData.theater_id}
                onChange={(e) => setFormData({ ...formData, theater_id: parseInt(e.target.value) })}
              >
                <option value="0">Select a theater</option>
                {theaters.map((theater) => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="datetime-local"
                required
                className="w-full border rounded px-3 py-2"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="datetime-local"
                required
                className="w-full border rounded px-3 py-2"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                className="w-full border rounded px-3 py-2"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
              <input
                type="number"
                required
                min="1"
                className="w-full border rounded px-3 py-2"
                value={formData.available_seats}
                onChange={(e) =>
                  setFormData({ ...formData, available_seats: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {editingShowtime ? 'Update Showtime' : 'Create Showtime'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Movie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Theater</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {showtimes.map((showtime) => (
                <tr key={showtime.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {showtime.movie?.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {showtime.theater?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(showtime.start_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${showtime.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {showtime.available_seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(showtime)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(showtime.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
