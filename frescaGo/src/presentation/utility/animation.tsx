import type { Variants } from "framer-motion";

const transition = (delay: number) => ({
  duration: 0.6,
  delay: Math.min(delay * 0.4, 0.5),
});

export const FadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: transition(delay) },
});

export const FadeLeft = (delay: number): Variants => ({
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: transition(delay) },
});

export const FadeRight = (delay: number): Variants => ({
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: transition(delay) },
});
