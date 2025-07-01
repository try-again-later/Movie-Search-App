import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import SearchIcon from './icons/search.svg?react';

import styles from './styles.module.scss';

export type MoviesSearchHandler = (searchQuery: string) => void;

type FormProps = {
  onSubmit: MoviesSearchHandler;
};

const MoviesSearchForm = ({ onSubmit }: FormProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'MoviesSearchForm' });

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <form
      method="get"
      className={styles['movie-search-form']}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(searchQuery);
      }}
    >
      <label htmlFor="title-query" className={styles['title-input-label']}>
        {t('movieTitle')}
      </label>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
