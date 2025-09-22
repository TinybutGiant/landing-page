// 动态图片加载器
export class ImageLoader {
  private static instance: ImageLoader;
  private cachedImages: string[] = [];
  private isLoaded = false;

  static getInstance(): ImageLoader {
    if (!ImageLoader.instance) {
      ImageLoader.instance = new ImageLoader();
    }
    return ImageLoader.instance;
  }

  async loadImages(): Promise<string[]> {
    if (this.isLoaded && this.cachedImages.length > 0) {
      return this.cachedImages;
    }

    try {
      const images: string[] = [];
      const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      
      // 常见的图片文件名模式
      const commonNames = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        'test', 'avatar', 'profile', 'user', 'person',
        'img', 'image', 'photo', 'pic', 'picture'
      ];

      // 检查所有可能的组合
      for (const name of commonNames) {
        for (const ext of imageExtensions) {
          const imagePath = `/${name}.${ext}`;
          try {
            const response = await fetch(imagePath, { method: 'HEAD' });
            if (response.ok) {
              images.push(imagePath);
            }
          } catch (error) {
            // 图片不存在，继续检查下一个
          }
        }
      }

      // 如果找到了本地图片，使用它们
      if (images.length > 0) {
        this.cachedImages = images;
        this.isLoaded = true;
        return images;
      }

      // 如果没有找到本地图片，使用默认的在线图片
      const defaultImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      ];

      this.cachedImages = defaultImages;
      this.isLoaded = true;
      return defaultImages;

    } catch (error) {
      console.error('Error loading images:', error);
      // 返回最基本的默认图片
      return [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      ];
    }
  }

  // 添加新图片到缓存
  addImage(imagePath: string): void {
    if (!this.cachedImages.includes(imagePath)) {
      this.cachedImages.push(imagePath);
    }
  }

  // 获取当前缓存的图片
  getCachedImages(): string[] {
    return [...this.cachedImages];
  }

  // 清除缓存
  clearCache(): void {
    this.cachedImages = [];
    this.isLoaded = false;
  }
}
