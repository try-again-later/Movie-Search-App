import { useEffect, useState, useCallback } from 'react';

const useScroll = (): {x:number, y:number} => {
  const [x, setX] = useState(window.scrollX);
  const [y, setY] = useState(window.scrollY);

  const onScroll = useCallback(() => {
    setX(window.scrollX);
    setY(window.scrollY);
  }, []);

  useEffect(() => {
    document.addEventListener('scroll', onScroll);
    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  return { x, y };
};

export default useScroll;
