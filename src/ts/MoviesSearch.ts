import Movie from './Movie';
import { Language } from './Language';
import * as TheMovieDB from './TheMovieDB';

export type MoviesSearchQuery = {
  queryString: string;
  apiKey: string;
  language?: Language;
};

function capitalize(string: string): string {
  return string.charAt(0).toUpperCase().concat(string.slice(1));
}

export async function queryMovies({
  queryString,
  apiKey,
  language = Language.ENGLISH_US,
}: MoviesSearchQuery): Promise<Movie[]> {
  if (queryString.trim().length == 0) {
    return [];
  }

  const moviesApi = new TheMovieDB.Context({ apiKey, language });
  const moviesData = await moviesApi.moviesSearch(queryString);

  const movies: Movie[] = [];
  for (const movie of moviesData) {
    if (movie.title == undefined || movie.id == undefined) {
      continue;
    }

    const posterUrl =
      movie.poster_path == undefined ? undefined : TheMovieDB.posterUrl(movie.poster_path);
    const backdropUrl =
      movie.backdrop_path == undefined ? undefined : TheMovieDB.backdropUrl(movie.backdrop_path);

    const movieDetails = await moviesApi.movieDetails(movie.id);
    const movieCredits = await moviesApi.movieCredits(movie.id);

    const director = movieCredits.crew?.find(
      (person) => person.job == 'Director' && person.known_for_department == 'Directing',
    )?.name;

    movies.push({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl,
      backdropUrl,
      releaseDate: movie.release_date ? new Date(movie.release_date) : undefined,
      rating: movie.vote_average ? Number.parseFloat(movie.vote_average) : undefined,
      genres: movieDetails.genres?.map(({ name }) => capitalize(name)) ?? [],
      runtime: movieDetails.runtime,
      director,
    });
  }

  return movies;
}
