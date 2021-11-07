import Movie from '../ts/Movie';

type MovieCardProps = {
  movie: Movie;
};

const MovieCard = ({ movie }: MovieCardProps) => (
  <div className="movie-card">
    <img className="poster" src={movie.posterUrl.toString()} alt={movie.title} />
    <h2 className="title">{movie.title}</h2>
    <p className="director">2018, David Ayer</p>
    <p className="meta">
      <span className="length">117 min</span>
      <span className="genre">Action, Crime, Fantasy</span>
    </p>
    {/* <p className="releaseDate">
      Дата выхода:&nbsp;
      {movie.releaseDate.toDateString()}
    </p> */}
    <p className="rating">
      Рейтинг:&nbsp;
      {movie.rating}
    </p>
    <p className="overview">{movie.overview}</p>
  </div>
);
export default MovieCard;
