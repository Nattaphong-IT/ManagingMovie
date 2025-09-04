import React from 'react';
import { MovieForm } from '@/components/movies/MovieForm';
import { useMovies } from '@/context/MovieContext';   // ดึง context ที่ติดต่อ backend
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CreateMovieRequest } from '../../types/movie.type';

export const MovieFormPage: React.FC = () => {
  const { createMovie, loading } = useMovies();      // ดึงเมธอด createMovie → ติดต่อ backend
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: CreateMovieRequest) => {
    try {
      // 🔗 ต่อ backend: สร้างหนังใหม่
      await createMovie(data);

      toast({
        title: 'Movie added successfully!',
        description: `"${data.title}" has been added to your collection.`,
      });

      navigate('/movies');    // front-end routing
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add movie. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-backgroundStart text-text p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Add New Movie</h1>
          <p className="text-muted">Add a new movie to your collection</p>
        </div>

        {/* Form Container */}
        <div className="bg-surface p-6 rounded-lg shadow">
          <MovieForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};