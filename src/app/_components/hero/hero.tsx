"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";
import TypewriterCursor from "../TypeWriterCursor";

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

  // Not used in current impl, but in case you ever use a real background image.
  const scale = useTransform(smoothScrollProgress, [0, 1], [1.5, 1]);

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

  const dividerOpacity = useTransform(smoothScrollProgress, [0, 0.001], [1, 0]);

  useEffect(() => {
    if (!typingComplete) {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [typingComplete]);

  useEffect(() => {
    const typingThreshold = 0.2;
    const handleScrollChange = (latest: number) => {
      if (latest <= 0) {
        setTypedText("");
        setTypingComplete(false);
        setShowCursor(true);
        return;
      }

      const progress = Math.min(1, latest / typingThreshold);
      const charsToShow = Math.floor(progress * fullText.length);

      setTypedText(fullText.substring(0, charsToShow));
      setTypingComplete(charsToShow === fullText.length);
      setShowCursor(charsToShow < fullText.length);
    };

    const unsubscribe = smoothScrollProgress.on("change", handleScrollChange);
    return () => unsubscribe();
  }, [smoothScrollProgress, fullText]);

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

          <div className={styles.imageContainer} style={{pointerEvents: "none"}}>
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
                href="mailto:jayde@jaydemitchell.com"
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
