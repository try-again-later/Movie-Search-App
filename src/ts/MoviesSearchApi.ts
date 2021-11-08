import Movie from './Movie';
import { Language, languageToString } from './Language';

export type MoviesSearchQuery = {
  queryString: string;
  apiKey: string;
  language?: Language;
};

function getSearchUrl({
  apiKey,
  queryString: searchQuery,
  language = Language.ENGLISH_US,
}: MoviesSearchQuery): URL {
  const url = new URL('https://api.themoviedb.org/3/search/movie');
  url.searchParams.append('api_key', apiKey);
  url.searchParams.append('language', languageToString(language));
  url.searchParams.append('query', searchQuery);
  url.searchParams.append('page', '1');
  url.searchParams.append('include_adult', 'false');

  return url;
}

function getPosterUrl(posterPath: string): URL | null {
  return new URL(`https://image.tmdb.org/t/p/original${posterPath}`);
}

function getBackdropUrl(backdropPath: string): URL | null {
  return new URL(`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${backdropPath}`);
}

/* eslint-disable camelcase */
type QueryMoviesResponse = {
  results: Array<
    Partial<{
      id: number;
      poster_path: string;
      backdrop_path: string;
      title: string;
      overview: string;
      release_date: string;
      vote_average: string;
    }>
  >;
};
/* eslint-enable camelcase */

export async function queryMovies(searchQuery: MoviesSearchQuery): Promise<Movie[]> {
  if (searchQuery.queryString.trim().length === 0) {
    return [];
  }

  const apiSearchUrl = getSearchUrl(searchQuery);

  const response = await fetch(apiSearchUrl.toString());
  if (!response.ok) {
    throw Error(`Failed to query movies: ${response.statusText}`);
  }

  const data: Partial<QueryMoviesResponse> = await response.json();
  if (!data.results) {
    throw Error('Failed to query movies.');
  }

  const movies: Movie[] = [];
  data.results.forEach((movie) => {
    if (movie.title === undefined || movie.id === undefined) {
      return;
    }

    const posterUrl = movie.poster_path ? getPosterUrl(movie.poster_path) : null;
    const backdropUrl = movie.backdrop_path ? getBackdropUrl(movie.backdrop_path) : null;

    movies.push({
      id: movie.id,
      title: movie.title,
      overview: movie.overview ?? '',
      posterUrl,
      backdropUrl,
      releaseDate: movie.release_date ? new Date(movie.release_date) : null,
      rating: movie.vote_average ? Number.parseFloat(movie.vote_average) : null,
    });
  });

  return movies;
}
