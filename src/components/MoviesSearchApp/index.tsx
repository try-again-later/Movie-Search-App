import { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Movie from '@ts/Movie';
import MovieCard from '@components/MovieCard';
import MoviesSearchForm from '@components/MoviesSearchForm';
import LoadingAnimation from '@components/Loading';
import LanguageSelect from '@components/LanguageSelect';
import ColorThemeSwitch from '@components/ColorThemeSwitch';
import LanguageType, * as Language from '@ts/Language';
import useLocalStorage from '@app/hooks/useLocalStorage';
import useQueryMovies from '@hooks/useQueryMovies';

import styles from './styles.module.scss';

const filterMoviesByIndex = (movies: Movie[], filter: (index: number) => boolean) => (
  movies.map((movie, index) => {
    if (filter(index)) {
      return (
        <div key={movie.id}>
          <MovieCard movie={movie} />
        </div>
      );
    }
    return null;
  })
);

const MoviesSearchApp = () => {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(
    i18n.language ? Language.fromString(i18n.language) : Language.DEFAULT,
  );

  useEffect(() => {
    i18n.changeLanguage(Language.toString(language));
  }, [i18n, language]);

  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage);
    },
    [setLanguage],
  );

  const [darkModeEnabled, setDarkMode] = useLocalStorage('darkMode', false);

  const handleColorThemeChange = useCallback(
    (darkModeEnabled) => {
      setDarkMode(darkModeEnabled);
    },
    [setDarkMode],
  );

  useEffect(() => {
    if (darkModeEnabled) {
      document.body.dataset.theme = 'dark';
    } else {
      delete document.body.dataset.theme;
    }
  }, [darkModeEnabled]);

  const API_KEY = '2ab87dbd3a5185ee9af24363729e47a9';
  const [queryString, setQueryString] = useState<string>('');

  const onSearchFormSubmit = useCallback((newQueryString) => {
    setQueryString(newQueryString);
  }, []);

  const [queriedMovies, loadingMovies] = useQueryMovies({ queryString, language, apiKey: API_KEY });

  const leftMoviesColumn = filterMoviesByIndex(queriedMovies, (i) => i % 2 == 0);
  const rightMoviesColumn = filterMoviesByIndex(queriedMovies, (i) => i % 2 != 0);

  let moviesPage;
  if (loadingMovies) {
    moviesPage = <LoadingAnimation loadingText={t('loading')} />;
  } else {
    moviesPage = (
      <div className={styles['movies-page']}>
        <div className={styles['movies-column']}>{leftMoviesColumn}</div>
        <div className={styles['movies-column']}>{rightMoviesColumn}</div>
      </div>
    );
  }

  return (
    <Suspense fallback="Loading...">
      <h1>{t('title')}</h1>
      <div className={styles['search-movies']}>
        <div className={styles['interface-container']}>
          <LanguageSelect
            value={language}
            onChange={handleLanguageChange}
            languages={[LanguageType.ENGLISH_US, LanguageType.RUSSIAN]}
            className={styles['choose-language-select']}
          />
          <ColorThemeSwitch
            darkModeEnabled={darkModeEnabled ?? false}
            onThemeChange={handleColorThemeChange}
            className={styles['change-color-theme']}
          />
          <MoviesSearchForm onSubmit={onSearchFormSubmit} />
        </div>
        {moviesPage}
      </div>
    </Suspense>
  );
};

export default MoviesSearchApp;
