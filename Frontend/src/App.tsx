import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MovieProvider } from "./context/MovieContext";
import { Layout } from "./components/layout/Layout";
import  LoginPage  from "./pages/Login";
import  DashboardPage  from "./pages/Dashboard";
import  MoviesPage from "./pages/Movie";
import  MovieFormPage  from "./pages/MovieForm";
import  MovieEditPage from "./pages/movieEdit";
import  MovieDetailsPage  from "./pages/MovieDetail";
import NotFound from "./pages/NotFound";
import React from "react";
// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null; // หรือใส่ skeleton/loading สั้น ๆ
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
// Public Route
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AuthProvider>
        <MovieProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movies"
                element={
                  <ProtectedRoute>
                    <MoviesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movies/new"
                element={
                  <ProtectedRoute>
                    <MovieFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movies/:id"
                element={
                  <ProtectedRoute>
                    <MovieDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movies/:id/edit"
                element={
                  <ProtectedRoute>
                    <MovieEditPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </MovieProvider>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
