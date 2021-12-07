import { useEffect, useState, useRef, useCallback } from 'react';

import Movie from '@ts/Movie';
import LanguageType from '@ts/Language';
import * as TheMovieDB from '@ts/TheMovieDB';

const capitalize = (string: string): string =>
  string.charAt(0).toUpperCase().concat(string.slice(1));

interface QueryDetailsProps {
  movie: Movie;
  apiKey: string;
  language: LanguageType;
  onError?: (error: Error) => void;
}

export interface MovieDetails {
  genres: string[];
  runtime?: number;
  director?: string;
  overview?: string;
  title?: string;
}

const useQueryMovieDetails = ({
  apiKey,
  language,
  movie,
  onError,
}: QueryDetailsProps): [MovieDetails, boolean, () => void] => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<MovieDetails>({ genres: [] });
  const abortController = useRef<AbortController | null>(null);

  const fetchDataAsync = useCallback(async () => {
    if (isLoading) {
      abortController.current?.abort();
    }

    setLoading(true);

    abortController.current = new AbortController();
    const moviesApi = new TheMovieDB.Context({ apiKey, language });
    const movieDetails = await moviesApi.movieDetails(movie.id, abortController?.current.signal);
    const movieCredits = await moviesApi.movieCredits(movie.id, abortController?.current.signal);
    if (movieDetails == 'AbortError' || movieCredits == 'AbortError') {
      return;
    }

    const director = movieCredits.crew?.find(
      (person) => person.job == 'Director' && person.known_for_department == 'Directing',
    )?.name;

    setDetails({
      genres: movieDetails.genres?.map(({ name }) => capitalize(name)) ?? [],
      runtime: movieDetails.runtime,
      director,
      overview: movieDetails.overview,
      title: movieDetails.title,
    });

    setLoading(false);
  }, [movie.id, apiKey, language]);

  const fetchData = useCallback(
    () => {
      fetchDataAsync();
      // fetchDataAsync().catch((error: unknown) => {
      //   if (!(error instanceof Error)) {
      //     return;
      //   }
      //   if (onError) {
      //     onError(error);
      //   }
      // });
    },
    [onError, fetchDataAsync],
  );

  // abort any pending requests on unmount
  useEffect(
    () => () => {
      abortController.current?.abort();
      setLoading(false);
    },
    [],
  );

  return [details, isLoading, fetchData];
};

export default useQueryMovieDetails;
