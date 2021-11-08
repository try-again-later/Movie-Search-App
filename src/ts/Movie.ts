type Movie = {
  id: number;
  title: string;
  genres: string[];
  overview?: string;
  posterUrl?: URL;
  backdropUrl?: URL;
  releaseDate?: Date;
  rating?: number;
  runtime?: number;
  director?: string;
};

export default Movie;
