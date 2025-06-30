import { useEffect, useState } from 'react';

const useScroll = (): { x: number; y: number } => {
  const [x, setX] = useState(window.scrollX);
  const [y, setY] = useState(window.scrollY);

  useEffect(() => {
    const onScroll = () => {
      setX(window.scrollX);
      setY(window.scrollY);
    };

    document.addEventListener('scroll', onScroll);
    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { x, y };
};

export default useScroll;
