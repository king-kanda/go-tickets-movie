import Link from 'next/link';
import type { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        <div className="aspect-[2/3] bg-gray-200 relative">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Poster
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>{movie.genre}</span>
            <span>{movie.rating}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{movie.duration} min</p>
        </div>
      </div>
    </Link>
  );
}
