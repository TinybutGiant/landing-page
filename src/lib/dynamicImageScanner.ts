// 动态图片扫描器 - 可以扫描 public 文件夹中的所有图片
export class DynamicImageScanner {
  private static instance: DynamicImageScanner;
  private scannedImages: string[] = [];
  private isScanned = false;

  static getInstance(): DynamicImageScanner {
    if (!DynamicImageScanner.instance) {
      DynamicImageScanner.instance = new DynamicImageScanner();
    }
    return DynamicImageScanner.instance;
  }

  // 扫描 public 文件夹中的所有图片
  async scanPublicImages(): Promise<string[]> {
    if (this.isScanned && this.scannedImages.length > 0) {
      return this.scannedImages;
    }

    try {
      const images: string[] = [];
      const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
      
      // 更精确的文件名模式，只检查实际可能存在的文件
      const namePatterns = [
        // 数字模式（只检查1-10）
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        // 常见名称
        'test', 'avatar', 'profile', 'user', 'person',
        'img', 'image', 'photo', 'pic', 'picture'
      ];

      // 检查所有可能的组合
      for (const name of namePatterns) {
        for (const ext of imageExtensions) {
          const imagePath = `/${name}.${ext}`;
          try {
            const response = await fetch(imagePath, { method: 'HEAD' });
            if (response.ok) {
              images.push(imagePath);
              console.log(`Found image: ${imagePath}`);
            }
          } catch (error) {
            // 图片不存在，静默跳过，不输出错误信息
          }
        }
      }

      // 如果找到了本地图片，使用它们
      if (images.length > 0) {
        this.scannedImages = images;
        this.isScanned = true;
        console.log(`Scanned ${images.length} local images`);
        return images;
      }

      // 如果没有找到本地图片，使用高质量的默认图片
      const defaultImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face'
      ];

      this.scannedImages = defaultImages;
      this.isScanned = true;
      console.log('Using default images');
      return defaultImages;

    } catch (error) {
      console.error('Error scanning images:', error);
      // 返回最基本的默认图片
      return [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      ];
    }
  }

  // 手动添加图片
  addImage(imagePath: string): void {
    if (!this.scannedImages.includes(imagePath)) {
      this.scannedImages.push(imagePath);
    }
  }

  // 获取当前扫描的图片
  getScannedImages(): string[] {
    return [...this.scannedImages];
  }

  // 重新扫描
  async rescan(): Promise<string[]> {
    this.scannedImages = [];
    this.isScanned = false;
    return await this.scanPublicImages();
  }

  // 清除缓存
  clearCache(): void {
    this.scannedImages = [];
    this.isScanned = false;
  }
}
