import Movie from './Movie';
import LanguageType from './Language';
import * as TheMovieDB from './TheMovieDB';

export type MoviesSearchQuery = {
  queryString: string;
  apiKey: string;
  language?: LanguageType;
};

function capitalize(string: string): string {
  return string.charAt(0).toUpperCase().concat(string.slice(1));
}

export async function queryMovies({
  queryString,
  apiKey,
  language = LanguageType.ENGLISH_US,
}: MoviesSearchQuery): Promise<Movie[]> {
  if (queryString.trim().length == 0) {
    return [];
  }

  const moviesApi = new TheMovieDB.Context({ apiKey, language });
  const moviesData = await moviesApi.moviesSearch(queryString);

  const movies: Movie[] = [];
  for (const movieData of moviesData) {
    if (movieData.title == undefined || movieData.id == undefined) {
      continue;
    }

    const posterUrl =
      movieData.poster_path == undefined ? undefined : TheMovieDB.posterUrl(movieData.poster_path);
    const backdropUrl =
      movieData.backdrop_path == undefined
        ? undefined
        : TheMovieDB.backdropUrl(movieData.backdrop_path);

    const movieDetails = await moviesApi.movieDetails(movieData.id);
    const movieCredits = await moviesApi.movieCredits(movieData.id);

    const director = movieCredits.crew?.find(
      (person) => person.job == 'Director' && person.known_for_department == 'Directing',
    )?.name;

    movies.push({
      id: movieData.id,
      title: movieData.title,
      overview: movieData.overview,
      posterUrl,
      backdropUrl,
      releaseDate: movieData.release_date ? new Date(movieData.release_date) : undefined,
      rating: movieData.vote_average ? Number.parseFloat(movieData.vote_average) : undefined,
      genres: movieDetails.genres?.map(({ name }) => capitalize(name)) ?? [],
      runtime: movieDetails.runtime,
      director,
    });
  }

  return movies;
}
