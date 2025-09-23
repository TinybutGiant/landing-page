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
      // 使用 Vite 的 import.meta.glob 在构建时扫描 public 目录下的所有图片
      const imageModules = import.meta.glob('/public/*.{jpg,jpeg,png,webp,gif,svg}', { 
        eager: true,
        query: '?url',
        import: 'default'
      });

      // 获取所有图片路径，移除 /public 前缀
      const localImages = Object.keys(imageModules).map(path => path.replace('/public', ''));
      
      if (localImages.length > 0) {
        this.preloadedImages = localImages;
        this.isPreloaded = true;
        console.log(`使用 Vite glob 找到 ${localImages.length} 张本地图片:`, localImages);
        return localImages;
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
