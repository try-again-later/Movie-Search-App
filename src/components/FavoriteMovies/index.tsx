import useLocalStorage from '@hooks/useLocalStorage';
import useQueryMovieDetails from '@hooks/useQueryMovieDetails';

import styles from './styles.module.scss';

interface FavoriteCard {
  movieId: number;
}

const FavoriteCard = ({ movieId }: FavoriteCard) => {
  return (
    <article className={styles['favorite-card']}>
      <h2>Movie name</h2>
      <img alt="Poster" />
      <div>{movieId}</div>
      <button>Add</button>
    </article>
  );
};

const FavoriteMovies = () => {
  const [moviesIds, setMoviesIds] = useLocalStorage<Record<string, boolean>>('favoriteMovies', {});

  return (
    <main className={styles['favorites-container']}>
      <div className={styles['favorites-list']}>
        {Object.keys(moviesIds).map((movieId) => (
          <FavoriteCard key={movieId} movieId={Number.parseInt(movieId, 10)} />
        ))}
      </div>
    </main>
  );
};

export default FavoriteMovies;
