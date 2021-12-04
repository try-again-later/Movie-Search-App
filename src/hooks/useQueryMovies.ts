import { useState, useEffect } from 'react';

import Movie from '@ts/Movie';
import LanguageType from '@ts/Language';
import * as TheMovieDB from '@ts/TheMovieDB';

interface QueryMoviesProps {
  queryString: string;
  page: number;
  apiKey: string;
  language: LanguageType;
}

const useQueryMovies = ({
  queryString,
  apiKey,
  page,
  language,
}: QueryMoviesProps): [Movie[], boolean] => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [abortController, setAbortController] = useState<AbortController>(
    () => new AbortController(),
  );

  useEffect(() => {
    async function fetchData() {
      if (isLoading && abortController != null) {
        abortController.abort();
        setLoading(false);
        setAbortController(new AbortController());
      }

      if (queryString.trim().length == 0) {
        return;
      }

      setLoading(true);

      const moviesApi = new TheMovieDB.Context({ apiKey, language });
      const moviesData = await moviesApi.moviesSearch(
        { queryString, page },
        abortController.signal,
      );

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
    }

    fetchData();
  }, [queryString, apiKey, language, page]);

  return [movies, isLoading];
};

export default useQueryMovies;
