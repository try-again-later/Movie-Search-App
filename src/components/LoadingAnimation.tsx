type LoadingAnimationProps = {
  loadingText: string;
};

const LoadingAnimation = ({ loadingText }: LoadingAnimationProps) => (
  <div className="bouncing-loading">
    <div className="balls">
      <div className="ball" />
      <div className="ball" />
      <div className="ball" />
    </div>
    <div className="text">{loadingText}</div>
  </div>
);

export default LoadingAnimation;
