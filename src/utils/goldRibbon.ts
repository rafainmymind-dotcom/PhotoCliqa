/**
 * Helper to render high quality metallic gold ribbons / bandagens douradas on HTML5 Canvas.
 */

export function safeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | number[] = 0
) {
  if (typeof ctx.roundRect === 'function') {
    try {
      ctx.roundRect(x, y, w, h, r);
      return;
    } catch {
      // Fall back if array parameters aren't supported in old browser
    }
  }

  let tr = 0, br = 0, bl = 0, tl = 0;
  if (typeof r === 'number') {
    tr = br = bl = tl = Math.max(0, Math.min(r, w / 2, h / 2));
  } else if (Array.isArray(r)) {
    if (r.length === 1) tr = br = bl = tl = Math.max(0, Math.min(r[0], w / 2, h / 2));
    else if (r.length === 2) {
      tl = br = Math.max(0, Math.min(r[0], w / 2, h / 2));
      tr = bl = Math.max(0, Math.min(r[1], w / 2, h / 2));
    } else if (r.length >= 4) {
      tl = Math.max(0, Math.min(r[0], w / 2, h / 2));
      tr = Math.max(0, Math.min(r[1], w / 2, h / 2));
      br = Math.max(0, Math.min(r[2], w / 2, h / 2));
      bl = Math.max(0, Math.min(r[3], w / 2, h / 2));
    }
  }

  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  if (tr > 0) ctx.arcTo(x + w, y, x + w, y + tr, tr);
  ctx.lineTo(x + w, y + h - br);
  if (br > 0) ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h);
  if (bl > 0) ctx.arcTo(x, y + h, x, y + h - bl, bl);
  ctx.lineTo(x, y + tl);
  if (tl > 0) ctx.arcTo(x, y, x + tl, y, tl);
  ctx.closePath();
}

export function drawGoldRibbon(
  ctx: CanvasRenderingContext2D,
  x: number, // center X
  y: number, // center Y
  width: number,
  height: number,
  opacity: number = 0.9,
  style: 'classic_gold' | 'shiny_gold' | 'rose_gold' = 'shiny_gold'
) {
  ctx.save();
  ctx.globalAlpha = opacity;

  const left = x - width / 2;
  const top = y - height / 2;
  const radius = Math.min(height / 3, 8);

  // Outer drop shadow for depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  // Banner background gradient
  const bgGrad = ctx.createLinearGradient(left, top, left + width, top + height);

  if (style === 'rose_gold') {
    bgGrad.addColorStop(0, '#B76E79');
    bgGrad.addColorStop(0.25, '#FFD1DC');
    bgGrad.addColorStop(0.5, '#E8C5C8');
    bgGrad.addColorStop(0.75, '#C97A85');
    bgGrad.addColorStop(1, '#A0525D');
  } else if (style === 'classic_gold') {
    bgGrad.addColorStop(0, '#B38728');
    bgGrad.addColorStop(0.3, '#FBF5B7');
    bgGrad.addColorStop(0.5, '#DAA520');
    bgGrad.addColorStop(0.8, '#FCF6BA');
    bgGrad.addColorStop(1, '#AA771C');
  } else {
    // shiny_gold
    bgGrad.addColorStop(0, '#9A7023');
    bgGrad.addColorStop(0.2, '#E8D082');
    bgGrad.addColorStop(0.4, '#FFF8DC');
    bgGrad.addColorStop(0.6, '#C59B27');
    bgGrad.addColorStop(0.8, '#FFF1AD');
    bgGrad.addColorStop(1, '#8A5D18');
  }

  ctx.fillStyle = bgGrad;

  // Draw rounded banner box with swallowtail ribbon accents or clean gold plaque
  ctx.beginPath();
  safeRoundRect(ctx, left, top, width, height, radius);
  ctx.fill();

  // Draw inner golden foil border
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  const strokeGrad = ctx.createLinearGradient(left, top, left + width, top);
  strokeGrad.addColorStop(0, '#FFFFFF');
  strokeGrad.addColorStop(0.3, '#FFE89C');
  strokeGrad.addColorStop(0.7, '#D4AF37');
  strokeGrad.addColorStop(1, '#FFF5CC');

  ctx.strokeStyle = strokeGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  safeRoundRect(ctx, left + 2, top + 2, width - 4, height - 4, Math.max(0, radius - 2));
  ctx.stroke();

  // Top highlight sheen
  const sheenGrad = ctx.createLinearGradient(left, top, left, top + height / 2);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  safeRoundRect(ctx, left + 3, top + 3, width - 6, (height - 6) / 2, [radius - 2, radius - 2, 0, 0]);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws metallic gold dot separator (ponto dourado) for Info text
 */
export function drawGoldDot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number = 6
) {
  ctx.save();
  ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
  ctx.shadowBlur = 6;

  const grad = ctx.createRadialGradient(cx - size / 4, cy - size / 4, 1, cx, cy, size);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.3, '#FFF3A8');
  grad.addColorStop(0.7, '#D4AF37');
  grad.addColorStop(1, '#8A620D');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
