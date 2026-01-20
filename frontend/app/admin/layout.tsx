'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await api.getMe();
      if (!response.success || response.data?.role !== 'admin') {
        router.push('/');
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white">
        <nav className="p-4 space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/movies"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Movies
          </Link>
          <Link
            href="/admin/theaters"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Theaters
          </Link>
          <Link
            href="/admin/showtimes"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Showtimes
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
