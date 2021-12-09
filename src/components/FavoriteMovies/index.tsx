import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import useQueryMovieDetails from '@hooks/useQueryMovieDetails';
import useLocalStorage from '@hooks/useLocalStorage';
import Movie from '@ts/Movie';
import LoadingAnimation from '@components/Loading';

import MoviesSearchContext from '@components/MoviesSearchApp/MoviesSearchContext';
import ScrollToTopButton from '../ScrollToTopButton';

import styles from './styles.module.scss';
import FavoriteButton from '../FavoriteButton';

interface FavoriteCard {
  movieId: number;
}

const FavoriteCard = ({ movieId }: FavoriteCard) => {
  const [movie, setMovie] = useState<Movie>({ id: movieId });
  useEffect(() => {
    setMovie({
      id: movieId,
    });
  }, [movieId]);

  const context = useContext(MoviesSearchContext);
  const [movieDetails, isLoading, queryDetails] = useQueryMovieDetails({
    apiKey: context.apiKey,
    language: context.language,
    movie,
  });
  useEffect(() => {
    queryDetails();
  }, [context.apiKey, context.language, movieId, queryDetails]);

  return isLoading ? (
    <LoadingAnimation loadingText="Loading" />
  ) : (
    <article className={styles['favorite-card']}>
      <h2 className={styles.title}>{movieDetails?.title}</h2>
      <img
        className={styles.poster}
        alt="Poster"
        loading="lazy"
        src={movieDetails.posterUrl?.toString()}
      />
      <FavoriteButton className={styles['favorite-button']} movie={movie} />
    </article>
  );
};

const FavoriteMovies = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'FavoriteMovies' });

  const [moviesIds] = useLocalStorage<Record<string, boolean>>('favoriteMovies', {});

  return (
    <main className={styles['favorites-container']}>
      <ScrollToTopButton />
      <div className={styles['favorites-list']}>
        {Object.keys(moviesIds).length == 0 ? (
          <div className={styles['empty-list-message']}>{t('nothingHereYet')}</div>
        ) : (
          Object.keys(moviesIds).map((movieId) => (
            <FavoriteCard key={movieId} movieId={Number.parseInt(movieId, 10)} />
          ))
        )}
      </div>
    </main>
  );
};

export default FavoriteMovies;
