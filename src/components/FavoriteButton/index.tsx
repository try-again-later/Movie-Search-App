import Movie from '@ts/Movie';
import useFavoriteMovie from '@hooks/useFavoriteMovie';

import HeartIcon from './heart-icon.svg?react';

import styles from './styles.module.scss';

interface PropsType {
  movie: Movie;
  className?: string;
}

const FavoriteButton = ({ movie, className = '' }: PropsType) => {
  const { favorite, change: changeFavorite } = useFavoriteMovie({ movie });

  return (
    <button
      className={`${styles['add-to-favorites-button']} ${
        favorite ? styles['add-to-favorites-button-checked'] : ''
      } ${className}`}
      aria-label="Add to favorites"
      type="button"
      onClick={changeFavorite}
    >
      <HeartIcon className={styles['add-to-favorites-icon']} />
    </button>
  );
};

export default FavoriteButton;
