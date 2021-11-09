import { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Movie from '../ts/Movie';
import MovieCard from './MovieCard';
import MoviesSearchForm from './MoviesSearchForm';
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

  const apiKey = '2ab87dbd3a5185ee9af24363729e47a9';

  const onSearchFormSubmit = useCallback(
    async (searchQuery: string) => {
      try {
        const newMovies = await queryMovies({
          queryString: searchQuery,
          apiKey,
          language: LanguageType.RUSSIAN,
        });
        setQueriedMovies(newMovies);
      } catch (error) {
        console.error(error);
      }
    },
    [setQueriedMovies],
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
        <ul className="queried-movies-list">
          {queriedMovies.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
        {/* <div>{queriedMovies.toString()}</div> */}
      </div>
    </Suspense>
  );
};

export default MoviesSearchApp;
