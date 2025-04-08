"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image'
import { books} from './bookData';
import styles from './books.module.css';

// Custom hook to handle window-dependent calculations
function useWindowAdjustedParallax(value: MotionValue<number>, distance: number) {
  const [limitedDistance, setLimitedDistance] = useState(distance);

  useEffect(() => {
    // Only run on client side
    const adjustDistance = () => {
      setLimitedDistance(Math.min(distance, window.innerHeight * 0.5));
    };

    // Initial adjustment
    adjustDistance();

    // Adjust on resize
    window.addEventListener('resize', adjustDistance);

    return () => {
      window.removeEventListener('resize', adjustDistance);
    };
  }, [distance]);

  return useTransform(value, [0, 1], [-limitedDistance, limitedDistance]);
}

function BookCover({ id }: { id: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useWindowAdjustedParallax(scrollYProgress, 300);

  // Ensure id is within valid range
  const bookIndex = id - 1;
  const book =
    bookIndex >= 0 && bookIndex < books.length ? books[bookIndex] : books[0];

  return (
    <section className={styles.imgContainer}>
      <div ref={ref} className={styles.bookContent}>
        <div className={styles.bookCover}>
          <Image
            src={`/book-cover-art/${book?.image}`}
            alt={`Book cover for ${book?.title}`}
            fill
            sizes="(max-width: 500px) 150px, 300px"
            style={{ objectFit: 'contain' }}
            priority={id === 1} // Prioritize loading the first image
          />
        </div>
        <div className={styles.bookDescription}>
          <p>{book?.description}</p>
        </div>
      </div>
      <motion.h2
        // Hide until scroll progress is measured
        initial={{ visibility: "hidden" }}
        animate={{ visibility: "visible" }}
        style={{ y }}
        className={styles.monthText}
      >{`${book?.month}`}</motion.h2>
    </section>
  );
}

function Books() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div id="home-link-circle">
      <Link href="/" className={styles.homeLink}>
        <div className={styles.homeCircle} />
      </Link>

      {books.map((_, index) => (
        <BookCover key={index + 1} id={index + 1} />
      ))}
      <motion.div className={styles.progress} style={{ scaleX }} />
    </div>
  );
}

export default Books;
