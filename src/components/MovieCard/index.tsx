import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';
import Movie from '../../ts/Movie';
import Rating from '../Rating';

type CardProps = {
  movie: Movie;
};

const MovieCard = ({ movie }: CardProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'MovieCard' });

  return (
    <div
      className={styles['movie-card']}
      style={{ backgroundImage: movie.backdropUrl && `url("${movie.backdropUrl.toString()}")` }}
    >
      <div className={styles.content}>
        {!!movie.posterUrl && (
          <img className={styles.poster} src={movie.posterUrl.toString()} alt={movie.title} />
        )}
        <div className={styles.meta}>
          <h2 className={styles.title}>{movie.title}</h2>
          <div className={styles.director}>
            {movie?.releaseDate?.getFullYear()}
            {!!movie.releaseDate && !!movie.director && ', '}
            {movie?.director}
          </div>
          <div className={styles['other-information']}>
            {!!movie.runtime && (
              <div className={styles.length}>
                {movie.runtime}
                &nbsp;
                {t('minutes')}
              </div>
            )}
            {movie.genres.map((genre) => (
              <div className={styles.genre} key={genre}>
                {genre}
              </div>
            ))}
          </div>
        </div>
        {!!movie.rating && <Rating rating={movie.rating} />}
        <div className={styles.overview}>{movie.overview}</div>
      </div>
    </div>
  );
};

export default MovieCard;
