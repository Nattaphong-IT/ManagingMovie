// context/MovieContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Movie, CreateMovieRequest, UpdateMovieRequest } from '../../types/movie.type';
import { useAuth } from './AuthContext';
import { api } from '../../lib/utils';

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  createMovie: (movie: CreateMovieRequest) => Promise<void>;
  updateMovie: (id: string, movie: UpdateMovieRequest) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  getMovieById: (id: string) => Movie | undefined;
}

type MovieAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'ADD_MOVIE'; payload: Movie }
  | { type: 'UPDATE_MOVIE'; payload: { id: string; movie: Partial<Movie> } }
  | { type: 'DELETE_MOVIE'; payload: string };

const MovieContext = createContext<MovieContextType | undefined>(undefined);

const movieReducer = (
  state: { movies: Movie[]; loading: boolean; error: string | null },
  action: MovieAction
) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_MOVIES':
      return { ...state, movies: action.payload, loading: false, error: null };
    case 'ADD_MOVIE':
      return { ...state, movies: [...state.movies, action.payload] };
    case 'UPDATE_MOVIE':
      return {
        ...state,
        movies: state.movies.map(m =>
          m.id === action.payload.id ? { ...m, ...action.payload.movie } : m
        ),
      };
    case 'DELETE_MOVIE':
      return { ...state, movies: state.movies.filter(m => m.id !== action.payload) };
    default:
      return state;
  }
};

const initialState = { movies: [], loading: false, error: null };

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);
  const { isAuthenticated, ready, user } = useAuth();

  // ดึงข้อมูลหนัง
  useEffect(() => {
    if (ready && isAuthenticated) {
      dispatch({ type: 'SET_LOADING', payload: true });
      api.get('/movies')
        .then(res => {
          const raw = res.data?.data || [];
          const movies: Movie[] = raw.map((m: any) => ({
            id: m._id, // ✅ normalize id
            title: m.title ?? '',
            year: m.year ?? 0,
            rating: m.rating ?? '',
            createdBy: m.createdBy ?? '',
            createdAt: m.createdAt ?? '',
            updatedAt: m.updatedAt ?? '',
          }));
          dispatch({ type: 'SET_MOVIES', payload: movies });
        })
        .catch(err => {
          dispatch({
            type: 'SET_ERROR',
            payload: err.response?.data?.message || err.message,
          });
        })
        .finally(() => {
          dispatch({ type: 'SET_LOADING', payload: false });
        });
    }
  }, [ready, isAuthenticated]);


  const createMovie = async (movieData: CreateMovieRequest) => {
    if (!user) throw new Error('User not authenticated');
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // ส่งเฉพาะฟิลด์ที่ฟอร์มกรอก ไม่ส่ง createdBy
      const res = await api.post('/movies', {
        title: movieData.title,
        year: movieData.year,
        rating: movieData.rating,
      });

      const payload = res.data?.data ?? res.data;



      const movie: Movie = {
        id: payload._id ?? payload.id,
        title: payload.title ?? '',
        year: payload.year ?? 0,
        rating: payload.rating ?? '',
        createdAt: payload.createdAt ?? '',
        updatedAt: payload.updatedAt ?? '',
      };

      dispatch({ type: 'ADD_MOVIE', payload: movie });

    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to create movie';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw new Error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  const updateMovie = async (id: string, movieData: UpdateMovieRequest) => {
    if (!user) throw new Error('User not authenticated');
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.patch(`/movies/${id}`, movieData);
      const payload = res.data?.data ?? res.data;
      dispatch({
        type: 'UPDATE_MOVIE',
        payload: {
          id,
          movie: {
            title: payload.title ?? '',
            year: payload.year ?? 0,
            rating: payload.rating ?? '',
            updatedAt: payload.updatedAt ?? '',
          },
        },
      });
    } catch (err: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || err.message,
      });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteMovie = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.delete(`/movies/${id}`);
      dispatch({ type: 'DELETE_MOVIE', payload: id });
    } catch (err: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || err.message,
      });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getMovieById = (id: string) => state.movies.find(m => m.id === id);

  return (
    <MovieContext.Provider
      value={{
        movies: state.movies,
        loading: state.loading,
        error: state.error,
        createMovie,
        updateMovie,
        deleteMovie,
        getMovieById,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovies must be used within a MovieProvider');
  return ctx;
};
