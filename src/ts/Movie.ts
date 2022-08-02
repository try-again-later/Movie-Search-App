type Movie = {
  id: number;
  title?: string;
  overview?: string;
  posterUrl?: URL;
  backdropUrl?: URL;
  releaseDate?: Date;
  rating?: number;
};

export default Movie;
