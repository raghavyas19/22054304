import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BarChart2, TrendingUp, Activity } from 'lucide-react';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/">Social Analytics</Link>
            <div className="navbar-nav">
              <Link className="nav-link d-flex align-items-center" to="/">
                <BarChart2 className="me-1" size={18} /> Top Users
              </Link>
              <Link className="nav-link d-flex align-items-center" to="/trending">
                <TrendingUp className="me-1" size={18} /> Trending Posts
              </Link>
              <Link className="nav-link d-flex align-items-center" to="/feed">
                <Activity className="me-1" size={18} /> Feed
              </Link>
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<TopUsers />} />
            <Route path="/trending" element={<TrendingPosts />} />
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;