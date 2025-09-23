// 使用 Vite 的 import.meta.glob 在构建时获取所有图片
export class ImagePreloader {
  private static instance: ImagePreloader;
  private preloadedImages: string[] = [];
  private isPreloaded = false;

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader();
    }
    return ImagePreloader.instance;
  }

  // 使用 Vite 的 import.meta.glob 获取所有图片
  async preloadImages(): Promise<string[]> {
    if (this.isPreloaded && this.preloadedImages.length > 0) {
      return this.preloadedImages;
    }

    try {
      
      // 仅扫描 src 目录下的资源，避免匹配到 public 中的文件
      const imageModules = import.meta.glob('/src/**/*.{jpg,jpeg,png,webp,gif,svg}', { 
        eager: true,
        query: '?url',
        import: 'default'
      });

      const localImages = Object.values(imageModules) as string[];

      // 读取 public 下的图片清单（由 public/images.json 提供）
      let publicImages: string[] = [];
      try {
        const res = await fetch('/images.json', { cache: 'no-cache' });
        if (res.ok) {
          publicImages = await res.json();
        }
      } catch (_) {
        // 忽略，manifest 不存在时跳过
      }

      // 合并并去重
      const merged = Array.from(new Set([...(localImages || []), ...(publicImages || [])]));
      
      if (merged.length > 0) {
        this.preloadedImages = merged;
        this.isPreloaded = true;
        console.log(`预加载图片合计 ${merged.length} 张（src + public）`);
        return merged;
      }

      // 如果没有找到本地图片，使用默认图片
      const defaultImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      ];

      this.preloadedImages = defaultImages;
      this.isPreloaded = true;
      console.log('使用默认图片');
      return defaultImages;

    } catch (error) {
      console.error('预加载图片时出错:', error);
      // 返回最基本的默认图片
      return [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      ];
    }
  }

  // 获取预加载的图片
  getPreloadedImages(): string[] {
    return [...this.preloadedImages];
  }

  // 清除缓存
  clearCache(): void {
    this.preloadedImages = [];
    this.isPreloaded = false;
  }
}
