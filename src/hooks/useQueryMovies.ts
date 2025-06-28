import { useState, useRef, useCallback } from 'react';

import Movie from '@ts/Movie';
import LanguageType from '@ts/Language';
import * as TheMovieDB from '@ts/TheMovieDB';

interface QueryMoviesProps {
  apiKey: string;
  language: LanguageType;
  onError?: (error: Error) => void;
}

const useQueryMovies = ({
  apiKey,
  language,
  onError,
}: QueryMoviesProps): [Movie[], boolean, (queryString: string, page: number) => void] => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  const abortController = useRef<AbortController | null>(null);

  const fetchDataAsync = useCallback(
    async (queryString: string, page: number) => {
      if (abortController.current != null) {
        abortController.current.abort();
        abortController.current = null;
      }

      if (queryString.trim().length == 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      abortController.current = new AbortController();

      const moviesApi = new TheMovieDB.Context({ apiKey, language });
      const moviesData = await moviesApi.moviesSearch(
        { queryString, page },
        abortController.current?.signal,
      );
      if (moviesData == 'AbortError') {
        return;
      }

      const fetchedMovies: Movie[] = [];
      for (const movieData of moviesData) {
        if (movieData.title == undefined || movieData.id == undefined) {
          continue;
        }

        const posterUrl =
          movieData.poster_path == undefined
            ? undefined
            : TheMovieDB.posterUrl(movieData.poster_path);

        const backdropUrl =
          movieData.backdrop_path == undefined
            ? undefined
            : TheMovieDB.backdropUrl(movieData.backdrop_path);

        fetchedMovies.push({
          id: movieData.id,
          title: movieData.title,
          overview: movieData.overview,
          posterUrl,
          backdropUrl,
          releaseDate: movieData.release_date ? new Date(movieData.release_date) : undefined,
          rating: movieData.vote_average ? Number.parseFloat(movieData.vote_average) : undefined,
        });
      }

      setLoading(false);
      setMovies(fetchedMovies);
    },
    [apiKey, language],
  );

  const fetchData = useCallback(
    (queryString: string, page: number) => {
      fetchDataAsync(queryString, page).catch((error: unknown) => {
        if (!(error instanceof Error)) {
          return;
        }
        if (onError) {
          onError(error);
        }
      });
    },
    [onError, fetchDataAsync],
  );

  return [movies, isLoading, fetchData];
};

export default useQueryMovies;
