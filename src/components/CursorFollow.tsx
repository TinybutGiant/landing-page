import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ImagePreloader } from "@/lib/imagePreloader";

const SPAWN_DISTANCE_PX = 96;
const HOLD_MS = 800;
const MAX_TRAILS = 12;
const MAX_SPAWNS_PER_EVENT = 5;
const IMAGE_W = 168;
const IMAGE_H = 108;
const TRAIL_OPACITY = 0.84;
const TRAIL_FILTER = "saturate(0.92) contrast(0.98) brightness(1.02)";

interface Trail {
  id: number;
  x: number;
  y: number;
  src: string;
  scale: number;
  depth: number;
}

interface CursorFollowProps {
  images?: string[];
  containerSelector?: string;
  fadeSelector?: string;
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
  fadeSelector = "",
  cycleMode = "sequential",
}: CursorFollowProps) => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const lastTrailRef = useRef<{ x: number; y: number } | null>(null);
  const imageIndexRef = useRef(0);
  const idRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const mountedRef = useRef(true);
  const shouldReduceMotion = useReducedMotion();

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
    const distance = prev ? Math.hypot(x - prev.x, y - prev.y) : Infinity;
    if (prev && distance < SPAWN_DISTANCE_PX) return;

    const spawnCount = prev
      ? Math.min(MAX_SPAWNS_PER_EVENT, Math.max(1, Math.ceil(distance / SPAWN_DISTANCE_PX)))
      : 1;
    const additions: Trail[] = [];

    for (let step = 1; step <= spawnCount; step += 1) {
      const progress = step / spawnCount;
      const trailX = prev ? prev.x + (x - prev.x) * progress : x;
      const trailY = prev ? prev.y + (y - prev.y) * progress : y;
      const index = imageIndexRef.current;
      const src = finalImages[index];
      if (!src) continue;

      imageIndexRef.current = nextImageIndex(cycleMode, index, finalImages.length);
      idRef.current += 1;
      const depth = step / spawnCount;
      additions.push({
        id: idRef.current,
        x: trailX,
        y: trailY,
        src,
        scale: [0.92, 1, 0.96, 1.04][idRef.current % 4],
        depth,
      });
    }

    if (additions.length === 0) return;
    lastTrailRef.current = { x, y };
    const additionIds = new Set(additions.map(({ id }) => id));
    setTrails((current) => [...current, ...additions].slice(-MAX_TRAILS));

    const timer = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setTrails((current) => current.filter(({ id }) => !additionIds.has(id)));
      timersRef.current = timersRef.current.filter((item) => item !== timer);
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

      if (fadeSelector) {
        const fadeTarget = document.querySelector(fadeSelector);
        const fadeRect = fadeTarget?.getBoundingClientRect();
        const isInsideFadeTarget = Boolean(
          fadeRect &&
            mouseEvent.clientX >= fadeRect.left &&
            mouseEvent.clientX <= fadeRect.right &&
            mouseEvent.clientY >= fadeRect.top &&
            mouseEvent.clientY <= fadeRect.bottom
        );
        setIsMuted((current) =>
          current === isInsideFadeTarget ? current : isInsideFadeTarget
        );
      }

      pointerX.set(mouseEvent.clientX);
      pointerY.set(mouseEvent.clientY);
    };

    const handleMouseLeave = () => {
      lastTrailRef.current = null;
      setIsMuted(false);
    };

    const target = containerSelector
      ? document.querySelector(containerSelector)
      : document;
    if (!target) return;

    target.addEventListener("mousemove", handleMouseMove);
    target.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      target.removeEventListener("mousemove", handleMouseMove);
      target.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [pointerX, pointerY, isMobile, containerSelector, fadeSelector]);

  if (isMobile) return null;

  return (
    <motion.div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      animate={{ opacity: isMuted ? 0.16 : 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.2,
        ease: shouldReduceMotion
          ? [0.23, 1, 0.32, 1]
          : [0.77, 0, 0.175, 1],
      }}
    >
      <AnimatePresence>
        {trails.map((t) => (
          <motion.img
            key={t.id}
            src={t.src}
            alt=""
            initial={{
              opacity: 0,
              transform: shouldReduceMotion
                ? "translate3d(-50%, -50%, 0) scale(1)"
                : "translate3d(-50%, -50%, 0) scale(0.92)",
              filter: shouldReduceMotion ? TRAIL_FILTER : "blur(5px) saturate(0.88)",
            }}
            animate={{
              opacity: TRAIL_OPACITY * (0.72 + t.depth * 0.28),
              transform: `translate3d(-50%, -50%, 0) scale(${t.scale})`,
              filter: TRAIL_FILTER,
              transition: shouldReduceMotion
                ? { duration: 0.12, ease: [0.23, 1, 0.32, 1] }
                : {
                    opacity: { duration: 0.16, ease: [0.23, 1, 0.32, 1] },
                    transform: { type: "spring", duration: 0.5, bounce: 0.2 },
                    filter: { duration: 0.18, ease: [0.23, 1, 0.32, 1] },
                  },
            }}
            exit={{
              opacity: 0,
              transform: shouldReduceMotion
                ? "translate3d(-50%, -50%, 0) scale(1)"
                : `translate3d(-50%, -50%, 0) scale(${t.scale * 1.16})`,
              filter: shouldReduceMotion ? TRAIL_FILTER : "blur(8px) saturate(0.8)",
              transition: { duration: shouldReduceMotion ? 0.14 : 0.28, ease: [0.23, 1, 0.32, 1] },
            }}
            className="absolute pointer-events-none select-none rounded-[16px] object-cover"
            style={{
              width: IMAGE_W,
              height: IMAGE_H,
              left: t.x,
              top: t.y,
              zIndex: t.id,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default CursorFollow;
