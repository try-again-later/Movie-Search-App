import { useContext, useRef, useEffect, Ref } from 'react';
import { useTranslation } from 'react-i18next';

import Movie from '@ts/Movie';
import cls from '@ts/utils/classNames';
import useQueryMovieDetails, { MovieDetails } from '@hooks/useQueryMovieDetails';

import MoviesSearchContext from '@components/MoviesSearchApp/MoviesSearchContext';
import FavoriteButton from '@components/FavoriteButton';
import Rating from '@components/Rating';

import styles from './styles.module.scss';

type MovieCardOtherInformationProps = {
  isLoading: boolean;
  movie: Movie;
  movieDetails: MovieDetails | null;
};

const MovieCardOtherInformation = ({
  isLoading,
  movie,
  movieDetails,
}: MovieCardOtherInformationProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'MovieCard' });

  const loadingAnimationsCount = useRef<number>(Math.floor(Math.random() * 4) + 2);
  const loadingAnimationsSizes = useRef<number[]>(
    Array.from({ length: loadingAnimationsCount.current }, () => Math.floor(Math.random() * 2) + 4),
  );

  if (isLoading) {
    return (
      <div className={styles['other-information']}>
        {loadingAnimationsSizes.current.map((width, index) => (
          <div
            key={index}
            className={styles['background-gradient-loading']}
            style={{ width: `${width}rem` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles['other-information']}>
      <FavoriteButton movie={movie} className={styles['add-to-favorites-button']} />
      {movieDetails?.runtime != null && (
        <div className={styles.length}>
          {movieDetails.runtime}&nbsp;{t('minutes')}
        </div>
      )}
      {movieDetails?.genres.map((genre) => (
        <div className={styles.genre} key={genre}>
          {genre}
        </div>
      ))}
    </div>
  );
};

type MovieCardProps = {
  movie: Movie;
  initialNeedsUpdate?: boolean;
  ref?: Ref<HTMLDivElement>;
};

const MovieCard = ({ movie, ref }: MovieCardProps) => {
  const context = useContext(MoviesSearchContext);

  const [movieDetails, isLoading, queryDetails] = useQueryMovieDetails({
    apiKey: context.apiKey,
    language: context.language,
    movie,
  });

  useEffect(() => {
    queryDetails();
  }, [context.language, queryDetails]);

  const formatDirector = (movieDetails: MovieDetails | null) => {
    let formattedString = '';
    formattedString += movie?.releaseDate?.getFullYear() ?? '';
    if (movie.releaseDate != null && movieDetails?.director != null) {
      formattedString += ', ';
    }
    formattedString += movieDetails?.director ?? '';

    return formattedString;
  };

  return (
    <div className={styles['movie-card']} ref={ref}>
      {movie.backdropUrl != null && (
        <picture>
          <source srcSet={movie.backdropUrl.toString()} media="(min-width: 52.5rem)" />
          <img className={styles['backdrop-image']} alt="" loading="lazy" />
        </picture>
      )}
      <div className={styles.content}>
        {movie.posterUrl != null && (
          <img
            className={styles.poster}
            src={movie.posterUrl.toString()}
            alt={movie.title}
            loading="lazy"
          />
        )}
        <div className={styles.meta}>
          <h2 className={cls(styles.title, isLoading && styles['text-loading-placeholder'])}>
            {!isLoading && movieDetails?.title}
          </h2>
          <div className={cls(styles.director, isLoading && styles['text-loading-placeholder'])}>
            {!isLoading && formatDirector(movieDetails)}
          </div>
          <MovieCardOtherInformation
            isLoading={isLoading}
            movie={movie}
            movieDetails={movieDetails}
          />
        </div>
        {movie.rating != null && <Rating rating={movie.rating} />}
        <div className={cls(styles.overview, isLoading && styles['text-loading-placeholder'])}>
          {!isLoading && movieDetails?.overview}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
