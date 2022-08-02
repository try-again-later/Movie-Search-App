import Movie from '@ts/Movie';
import useLocalStorage from '@hooks/useLocalStorage';
import { useCallback } from 'react';

interface ReturnType {
  favorite: boolean;
  change: () => void;
}

interface PropsType {
  movie: Movie;
  listName?: string;
}

const useFavoriteMovie = ({ movie, listName = 'favoriteMovies' }: PropsType): ReturnType => {
  const [favorites, setFavorites] = useLocalStorage<Record<string, boolean>>(listName, {});

  const change = useCallback(() => {
    setFavorites((prevFavorites) => {
      if (prevFavorites == null) {
        return {
          [String(movie.id)]: true,
        };
      }
      if (prevFavorites[String(movie.id)]) {
        const updatedFavorites: Record<string, boolean> = { ...prevFavorites };
        delete updatedFavorites[String(movie.id)];
        return updatedFavorites;
      }
      return {
        ...prevFavorites,
        [String(movie.id)]: true,
      };
    });
  }, [setFavorites, movie.id]);

  return { favorite: favorites[String(movie.id)], change };
};

export default useFavoriteMovie;
