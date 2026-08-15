import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { ImagePreloader } from "@/lib/imagePreloader";

const SPAWN_DISTANCE_PX = 170;
const HOLD_MS = 700;
const IMAGE_W = 256;
const IMAGE_H = 144;
const TRAIL_OPACITY = 0.72;
const TRAIL_FILTER =
  "sepia(0.45) saturate(1.25) hue-rotate(-12deg) brightness(1.04)";

interface Trail {
  id: number;
  x: number;
  y: number;
  src: string;
}

interface CursorFollowProps {
  images?: string[];
  containerSelector?: string;
  cycleMode?: "sequential" | "random" | "reverse";
}

function nextImageIndex(
  mode: NonNullable<CursorFollowProps["cycleMode"]>,
  index: number,
  length: number
) {
  switch (mode) {
    case "random":
      return Math.floor(Math.random() * length);
    case "reverse":
      return index === 0 ? length - 1 : index - 1;
    case "sequential":
    default:
      return (index + 1) % length;
  }
}

function isTouchPrimaryDevice() {
  const uaMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const touchPrimary = window.matchMedia(
    "(hover: none) and (pointer: coarse)"
  ).matches;
  return uaMobile || touchPrimary;
}

const CursorFollow = ({
  images = [],
  containerSelector = "",
  cycleMode = "sequential",
}: CursorFollowProps) => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const lastTrailRef = useRef<{ x: number; y: number } | null>(null);
  const imageIndexRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const mountedRef = useRef(true);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  useEffect(() => {
    mountedRef.current = true;
    const preloader = ImagePreloader.getInstance();
    preloader.preloadImages().then((list) => {
      if (mountedRef.current) setAvailableImages(list);
    });
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  useEffect(() => {
    setIsMobile(isTouchPrimaryDevice());
  }, []);

  const finalImages = images.length > 0 ? images : availableImages;

  useMotionValueEvent(pointerX, "change", (clientX) => {
    if (isMobile || finalImages.length === 0) return;

    const clientY = pointerY.get();
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : null;
    const rect = container?.getBoundingClientRect();
    const x = rect ? clientX - rect.left : clientX;
    const y = rect ? clientY - rect.top : clientY;

    const prev = lastTrailRef.current;
    const farEnough =
      !prev || Math.hypot(x - prev.x, y - prev.y) > SPAWN_DISTANCE_PX;
    if (!farEnough) return;

    const index = imageIndexRef.current;
    const src = finalImages[index];
    if (!src) return;

    imageIndexRef.current = nextImageIndex(
      cycleMode,
      index,
      finalImages.length
    );

    const id = Date.now() + Math.random();
    lastTrailRef.current = { x, y };
    setTrails((t) => [...t, { id, x, y, src }]);

    const timer = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setTrails((t) => t.filter((trail) => trail.id !== id));
      timersRef.current = timersRef.current.filter((t) => t !== timer);
    }, HOLD_MS);
    timersRef.current.push(timer);
  });

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: Event) => {
      if (document.documentElement.classList.contains("is-scrolling")) return;

      const mouseEvent = e as MouseEvent;
      if (containerSelector) {
        const container = document.querySelector(containerSelector);
        if (container) {
          const rect = container.getBoundingClientRect();
          const inside =
            mouseEvent.clientX >= rect.left &&
            mouseEvent.clientX <= rect.right &&
            mouseEvent.clientY >= rect.top &&
            mouseEvent.clientY <= rect.bottom;
          if (!inside) return;
        }
      }

      pointerX.set(mouseEvent.clientX);
      pointerY.set(mouseEvent.clientY);
    };

    const target = containerSelector
      ? document.querySelector(containerSelector)
      : document;
    if (!target) return;

    target.addEventListener("mousemove", handleMouseMove);
    return () => target.removeEventListener("mousemove", handleMouseMove);
  }, [pointerX, pointerY, isMobile, containerSelector]);

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {trails.map((t) => (
          <motion.img
            key={t.id}
            src={t.src}
            alt=""
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: TRAIL_OPACITY,
              scale: 1,
              transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              scale: 0.88,
              transition: { duration: 0.3, ease: "easeIn" },
            }}
            className="absolute pointer-events-none select-none object-cover"
            style={{
              width: IMAGE_W,
              height: IMAGE_H,
              left: t.x - IMAGE_W / 2,
              top: t.y - IMAGE_H / 2,
              filter: TRAIL_FILTER,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CursorFollow;
