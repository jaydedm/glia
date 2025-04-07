"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// Define book type
type Book = {
  month: string;
  title: string;
  image: string;
  description: string;
};

// Define book data with months and image names
const books: Book[] = [
  {
    month: "Feb",
    title: "nightingale",
    image: "nightingale.jpg",
    description: "TWO SISTERS IN OCCUPIED FRANCE DURING WORLD WAR II FACE IMPOSSIBLE CHOICES AS THEY RESIST THE GERMAN INVASION, ONE THROUGH DIRECT ACTION AND THE OTHER THROUGH SUBTLE DEFIANCE"
  },
  {
    month: "Mar",
    title: "wildSwans",
    image: "wildSwans.jpg",
    description: "THREE GENERATIONS OF CHINESE WOMEN NAVIGATE THE TURBULENT WATERS OF TWENTIETH CENTURY CHINA, FROM THE EMPEROR'S COURT TO THE CULTURAL REVOLUTION AND BEYOND"
  },
  {
    month: "Apr",
    title: "Cantoras",
    image: "Cantoras.jpeg",
    description: "FIVE WOMEN FIND REFUGE AND LOVE IN A REMOTE BEACH HOUSE DURING URUGUAY'S DICTATORSHIP ERA, CREATING A SANCTUARY OF FREEDOM AND AUTHENTICITY AMIDST OPPRESSION"
  },
  {
    month: "May",
    title: "theOverstory",
    image: "theOverstory.jpeg",
    description: "NINE AMERICANS FROM DIVERSE BACKGROUNDS DISCOVER THE PROFOUND CONNECTIONS BETWEEN HUMANS AND TREES, JOINING FORCES TO PROTECT THE ANCIENT FORESTS FROM DESTRUCTION"
  },
];

function BookCover({ id }: { id: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 300);

  // Ensure id is within valid range
  const bookIndex = id - 1;
  const book =
    bookIndex >= 0 && bookIndex < books.length ? books[bookIndex] : books[0];

  return (
    <section className="img-container">
      <div ref={ref} className="book-content">
        <div className="book-cover">
          <img
            src={`/book-cover-art/${book.image}`}
            alt={`Book cover for ${book.title}`}
          />
        </div>
        <div className="book-description">
          <p>{book?.description}</p>
        </div>
      </div>
      <motion.h2
        // Hide until scroll progress is measured
        initial={{ visibility: "hidden" }}
        animate={{ visibility: "visible" }}
        style={{ y }}
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
    <div id="example">
      {/* Home link circle */}
      <Link href="/" className="home-link">
        <div className="home-circle" />
      </Link>

      {books.map((_, index) => (
        <BookCover key={index + 1} id={index + 1} />
      ))}
      <motion.div className="progress" style={{ scaleX }} />
      <StyleSheet />
    </div>
  );
}

/**
 * ==============   Styles   ================
 */

function StyleSheet() {
  return (
    <style>{`
        html {
            scroll-snap-type: y mandatory;
            background-color: #0a2a0a; /* Dark green background */
        }

        body {
            background-color: #0a2a0a; /* Dark green background */
            margin: 0;
            padding: 0;
        }

        .home-link {
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 100;
            cursor: pointer;
        }

        .home-circle {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background-color: #eaf5e9; /* Light green color */
        }

        .img-container {
            height: 100vh;
            scroll-snap-align: start;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        .book-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 800px;
            margin: 0 auto;
        }

        .book-cover {
            width: 300px;
            height: 400px;
            margin: 20px;
            background: #0a2a0a; /* Dark green background to match app */
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .book-cover img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
        }

        .book-description {
            max-width: 500px;
            margin: 2rem auto 2rem;
            padding: 0 2rem;
        }

        .book-description p {
            color: #eaf5e9; /* Light green color for text */
            font-size: clamp(0.7rem, 2.5vw, 0.9rem);
            line-height: 1.4;
            text-transform: uppercase;
            font-weight: bolder;
            text-align: center;
        }

        @media (max-width: 500px) {
            .book-cover {
                width: 150px;
                height: 200px;
            }

            .book-cover img {
                max-width: 100%;
                max-height: 100%;
            }

            .img-container h2 {
                font-size: 24px;
                left: auto;
                right: 20px;
                max-width: 120px;
                text-align: right;
            }
        }

        @media (max-width: 350px) {
            .img-container h2 {
                font-size: 20px;
                right: 10px;
                max-width: 100px;
            }
        }

        .img-container h2 {
            color: #d4af37; /* Gold color for text */
            margin: 0;
            font-family: "Azeret Mono", monospace;
            font-size: 50px;
            font-weight: 700;
            letter-spacing: -3px;
            line-height: 1.2;
            position: absolute;
            display: inline-block;
            top: calc(50% - 25px);
            left: calc(50% + 120px);
            max-width: 200px;
            overflow: visible;
            white-space: nowrap;
        }

        .progress {
            position: fixed;
            left: 0;
            right: 0;
            height: 5px;
            background: #d4af37; /* Gold color for progress bar */
            bottom: 50px;
            transform: scaleX(0);
        }
    `}</style>
  );
}

export default Books;
