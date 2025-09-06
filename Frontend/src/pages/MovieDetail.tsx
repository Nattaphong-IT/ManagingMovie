import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useMovies } from '../context/MovieContext';    // ดึง context ที่ fetch มาจาก backend
import { useAuth } from '../context/AuthContext';      // ดึง context ที่ fetch มาจาก backend
import { useToast } from '../hooks/use-toast';
import {
    Edit,
    Trash2,
    ArrowLeft,
    Calendar,
    User,
    Clock,
    Film
} from 'lucide-react';
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
} from '../components/ui/alert-dialog';

export const MovieDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();                          // ดึง movie ID จาก URL (frontend)
    const { getMovieById, deleteMovie } = useMovies();                    // getMovieById / deleteMovie ติดต่อ backend
    const { user } = useAuth();                                           // ดึงข้อมูล user มาจาก backend
    const navigate = useNavigate();
    const { toast } = useToast();

    // ดึงข้อมูลหนังจาก backend ผ่าน context
    const movie = id ? getMovieById(id) : null;

    if (!movie) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                    <Film className="h-8 w-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
                <p className="text-muted-foreground mb-4">

                    The movie you&apos;re looking for doesn&apos;t exist or has been removed.


                </p>
                <Button onClick={() => navigate('/movies')} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Movies
                </Button>
            </div>
        );
    }

    const canEdit =
        user?.role === 'MANAGER' ||
        user?.role === 'TEAMLEADER' ||
        user?.username === movie.createdBy;

    const canDelete =
        user?.role === 'MANAGER' ||
        (user?.role === 'TEAMLEADER' && user?.username === movie.createdBy);

    const handleDelete = async () => {
        try {
            // ดึง context deleteMovie → ส่งคำขอลบไปยัง backend
            await deleteMovie(movie.id);
            toast({
                title: "Movie deleted",
                description: `"${movie.title}" has been removed from your collection.`,
            });
            navigate('/movies');  // frontend navigation
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete movie. Please try again.",
            });
        }
    };

    const getRatingColor = (rating: string) => {
        // ไม่เกี่ยวกับ backend
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
                return 'bg-secondary text-secondary-foreground';
        }
    };

    const getRatingDescription = (rating: string) => {
        // ไม่เกี่ยวกับ backend
        switch (rating) {
            case 'G':
                return 'General Audiences - All ages admitted';
            case 'PG':
                return 'Parental Guidance Suggested - Some material may not be suitable for children';
            case 'M':
                return 'Mature - Recommended for mature audiences';
            case 'MA':
                return 'Mature Accompanied - Children under 15 must be accompanied by adult';
            case 'R':
                return 'Restricted - Under 17 requires accompanying parent or adult guardian';
            default:
                return 'Rating information not available';
        }
    };

    return (
        <div className="space-y-6">
            {/* ปุ่มกลับ */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/movies')}  // frontend navigation
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Movies
                </Button>

                <div className="flex gap-2">
                    {canEdit && (
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/movies/${movie.id}/edit`)}  // frontend navigation
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    )}

                    {canDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Movie</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete &quot;{movie.title}&quot;? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}  // ดึง context deleteMovie → backend
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ข้อมูลหลัก */}
                <div className="lg:col-span-2">
                    <Card className="bg-gradient-to-br from-card to-card/50">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="text-3xl font-bold">{movie.title}</CardTitle>
                                    <div className="flex items-center space-x-4">
                                        <Badge
                                            variant="outline"
                                            className={`${getRatingColor(movie.rating)} text-lg px-3 py-1`}
                                        >
                                            {movie.rating}
                                        </Badge>
                                        <span className="text-xl text-muted-foreground">{movie.year}</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Rating Information</h3>
                                <p className="text-muted-foreground">
                                    {getRatingDescription(movie.rating)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* รายละเอียดผู้สร้างและวันเวลา */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>Movie Details</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Added by</p>
                                    <p className="font-medium">
                                        {typeof movie.createdBy === 'string'
                                            ? movie.createdBy
                                            : movie.createdBy?.name || 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Date added</p>
                                    <p className="font-medium">
                                        {new Date(movie.createdAt).toLocaleDateString()}  {/* ข้อมูลจาก backend */}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Last updated</p>
                                    <p className="font-medium">
                                        {new Date(movie.updatedAt).toLocaleDateString()}  {/* ข้อมูลจาก backend */}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                        <CardHeader>
                            <CardTitle className="text-primary">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {canEdit && (
                                <Button
                                    className="w-full bg-gradient-to-r from-primary to-primary/90"
                                    onClick={() => navigate(`/movies/${movie.id}/edit`)}  // frontend navigation
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Movie
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/movies')}  // frontend navigation
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Collection
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
export default MovieDetailsPage;
