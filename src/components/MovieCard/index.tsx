import { useTranslation } from 'react-i18next';
import { useContext, useRef, useEffect, forwardRef, ForwardRefRenderFunction } from 'react';

import Movie from '@ts/Movie';
import Rating from '@components/Rating';
import useQueryMovieDetails from '@hooks/useQueryMovieDetails';
import MoviesSearchContext from '@components/MoviesSearchApp/MoviesSearchContext';

import styles from './styles.module.scss';

type CardProps = {
  movie: Movie;
};

const MovieCard: ForwardRefRenderFunction<HTMLDivElement, CardProps> = ({ movie }, ref) => {
  const { t } = useTranslation('translation', { keyPrefix: 'MovieCard' });

  const context = useContext(MoviesSearchContext);
  const [movieDetails, isLoading, abort] = useQueryMovieDetails({
    apiKey: context.apiKey,
    language: context.language,
    movie,
  });

  // abort any pending requests on component unmount
  useEffect(
    () => () => {
      abort();
    },
    [],
  );

  const director = isLoading ? (
    <div className={styles['text-loading-placeholder']} />
  ) : (
    <div className={styles.director}>
      {movie?.releaseDate?.getFullYear()}
      {!!movie.releaseDate && !!movieDetails?.director && ', '}
      {movieDetails?.director}
    </div>
  );

  const loadingAnimationsCount = useRef<number>(Math.floor(Math.random() * 4) + 2);
  const loadingAnimationsSizes = useRef<number[]>(
    Array.from({ length: loadingAnimationsCount.current }, () => Math.floor(Math.random() * 2) + 4),
  );
  const otherInformation = isLoading ? (
    <div className={styles['other-information']}>
      {[...Array(loadingAnimationsCount.current).keys()].map((i) => (
        <div
          key={i}
          className={styles['background-gradient-loading']}
          style={{
            width: `${loadingAnimationsSizes.current[i]}rem`,
          }}
        />
      ))}
    </div>
  ) : (
    <div className={styles['other-information']}>
      {!!movieDetails.runtime && (
        <div className={styles.length}>
          {movieDetails.runtime}
          &nbsp;
          {t('minutes')}
        </div>
      )}
      {movieDetails.genres.map((genre) => (
        <div className={styles.genre} key={genre}>
          {genre}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={styles['movie-card']}
      style={{ backgroundImage: movie.backdropUrl && `url("${movie.backdropUrl.toString()}")` }}
      ref={ref}
    >
      <div className={styles.content}>
        {!!movie.posterUrl && (
          <img
            className={styles.poster}
            src={movie.posterUrl.toString()}
            alt={movie.title}
            loading="lazy"
          />
        )}
        <div className={styles.meta}>
          <h2 className={styles.title}>{movie.title}</h2>
          {director}
          {otherInformation}
        </div>
        {!!movie.rating && <Rating rating={movie.rating} />}
        <div className={styles.overview}>{movie.overview}</div>
      </div>
    </div>
  );
};

export default forwardRef<HTMLDivElement, CardProps>(MovieCard);
