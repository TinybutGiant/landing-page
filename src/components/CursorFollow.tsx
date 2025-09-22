import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent } from "framer-motion"

interface Trail {
  id: number
  x: number
  y: number
  src: string
  rotate: number
  scale: number
}

interface CursorFollowProps {
  images?: string[];
  containerSelector?: string; // 指定只在特定容器内显示
}

const CursorFollow = ({ 
  images = [], 
  containerSelector = ''
}: CursorFollowProps) => {
  const [trails, setTrails] = useState<Trail[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // 创建 motion values 来跟踪鼠标位置
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  // 你的图片池uploads/avatars，可以放任意数量的图片
  const avatarImages = [
    '/1.jpg',
    '/2.jpg',
    '/3.png',
    '/4.jpg',
    '/5.jpg',
    '/test.jpg' // 添加测试图片
  ];

  const finalImages = images.length > 0 ? images : avatarImages;

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
        window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  // 监听鼠标位置
  useMotionValueEvent(pointerX, "change", (latestX) => {
    if (isMobile) return;
    
    const latestY = pointerY.get()

    const prev = trails[trails.length - 1]
    if (!prev || Math.hypot(latestX - prev.x, latestY - prev.y) > 170) { // 256px * 2/3 ≈ 170px
      const currentImg = finalImages[currentImageIndex]
      
      // 更新索引，使用模运算循环
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % finalImages.length)

      const newTrail = {
        id: Date.now() + Math.random(), // 避免重复
        x: latestX,
        y: latestY,
        src: currentImg,
        rotate: 0, // 不旋转
        scale: 1 // 基础缩放
      }

      setTrails((t) => [...t, newTrail])

      // 1秒后移除这个轨迹（0.7秒保持 + 0.3秒缩小）
      setTimeout(() => {
        setTrails((t) => t.filter(trail => trail.id !== newTrail.id))
      }, 1000)
    }
  })

  // 鼠标移动事件监听
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      // 如果指定了容器选择器，检查鼠标是否在该容器内
      if (containerSelector) {
        const container = document.querySelector(containerSelector);
        if (container) {
          const rect = container.getBoundingClientRect();
          const isInside = mouseEvent.clientX >= rect.left && 
                          mouseEvent.clientX <= rect.right && 
                          mouseEvent.clientY >= rect.top && 
                          mouseEvent.clientY <= rect.bottom;
          if (!isInside) return;
        }
      }
      
      pointerX.set(mouseEvent.clientX)
      pointerY.set(mouseEvent.clientY)
    }

    const targetElement = containerSelector ? document.querySelector(containerSelector) : document;
    if (targetElement) {
      targetElement.addEventListener('mousemove', handleMouseMove)
      return () => targetElement.removeEventListener('mousemove', handleMouseMove)
    }
  }, [pointerX, pointerY, isMobile, containerSelector])

  // 在移动设备上不渲染组件
  if (isMobile) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {trails.map((t) => (
          <motion.img
            key={t.id}
            src={t.src}
            initial={{ opacity: 1, scale: 1.0 }}
            animate={{ 
              opacity: 1, 
              scale: 1.0,
              transition: { 
                duration: 0.7,
                ease: "easeOut"
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.85,
              transition: { 
                duration: 0.3,
                ease: "easeIn"
              }
            }}
            className="absolute pointer-events-none select-none object-cover"
            style={{
              width: '256px', // 9:16 比例，放大8倍：32px * 8 = 256px
              height: '144px', // 放大8倍：18px * 8 = 144px
              left: t.x - 128, // 居中定位：256px / 2 = 128px
              top: t.y - 72, // 居中定位：144px / 2 = 72px
              filter: `
              brightness(1.1)   /* 稍微提亮 */
              contrast(1.05)    /* 对比度提高 */
              saturate(1.2)     /* 稍微提高饱和度 */
              warmth(1.05)      /* 可选，部分浏览器不支持 */
              `,
            }}
            onLoad={() => console.log('图片加载成功:', t.src)}
            onError={(e) => {
              console.error('图片加载失败:', t.src, e);
              // 如果图片加载失败，可以设置一个默认图片
              const target = e.target as HTMLImageElement;
              target.src = '/test.jpg'; // 使用测试图片作为后备
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
};

export default CursorFollow;
