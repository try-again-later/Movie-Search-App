import { Language, languageToString } from './Language';

/* eslint-disable camelcase */
type MoviesSearchData = {
  id: number;
  poster_path: string;
  backdrop_path: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: string;
  genre_ids: number[];
};

type MovieDetailsData = {
  runtime: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
};

type MovieCreditsData = {
  crew: Array<{
    job: string;
    known_for_department: string;
    name: string;
  }>;
};
/* eslint-enable camelcase */

type ContextOptions = { apiKey: string; language: Language };

export class Context {
  private apiKey: string;

  private language: Language;

  constructor({ apiKey, language = Language.ENGLISH_US }: ContextOptions) {
    this.apiKey = apiKey;
    this.language = language;
  }

  async moviesSearch(queryString: string): Promise<Partial<MoviesSearchData>[]> {
    const data = await Context.retrieveJson<{ results?: Partial<MoviesSearchData>[] }>(
      this.moviesSearchUrl(queryString),
    );
    if (!data.results) {
      throw Error('Failed to query movies.');
    }

    return data.results;
  }

  async movieDetails(movieId: number): Promise<Partial<MovieDetailsData>> {
    const data = await Context.retrieveJson<MovieDetailsData>(this.movieDetailsUrl(movieId));
    return data;
  }

  async movieCredits(movieId: number): Promise<Partial<MovieCreditsData>> {
    const data = await Context.retrieveJson<MovieCreditsData>(this.movieCreditsUrl(movieId));
    return data;
  }

  private static async retrieveJson<T>(url: URL): Promise<T> {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw Error(`Failed to query movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  private moviesSearchUrl(queryString: string): URL {
    const url = new URL('https://api.themoviedb.org/3/search/movie');
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', languageToString(this.language));
    url.searchParams.append('query', queryString);
    url.searchParams.append('page', '1');
    url.searchParams.append('include_adult', 'false');

    return url;
  }

  private movieDetailsUrl(movieId: number): URL {
    const url = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', languageToString(this.language));

    return url;
  }

  private movieCreditsUrl(movieId: number): URL {
    const url = new URL(`https://api.themoviedb.org/3/movie/${movieId}/credits`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', languageToString(this.language));

    return url;
  }
}

export function posterUrl(posterPath: string): URL {
  return new URL(`https://image.tmdb.org/t/p/original${posterPath}`);
}

export function backdropUrl(backdropPath: string): URL {
  return new URL(`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${backdropPath}`);
}
