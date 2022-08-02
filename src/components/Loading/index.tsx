import styles from './styles.module.scss';

type LoadingAnimationProps = {
  loadingText: string;
};

const LoadingAnimation = ({ loadingText }: LoadingAnimationProps) => (
  <div className={styles['bouncing-loading']}>
    <div className={styles.balls}>
      <div className={styles.ball} />
      <div className={styles.ball} />
      <div className={styles.ball} />
    </div>
    <div className={styles.text}>{loadingText}</div>
  </div>
);

export default LoadingAnimation;
