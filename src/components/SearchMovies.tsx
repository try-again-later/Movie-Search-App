import { FormEvent, useCallback, useState } from 'react';
import Movie from '../ts/Movie';
import MovieCard from './MovieCard';

const SearchMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [queriedMovies, setQueriedMovies] = useState<Movie[]>([]);

  const searchMoviesRequest = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (searchQuery.trim().length === 0) {
        setQueriedMovies([]);
        return;
      }

      const apiKey = '2ab87dbd3a5185ee9af24363729e47a9';
      const apiSearchUrl = new URL('https://api.themoviedb.org/3/search/movie');
      apiSearchUrl.searchParams.append('api_key', apiKey);
      apiSearchUrl.searchParams.append('language', 'ru');
      apiSearchUrl.searchParams.append('query', searchQuery);
      apiSearchUrl.searchParams.append('page', '1');
      apiSearchUrl.searchParams.append('include_adult', 'false');

      try {
        const response = await fetch(apiSearchUrl.toString());
        const data = await response.json();

        const newMovies: Movie[] = [];
        data.results.forEach((movie: any) => {
          const posterUrl = new URL(
            `https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`,
          );

          newMovies.push({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterUrl,
            releaseDate: new Date(movie.release_date),
            rating: Number.parseFloat(movie.vote_average),
          });
        });

        setQueriedMovies(newMovies);
      } catch (error) {
        console.error(error);
      }
    },
    [searchQuery],
  );

  return (
    <>
      <form method="get" className="movie-search-form" onSubmit={searchMoviesRequest}>
        <label htmlFor="title-query" className="title-input-label">
          Название фильма
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          name="movie-title-query"
          id="movie-title-query"
          className="title-input"
          placeholder='Например, "Гарри Поттер"'
        />
        <button type="submit">Поиск</button>
      </form>
      <ul className="queried-movies-list">
        {queriedMovies.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
      {/* <div>{queriedMovies.toString()}</div> */}
    </>
  );
};

export default SearchMovies;
