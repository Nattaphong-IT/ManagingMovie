import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Movie, CreateMovieRequest } from '../../types/movie.type';
import { useAuth } from './AuthContext';

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  createMovie: (movie: CreateMovieRequest) => Promise<void>;
  updateMovie: (id: string, movie: CreateMovieRequest) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  getMovieById: (id: string) => Movie | undefined;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

type MovieAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'ADD_MOVIE'; payload: Movie }
  | { type: 'UPDATE_MOVIE'; payload: { id: string; movie: Partial<Movie> } }
  | { type: 'DELETE_MOVIE'; payload: string };

const movieReducer = (state: { movies: Movie[]; loading: boolean; error: string | null }, action: MovieAction) => {
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
        movies: state.movies.map(movie =>
          movie.id === action.payload.id
            ? { ...movie, ...action.payload.movie }
            : movie
        )
      };
    case 'DELETE_MOVIE':
      return {
        ...state,
        movies: state.movies.filter(movie => movie.id !== action.payload)
      };
    default:
      return state;
  }
};

const initialState = {
  movies: [],
  loading: false,
  error: null,
};

// Mock movies for demonstration
const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'The Shawshank Redemption',
    yearReleased: 1994,
    rating: 'R',
    createdBy: 'manager',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'The Godfather',
    yearReleased: 1972,
    rating: 'R',
    createdBy: 'manager',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'The Dark Knight',
    yearReleased: 2008,
    rating: 'M',
    createdBy: 'teamlead',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Load movies from localStorage or use mock data
      const savedMovies = localStorage.getItem('movies');
      if (savedMovies) {
        dispatch({ type: 'SET_MOVIES', payload: JSON.parse(savedMovies) });
      } else {
        dispatch({ type: 'SET_MOVIES', payload: mockMovies });
        localStorage.setItem('movies', JSON.stringify(mockMovies));
      }
    }
  }, [isAuthenticated]);

  const createMovie = async (movieData: CreateMovieRequest) => {
    if (!user) throw new Error('User not authenticated');
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMovie: Movie = {
      id: Date.now().toString(),
      ...movieData,
      createdBy: user.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    dispatch({ type: 'ADD_MOVIE', payload: newMovie });
    
    // Update localStorage
    const updatedMovies = [...state.movies, newMovie];
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
    
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const updateMovie = async (id: string, movieData: CreateMovieRequest) => {
    if (!user) throw new Error('User not authenticated');
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedMovie = { ...movieData, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_MOVIE', payload: { id, movie: updatedMovie } });
    
    // Update localStorage
    const updatedMovies = state.movies.map(movie =>
      movie.id === id ? { ...movie, ...updatedMovie } : movie
    );
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
    
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const deleteMovie = async (id: string) => {
    if (!user || (user.role !== 'MANAGER' && user.role !== 'TEAMLEADER')) {
      throw new Error('Insufficient permissions');
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch({ type: 'DELETE_MOVIE', payload: id });
    
    // Update localStorage
    const updatedMovies = state.movies.filter(movie => movie.id !== id);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
    
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const getMovieById = (id: string) => {
    return state.movies.find(movie => movie.id === id);
  };

  return (
    <MovieContext.Provider value={{
      ...state,
      createMovie,
      updateMovie,
      deleteMovie,
      getMovieById,
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};