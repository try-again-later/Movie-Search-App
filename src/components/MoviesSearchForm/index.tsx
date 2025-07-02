import { useTranslation } from 'react-i18next';

import SearchIcon from './icons/search.svg?react';

import styles from './styles.module.scss';

export type MoviesSearchHandler = (searchQuery: string) => void;
export type OnMovieSearchQueryChange = (searchQuery: string) => void;

type FormProps = {
  searchQuery: string;
  onChange: OnMovieSearchQueryChange;
  onSubmit: MoviesSearchHandler;
};

const MoviesSearchForm = ({ searchQuery, onChange, onSubmit }: FormProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'MoviesSearchForm' });

  return (
    <form
      method="get"
      className={styles['movie-search-form']}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(searchQuery);
      }}
    >
      <label htmlFor="movie-title-query" className={styles['title-input-label']}>
        {t('movieTitle')}
      </label>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onChange(e.target.value)}
        name="movie-title-query"
        id="movie-title-query"
        className={styles['title-input']}
        placeholder={t('searchQueryExample')}
      />
      <button type="submit">
        {t('search')}
        <SearchIcon className={styles['submit-button-icon']} />
      </button>
    </form>
  );
};

export default MoviesSearchForm;
