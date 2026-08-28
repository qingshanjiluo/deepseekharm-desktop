const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_PATH = path.join(__dirname, '..', '..', 'deepseek-harness', 'apps', 'web', 'public', 'favicon.svg');
const OUTPUT_DIR = path.join(__dirname, '..', 'resources', 'icons');
const SIZES = [16, 32, 48, 64, 128, 256];

async function generatePNGs(svgBuffer) {
  const pngPaths = [];
  for (const size of SIZES) {
    const outPath = path.join(OUTPUT_DIR, `favicon-${size}x${size}.png`);
    await sharp(svgBuffer).resize(size, size).png().toFile(outPath);
    pngPaths.push(outPath);
    console.log(`Generated: ${outPath}`);
  }
  return pngPaths;
}

function createICO(pngBuffers, sizes) {
  const numImages = pngBuffers.length;
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);       // reserved
  header.writeUInt16LE(1, 2);       // type = ICO
  header.writeUInt16LE(numImages, 4); // image count

  // Calculate offsets
  const dirSize = 16 * numImages;
  let dataOffset = 6 + dirSize;

  const dirEntries = [];
  const imageData = [];

  for (let i = 0; i < numImages; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];

    // ICO directory entry (16 bytes)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size < 256 ? size : 0, 0);  // width (0 = 256)
    entry.writeUInt8(size < 256 ? size : 0, 1);  // height (0 = 256)
    entry.writeUInt8(0, 2);                       // color palette
    entry.writeUInt8(0, 3);                       // reserved
    entry.writeUInt16LE(1, 4);                    // color planes
    entry.writeUInt16LE(32, 6);                   // bits per pixel
    entry.writeUInt32LE(buf.length, 8);           // data size
    entry.writeUInt32LE(dataOffset, 12);          // data offset

    dirEntries.push(entry);
    imageData.push(buf);
    dataOffset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageData]);
}

function createGlowSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 50 50" fill="none">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feFlood flood-color="#4D6BFE" flood-opacity="0.7" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="shadow"/>
      <feMerge>
        <feMergeNode in="shadow"/>
        <feMergeNode in="shadow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g filter="url(#glow)">
    <path d="M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 11.5317 35.8076C9.45679 34.1477 7.47583 31.8838 6.35596 28.1597C5.34813 24.7676 5.29297 20.6081 6.09668 17.0156C6.33768 15.9438 6.66309 14.9077 7.06519 13.9277C7.37158 13.1758 7.74072 12.4558 8.16162 11.7837C8.42361 11.3677 8.71765 10.9756 9.03955 10.6157C9.82568 9.74365 10.7637 9.05591 11.8091 8.58398C13.3227 7.896 14.9912 7.60791 16.6377 7.67188C18.3482 7.73584 20.0247 8.22391 21.4368 9.12793C22.5288 9.82373 23.4739 10.7197 24.1973 11.7676C25.6859 13.9116 26.7048 14.8477 29.2402 17.2878C30.6523 18.6558 32.2456 19.8878 34.0005 20.896C35.7554 21.9038 37.6694 22.6238 39.6851 23.0398C41.7007 23.4558 43.7942 23.5678 45.8767 23.3757C47.2808 23.2477 48.6609 22.9038 49.9609 22.3599C49.9609 22.3599 49.7695 24.6238 48.9033 27.0159C47.958 29.6238 46.2817 31.8157 43.8999 33.5837C41.5181 35.3518 39.1543 36.4717 36.4404 37.1035C33.7265 37.7354 30.9185 37.8634 28.1367 37.4878C26.8487 37.3118 25.5767 37.0078 24.3262 37.8398Z" fill="#4D6BFE"/>
  </g>
</svg>`;
}

async function generateGlowEffect() {
  const glowSvg = createGlowSVG();
  const glowSizes = [16, 32, 48, 64, 128, 256];
  const glowPngBuffers = [];
  
  for (const size of glowSizes) {
    const outPath = path.join(OUTPUT_DIR, `favicon-glow-${size}x${size}.png`);
    const buf = await sharp(Buffer.from(glowSvg)).resize(size, size).png().toBuffer();
    await fs.promises.writeFile(outPath, buf);
    glowPngBuffers.push(buf);
    console.log(`Generated glow: ${outPath}`);
  }
  
  const icoPath = path.join(OUTPUT_DIR, 'favicon-glow.ico');
  const icoBuffer = createICO(glowPngBuffers, glowSizes);
  await fs.promises.writeFile(icoPath, icoBuffer);
  console.log(`Generated glow ICO: ${icoPath}`);
}

async function main() {
  console.log('Reading SVG from:', SVG_PATH);
  const svgBuffer = await fs.promises.readFile(SVG_PATH);
  
  console.log('Generating standard PNGs...');
  const pngBuffers = [];
  for (const size of SIZES) {
    const outPath = path.join(OUTPUT_DIR, `favicon-${size}x${size}.png`);
    const buf = await sharp(svgBuffer).resize(size, size).png().toBuffer();
    await fs.promises.writeFile(outPath, buf);
    pngBuffers.push(buf);
    console.log(`Generated: ${outPath}`);
  }
  
  console.log('Generating ICO...');
  const icoPath = path.join(OUTPUT_DIR, 'favicon.ico');
  const icoBuffer = createICO(pngBuffers, SIZES);
  await fs.promises.writeFile(icoPath, icoBuffer);
  console.log(`Generated ICO: ${icoPath}`);
  
  console.log('Generating glow effect versions...');
  await generateGlowEffect();
  
  console.log('Done!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
