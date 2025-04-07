"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Hero = () => {
  const containerRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const fullText = "Welcome";
  const typingSpeed = 100; // milliseconds per character

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth the scroll progress for a weighted feel.
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 40,
    bounce: 0,
  });

  // Animate the background image scale from 1.5 (zoomed in) to 1 (normal)
  const scale = useTransform(smoothScrollProgress, [0, 1], [1.5, 1]);

  // Animate the masks moving apart.
  const topMaskTranslateY = useTransform(smoothScrollProgress, [0, 1], [0, -1600]);
  const bottomMaskTranslateY = useTransform(smoothScrollProgress, [0, 1], [0, 1600]);

  // Divider opacity is 1 at scrollYProgress=0, and immediately drops to 0 once scrolling begins.
  const dividerOpacity = useTransform(smoothScrollProgress, [0, 0.001], [1, 0]);

  // Typewriter effect based on scroll progress
  useEffect(() => {
    const unsubscribe = smoothScrollProgress.on("change", (latest) => {
      // Start typing immediately when scrolling begins
      if (latest > 0) {
        const progress = Math.min(1, latest / 0.2); // Complete typing by 15% scroll
        const charsToShow = Math.floor(progress * fullText.length);
        setTypedText(fullText.substring(0, charsToShow));
      } else {
        setTypedText("");
      }
    });

    return () => unsubscribe();
  }, [smoothScrollProgress]);

  // Create a ref for the background image
  const backgroundImgRef = useRef<HTMLImageElement>(null);

  return (
    <div ref={containerRef} style={{ position: "relative", height: "150vh" }}>
      <motion.div
        className="hero-wrapper"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden"
        }}
      >
        {/* Background image container */}
        <motion.div
          className="hero-slider"
          style={{
            position: "absolute",
            inset: 0,
            scale: scale,
            backgroundColor: "#0a2a0a" // Darker green background color
          }}
        >
          {/* Removed the image div and replaced with a solid color background */}
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
            textTransform: "uppercase"
          }}
        >
          {typedText}
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
            backgroundColor: "#eaf5e9"
          }}
        >
          <img
            src="/glia-logo-green.svg"
            alt="Top Mask"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "4rem"
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
            backgroundColor: "#eaf5e9"
          }}
        >
          <img
            src="/glia-logo-green.svg"
            alt="Bottom Mask"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "4rem"
            }}
          />

          {/* Footer row with three columns */}
          <div style={{
            position: "absolute",
            bottom: "4rem",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "0 2rem",
            zIndex: 10,
            alignItems: "center"
          }}>
            {/* Left column - Instagram link */}
            <div style={{ flex: 0.5, textAlign: "left", display: "flex", alignItems: "center", height: "100%" }}>
              <a
                href="https://instagram.com/glia"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#20441c",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.7rem"
                }}
              >
                INSTAGRAM
              </a>
            </div>

            {/* Center column - Description text */}
            <div style={{
              flex: 1,
              textAlign: "center",
              maxWidth: "200px",
              margin: "0 auto",
              padding: "0 2rem"
            }}>
              <p style={{
                color: "#20441c",
                fontSize: "0.7rem",
                lineHeight: "1.4",
                textTransform: "uppercase",
                fontWeight: "bolder"
              }}>
                <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>BIENVENUE</span><br />
                GLIA BOOK CLUB IS A DISCERNING COLLECTIVE THAT CULTIVATES HUMANITY THROUGH CONNECTION, REFLECTION, AND EXCEPTIONAL LITERATURE
              </p>
            </div>

            {/* Right column - Email link */}
            <div style={{ flex: 0.5, textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <a
                href="mailto:contact@glia.com"
                style={{
                  color: "#20441c",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  textTransform: "uppercase"
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
            opacity: dividerOpacity
          }}
        />
      </motion.div>
      {/* Rest of your page content */}
      <div style={{ padding: "2rem", background: "#f0f0f0" }}>
        <h2>More Content Here</h2>
        <p>
          After the scroll effect completes, this content will scroll into view as normal.
        </p>
      </div>
    </div>
  );
};

export default Hero;
