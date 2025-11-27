'use client';

import styles from './CardSkeleton.module.scss';

export default function CardSkeleton() {
  return (
    <div className={styles.card}>
      {/* Image skeleton */}
      <div className={styles.imageWrapper}>
        <div className={styles.imageSkeleton} />
      </div>

      {/* Content skeleton */}
      <div className={styles.cardContent}>
        {/* Title */}
        <div className={styles.titleSkeleton} />

        {/* Badges */}
        <div className={styles.badgesRow}>
          <div className={styles.badgeSkeleton} />
          <div className={styles.badgeSkeleton} style={{ width: '60px' }} />
          <div className={styles.badgeSkeleton} style={{ width: '50px' }} />
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statSkeleton} />
          <div className={styles.statSkeleton} />
          <div className={styles.statSkeleton} />
        </div>

        {/* Description */}
        <div className={styles.descriptionSection}>
          <div className={styles.descLabelSkeleton} />
          <div className={styles.descLineSkeleton} />
          <div className={styles.descLineSkeleton} style={{ width: '90%' }} />
          <div className={styles.descLineSkeleton} style={{ width: '75%' }} />
        </div>

        {/* Codes section */}
        <div className={styles.codesSection}>
          <div className={styles.codeLineSkeleton} />
          <div className={styles.codeLineSkeleton} style={{ width: '80%' }} />
        </div>

        {/* Price */}
        <div className={styles.priceSection}>
          <div className={styles.priceLabelSkeleton} />
          <div className={styles.priceValueSkeleton} />
        </div>
      </div>
    </div>
  );
}
