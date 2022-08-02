import { useCallback } from 'react';

import useScroll from '@hooks/useScroll';

import styles from './styles.module.scss';

const ScrollToTopButton = () => {
  const { y: scrollPosition } = useScroll();
  const onScrollToTopClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <button
      type="button"
      className={`${styles['move-to-top-button']} ${
        scrollPosition > 1000 ? styles['move-to-top-button-visible'] : ''
      }`}
      aria-label="Scroll to top"
      onClick={onScrollToTopClick}
    />
  );
};

export default ScrollToTopButton;
