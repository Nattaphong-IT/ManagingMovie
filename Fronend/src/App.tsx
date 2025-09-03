import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MovieForm from './pages/MovieForm';
import MovieDetail from './pages/MovieDetail';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* หน้าแรก */}
          <Route path="/" element={<Home />} />
          
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Movies */}
          <Route path="/movies/new" element={<MovieForm />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/movies/:id/edit" element={<MovieForm />} />
          
          {/* Error Pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;