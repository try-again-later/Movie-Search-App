import LanguageType, * as Language from './Language';

const TMDB_API_BASE_URL = 'https://movie-search.185-236-23-37.sslip.io/api';
const TMBD_IMAGES_CDN_BASE_URL = 'https://movie-search.185-236-23-37.sslip.io/image';

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
  overview: string;
  poster_path: string;
  title: string;
};

type MovieCreditsData = {
  crew: Array<{
    job: string;
    known_for_department: string;
    name: string;
  }>;
};

type ContextOptions = { apiKey: string; language: LanguageType };

interface MoviesSearchParameters {
  queryString: string;
  page?: number;
}

export class Context {
  private apiKey: string;

  private language: LanguageType;

  constructor({ apiKey, language = LanguageType.ENGLISH_US }: ContextOptions) {
    this.apiKey = apiKey;
    this.language = language;
  }

  async moviesSearch(
    { queryString, page = 1 }: MoviesSearchParameters,
    abortSignal?: AbortSignal,
  ): Promise<Partial<MoviesSearchData>[] | 'AbortError'> {
    const data = await Context.retrieveJson<{ results?: Partial<MoviesSearchData>[] }>(
      this.moviesSearchUrl(queryString, page),
      abortSignal,
    );
    if (data == null) {
      return [];
    }
    if (data == 'AbortError') {
      return 'AbortError';
    }
    if (!data.results) {
      throw new Error('Failed to fetch movies.');
    }
    return data.results;
  }

  async movieDetails(
    movieId: number,
    abortSignal?: AbortSignal,
  ): Promise<Partial<MovieDetailsData> | 'AbortError'> {
    const data = await Context.retrieveJson<MovieDetailsData>(
      this.movieDetailsUrl(movieId),
      abortSignal,
    );
    return data ?? {};
  }

  async movieCredits(
    movieId: number,
    abortSignal?: AbortSignal,
  ): Promise<Partial<MovieCreditsData> | 'AbortError'> {
    const data = await Context.retrieveJson<MovieCreditsData>(
      this.movieCreditsUrl(movieId),
      abortSignal,
    );
    return data ?? {};
  }

  private static async retrieveJson<T>(url: URL, abortSignal?: AbortSignal): Promise<T | 'AbortError' | null> {
    try {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name != 'AbortError') {
          throw new Error(error.toString());
        }
        return 'AbortError';
      }
      throw new Error('Failed to fetch movies.');
    }

    return null;
  }

  private moviesSearchUrl(queryString: string, page = 1): URL {
    if (page < 1 || !Number.isInteger(page)) {
      throw Error(`Wrong page number. Expected: integer > 0. Got: ${page}.`);
    }

    const url = new URL(`${TMDB_API_BASE_URL}/3/search/movie`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', Language.toString(this.language));
    url.searchParams.append('query', queryString);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('include_adult', 'false');

    return url;
  }

  private movieDetailsUrl(movieId: number): URL {
    const url = new URL(`${TMDB_API_BASE_URL}/3/movie/${movieId}`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', Language.toString(this.language));

    return url;
  }

  private movieCreditsUrl(movieId: number): URL {
    const url = new URL(`${TMDB_API_BASE_URL}/3/movie/${movieId}/credits`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', Language.toString(this.language));

    return url;
  }
}

export function posterUrl(posterPath: string): URL {
  return new URL(`${TMBD_IMAGES_CDN_BASE_URL}/t/p/original${posterPath}`);
}

export function backdropUrl(backdropPath: string): URL {
  return new URL(`${TMBD_IMAGES_CDN_BASE_URL}/t/p/w1920_and_h800_multi_faces${backdropPath}`);
}
