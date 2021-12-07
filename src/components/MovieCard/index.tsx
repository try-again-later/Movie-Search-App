import { useTranslation } from 'react-i18next';
import {
  useContext,
  useRef,
  forwardRef,
  ForwardRefRenderFunction,
  useState,
  useEffect,
} from 'react';

import Movie from '@ts/Movie';
import Rating from '@components/Rating';
import useQueryMovieDetails from '@hooks/useQueryMovieDetails';
import useJustMounted from '@hooks/useJustMounted';
import MoviesSearchContext from '@components/MoviesSearchApp/MoviesSearchContext';

import styles from './styles.module.scss';

type CardProps = {
  movie: Movie;
};

const MovieCard: ForwardRefRenderFunction<HTMLDivElement, CardProps> = ({ movie }, ref) => {
  const { t } = useTranslation('translation', { keyPrefix: 'MovieCard' });

  const context = useContext(MoviesSearchContext);
  const [movieDetails, isLoading] = useQueryMovieDetails({
    apiKey: context.apiKey,
    language: context.language,
    movie,
  });

  const director = isLoading ? (
    <div className={`${styles['text-loading-placeholder']} ${styles.director}`} />
  ) : (
    <div className={styles.director}>
      {movie?.releaseDate?.getFullYear()}
      {!!movie.releaseDate && !!movieDetails?.director && ', '}
      {movieDetails?.director}
    </div>
  );

  // the first time the card is rendered the title and overview comes from movie prop
  // in case the language changes, then those values will be fetched with other movie details
  const [title, setTitle] = useState(movie.title);
  const [titleElement, setTitleElement] = useState(<h2 className={styles.title}>{movie.title}</h2>);
  const [overviewElement, setOverviewElement] = useState(
    <div className={styles.overview}>{movie.overview}</div>,
  );

  const justMounted = useJustMounted();
  const needsUpdatingTitle = useRef(false);
  useEffect(() => {
    if (justMounted) {
      return;
    }
    needsUpdatingTitle.current = true;
  }, [context.language]);

  useEffect(() => {
    if (!needsUpdatingTitle.current) {
      return;
    }

    setTitle(movieDetails.title ?? 'Loading');
    setTitleElement(
      isLoading ? (
        // eslint-disable-next-line jsx-a11y/heading-has-content
        <h2 className={`${styles['text-loading-placeholder']} ${styles.title}`} />
      ) : (
        <h2 className={styles.title}>{movieDetails?.title}</h2>
      ),
    );

    setOverviewElement(
      isLoading ? (
        <div className={`${styles['text-loading-placeholder']} ${styles.overview}`} />
      ) : (
        <div className={styles.overview}>{movieDetails.overview}</div>
      ),
    );
  }, [context.language, isLoading]);

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
    <div className={styles['movie-card']} ref={ref}>
      {!!movie.backdropUrl && (
        <picture>
          <source srcSet={movie.backdropUrl?.toString()} media="(min-width: 52.5rem)" />
          <img className={styles['backdrop-image']} alt="" aria-hidden="true" loading="lazy" />
        </picture>
      )}
      <div className={styles.content}>
        {!!movie.posterUrl && (
          <img
            className={styles.poster}
            src={movie.posterUrl.toString()}
            alt={title}
            loading="lazy"
          />
        )}
        <div className={styles.meta}>
          {titleElement}
          {director}
          {otherInformation}
        </div>
        {!!movie.rating && <Rating rating={movie.rating} />}
        {overviewElement}
      </div>
    </div>
  );
};

export default forwardRef<HTMLDivElement, CardProps>(MovieCard);
