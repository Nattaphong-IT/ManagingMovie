import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashborad';
import MovieForm from './pages/MovieForm';
import MovieDetail from './pages/MovieDetail';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';


function App() {
  return (
    <Router>
     
        <Routes>
          {/* หน้าแรก = Login */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        
            {/* Movies */}
          <Route path="/movies" element={<MovieForm />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/movies/:id/edit" element={<MovieForm />} />

          {/* Error Pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />


         
        </Routes>

   
    </Router>
  );
}

export default App;