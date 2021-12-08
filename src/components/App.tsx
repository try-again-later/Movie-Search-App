import { Suspense } from 'react';

import MoviesSearchApp from '@components/MoviesSearchApp';
import LoadingAnimation from '@components/Loading';
import { Route, Routes, BrowserRouter as Router, Link } from 'react-router-dom';

const App = () => (
  <Suspense fallback={<LoadingAnimation loadingText="Loading translations" />}>
    <Router>
      <div className="container">
        <nav>
          <Link to="/">Search</Link>
          <Link to="/favorites">Favorites</Link>
        </nav>
        <Routes>
          <Route path="/" element={<MoviesSearchApp />} />
          <Route path="/favorites" element={<div>Favorites</div>} />
        </Routes>
      </div>
    </Router>
  </Suspense>
);

export default App;
