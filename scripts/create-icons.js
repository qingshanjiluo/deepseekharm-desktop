const fs = require('fs');
const path = require('path');

// 创建一个简单的ICO文件（16x16 像素，32位RGBA）
function createICO() {
  const width = 16;
  const height = 16;
  const bpp = 32; // bits per pixel
  
  // ICO文件头
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type: ICO
  icoHeader.writeUInt16LE(1, 4); // Number of images
  
  // 图像条目
  const imageEntry = Buffer.alloc(16);
  imageEntry.writeUInt8(width, 0); // Width
  imageEntry.writeUInt8(height, 1); // Height
  imageEntry.writeUInt8(0, 2); // Color palette
  imageEntry.writeUInt8(0, 3); // Reserved
  imageEntry.writeUInt16LE(1, 4); // Color planes
  imageEntry.writeUInt16LE(bpp, 6); // Bits per pixel
  
  // 图像数据大小 (40字节头 + 宽*高*4字节像素数据 + AND掩码)
  const imageDataSize = 40 + width * height * 4 + Math.ceil(width / 32) * height * 4;
  imageEntry.writeUInt32LE(imageDataSize, 8); // Image data size
  imageEntry.writeUInt32LE(22, 12); // Offset to image data
  
  // BMP信息头
  const bmpHeader = Buffer.alloc(40);
  bmpHeader.writeUInt32LE(40, 0); // Header size
  bmpHeader.writeInt32LE(width, 4); // Width
  bmpHeader.writeInt32LE(height * 2, 8); // Height (doubled for ICO)
  bmpHeader.writeUInt16LE(1, 12); // Planes
  bmpHeader.writeUInt16LE(bpp, 14); // Bits per pixel
  bmpHeader.writeUInt32LE(0, 16); // Compression
  bmpHeader.writeUInt32LE(width * height * 4, 20); // Image size
  bmpHeader.writeInt32LE(3780, 24); // X pixels per meter
  bmpHeader.writeInt32LE(3780, 28); // Y pixels per meter
  bmpHeader.writeUInt32LE(0, 32); // Colors in palette
  bmpHeader.writeUInt32LE(0, 36); // Important colors
  
  // 创建像素数据（蓝色渐变）
  const pixelData = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = Math.floor((x / width) * 100);
      const g = Math.floor((y / height) * 100);
      const b = 200;
      const a = 255;
      
      pixelData.writeUInt8(b, offset);     // Blue
      pixelData.writeUInt8(g, offset + 1); // Green
      pixelData.writeUInt8(r, offset + 2); // Red
      pixelData.writeUInt8(a, offset + 3); // Alpha
    }
  }
  
  // AND掩码（全0表示完全不透明）
  const andMask = Buffer.alloc(Math.ceil(width / 32) * height * 4);
  
  // 组合所有数据
  const icoData = Buffer.concat([
    icoHeader,
    imageEntry,
    bmpHeader,
    pixelData,
    andMask
  ]);
  
  return icoData;
}

// 创建PNG文件（简单的占位图）
function createPNG() {
  // 最小PNG文件（1x1 像素，红色）
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x10, // Width: 16
    0x00, 0x00, 0x00, 0x10, // Height: 16
    0x08, // Bit depth: 8
    0x02, // Color type: RGB
    0x06, // Compression: deflate
    0x00, // Filter: none
    0x00, // Interlace: none
  ]);
  
  // 简化的PNG数据（实际应用中应该使用完整的PNG）
  return pngHeader;
}

// 主函数
function main() {
  const resourcesDir = path.join(__dirname, 'resources');
  
  // 确保resources目录存在
  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
  }
  
  // 创建ICO文件
  const icoData = createICO();
  fs.writeFileSync(path.join(resourcesDir, 'icon.ico'), icoData);
  console.log('Created icon.ico');
  
  // 创建托盘图标（使用同样的数据）
  fs.writeFileSync(path.join(resourcesDir, 'tray-icon.png'), icoData);
  console.log('Created tray-icon.png');
  
  console.log('Icons created successfully!');
}

main();
