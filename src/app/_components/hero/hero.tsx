"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";
import TypewriterCursor from '../TypeWriterCursor'

const Hero = () => {
  const containerRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const fullText = "Welcome";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 40,
    bounce: 0,
  });

  // Animate the background image scale from 1.5 (zoomed in) to 1 (normal)
  const scale = useTransform(smoothScrollProgress, [0, 1], [1.5, 1]);

  // Animate the masks moving apart.
  const topMaskTranslateY = useTransform(
    smoothScrollProgress,
    [0, 1],
    [0, -1600],
  );
  const bottomMaskTranslateY = useTransform(
    smoothScrollProgress,
    [0, 1],
    [0, 1600],
  );

  // Divider opacity is 1 at scrollYProgress=0, and immediately drops to 0 once scrolling begins.
  const dividerOpacity = useTransform(smoothScrollProgress, [0, 0.001], [1, 0]);

  // Blinking cursor effect
  useEffect(() => {
    // Only run the cursor interval if typing is not complete
    if (!typingComplete) {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500); // Blink every 500ms

      return () => clearInterval(cursorInterval);
    }
  }, [typingComplete]);

  // Typewriter effect based on scroll progress
  useEffect(() => {
    const unsubscribe = smoothScrollProgress.on("change", (latest) => {
      // Start typing immediately when scrolling begins
      if (latest > 0) {
        const progress = Math.min(1, latest / 0.2); // Complete typing by 15% scroll
        const charsToShow = Math.floor(progress * fullText.length);
        setTypedText(fullText.substring(0, charsToShow));

        if (charsToShow === fullText.length) {
          setTypingComplete(true);
        } else {
          setTypingComplete(false);
          setShowCursor(true);
        }
      } else {
        setTypedText("");
        setTypingComplete(false);
        setShowCursor(true);
      }
    });

    return () => unsubscribe();
  }, [smoothScrollProgress]);

  return (
    <div ref={containerRef} className={styles.container}>
      <motion.div className={styles.heroWrapper}>
        <motion.div className={styles.heroSlider} style={{ scale }} />

        {/* Typewriter text */}
        <motion.div
          className={styles.typewriterContainer}
          style={{
            opacity: useTransform(smoothScrollProgress, [0, 0.05], [0, 1]),
          }}
        >
          <span className={styles.typewriterText}>
            {typedText}
            <TypewriterCursor
              show={showCursor}
              typingComplete={typingComplete}
            />
          </span>
        </motion.div>

        {/* Top mask */}
        <motion.div
          className={styles.heroTopMask}
          style={{ translateY: topMaskTranslateY }}
        >
          <Link href="/books" className={styles.booksLink}>
            <div className={styles.booksLinkDot} />
          </Link>

          <div className={styles.imageContainer}>
            <Image
              src="/glia-logo-green.svg"
              alt="Top Mask"
              fill
              className={styles.maskImage}
            />
          </div>
        </motion.div>

        {/* Bottom mask */}
        <motion.div
          className={styles.heroBottomMask}
          style={{ translateY: bottomMaskTranslateY }}
        >
          <div className={styles.imageContainer}>
            <Image
              src="/glia-logo-green.svg"
              alt="Bottom Mask"
              fill
              className={styles.maskImage}
            />
          </div>

          {/* Footer row with three columns */}
          <div className={styles.footerRow}>
            {/* Left column - Instagram link */}
            <div className={styles.footerColumn}>
              <a
                href="https://instagram.com/glia"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                INSTAGRAM
              </a>
            </div>

            {/* Center column - Description text */}
            <div className={styles.footerCenter}>
              <p className={styles.footerText}>
                <span className={styles.footerTextItalic}>BIENVENUE</span>
                <br />
                GLIA BOOK CLUB IS A DISCERNING COLLECTIVE THAT CULTIVATES
                HUMANITY THROUGH CONNECTION, REFLECTION, AND EXCEPTIONAL
                LITERATURE
              </p>
            </div>

            {/* Right column - Email link */}
            <div className={styles.footerColumnRight}>
              <a
                href="mailto:contact@glia.com"
                className={styles.footerLinkEmail}
              >
                email us
              </a>
            </div>
          </div>
        </motion.div>

        {/* Divider line */}
        <motion.div
          className={styles.divider}
          style={{ opacity: dividerOpacity }}
        />
      </motion.div>

      <div className={styles.content}>
        <h2>This does not matter</h2>
        <p>
          This is purely filler for the structure of the page. Do not worry....
        </p>
      </div>
    </div>
  );
};

export default Hero;
