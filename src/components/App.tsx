import { Suspense } from 'react';

import MoviesSearchApp from '@components/MoviesSearchApp';
import LoadingAnimation from '@components/Loading';

const App = () => (
  <Suspense fallback={<LoadingAnimation loadingText="Loading translations" />}>
    <div className="container">
      <MoviesSearchApp />
    </div>
  </Suspense>
);

export default App;
