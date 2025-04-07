"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxTextProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Number of text instances
  const numInstances = 3;

  // Calculate wrap range based on number of instances
  // For 3 instances, we want to wrap from 0% to -66.67% (100% / 3 * 2)
  const wrapMin = 0;
  // const wrapMax = -(100 / numInstances) * (numInstances - 1);
  const wrapMax = -56;

  // Use the calculated wrap range
  const x = useTransform(baseX, (v) => `${wrap(wrapMin, wrapMax, v)}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 500);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax overflow-hidden whitespace-nowrap">
      <motion.div className="scroller flex whitespace-nowrap" style={{ x }}>
        <span className="mr-4 text-3xl text-[#d4af37] uppercase" style={{ fontFamily: 'var(--font-crimson-pro), serif' }}>
          {children}
        </span>
        <span className="mr-4 text-3xl text-[#d4af37] uppercase" style={{ fontFamily: 'var(--font-crimson-pro), serif' }}>
          {children}
        </span>
        <span className="mr-4 text-3xl text-[#d4af37] uppercase" style={{ fontFamily: 'var(--font-crimson-pro), serif' }}>
          {children}
        </span>
      </motion.div>
    </div>
  );
}

export default ParallaxText;
