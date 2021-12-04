import LanguageType, * as Language from './Language';

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

type ContextOptions = { apiKey: string; language: LanguageType };

export class Context {
  private apiKey: string;

  private language: LanguageType;

  constructor({ apiKey, language = LanguageType.ENGLISH_US }: ContextOptions) {
    this.apiKey = apiKey;
    this.language = language;
  }

  async moviesSearch(
    queryString: string,
    abortSignal?: AbortSignal,
  ): Promise<Partial<MoviesSearchData>[]> {
    try {
      const data = await Context.retrieveJson<{ results?: Partial<MoviesSearchData>[] }>(
        this.moviesSearchUrl(queryString),
        abortSignal,
      );
      if (!data.results) {
        throw Error('Failed to query movies.');
      }
      return data.results;
    } catch (error: any) {
      if (error.name != 'AbortError') {
        throw new Error(error.toString());
      }
    }

    return [];
  }

  async movieDetails(
    movieId: number,
    abortSignal?: AbortSignal,
  ): Promise<Partial<MovieDetailsData>> {
    const data = await Context.retrieveJson<MovieDetailsData>(
      this.movieDetailsUrl(movieId),
      abortSignal,
    );
    return data;
  }

  async movieCredits(
    movieId: number,
    abortSignal?: AbortSignal,
  ): Promise<Partial<MovieCreditsData>> {
    const data = await Context.retrieveJson<MovieCreditsData>(
      this.movieCreditsUrl(movieId),
      abortSignal,
    );
    return data;
  }

  private static async retrieveJson<T>(url: URL, abortSignal?: AbortSignal): Promise<T> {
    let response;
    if (abortSignal != undefined) {
      response = await fetch(url.toString(), { signal: abortSignal });
    } else {
      response = await fetch(url.toString());
    }
    if (!response.ok) {
      throw Error(`Failed to query movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  private moviesSearchUrl(queryString: string): URL {
    const url = new URL('https://api.themoviedb.org/3/search/movie');
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', Language.toString(this.language));
    url.searchParams.append('query', queryString);
    url.searchParams.append('page', '1');
    url.searchParams.append('include_adult', 'false');

    return url;
  }

  private movieDetailsUrl(movieId: number): URL {
    const url = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', Language.toString(this.language));

    return url;
  }

  private movieCreditsUrl(movieId: number): URL {
    const url = new URL(`https://api.themoviedb.org/3/movie/${movieId}/credits`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', Language.toString(this.language));

    return url;
  }
}

export function posterUrl(posterPath: string): URL {
  return new URL(`https://image.tmdb.org/t/p/original${posterPath}`);
}

export function backdropUrl(backdropPath: string): URL {
  return new URL(`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${backdropPath}`);
}
