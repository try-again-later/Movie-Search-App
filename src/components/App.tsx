import { Suspense } from 'react';

import MoviesSearchApp from './MoviesSearchApp';

const App = () => (
  <Suspense fallback="Loading...">
    <div className="container">
      <MoviesSearchApp />
    </div>
  </Suspense>
);

export default App;
