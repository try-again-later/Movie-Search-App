type Movie = {
  id: number;
  title: string;
  overview: string;
  posterUrl: URL | null;
  backdropUrl: URL | null;
  releaseDate: Date | null;
  rating: number | null;
};

export default Movie;
