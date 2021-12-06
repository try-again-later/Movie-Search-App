import { useEffect, useState, useRef } from 'react';

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
  overview?: string;
  title?: string;
}

const useQueryMovieDetails = ({
  apiKey,
  language,
  movie,
}: QueryDetailsProps): [MovieDetails, boolean] => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<MovieDetails>({ genres: [] });
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    async function fetchData() {
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
    }

    fetchData();
  }, [movie.id, apiKey, language]);

  // abort any pending requests on unmount
  useEffect(() => () => {
    abortController.current?.abort();
    setLoading(false);
  }, []);

  return [details, isLoading];
};

export default useQueryMovieDetails;
