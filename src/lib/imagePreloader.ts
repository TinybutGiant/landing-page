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
      
      // 只用本站的图片；一张都没有时返回空列表，不再用第三方图床兜底（隐私政策第 14 节）。
      this.preloadedImages = merged;
      this.isPreloaded = merged.length > 0;
      return merged;
    } catch (error) {
      console.error('预加载图片时出错:', error);
      return [];
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
