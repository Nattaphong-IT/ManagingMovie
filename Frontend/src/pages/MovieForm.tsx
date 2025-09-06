// src/pages/MovieFormPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {MovieForm} from '../components/Movies/MovieForm';    // ← เปลี่ยนเป็น default import
import { useMovies } from '../context/MovieContext';
import { useToast } from '../hooks/use-toast';
import { CreateMovieRequest } from '../../types/movie.type';

const MovieFormPage: React.FC = () => {
  const { createMovie, loading } = useMovies();
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * onSubmit ของ MovieForm จะได้ข้อมูล { title, year, rating }
   * ซึ่งตรงกับ CreateMovieRequest แต่ year อาจมาเป็น string
   * ให้แปลงเป็น number ก่อนส่ง
   */
  const handleSubmit = async (data: CreateMovieRequest) => {
    const yearNum = Number(data.year);
    const payload: CreateMovieRequest = {
      title: data.title.trim(),
      year: yearNum,
      rating: data.rating,
    };

    try {
      await createMovie(payload);

      toast({
        title: 'เพิ่มหนังเรียบร้อย!',
        description: `"${payload.title}" ถูกเพิ่มแล้ว`,
      });

      navigate('/movies', { replace: true });
    } catch (err: any) {
      const description =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'ไม่สามารถเพิ่มหนังได้ ลองใหม่อีกครั้ง';
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description,
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

export default MovieFormPage;
