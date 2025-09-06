import React from 'react';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/badge';
import { Movie } from '../../../types/movie.type';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { user } = useAuth();
  const { deleteMovie } = useMovies();
  const navigate = useNavigate();
  const { toast } = useToast();

  // แปลงค่า createdBy เป็น string สำหรับแสดงผลเสมอ
  const createdByText =
    typeof movie.createdBy === 'string'
      ? movie.createdBy
      : movie.createdBy?.name ?? 'Unknown';

  // เช็คความเป็นเจ้าของให้รองรับทั้ง string (username) และ object (ObjectId)
  const isOwner =
    typeof movie.createdBy === 'string'
      ? user?.username === movie.createdBy
      : (user?.id ?? user?.id) === movie.createdBy?._id;

  const canEdit =
    user?.role === 'MANAGER' ||
    user?.role === 'TEAMLEADER' ||
    isOwner;

  const canDelete =
    user?.role === 'MANAGER' ||
    (user?.role === 'TEAMLEADER' && isOwner);

  const handleDelete = async () => {
    try {
      await deleteMovie(movie.id);
      toast({
        title: 'Movie deleted',
        description: `"${movie.title}" has been removed from your collection.`,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete movie. Please try again.',
      });
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'G':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'PG':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'M':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'MA':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'R':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-surface text-text border-muted';
    }
  };

  return (
    <Card className="group transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10 bg-surface">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant="outline"
            className={`${getRatingColor(movie.rating)} text-sm`}
          >
            {movie.rating}
          </Badge>
          <span className="text-sm text-muted">{movie.year}</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 text-text group-hover:text-primary transition-colors">
          {movie.title}
        </h3>

        <div className="space-y-2 text-sm text-muted">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted" />
            <span>{new Date(movie.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2 bg-surface">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-text hover:text-accent border border-muted"
          onClick={() => navigate(`/movies/${movie.id}`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>

        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            className="text-primary hover:text-accent border border-primary/50"
            onClick={() => navigate(`/movies/${movie.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive border border-destructive/50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white text-gray-900 border border-gray-300 shadow-xl rounded-lg p-6 w-[400px]" >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-semibold text-red-600">Delete Movie</AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-700">
                  Are you sure you want to delete &quot;{movie.title}&quot;? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};
