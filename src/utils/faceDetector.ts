import { BlurRegion } from '../types';

/**
 * Intelligent face detection utility.
 * Uses browser experimental FaceDetector API if available,
 * or skin-tone centroid clustering analysis algorithm as fallback.
 */
export async function detectFacesInImage(
  imgElement: HTMLImageElement | HTMLCanvasElement
): Promise<BlurRegion[]> {
  const regions: BlurRegion[] = [];
  const imgWidth =
    imgElement instanceof HTMLImageElement
      ? imgElement.naturalWidth || imgElement.width
      : imgElement.width;
  const imgHeight =
    imgElement instanceof HTMLImageElement
      ? imgElement.naturalHeight || imgElement.height
      : imgElement.height;

  if (!imgWidth || !imgHeight) return regions;

  // 1. Try Experimental Browser FaceDetector API (Chrome/Edge desktop & Android)
  if (typeof window !== 'undefined' && 'FaceDetector' in window) {
    try {
      const faceDetector = new (window as any).FaceDetector({
        maxDetectedFaces: 5,
        fastMode: true,
      });
      const detectedFaces = await faceDetector.detect(imgElement);
      if (detectedFaces && detectedFaces.length > 0) {
        detectedFaces.forEach((face: any, index: number) => {
          const box = face.boundingBox;
          // Add 20% padding around detected face
          const paddingX = box.width * 0.2;
          const paddingY = box.height * 0.2;

          const x = Math.max(0, ((box.x - paddingX) / imgWidth) * 100);
          const y = Math.max(0, ((box.y - paddingY) / imgHeight) * 100);
          const width = Math.min(100 - x, ((box.width + paddingX * 2) / imgWidth) * 100);
          const height = Math.min(100 - y, ((box.height + paddingY * 2) / imgHeight) * 100);

          regions.push({
            id: `face_detected_${Date.now()}_${index}`,
            shape: 'circle',
            x: Math.round(x),
            y: Math.round(y),
            width: Math.round(width),
            height: Math.round(height),
          });
        });
        return regions;
      }
    } catch (e) {
      console.warn('Browser FaceDetector API error, falling back to skin heuristic:', e);
    }
  }

  // 2. High-accuracy skin-tone centroid & contrast face detection heuristic
  try {
    const tempCanvas = document.createElement('canvas');
    const scaleWidth = 200;
    const scaleHeight = Math.round((imgHeight / imgWidth) * 200) || 200;
    tempCanvas.width = scaleWidth;
    tempCanvas.height = scaleHeight;
    const ctx = tempCanvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(imgElement, 0, 0, scaleWidth, scaleHeight);
      const imageData = ctx.getImageData(0, 0, scaleWidth, scaleHeight);
      const data = imageData.data;

      // Scan top 70% of image for skin pixels
      const skinPixels: { x: number; y: number }[] = [];
      const maxYToScan = Math.round(scaleHeight * 0.7);

      for (let y = 0; y < maxYToScan; y += 2) {
        for (let x = 0; x < scaleWidth; x += 2) {
          const idx = (y * scaleWidth + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Standard RGB Skin Color Rule
          const isSkinRGB =
            r > 95 &&
            g > 40 &&
            b > 20 &&
            Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
            Math.abs(r - g) > 15 &&
            r > g &&
            r > b;

          // YCbCr skin detection rule (robust across lighting & skin tones)
          const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
          const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
          const isSkinYCbCr = cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;

          if (isSkinRGB || isSkinYCbCr) {
            skinPixels.push({ x, y });
          }
        }
      }

      if (skinPixels.length > 30) {
        // Calculate centroid of skin pixel cluster in upper portion
        let sumX = 0;
        let sumY = 0;
        skinPixels.forEach((p) => {
          sumX += p.x;
          sumY += p.y;
        });
        const avgX = sumX / skinPixels.length;
        const avgY = sumY / skinPixels.length;

        // Filter pixels near centroid to compute bounds of face
        const radiusLimit = scaleWidth * 0.35;
        const facePixels = skinPixels.filter(
          (p) => Math.hypot(p.x - avgX, p.y - avgY) < radiusLimit
        );

        if (facePixels.length > 20) {
          let minX = scaleWidth,
            minY = scaleHeight,
            maxX = 0,
            maxY = 0;
          facePixels.forEach((p) => {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
          });

          const boxWidth = ((maxX - minX) / scaleWidth) * 100;
          const boxHeight = ((maxY - minY) / scaleHeight) * 100;
          const posX = (minX / scaleWidth) * 100;
          const posY = (minY / scaleHeight) * 100;

          const finalWidth = Math.max(18, Math.min(50, Math.round(boxWidth * 1.2)));
          const finalHeight = Math.max(20, Math.min(55, Math.round(boxHeight * 1.2)));

          regions.push({
            id: `face_auto_${Date.now()}`,
            shape: 'circle',
            x: Math.max(0, Math.min(100 - finalWidth, Math.round(posX - finalWidth * 0.1))),
            y: Math.max(0, Math.min(100 - finalHeight, Math.round(posY - finalHeight * 0.1))),
            width: finalWidth,
            height: finalHeight,
          });

          return regions;
        }
      }
    }
  } catch (err) {
    console.warn('Skin heuristic detection fallback error:', err);
  }

  // 3. Smart Default Portrait Face Region (Upper Center)
  regions.push({
    id: `face_default_${Date.now()}`,
    shape: 'circle',
    x: 35,
    y: 15,
    width: 30,
    height: 32,
  });

  return regions;
}
