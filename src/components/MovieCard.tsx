import { useTranslation } from 'react-i18next';

import Movie from '../ts/Movie';
import Rating from './Rating';

type CardProps = {
  movie: Movie;
};

const MovieCard = ({ movie }: CardProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'MovieCard' });

  return (
    <div
      className="movie-card"
      style={{ backgroundImage: movie.backdropUrl && `url("${movie.backdropUrl.toString()}")` }}
    >
      <div className="content">
        {!!movie.posterUrl && (
          <img className="poster" src={movie.posterUrl.toString()} alt={movie.title} />
        )}
        <div className="meta">
          <h2 className="title">{movie.title}</h2>
          <div className="director">
            {movie?.releaseDate?.getFullYear()}
            {!!movie.releaseDate && !!movie.director && ', '}
            {movie?.director}
          </div>
          <div className="other-information">
            {!!movie.runtime && (
              <div className="length">
                {movie.runtime}
                &nbsp;
                {t('minutes')}
              </div>
            )}
            {movie.genres.map((genre) => (
              <div className="genre" key={genre}>
                {genre}
              </div>
            ))}
          </div>
        </div>
        {!!movie.rating && <Rating rating={movie.rating} />}
        <div className="overview">{movie.overview}</div>
      </div>
    </div>
  );
};

export default MovieCard;
