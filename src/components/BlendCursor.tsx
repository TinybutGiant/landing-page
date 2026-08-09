import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SIZE = 22;

/** White fill + mix-blend difference → dark on light, light on dark. */
const BlendCursor = ({ enabled = true }: { enabled?: boolean }) => {
  const [visible, setVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 480, damping: 40, mass: 0.3 });
  const y = useSpring(rawY, { stiffness: 480, damping: 40, mass: 0.3 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !isFinePointer) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, isFinePointer, rawX, rawY]);

  if (!enabled || !isFinePointer) return null;

  const half = SIZE / 2;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full"
      style={{
        x,
        y,
        width: SIZE,
        height: SIZE,
        marginLeft: -half,
        marginTop: -half,
        opacity: visible ? 1 : 0,
        backgroundColor: "#ffffff",
        mixBlendMode: "difference",
      }}
    />
  );
};

export default BlendCursor;
