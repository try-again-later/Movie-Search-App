import useScroll from '@hooks/useScroll';

import ArrowUp from './icons/arrow-up.svg?react';

import styles from './styles.module.scss';

const ScrollToTopButton = () => {
  const { y: scrollPosition } = useScroll();
  const onScrollToTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`${styles['move-to-top-button']} ${
        scrollPosition > 1000 ? styles['move-to-top-button-visible'] : ''
      }`}
      title="Scroll to top"
      onClick={onScrollToTopClick}
    >
      <ArrowUp />
    </button>
  );
};

export default ScrollToTopButton;
