"use client";

import Masonry from "react-masonry-css";
import { OptimizedMedia } from "@/components/OptimizedMedia";
import styles from "./Gallery.module.scss";
import { gallery } from "@/resources";

export default function MasonryGrid() {
  const breakpointColumnsObj = {
    default: 2,
    720: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={styles.masonryGrid}
      columnClassName={styles.masonryGridColumn}
    >
      {gallery.images.map((image, index) => (
        <OptimizedMedia
          key={index}
          src={image.src}
          alt={image.alt}
          sizes="(max-width: 560px) 100vw, 50vw"
          radius="m"
          priority={index < 2}
          loading={index < 4 ? "eager" : "lazy"}
          className={styles.gridItem}
        />
      ))}
    </Masonry>
  );
}
