import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export const HeadingScribble = () => {
  const ref = useRef<SVGSVGElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });
  const drawn = Boolean(reduceMotion || inView);

  return (
    <svg
      ref={ref}
      className={`heading-scribble ${drawn ? "is-drawn" : ""}`}
      viewBox="0 0 120 12"
      aria-hidden
    >
      <path
        d="M3 9 C 22 3, 44 3, 60 7 S 100 10, 117 4"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
