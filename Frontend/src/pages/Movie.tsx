import React, { useState } from 'react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/input'
import { useMovies } from '@/context/MovieContext';           // 🔗 ต่อ backend: ดึงรายการหนัง
import { useAuth } from '@/context/AuthContext';            // 🔗 ต่อ backend: ดึงข้อมูล user
import { MovieCard } from '../components/Movies/MovieCard';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/UI/select';

export const MoviesPage: React.FC = () => {
  const { movies, loading } = useMovies();  // 🔗 ต่อ backend
  const { user } = useAuth();              // 🔗 ต่อ backend
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredMovies = movies
    .filter(movie => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRating =
        ratingFilter === 'all' || movie.rating === ratingFilter;
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.yearReleased - a.yearReleased;
        default:
          return 0;
      }
    });

  const canCreateMovie =
    user?.role === 'MANAGER' || user?.role === 'TEAMLEADER';

  return (
    <div className="min-h-screen bg-backgroundStart text-text p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Movies</h1>
          <p className="text-muted">Manage your movie collection</p>
        </div>

        {canCreateMovie && (
          <Button
            onClick={() => navigate('/movies/new')}    // frontend routing
            className="bg-primary hover:bg-accent text-text"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Movie
          </Button>
        )}
      </div>

      {/* Search, Filter, Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search movies..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-surface text-text placeholder-muted"
          />
        </div>

        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[150px] bg-surface text-text border border-muted">
            <Filter className="h-4 w-4 mr-2 text-muted" />
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent className="bg-surface text-text">
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="G">G</SelectItem>
            <SelectItem value="PG">PG</SelectItem>
            <SelectItem value="M">M</SelectItem>
            <SelectItem value="MA">MA</SelectItem>
            <SelectItem value="R">R</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px] bg-surface text-text border border-muted">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-surface text-text">
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-surface/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-surface/50 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">No movies found</h3>
          <p className="text-muted mb-4">
            {searchTerm || ratingFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first movie'}
          </p>
          {canCreateMovie && (
            <Button
              onClick={() => navigate('/movies/new')}    // frontend routing
              className="bg-primary hover:bg-accent text-text"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Movie
            </Button>
          )}
        </div>
      )}
    </div>
  );
};