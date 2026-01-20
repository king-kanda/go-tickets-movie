'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Movie } from '@/types';

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 0,
    genre: '',
    rating: '',
    poster_url: '',
    release_date: '',
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    const response = await api.getMovies();
    if (response.success && response.data) {
      setMovies(response.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      duration: parseInt(formData.duration.toString()),
      release_date: new Date(formData.release_date).toISOString(),
    };

    const response = editingMovie
      ? await api.updateMovie(editingMovie.id, data)
      : await api.createMovie(data);

    if (response.success) {
      alert(editingMovie ? 'Movie updated successfully' : 'Movie created successfully');
      setShowForm(false);
      setEditingMovie(null);
      resetForm();
      loadMovies();
    } else {
      alert(response.error || 'Operation failed');
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      genre: movie.genre,
      rating: movie.rating,
      poster_url: movie.poster_url,
      release_date: movie.release_date.split('T')[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    const response = await api.deleteMovie(id);
    if (response.success) {
      alert('Movie deleted successfully');
      loadMovies();
    } else {
      alert(response.error || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 0,
      genre: '',
      rating: '',
      poster_url: '',
      release_date: '',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Movies</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingMovie(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Movie'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full border rounded px-3 py-2"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <input
                type="text"
                required
                className="w-full border rounded px-3 py-2"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                className="w-full border rounded px-3 py-2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                required
                className="w-full border rounded px-3 py-2"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="text"
                required
                className="w-full border rounded px-3 py-2"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
              <input
                type="url"
                className="w-full border rounded px-3 py-2"
                value={formData.poster_url}
                onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
              <input
                type="date"
                required
                className="w-full border rounded px-3 py-2"
                value={formData.release_date}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {editingMovie ? 'Update Movie' : 'Create Movie'}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {movie.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.genre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.duration} min</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
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
