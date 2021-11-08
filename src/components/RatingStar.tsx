import uniqueId from 'lodash/uniqueId';
import { useRef } from 'react';

type RatingStarProps = {
  fraction: number;
};

const RatingStar = ({ fraction }: RatingStarProps) => {
  const id = useRef(uniqueId('star-gradient-'));

  return (
    <svg
      version="1.1"
      width="20%"
      viewBox="0 0 200 190"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id={id.current}>
          <stop stopColor="var(--color-neutral-700)" offset="0%" />
          <stop stopColor="var(--color-neutral-700)" offset={`${Math.floor(100 * fraction)}%`} />
          <stop stopColor="var(--color-neutral-100)" offset={`${Math.floor(100 * fraction)}%`} />
        </linearGradient>
      </defs>
      <polygon
        points="100,10 129,59 190,69 147,115 158,180 100,150 41,180 52,115 10,69 70,59"
        fill={`url(#${id.current})`}
        stroke="var(--color-neutral-700)"
        strokeWidth="8"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RatingStar;
