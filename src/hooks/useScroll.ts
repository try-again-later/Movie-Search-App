import { useEffect, useState } from 'react';

const useScroll = (): {x:number, y:number} => {
  const [x, setX] = useState(window.scrollX);
  const [y, setY] = useState(window.scrollY);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      setX(window.scrollX);
      setY(window.scrollY);
    });
  }, []);

  return { x, y };
};

export default useScroll;
