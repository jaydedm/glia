"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  const containerRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const fullText = "Welcome";
  const typingSpeed = 100; // milliseconds per character

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
    <div ref={containerRef} style={{ position: "relative", height: "150vh" }}>
      <motion.div
        className="hero-wrapper"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <motion.div
          className="hero-slider"
          style={{
            position: "absolute",
            inset: 0,
            scale: scale,
            backgroundColor: "#0a2a0a",
          }}
        >
          {/* can insert image here if desired */}
        </motion.div>

        {/* Typewriter text */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
            color: "#d4af37", // Gold color
            fontSize: "3rem",
            fontWeight: "bold",
            fontFamily: "var(--font-crimson-pro), serif", // Use Crimson Pro font variable
            textAlign: "center",
            opacity: useTransform(smoothScrollProgress, [0, 0.05], [0, 1]),
            // textShadow: "0 0 10px rgba(212, 175, 55, 0.5)",
            textTransform: "uppercase",
            whiteSpace: "nowrap", // Prevent text wrapping
          }}
        >
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {typedText}
            {!typingComplete && (
              <span
                style={{
                  opacity: !typingComplete && showCursor ? 1 : 0,
                  display: "inline-block",
                  width: "0.5em", // Fixed width for the cursor
                  whiteSpace: "nowrap", // Prevent cursor wrapping
                }}
              >
                &nbsp;| {/* Use non-breaking space before cursor */}
              </span>
            )}
          </span>
        </motion.div>

        {/* Top mask */}
        <motion.div
          className="hero-top-mask"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            overflow: "hidden",
            clipPath: "inset(0 0 50% 0)",
            translateY: topMaskTranslateY,
            backgroundColor: "#eaf5e9",
          }}
        >
          <Link href="/books" style={{
            position: "absolute",
            top: ".5rem",
            right: ".5rem",
            width: "4.5rem",
            height: "4.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}>
            <div
              id="books-link"
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "50%",
                backgroundColor: "#20441c",
              }}
            />
          </Link>

          <img
            src="/glia-logo-green.svg"
            alt="Top Mask"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "4rem",
            }}
          />
        </motion.div>
        {/* Bottom mask */}
        <motion.div
          className="hero-bottom-mask"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            overflow: "hidden",
            clipPath: "inset(50% 0 0 0)",
            translateY: bottomMaskTranslateY,
            backgroundColor: "#eaf5e9",
          }}
        >
          <img
            src="/glia-logo-green.svg"
            alt="Bottom Mask"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "4rem",
            }}
          />

          {/* Footer row with three columns */}
          <div
            style={{
              position: "absolute",
              bottom: "5rem",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              padding: "0 2rem",
              zIndex: 10,
              alignItems: "center",
            }}
          >
            {/* Left column - Instagram link */}
            <div
              style={{
                flex: 0.5,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <a
                href="https://instagram.com/glia"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#20441c",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "clamp(0.5rem, 2vw, 0.7rem)",
                }}
              >
                INSTAGRAM
              </a>
            </div>

            {/* Center column - Description text */}
            <div
              style={{
                flex: 1,
                textAlign: "center",
                maxWidth: "200px",
                margin: "0 auto",
                padding: "0 2rem",
              }}
            >
              <p
                style={{
                  color: "#20441c",
                  fontSize: "clamp(0.5rem, 2vw, 0.7rem)",
                  lineHeight: "1.4",
                  textTransform: "uppercase",
                  fontWeight: "bolder",
                }}
              >
                <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>
                  BIENVENUE
                </span>
                <br />
                GLIA BOOK CLUB IS A DISCERNING COLLECTIVE THAT CULTIVATES
                HUMANITY THROUGH CONNECTION, REFLECTION, AND EXCEPTIONAL
                LITERATURE
              </p>
            </div>

            {/* Right column - Email link */}
            <div
              style={{
                flex: 0.5,
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <a
                href="mailto:contact@glia.com"
                style={{
                  color: "#20441c",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "clamp(0.5rem, 2vw, 0.7rem)",
                  textTransform: "uppercase",
                }}
              >
                email us
              </a>
            </div>
          </div>
        </motion.div>
        {/* Divider line */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "#faf6f0", // adjust color as needed
            zIndex: 3,
            opacity: dividerOpacity,
          }}
        />
      </motion.div>
      {/* Rest of your page content */}
      <div style={{ padding: "2rem", background: "#f0f0f0" }}>
        <h2>More Content Here</h2>
        <p>
          After the scroll effect completes, this content will scroll into view
          as normal.
        </p>
      </div>
    </div>
  );
};

export default Hero;
