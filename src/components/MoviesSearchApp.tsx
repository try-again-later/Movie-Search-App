import { useCallback, useState } from 'react';

import Movie from '../ts/Movie';
import MovieCard from './MovieCard';
import MoviesSearchForm from './MoviesSearchForm';
import { queryMovies } from '../ts/MoviesSearch';
import { Language } from '../ts/Language';

const MoviesSearchApp = () => {
  const [queriedMovies, setQueriedMovies] = useState<Movie[]>([]);

  const apiKey = '2ab87dbd3a5185ee9af24363729e47a9';

  const onSearchFormSubmit = useCallback(
    async (searchQuery: string) => {
      try {
        const newMovies = await queryMovies({
          queryString: searchQuery,
          apiKey,
          language: Language.RUSSIAN,
        });
        setQueriedMovies(newMovies);
      } catch (error) {
        console.error(error);
      }
    },
    [setQueriedMovies],
  );

  return (
    <div className="search-movies">
      <MoviesSearchForm onSubmit={onSearchFormSubmit} />
      <ul className="queried-movies-list">
        {queriedMovies.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
      {/* <div>{queriedMovies.toString()}</div> */}
    </div>
  );
};

export default MoviesSearchApp;
