import { FC, useCallback, useEffect, useState, useRef } from 'react';
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
import { Route, Routes, HashRouter as Router, NavLink } from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ScrollToTopButton from '../ScrollToTopButton';
import MoviesSearchContext from './MoviesSearchContext';

import styles from './styles.module.scss';
import FavoriteMovies from '../FavoriteMovies';

const QueryFallback: FC<FallbackProps> = ({ resetErrorBoundary }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'QueryFallback' });

  return (
    <>
      <div className={styles['error-message']}>{t('failedToQuery')}</div>
      <button type="button" onClick={resetErrorBoundary} className={styles['retry-button']}>
        {t('tryAgain')}
      </button>
    </>
  );
};

const MoviesSearchApp = () => {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(
    i18n.language ? Language.fromString(i18n.language) : Language.DEFAULT,
  );

  useEffect(() => {
    i18n.changeLanguage(Language.toString(language));
  }, [i18n, language]);

  const handleLanguageChange = useCallback(
    (newLanguage: LanguageType) => {
      setLanguage(newLanguage);
    },
    [setLanguage],
  );

  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [darkModeEnabled, setDarkMode] = useLocalStorage('darkMode', false);

  const handleColorThemeChange = useCallback(
    (darkModeEnabled: boolean) => {
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
  const [queryString, setQueryString] = useState('');

  // TMDB sometimes returns duplicate movies, so track which ones are already loaded.
  const loadedMovieIds = useRef(new Set());
  const [loadedMovies, setLoadedMovies] = useState<Movie[]>([]);

  const onQueryError = useCallback((error: Error) => {
    setHasError(true);
    setError(error);
  }, []);

  const [queriedMoviesPage, loadingMovies, fetchMovies] = useQueryMovies({
    apiKey: API_KEY,
    language,
    onError: onQueryError,
  });

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    fetchMovies(queryString, currentPage);
  }, [fetchMovies, queryString, currentPage]);

  useEffect(() => {
    setLoadedMovies((prevLoadedMovies) => {
      const newLoadedMovies = [...prevLoadedMovies];
      for (const movie of queriedMoviesPage) {
        if (!loadedMovieIds.current.has(movie.id)) {
          loadedMovieIds.current.add(movie.id);
          newLoadedMovies.push(movie);
        }
      }
      return newLoadedMovies;
    });
  }, [queriedMoviesPage]);

  const lastCardElement = useRef<HTMLDivElement>(null);
  const lastCardIntersectionObserver = useRef<IntersectionObserver>(null);
  if (lastCardIntersectionObserver.current == null) {
    lastCardIntersectionObserver.current = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target == lastCardElement.current && entry.isIntersecting) {
          setCurrentPage((page) => page + 1);
          lastCardIntersectionObserver.current?.unobserve(lastCardElement.current);
        }
      }
    });
  }

  const movieCards = loadedMovies.map((movie, index, array) =>
    index == array.length - 1 ? (
      <MovieCard
        key={movie.id}
        movie={movie}
        ref={(node) => {
          if (node != null && node != lastCardElement.current) {
            lastCardIntersectionObserver.current?.observe(node);
            lastCardElement.current = node;
          }
        }}
      />
    ) : (
      <MovieCard key={movie.id} movie={movie} />
    ),
  );

  const leftMoviesColumn = movieCards.filter((_, i) => i % 2 == 0);
  const rightMoviesColumn = movieCards.filter((_, i) => i % 2 != 0);

  const moviesPage = (
    <>
      <div className={styles['movies-page']}>
        <div className={styles['movies-column']}>{leftMoviesColumn}</div>
        <div className={styles['movies-column']}>{rightMoviesColumn}</div>
      </div>
      {loadingMovies && <LoadingAnimation loadingText={t('loading')} />}
    </>
  );

  const onSearchFormSubmit = useCallback((newQueryString: string) => {
    setLoadedMovies([]);
    loadedMovieIds.current.clear();

    setQueryString(newQueryString);
    setCurrentPage(1);
  }, []);

  const onTryAgain = useCallback(() => {
    setHasError(false);
    onSearchFormSubmit(queryString);
  }, [queryString, onSearchFormSubmit]);

  return (
    <Router>
      <header className={styles['page-header']}>
        <div className={styles['page-header-container']}>
          <h1 className={styles['page-heading']}>{t('title')}</h1>
          <nav className={styles['page-nav']}>
            <NavLink
              to="/"
              className={(navData) =>
                !navData.isActive ? styles['nav-link'] : styles['nav-link-highlighted']
              }
            >
              <div className={styles['nav-link-content-wrapper']}>{t('searchRoute')}</div>
            </NavLink>
            <NavLink
              to="/favorites"
              className={(navData) =>
                !navData.isActive ? styles['nav-link'] : styles['nav-link-highlighted']
              }
            >
              <div className={styles['nav-link-content-wrapper']}>{t('favoritesRoute')}</div>
            </NavLink>
          </nav>
        </div>
      </header>
      <MoviesSearchContext.Provider value={{ darkModeEnabled, language, apiKey: API_KEY }}>
        <Routes>
          <Route path="/favorites" element={<FavoriteMovies />} />
          <Route
            path="/"
            element={
              <main className="container">
                <ScrollToTopButton />
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
                  <ErrorBoundary FallbackComponent={QueryFallback}>
                    {hasError ? (
                      <QueryFallback
                        error={error ?? new Error('Something went wrong')}
                        resetErrorBoundary={onTryAgain}
                      />
                    ) : (
                      moviesPage
                    )}
                  </ErrorBoundary>
                </div>
              </main>
            }
          />
        </Routes>
      </MoviesSearchContext.Provider>
    </Router>
  );
};

export default MoviesSearchApp;
