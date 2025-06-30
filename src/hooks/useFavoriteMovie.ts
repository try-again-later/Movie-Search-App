import Movie from '@ts/Movie';
import useLocalStorage from '@hooks/useLocalStorage';

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

  const change = () => {
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
  };

  return { favorite: favorites[String(movie.id)], change };
};

export default useFavoriteMovie;
