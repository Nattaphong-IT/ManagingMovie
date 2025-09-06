import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useMovies } from '../context/MovieContext';     // ดึงจาก backend: รายการหนัง
import { useAuth } from '../context/AuthContext';       // ดึงจาก backend: ข้อมูลผู้ใช้
import { Film, Plus, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { movies } = useMovies();      // ดึงจาก backend
  const { user } = useAuth();         // ดึงจาก backend
  const navigate = useNavigate();

  const totalMovies = movies.length;
  const moviesByRating = movies.reduce((acc, movie) => {
   acc[movie.rating] = (acc[movie.rating] || 0) + 1;
   return acc;
  }, {} as Record<string, number>);

  const recentMovies = movies
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    // หน้าเต็มแบ็คกราวน์ฟ้าเข้ม ข้อความหลักสีขาว
    <div className="min-h-screen bg-backgroundStart text-text p-6">
      <div className="space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted mt-1">
              Welcome back, <span className="font-semibold text-text">{user?.username}</span>!
            </p>
          </div>
          <Button
            onClick={() => navigate('/movies/new')}
            className="bg-primary hover:bg-accent text-text"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Movie
          </Button>
        </div>

        {/* top stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-surface border border-primary/30">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary">
                Total Movies
              </CardTitle>
              <Film className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalMovies}</div>
              <p className="text-xs text-muted">In your collection</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border border-accent/30">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-accent">
                Most Common Rating
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {Object.entries(moviesByRating)
                  .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
              </div>
              <p className="text-xs text-muted">
                {Object.entries(moviesByRating)
                  .sort(([, a], [, b]) => b - a)[0]?.[1] || 0}{' '}
                movies
              </p>
            </CardContent>
          </Card>

          <Card className="bg-surface border border-muted/50">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-text">Your Role</CardTitle>
              <Users className="h-4 w-4 text-text" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">{user?.role}</div>
              <p className="text-xs text-muted">Access level</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border border-muted/30">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-text">This Year</CardTitle>
              <Film className="h-4 w-4 text-text" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">
                {movies.filter(m => m.year === new Date().getFullYear()).length}
              </div>
              <p className="text-xs text-muted">Recent releases</p>
            </CardContent>
          </Card>
        </div>

        {/* recent + by rating */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-surface border border-primary/20">
            <CardHeader>
              <CardTitle className="text-text">Recent Movies</CardTitle>
            </CardHeader>
            <CardContent>
               
              <div className="space-y-4">
                {recentMovies.length > 0 ? (
                  recentMovies.map(movie => (
                    <div
                      key={movie.id}
                      className="flex items-center justify-between p-3 bg-backgroundEnd rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-text">{movie.title}</h3>
                        <p className="text-sm text-muted">
                          {movie.year} • {movie.rating}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/movies/${movie.id}`)}  // นำทางไปหน้า Detail
                        className="text-text hover:text-accent"
                      >
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-4">
                    No movies yet. Add your first movie to get started!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
      

          <Card className="bg-surface border border-accent/20">
            <CardHeader>
              <CardTitle className="text-text">Movies by Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(moviesByRating).map(([rating, count]) => (
                  <div
                    key={rating}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white text-sm font-bold">
                        {rating}
                      </div>
                      <span className="font-medium text-text">{rating} Rated</span>
                    </div>
                    <span className="text-muted">{count} movies</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
