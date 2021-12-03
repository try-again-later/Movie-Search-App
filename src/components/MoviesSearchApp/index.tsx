import { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Movie from '@ts/Movie';
import MovieCard from '@components/MovieCard';
import MoviesSearchForm from '@components/MoviesSearchForm';
import LoadingAnimation from '@components/Loading';
import LanguageSelect from '@components/LanguageSelect';
import ColorThemeSwitch from '@components/ColorThemeSwitch';
import { queryMovies } from '@ts/MoviesSearch';
import LanguageType, * as Language from '@ts/Language';

import styles from './styles.module.scss';

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
      console.log(Language.toString(newLanguage));
      setLanguage(newLanguage);
    },
    [setLanguage],
  );

  const [darkModeEnabled, setDarkMode] = useState(false);

  const [queriedMovies, setQueriedMovies] = useState<Movie[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [loadingMovies, setLoadingMovies] = useState(false);

  const apiKey = '2ab87dbd3a5185ee9af24363729e47a9';

  const onSearchFormSubmit = useCallback(
    async (searchQuery: string) => {
      setLoadingMovies(true);
      setLastQuery(searchQuery);

      await queryMovies({
        queryString: searchQuery,
        apiKey,
        language,
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
    [language, setQueriedMovies, setLastQuery, setLoadingMovies],
  );

  useEffect(() => {
    if (queriedMovies.length == 0 || lastQuery.length == 0) {
      return;
    }

    setQueriedMovies([]);
    onSearchFormSubmit(lastQuery);
  }, [language, lastQuery, onSearchFormSubmit, queriedMovies.length]);

  const moviesList = (
    <ul className={styles['queried-movies-list']}>
      {queriedMovies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );

  return (
    <Suspense fallback="Loading...">
      <h1>{t('title')}</h1>
      <div className={styles['search-movies']}>
        <LanguageSelect
          value={language}
          onChange={handleLanguageChange}
          languages={[LanguageType.ENGLISH_US, LanguageType.RUSSIAN]}
        />
        <ColorThemeSwitch darkModeEnabled={darkModeEnabled} onThemeChange={setDarkMode} />
        <MoviesSearchForm onSubmit={onSearchFormSubmit} />
        {loadingMovies ? <LoadingAnimation loadingText="Загрузка" /> : moviesList}
      </div>
    </Suspense>
  );
};

export default MoviesSearchApp;
