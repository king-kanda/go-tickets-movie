'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Theater } from '@/types';

export default function AdminTheaters() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    total_seats: 0,
  });

  useEffect(() => {
    loadTheaters();
  }, []);

  const loadTheaters = async () => {
    setLoading(true);
    const response = await api.getTheaters();
    if (response.success && response.data) {
      setTheaters(response.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      total_seats: parseInt(formData.total_seats.toString()),
    };

    const response = editingTheater
      ? await api.updateTheater(editingTheater.id, data)
      : await api.createTheater(data);

    if (response.success) {
      alert(editingTheater ? 'Theater updated successfully' : 'Theater created successfully');
      setShowForm(false);
      setEditingTheater(null);
      resetForm();
      loadTheaters();
    } else {
      alert(response.error || 'Operation failed');
    }
  };

  const handleEdit = (theater: Theater) => {
    setEditingTheater(theater);
    setFormData({
      name: theater.name,
      location: theater.location,
      total_seats: theater.total_seats,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this theater?')) return;

    const response = await api.deleteTheater(id);
    if (response.success) {
      alert('Theater deleted successfully');
      loadTheaters();
    } else {
      alert(response.error || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      total_seats: 0,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Theaters</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTheater(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Theater'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingTheater ? 'Edit Theater' : 'Add New Theater'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theater Name</label>
              <input
                type="text"
                required
                className="w-full border rounded px-3 py-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                required
                className="w-full border rounded px-3 py-2"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
              <input
                type="number"
                required
                min="1"
                className="w-full border rounded px-3 py-2"
                value={formData.total_seats}
                onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value) })}
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {editingTheater ? 'Update Theater' : 'Create Theater'}
            </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {theaters.map((theater) => (
                <tr key={theater.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {theater.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {theater.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {theater.total_seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(theater)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(theater.id)}
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
