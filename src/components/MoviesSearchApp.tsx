import { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Movie from '../ts/Movie';
import MovieCard from './MovieCard';
import MoviesSearchForm from './MoviesSearchForm';
import LoadingAnimation from './LoadingAnimation';
import { queryMovies } from '../ts/MoviesSearch';
import LanguageType, * as Language from '../ts/Language';

const MoviesSearchApp = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language ? Language.fromString(i18n.language) : Language.DEFAULT,
  );
  useEffect(() => {
    i18n.changeLanguage(Language.toString(language));
  }, [language]);

  const [queriedMovies, setQueriedMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const apiKey = '2ab87dbd3a5185ee9af24363729e47a9';

  const onSearchFormSubmit = useCallback(
    async (searchQuery: string) => {
      setLoadingMovies(true);
      await queryMovies({
        queryString: searchQuery,
        apiKey,
        language: LanguageType.RUSSIAN,
      })
        .then((newMovies) => {
          setLoadingMovies(false);
          setQueriedMovies(newMovies);
        })
        .catch((reason) => {
          console.error(reason.toString());
          setLoadingMovies(false);
        });
    },
    [setQueriedMovies],
  );

  const moviesList = (
    <ul className="queried-movies-list">
      {queriedMovies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );

  return (
    <Suspense fallback="Loading...">
      <h1>{t('Title')}</h1>
      <div className="search-movies">
        <MoviesSearchForm onSubmit={onSearchFormSubmit} />
        <button type="button" onClick={() => setLanguage(LanguageType.ENGLISH_US)}>
          English
        </button>
        <button type="button" onClick={() => setLanguage(LanguageType.RUSSIAN)}>
          Russian
        </button>
        {loadingMovies ? <LoadingAnimation loadingText="Загрузка" /> : moviesList}
      </div>
    </Suspense>
  );
};

export default MoviesSearchApp;
