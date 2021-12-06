import { useRef } from 'react';

const useJustMounted = () => {
  const ref = useRef(true);
  const justMounted = ref.current;
  ref.current = false;
  return justMounted;
};

export default useJustMounted;
