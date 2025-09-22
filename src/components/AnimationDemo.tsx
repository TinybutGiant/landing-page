import { motion } from "framer-motion";

const AnimationDemo = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
        whileHover={{ scale: 1.05, y: -2 }}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          🎨 交互动效演示
        </h3>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>✨ 滚动视差效果</div>
          <div>🎯 悬停缩放动画</div>
          <div>🌈 渐变淡入淡出</div>
          <div>💫 流畅页面过渡</div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimationDemo;
