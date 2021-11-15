import { Suspense } from 'react';

import MoviesSearchApp from './MoviesSearchApp';
import LoadingAnimation from './Loading';

const App = () => (
  <Suspense fallback={<LoadingAnimation loadingText="Loading translations" />}>
    <div className="container">
      <MoviesSearchApp />
    </div>
  </Suspense>
);

export default App;
