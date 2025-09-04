import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MovieForm } from '@/components/movies/MovieForm';
import { useMovies } from '@/context/MovieContext';     // ดึงจาก backend: context ที่ fetch ข้อมูลหนัง
import { useAuth } from '@/context/AuthContext';         // ดึงจาก backend: context ที่ fetch ข้อมูล user
import { useToast } from '@/hooks/use-toast';
import { UpdateMovieRequest } from '../../types/movie.type'

export const MovieEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();  
  const { getMovieById, updateMovie, loading } = useMovies();  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ดึงข้อมูลหนังจาก backend ผ่าน context
  const movie = id ? getMovieById(id) : null;

  // ถ้าไม่เจอหนัง ให้แสดงข้อความ
  if (!movie) {
    return (
      <div className="min-h-screen bg-backgroundStart text-text flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Movie Not Found</h1>
        <p className="text-muted mb-6">
          The movie you're trying to edit doesn't exist.
        </p>
        <button
          onClick={() => navigate('/movies')}  // frontend routing
          className="text-primary hover:text-accent"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  // ตรวจสิทธิ์แก้ไข
  const canEdit =
    user?.role === 'MANAGER' ||
    user?.role === 'TEAMLEADER' ||
    user?.username === movie.createdBy;

  // ถ้าไม่มีสิทธิ์ให้บล็อค
  if (!canEdit) {
    return (
      <div className="min-h-screen bg-backgroundStart text-text flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Access Denied</h1>
        <p className="text-muted mb-6">
          You don't have permission to edit this movie.
        </p>
        <button
          onClick={() => navigate('/movies')}
          className="text-primary hover:text-accent"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  // เมื่อส่งฟอร์ม
  const handleSubmit = async (data: UpdateMovieRequest) => {
    try {
      // ดึงจาก backend: update หนัง
      await updateMovie(movie.id, data);

      toast({
        title: 'Movie updated successfully!',
        description: `"${data.title || movie.title}" has been updated.`,
      });

      navigate(`/movies/${movie.id}`);  // ไปหน้า Detail
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update movie. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-backgroundStart text-text p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">Edit Movie</h1>
          <p className="text-muted">
            Update "<span className="font-semibold text-text">{movie.title}</span>" details
          </p>
        </div>

        {/* Form */}
        <Card className="bg-surface p-6 rounded-lg shadow">
          <MovieForm
            onSubmit={handleSubmit}
            initialData={movie}
            isEditing={true}
            loading={loading}
          />
        </Card>
      </div>
    </div>
  );
};