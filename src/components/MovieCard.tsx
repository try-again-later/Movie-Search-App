import Movie from '../ts/Movie';

type MovieCardProps = {
  movie: Movie;
};

const MovieCard = ({ movie }: MovieCardProps) => (
  <div className="movieCard">
    <img className="poster" src={movie.posterUrl.toString()} alt={movie.title} />
    <h2 className="title">{movie.title}</h2>
    <p className="releaseDate">
      Release date:&nbsp;
      {movie.releaseDate.toDateString()}
    </p>
    <p className="rating">
      Rating:&nbsp;
      {movie.rating}
    </p>
    <p className="overview">{movie.overview}</p>
  </div>
);
export default MovieCard;
