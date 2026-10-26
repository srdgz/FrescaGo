const reveal = (axis: "x" | "y", from: number) => (delay: number) => ({
  hidden: {
    opacity: 0,
    [axis]: from,
  },
  visible: {
    opacity: 1,
    [axis]: 0,
    transition: {
      duration: 0.6,
      delay: Math.min(delay * 0.4, 0.5),
    },
  },
});

export const FadeUp = reveal("y", 40);

export const FadeLeft = reveal("x", 40);

export const FadeRight = reveal("x", -40);
