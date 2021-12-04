import { useEffect, useState, useCallback } from 'react';

import Movie from '@ts/Movie';
import LanguageType from '@ts/Language';
import * as TheMovieDB from '@ts/TheMovieDB';

const capitalize = (string: string): string => (
  string.charAt(0).toUpperCase().concat(string.slice(1))
);

interface QueryDetailsProps {
  movie: Movie;
  apiKey: string;
  language: LanguageType;
}

export interface MovieDetails {
  genres: string[];
  runtime?: number;
  director?: string;
}

const useQueryMovieDetails = ({
  apiKey,
  language,
  movie,
}: QueryDetailsProps): [MovieDetails, boolean, () => void] => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<MovieDetails>({ genres: [] });
  const [abortController, setAbortController] = useState(() => new AbortController());

  const abort = useCallback(() => {
    abortController.abort();
    setLoading(false);
  }, [abortController]);

  useEffect(() => {
    async function fetchData() {
      if (isLoading && abortController != null) {
        abortController.abort();
        setLoading(false);
        setAbortController(new AbortController());
      }

      setLoading(true);

      const moviesApi = new TheMovieDB.Context({ apiKey, language });
      const movieDetails = await moviesApi.movieDetails(movie.id);
      const movieCredits = await moviesApi.movieCredits(movie.id);

      const director = movieCredits.crew?.find(
        (person) => person.job == 'Director' && person.known_for_department == 'Directing',
      )?.name;

      setLoading(false);
      setDetails({
        genres: movieDetails.genres?.map(({ name }) => capitalize(name)) ?? [],
        director,
      });
    }

    fetchData();
  }, [movie.id, apiKey, language]);

  return [details, isLoading, abort];
};

export default useQueryMovieDetails;
