import { useTranslation } from 'react-i18next';

import RatingStar from './RatingStar';

import styles from './styles.module.scss';

type RatingProps = {
  rating: number;
};

const Rating = ({ rating }: RatingProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'Rating' });

  return (
    <div className={styles.rating}>
      <div>
        {[...Array(5).keys()].map((i) => {
          const fraction = Math.min(Math.max(rating / 2 - i, 0), 1);
          return <RatingStar key={i} fraction={fraction} />;
        })}
      </div>
      <div className={styles.text}>
        {t('rating')}
        &nbsp;
        {rating}
      </div>
    </div>
  );
};
export default Rating;
