import Movie from '../ts/Movie';

type CardProps = {
  movie: Movie;
};

const MovieCard = ({ movie }: CardProps) => (
  <div
    className="movie-card"
    style={{ backgroundImage: movie.backdropUrl && `url("${movie.backdropUrl.toString()}")` }}
  >
    <div className="content">
      {movie.posterUrl && (
        <img className="poster" src={movie.posterUrl.toString()} alt={movie.title} />
      )}
      <div className="meta">
        <h2 className="title">{movie.title}</h2>
        <div className="director">Год, Режиссёр-постановщик</div>
        <div className="other-information">
          <div className="length">666 мин.</div>
          <div className="genre">Список жанров</div>
        </div>
      </div>
      <div className="rating">
        Рейтинг:&nbsp;
        {movie.rating}
      </div>
      <div className="overview">{movie.overview}</div>
    </div>
  </div>
);

export default MovieCard;
