import { AspectDimension, EditConfig, ModelData } from '../types';
import { drawGoldDot, drawGoldRibbon, safeRoundRect } from './goldRibbon';
import { formatProfileInfo } from './formatters';
import { DEFAULT_SAMPLE_PORTRAIT } from './defaults';

async function ensureImageLoaded(img: HTMLImageElement): Promise<HTMLImageElement> {
  if (img.complete && img.naturalWidth > 0) {
    return img;
  }
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve(img);
      return;
    }
    const onLoad = () => resolve(img);
    const onError = () => {
      const fallback = new Image();
      fallback.onload = () => resolve(fallback);
      fallback.onerror = () => resolve(fallback);
      fallback.src = DEFAULT_SAMPLE_PORTRAIT;
    };
    img.addEventListener('load', onLoad, { once: true });
    img.addEventListener('error', onError, { once: true });
    setTimeout(() => {
      if (img.naturalWidth > 0) resolve(img);
      else onError();
    }, 1200);
  });
}

export function getCanvasDimensions(
  dimension: AspectDimension,
  origWidth: number,
  origHeight: number
): { width: number; height: number } {
  switch (dimension) {
    case '1080x1080':
      return { width: 1080, height: 1080 };
    case '385x530':
    case '350x550':
      return { width: 385, height: 530 };
    case '1067x1600':
      return { width: 1067, height: 1600 };
    case 'original':
    default:
      return { width: origWidth || 1080, height: origHeight || 1080 };
  }
}

/**
 * Main exportable renderer function that processes an HTMLImageElement with EditConfig
 * and returns a promise resolving to a HTMLCanvasElement.
 */
export async function renderImageToCanvas(
  img: HTMLImageElement,
  config: EditConfig,
  logoImg?: HTMLImageElement | null,
  modelData?: ModelData
): Promise<HTMLCanvasElement> {
  const readyImg = await ensureImageLoaded(img);
  const naturalW = readyImg.naturalWidth || readyImg.width || 1080;
  const naturalH = readyImg.naturalHeight || readyImg.height || 1080;

  const { width: targetWidth, height: targetHeight } = getCanvasDimensions(
    config.dimension,
    naturalW,
    naturalH
  );

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Draw base image cropped/fitted to target aspect ratio with imageTransform (scale, offsetX, offsetY)
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const imgAspect = naturalW / naturalH;
  const targetAspect = targetWidth / targetHeight;

  let baseWidth = naturalW;
  let baseHeight = naturalH;

  if (imgAspect > targetAspect) {
    baseWidth = naturalH * targetAspect;
  } else {
    baseHeight = naturalW / targetAspect;
  }

  const transform = config.imageTransform || {
    scale: 100,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  };
  const scale = Math.max(0.3, Math.min(3.0, (transform.scale || 100) / 100));

  const sWidth = baseWidth / scale;
  const sHeight = baseHeight / scale;

  const defaultSx = (naturalW - baseWidth) / 2;
  const defaultSy = (naturalH - baseHeight) / 2;

  const shiftX = (baseWidth - sWidth) / 2 - ((transform.offsetX || 0) / 100) * baseWidth;
  const shiftY = (baseHeight - sHeight) / 2 - ((transform.offsetY || 0) / 100) * baseHeight;

  const sx = defaultSx + shiftX;
  const sy = defaultSy + shiftY;

  // Fill dark canvas background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  if (config.filters) {
    const b = config.filters.brightness ?? 100;
    const c = config.filters.contrast ?? 100;
    const s = config.filters.saturation ?? 100;
    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
  }

  // Draw base image centered with rotation and flipping (horizontal/vertical)
  ctx.save();
  ctx.translate(targetWidth / 2, targetHeight / 2);

  const rotation = transform.rotation || 0;
  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  const flipH = transform.flipHorizontal ? -1 : 1;
  const flipV = transform.flipVertical ? -1 : 1;
  if (flipH !== 1 || flipV !== 1) {
    ctx.scale(flipH, flipV);
  }

  try {
    ctx.drawImage(
      readyImg,
      sx,
      sy,
      sWidth,
      sHeight,
      -targetWidth / 2,
      -targetHeight / 2,
      targetWidth,
      targetHeight
    );
  } catch (err) {
    console.warn('Could not draw base image to canvas, using studio fallback background', err);
  }
  ctx.restore();
  ctx.filter = 'none';

  // Apply Vignette if enabled
  if (config.filters && config.filters.vignette > 0) {
    const vig = config.filters.vignette / 100;
    const grad = ctx.createRadialGradient(
      targetWidth / 2,
      targetHeight / 2,
      Math.min(targetWidth, targetHeight) * 0.35,
      targetWidth / 2,
      targetHeight / 2,
      Math.max(targetWidth, targetHeight) * 0.75
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, `rgba(0,0,0,${vig * 0.85})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Apply Fundo Preto Degradê Inferior (Dark Bottom Base Gradient) if enabled or density > 0
  if (
    config.filters?.fundoPretoInferiorAtivo ||
    (config.filters?.fundoPretoInferiorDensidade && config.filters.fundoPretoInferiorDensidade > 0)
  ) {
    const density = Math.max(0, Math.min(100, config.filters?.fundoPretoInferiorDensidade ?? 65)) / 100;
    const gradHeightPercent = Math.max(10, Math.min(100, config.filters?.fundoPretoInferiorAltura ?? 45)) / 100;
    const gradHeight = targetHeight * gradHeightPercent;
    const startY = targetHeight - gradHeight;

    const bottomGrad = ctx.createLinearGradient(0, startY, 0, targetHeight);
    bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    bottomGrad.addColorStop(0.35, `rgba(0, 0, 0, ${density * 0.35})`);
    bottomGrad.addColorStop(0.7, `rgba(0, 0, 0, ${density * 0.75})`);
    bottomGrad.addColorStop(1, `rgba(0, 0, 0, ${density})`);

    ctx.save();
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, startY, targetWidth, gradHeight);
    ctx.restore();
  }

  // 2. Apply Magic Eraser
  if (config.magicEraser.active && config.magicEraser.strokes.length > 0) {
    applyMagicEraserStrokes(ctx, config.magicEraser.strokes, targetWidth, targetHeight);
  }

  // 3. Apply Pixelate / Blur
  if (config.pixelateBlur.active) {
    applyPixelateBlur(
      ctx,
      canvas,
      config.pixelateBlur,
      targetWidth,
      targetHeight
    );
  }

  // 4. Apply Faixa Preta (Black Strip)
  if (config.blackStrip.active) {
    const stripHeight = Math.max(50, Math.round(targetHeight * 0.08));
    const stripY =
      config.blackStrip.position === 'top' ? 0 : targetHeight - stripHeight;

    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${config.blackStrip.opacity || 0.5})`;
    ctx.fillRect(0, stripY, targetWidth, stripHeight);

    const stripText = modelData?.nome || config.blackStrip.text;
    if (stripText) {
      ctx.fillStyle = '#FFFFFF';
      const fontSize = Math.max(14, Math.round(stripHeight * 0.4));
      ctx.font = `600 ${fontSize}px "${config.blackStrip.fontFamily || 'Gilda Display'}", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        stripText.toUpperCase(),
        targetWidth / 2,
        stripY + stripHeight / 2
      );
    }
    ctx.restore();
  }

  // 5. Render Structured Profile Card (Rule 1 to 11)
  if (config.profileCard?.active !== false) {
    renderProfileCard(ctx, modelData, config, targetWidth, targetHeight);
  } else {
    // Legacy fallbacks if profileCard is explicitly deactivated
    if (config.nameOverlay.active && config.nameOverlay.text) {
      renderTextWithOptionalGoldBand(
        ctx,
        modelData?.nome || config.nameOverlay.text,
        config.nameOverlay.fontSize,
        config.nameOverlay.fontFamily,
        config.nameOverlay.textColor || '#FFFFFF',
        config.nameOverlay.positionX,
        config.nameOverlay.positionY,
        config.nameOverlay.goldBand,
        targetWidth,
        targetHeight
      );
    }

    if (config.highlightOverlay.active && config.highlightOverlay.text) {
      renderTextWithOptionalGoldBand(
        ctx,
        config.highlightOverlay.text,
        config.highlightOverlay.fontSize,
        config.highlightOverlay.fontFamily,
        config.highlightOverlay.textColor || '#FFFFFF',
        config.highlightOverlay.positionX,
        config.highlightOverlay.positionY,
        config.highlightOverlay.goldBand,
        targetWidth,
        targetHeight
      );
    }

    if (config.infoOverlay.active) {
      renderInfoOverlay(
        ctx,
        config.infoOverlay,
        targetWidth,
        targetHeight
      );
    }
  }

  // 6. Apply Bottom Name Band (Faixa inferior com nome - 100% width, bottom 0)
  if (config.bottomNameBand?.enabled) {
    renderBottomNameBand(ctx, modelData, config, targetWidth, targetHeight);
  }

  // 7. Apply Logo Overlay
  if (config.logoOverlay.active && logoImg) {
    renderLogo(ctx, logoImg, config.logoOverlay, targetWidth, targetHeight);
  }

  return canvas;
}

/**
 * Helper to draw text with cross-browser letter-spacing support.
 */
function drawLetterSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  letterSpacing: number,
  textAlign: 'center' | 'left' | 'right' = 'center'
) {
  if (!letterSpacing || letterSpacing <= 0) {
    ctx.textAlign = textAlign;
    ctx.fillText(text, centerX, centerY);
    return;
  }

  const chars = Array.from(text);
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const totalWidth = widths.reduce((acc, w) => acc + w, 0) + (chars.length - 1) * letterSpacing;

  let startX = centerX - totalWidth / 2;
  if (textAlign === 'left') startX = centerX;
  else if (textAlign === 'right') startX = centerX - totalWidth;

  ctx.textAlign = 'left';
  let currentX = startX;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], currentX, centerY);
    currentX += widths[i] + letterSpacing;
  }
}

/**
 * Renders the full-width Bottom Name Band (Faixa inferior com nome)
 */
function renderBottomNameBand(
  ctx: CanvasRenderingContext2D,
  modelData: ModelData | undefined,
  config: EditConfig,
  canvasWidth: number,
  canvasHeight: number
) {
  const bandCfg = config.bottomNameBand;
  if (!bandCfg || !bandCfg.enabled) return;

  const rawName = modelData?.nome || config.nameOverlay?.text || '';
  const uppercaseName = rawName.trim().toUpperCase();

  const heightScale = canvasHeight / 1080;
  const widthScale = canvasWidth / 1080;

  const bandHeight = Math.max(18, Math.round((bandCfg.height ?? 58) * heightScale));
  const bandY = canvasHeight - bandHeight;

  // 1. Draw horizontal background band across entire image width (bottom: 0, width: 100%)
  ctx.save();
  const opacity = Math.max(0, Math.min(100, bandCfg.backgroundOpacity ?? 78)) / 100;
  ctx.globalAlpha = opacity;
  ctx.fillStyle = bandCfg.backgroundColor || '#000000';
  ctx.fillRect(0, bandY, canvasWidth, bandHeight);
  ctx.restore();

  // 2. Draw centered uppercase name inside the band
  if (uppercaseName) {
    ctx.save();
    const fontSize = Math.max(
      11,
      Math.round((bandCfg.fontSize ?? 26) * Math.min(heightScale, widthScale * 1.15))
    );
    const fontWeight = bandCfg.fontWeight || '700';
    const fontFamily = bandCfg.fontFamily || 'Montserrat';
    const letterSpacing = Math.max(0, Math.round((bandCfg.letterSpacing ?? 4) * widthScale));

    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
    ctx.fillStyle = bandCfg.textColor || '#FFFFFF';
    ctx.textBaseline = 'middle';

    let textY = bandY + bandHeight / 2;
    if (bandCfg.verticalAlign === 'top') {
      textY = bandY + bandHeight * 0.32;
    } else if (bandCfg.verticalAlign === 'bottom') {
      textY = bandY + bandHeight * 0.68;
    }

    if (bandCfg.offsetY) {
      textY += (bandCfg.offsetY / 100) * bandHeight;
    }

    let textX = canvasWidth / 2;
    if (bandCfg.offsetX) {
      textX += (bandCfg.offsetX / 100) * canvasWidth;
    }

    // High legibility subtle shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;

    drawLetterSpacedText(ctx, uppercaseName, textX, textY, letterSpacing, 'center');
    ctx.restore();
  }
}

/**
 * Render Profile Card adhering strictly to all user rules:
 * Rule 1: Name highlighted, white serif font (#FFFFFF), large size.
 * Rule 2 & 3 & 4 & 5: Below name, age, height, weight on same line separated by golden dots (#D4AF37). Units: "anos", "m", "kg" (never "k").
 * Rule 6 & 11: Grouped with safe margins, customizable position (bottom right default, or any corner/center/free X-Y).
 * Rule 7 & 8 & 9: Novidade tag centered over golden gradient horizontal strip BELOW info line. Never overlaps name or info.
 */
function renderProfileCard(
  ctx: CanvasRenderingContext2D,
  modelData: ModelData | undefined,
  config: EditConfig,
  canvasWidth: number,
  canvasHeight: number
) {
  const card = config.profileCard;

  const nome = modelData?.nome ?? config.nameOverlay?.text ?? 'Valentina';
  const rawIdade = modelData?.idade ?? config.infoOverlay?.idade ?? 29;
  const rawAltura = modelData?.altura ?? config.infoOverlay?.altura ?? '1,69';
  const rawPeso = modelData?.peso ?? config.infoOverlay?.peso ?? 66;

  const formatted = formatProfileInfo(
    nome,
    rawIdade,
    rawAltura,
    rawPeso,
    undefined,
    undefined,
    {
      idadeFormato: card?.infoIdadeFormato,
      alturaFormato: card?.infoAlturaFormato,
      pesoFormato: card?.infoPesoFormato,
      separadorSimbolo: card?.infoSeparadorSimbolo,
    }
  );

  const tagActive = modelData?.novidade ?? modelData?.etiquetaAtiva ?? card?.etiquetaAtiva ?? true;
  const tagTextRaw = modelData?.texto_novidade || modelData?.etiquetaTexto || card?.etiquetaTexto || 'NOVIDADE';
  const tagText = (card?.etiquetaCaixaAlta ?? true) ? tagTextRaw.toUpperCase() : tagTextRaw;

  // Position & Alignment Math
  const posPreset = card?.position || 'bottom_right';
  let anchorX = canvasWidth * 0.92;
  let anchorY = tagActive ? canvasHeight * 0.77 : canvasHeight * 0.83;
  let align: CanvasTextAlign = card?.align || 'right';

  if (posPreset === 'bottom_right') {
    anchorX = canvasWidth * 0.92;
    anchorY = tagActive ? canvasHeight * 0.77 : canvasHeight * 0.83;
    if (!card?.align) align = 'right';
  } else if (posPreset === 'bottom_left') {
    anchorX = canvasWidth * 0.08;
    anchorY = tagActive ? canvasHeight * 0.77 : canvasHeight * 0.83;
    if (!card?.align) align = 'left';
  } else if (posPreset === 'top_right') {
    anchorX = canvasWidth * 0.92;
    anchorY = canvasHeight * 0.08;
    if (!card?.align) align = 'right';
  } else if (posPreset === 'top_left') {
    anchorX = canvasWidth * 0.08;
    anchorY = canvasHeight * 0.08;
    if (!card?.align) align = 'left';
  } else if (posPreset === 'bottom_center') {
    anchorX = canvasWidth * 0.5;
    anchorY = tagActive ? canvasHeight * 0.77 : canvasHeight * 0.83;
    if (!card?.align) align = 'center';
  } else if (posPreset === 'top_center') {
    anchorX = canvasWidth * 0.5;
    anchorY = canvasHeight * 0.08;
    if (!card?.align) align = 'center';
  } else if (posPreset === 'center') {
    anchorX = canvasWidth * 0.5;
    anchorY = canvasHeight * 0.44;
    if (!card?.align) align = 'center';
  } else if (posPreset === 'custom') {
    anchorX = ((card?.customX ?? 85) / 100) * canvasWidth;
    anchorY = ((card?.customY ?? 85) / 100) * canvasHeight;
    if (!card?.align) {
      align = anchorX > canvasWidth * 0.6 ? 'right' : anchorX < canvasWidth * 0.4 ? 'left' : 'center';
    }
  }

  ctx.save();

  // Scaled Font Sizes & Metrics
  let nameFontSize = Math.max(20, Math.round(((card?.nomeTamanho || 34) / 1000) * canvasWidth * 1.15));
  let infoFontSize = Math.max(12, Math.round(((card?.infoTamanho || 18) / 1000) * canvasWidth * 1.05));

  const nameFontFamily = card?.nomeFonte || 'Gilda Display';
  const infoFontFamily = card?.infoFonte || 'Montserrat';
  const nameColor = card?.nomeCor || '#FFFFFF';
  const infoColor = card?.infoCorTexto || '#FFFFFF';
  const goldSeparatorColor = card?.infoCorSeparadores || '#d4af37';

  // 1. Measure and Auto-Scale Name if too wide (never overflow canvas)
  ctx.font = `700 ${nameFontSize}px "${nameFontFamily}", serif`;
  let measuredNameWidth = ctx.measureText(formatted.nome).width;
  const maxAllowedNameWidth = canvasWidth * 0.78;

  if (measuredNameWidth > maxAllowedNameWidth && formatted.nome.length > 0) {
    const scaleRatio = maxAllowedNameWidth / measuredNameWidth;
    nameFontSize = Math.max(18, Math.round(nameFontSize * Math.max(0.7, scaleRatio)));
    ctx.font = `700 ${nameFontSize}px "${nameFontFamily}", serif`;
    measuredNameWidth = ctx.measureText(formatted.nome).width;
  }

  // Calculate Info Line Width & Metrics
  let infoLineWidth = 0;
  let partWidths: number[] = [];
  
  const sepSymbol = card?.infoSeparadorSimbolo !== undefined ? card.infoSeparadorSimbolo : '';
  const hasExplicitSeparator = sepSymbol.trim().length > 0;
  let sepSpacing = Math.max(4, Math.round(((card?.infoEspacamento ?? 12) / 1000) * canvasWidth));
  const sepScale = (card?.infoSeparadorTamanho ?? 100) / 100;
  const isCircleBullet = sepSymbol === '•' || sepSymbol === '·';
  let dotRadius = Math.max(2, (infoFontSize * 0.13) * sepScale);
  let separatorWidth = hasExplicitSeparator ? (isCircleBullet ? (dotRadius * 2) : 0) : 0;

  const measureInfo = () => {
    infoLineWidth = 0;
    partWidths = [];
    ctx.font = `600 ${infoFontSize}px "${infoFontFamily}", sans-serif`;
    dotRadius = Math.max(2, (infoFontSize * 0.13) * sepScale);
    ctx.font = `700 ${Math.round(infoFontSize * sepScale)}px "${infoFontFamily}", sans-serif`;
    if (hasExplicitSeparator) {
      separatorWidth = isCircleBullet ? (dotRadius * 2) : Math.max(4, ctx.measureText(sepSymbol).width);
    } else {
      separatorWidth = 0;
    }
    ctx.font = `600 ${infoFontSize}px "${infoFontFamily}", sans-serif`;

    if (formatted.parts.length > 0) {
      formatted.parts.forEach((p, idx) => {
        const w = ctx.measureText(p).width;
        partWidths.push(w);
        infoLineWidth += w;
        if (idx < formatted.parts.length - 1) {
          infoLineWidth += hasExplicitSeparator ? (sepSpacing * 2 + separatorWidth) : sepSpacing;
        }
      });
    }
  };

  measureInfo();

  // Auto-scale info font if exceeds available width
  if (infoLineWidth > canvasWidth * 0.85 && formatted.parts.length > 0) {
    const ratio = (canvasWidth * 0.85) / infoLineWidth;
    infoFontSize = Math.max(10, Math.round(infoFontSize * ratio));
    measureInfo();
  }

  // Calculate Novidade Badge Size
  const tagFontSize = Math.max(10, Math.round(infoFontSize * 0.82));
  ctx.font = `700 ${tagFontSize}px "${nameFontFamily}", serif`;
  const tagTextWidth = ctx.measureText(tagText).width;
  const tagHeight = Math.round(tagFontSize * 2.1);
  const tagPaddingH = Math.max(16, Math.round(tagHeight * 0.75));
  const tagBandWidth = tagTextWidth + tagPaddingH * 2;

  // -------------------------------------------------------------
  // PRE-CALCULATE EXACT POSITIONS TO ANCHOR SHADOW TO INFORMATION
  // -------------------------------------------------------------
  let cursorY = anchorY;

  const effectiveNameAlign = card?.nomeAlign || align;
  const effectiveInfoAlign = card?.infoAlign || align;
  const effectiveFaixaAlign = card?.faixaAlign || align;

  // Name Position Calculation
  let drawNameAnchorX = anchorX;
  if (card?.nomeAlign === 'center' && align !== 'center') {
    drawNameAnchorX = canvasWidth * 0.5;
  } else if (card?.nomeAlign === 'left' && align !== 'left') {
    drawNameAnchorX = canvasWidth * 0.08;
  } else if (card?.nomeAlign === 'right' && align !== 'right') {
    drawNameAnchorX = canvasWidth * 0.92;
  }
  if (card?.nomeOffsetX) {
    drawNameAnchorX += (card.nomeOffsetX / 100) * canvasWidth;
  }
  let drawNameCurrentY = cursorY;
  if (card?.nomeOffsetY) {
    drawNameCurrentY += (card.nomeOffsetY / 100) * canvasHeight;
  }
  let nameStartX = drawNameAnchorX;
  if (effectiveNameAlign === 'right') {
    nameStartX = drawNameAnchorX - measuredNameWidth;
  } else if (effectiveNameAlign === 'center') {
    nameStartX = drawNameAnchorX - measuredNameWidth / 2;
  }

  if (formatted.nome) {
    cursorY += nameFontSize + Math.round(nameFontSize * 0.24);
  }

  // Info Line Position Calculation
  let drawInfoAnchorX = anchorX;
  if (card?.infoAlign === 'center' && align !== 'center') {
    drawInfoAnchorX = canvasWidth * 0.5;
  } else if (card?.infoAlign === 'left' && align !== 'left') {
    drawInfoAnchorX = canvasWidth * 0.08;
  } else if (card?.infoAlign === 'right' && align !== 'right') {
    drawInfoAnchorX = canvasWidth * 0.92;
  }
  if (card?.infoOffsetX) {
    drawInfoAnchorX += (card.infoOffsetX / 100) * canvasWidth;
  }
  let drawInfoCurrentY = cursorY;
  if (card?.infoOffsetY) {
    drawInfoCurrentY += (card.infoOffsetY / 100) * canvasHeight;
  }
  let infoStartX = drawInfoAnchorX;
  if (effectiveInfoAlign === 'right') {
    infoStartX = drawInfoAnchorX - infoLineWidth;
  } else if (effectiveInfoAlign === 'center') {
    infoStartX = drawInfoAnchorX - infoLineWidth / 2;
  }

  if (formatted.parts.length > 0) {
    cursorY += infoFontSize + Math.round(infoFontSize * 0.58);
  }

  // Novidade Faixa Position Calculation
  const scaleFactor = ((card?.faixaTamanho ?? 100) / 100);
  const scaledTagFontSize = Math.round(tagFontSize * scaleFactor);
  const scaledTagHeight = Math.round(tagHeight * scaleFactor);
  const scaledTagBandWidth = Math.round(tagBandWidth * scaleFactor);

  let drawFaixaAnchorX = anchorX;
  if (card?.faixaAlign === 'center' && align !== 'center') {
    drawFaixaAnchorX = canvasWidth * 0.5;
  } else if (card?.faixaAlign === 'left' && align !== 'left') {
    drawFaixaAnchorX = canvasWidth * 0.08;
  } else if (card?.faixaAlign === 'right' && align !== 'right') {
    drawFaixaAnchorX = canvasWidth * 0.92;
  }

  let bandX = drawFaixaAnchorX - scaledTagBandWidth;
  if (effectiveFaixaAlign === 'left') {
    bandX = drawFaixaAnchorX;
  } else if (effectiveFaixaAlign === 'center') {
    bandX = drawFaixaAnchorX - scaledTagBandWidth / 2;
  }
  if (card?.faixaOffsetX) {
    bandX += (card.faixaOffsetX / 100) * canvasWidth;
  }
  let bandY = cursorY + 4;
  if (card?.faixaOffsetY) {
    bandY += (card.faixaOffsetY / 100) * canvasHeight;
  }

  // -------------------------------------------------------------
  // CALCULATE EXACT BOUNDING BOX ANCHORED TO INFORMATION BLOCK
  // -------------------------------------------------------------
  let boundMinX = Infinity;
  let boundMaxX = -Infinity;
  let boundMinY = Infinity;
  let boundMaxY = -Infinity;

  if (formatted.nome) {
    boundMinX = Math.min(boundMinX, nameStartX);
    boundMaxX = Math.max(boundMaxX, nameStartX + measuredNameWidth);
    boundMinY = Math.min(boundMinY, drawNameCurrentY);
    boundMaxY = Math.max(boundMaxY, drawNameCurrentY + nameFontSize);
  }

  if (formatted.parts.length > 0) {
    boundMinX = Math.min(boundMinX, infoStartX);
    boundMaxX = Math.max(boundMaxX, infoStartX + infoLineWidth);
    boundMinY = Math.min(boundMinY, drawInfoCurrentY);
    boundMaxY = Math.max(boundMaxY, drawInfoCurrentY + infoFontSize);
  }

  if (tagActive && tagText) {
    boundMinX = Math.min(boundMinX, bandX);
    boundMaxX = Math.max(boundMaxX, bandX + scaledTagBandWidth);
    boundMinY = Math.min(boundMinY, bandY);
    boundMaxY = Math.max(boundMaxY, bandY + scaledTagHeight);
  }

  if (!isFinite(boundMinX)) {
    boundMinX = anchorX - 100;
    boundMaxX = anchorX + 100;
    boundMinY = anchorY;
    boundMaxY = anchorY + 80;
  }

  const contentCenterX = (boundMinX + boundMaxX) / 2;
  const contentCenterY = (boundMinY + boundMaxY) / 2;
  const contentWidth = boundMaxX - boundMinX;
  const contentHeight = boundMaxY - boundMinY;

  // -------------------------------------------------------------
  // RENDER DIFFUSE GRADIENT SHADOW (DIRECTLY ALIGNED WITH INFO)
  // -------------------------------------------------------------
  if (card?.sombraAtiva !== false) {
    const rawDensity = card?.sombraDensidade ?? card?.sombraIntensidade ?? 60;
    const shadowIntensity = Math.max(0, Math.min(100, rawDensity)) / 100;

    if (shadowIntensity > 0) {
      const spreadX = (card?.sombraRaioHorizontal ?? 100) / 100;
      const spreadY = (card?.sombraRaioVertical ?? 100) / 100;
      const blurAmount = card?.sombraBlur ?? 26;
      const shadowOffsetX = ((card?.sombraOffsetX ?? 0) / 100) * canvasWidth;
      const shadowOffsetY = ((card?.sombraOffsetY ?? 0) / 100) * canvasHeight;

      // Shadow center is directly anchored to the info block
      const centerX = contentCenterX + shadowOffsetX;
      const centerY = contentCenterY + shadowOffsetY;
      const radiusX = Math.max(contentWidth * 0.72 + canvasWidth * 0.08, 120) * spreadX + blurAmount;
      const radiusY = Math.max(contentHeight * 0.85 + canvasHeight * 0.06, 80) * spreadY + blurAmount;

      const style = card?.sombraEstilo || 'suave_radial';

      ctx.save();

      if (style === 'degrade_inferior') {
        // Vertical gradient rising up to cover info block
        const startGradY = Math.max(0, boundMinY - 35);
        const grad = ctx.createLinearGradient(0, startGradY, 0, canvasHeight);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.25, `rgba(0, 0, 0, ${shadowIntensity * 0.3})`);
        grad.addColorStop(0.6, `rgba(0, 0, 0, ${shadowIntensity * 0.75})`);
        grad.addColorStop(1, `rgba(0, 0, 0, ${shadowIntensity})`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, startGradY, canvasWidth, canvasHeight - startGradY);
      } else if (style === 'faixa_escura') {
        // Rounded dark translucent capsule framing content
        const padX = 26 * spreadX;
        const padY = 18 * spreadY;
        const barX = boundMinX - padX + shadowOffsetX;
        const barY = boundMinY - padY + shadowOffsetY;
        const barW = contentWidth + padX * 2;
        const barH = contentHeight + padY * 2;
        const cornerR = Math.min(22, Math.round(barH * 0.28));

        ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity * 0.88})`;
        ctx.shadowColor = `rgba(0, 0, 0, ${shadowIntensity})`;
        ctx.shadowBlur = blurAmount;

        ctx.beginPath();
        safeRoundRect(ctx, barX, barY, barW, barH, cornerR);
        ctx.fill();
      } else {
        // 'suave_radial' or 'vinheta_focal' (smooth 5-stop diffuse oval shadow)
        const innerRatio = style === 'vinheta_focal' ? 0.05 : 0.12;
        const maxR = Math.max(radiusX, radiusY);
        const blockGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          Math.min(radiusX, radiusY) * innerRatio,
          centerX,
          centerY,
          maxR
        );
        blockGrad.addColorStop(0, `rgba(0, 0, 0, ${shadowIntensity * 0.95})`);
        blockGrad.addColorStop(0.35, `rgba(0, 0, 0, ${shadowIntensity * 0.75})`);
        blockGrad.addColorStop(0.65, `rgba(0, 0, 0, ${shadowIntensity * 0.38})`);
        blockGrad.addColorStop(0.85, `rgba(0, 0, 0, ${shadowIntensity * 0.12})`);
        blockGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = blockGrad;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, Math.max(10, radiusX), Math.max(10, radiusY), 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // 1. NOME (Highlight, White / Ivory Serif, Large)
  // -------------------------------------------------------------
  if (formatted.nome) {
    // 1a. Faixa / Fundo Preto Opcional no Nome (Ativada APENAS quando o usuário quiser - Não Automático!)
    const blackBandCfg = card?.nomeFaixaPreta || config?.nameOverlay?.blackBand;
    if (blackBandCfg && blackBandCfg.enabled) {
      const widthScale = (blackBandCfg.width ?? 115) / 100;
      const bandWidth = Math.max(30, (measuredNameWidth + nameFontSize * 0.8) * widthScale);
      const bandHeight = Math.max(10, blackBandCfg.height ?? (nameFontSize * 1.15));
      const bandX = nameStartX - (bandWidth - measuredNameWidth) / 2 + ((blackBandCfg.offsetX ?? 0) / 100) * canvasWidth;
      const bandY = drawNameCurrentY - nameFontSize * 0.08 + ((blackBandCfg.offsetY ?? 0) / 100) * nameFontSize;

      drawBlackBandOrShadow(
        ctx,
        bandX,
        bandY,
        bandWidth,
        bandHeight,
        blackBandCfg.opacity ?? 0.75,
        blackBandCfg.blur ?? 10,
        blackBandCfg.style || 'capsula'
      );
    }

    // 1b. Bandagem Dourada no Nome (se ativada)
    const bandCfg = card?.nomeBandagemDourada || config?.nameOverlay?.goldBand;
    if (bandCfg && bandCfg.enabled && formatted.nome) {
      const widthScale = (bandCfg.width ?? 108) / 100;
      const bandWidth = Math.max(30, (measuredNameWidth + nameFontSize * 0.6) * widthScale);

      const placement = bandCfg.placement || 'half_bottom';
      let bandHeight = Math.max(8, nameFontSize * 0.72 * ((bandCfg.height || 36) / 36));
      let bandY = drawNameCurrentY + nameFontSize * 0.42;

      if (placement === 'full_name') {
        bandHeight = Math.max(12, nameFontSize * 1.32 * ((bandCfg.height || 36) / 36));
        bandY = drawNameCurrentY - nameFontSize * 0.16;
      } else if (placement === 'underline') {
        bandHeight = Math.max(4, nameFontSize * 0.28 * ((bandCfg.height || 36) / 36));
        bandY = drawNameCurrentY + nameFontSize * 1.05;
      } else if (placement === 'half_bottom') {
        bandHeight = Math.max(8, nameFontSize * 0.72 * ((bandCfg.height || 36) / 36));
        bandY = drawNameCurrentY + nameFontSize * 0.42;
      } else if (placement === 'custom') {
        bandHeight = Math.max(6, bandCfg.height || 36);
        bandY = drawNameCurrentY + ((bandCfg.offsetY ?? 0) / 100) * nameFontSize * 1.5;
      }

      if (placement !== 'custom' && bandCfg.offsetY !== undefined && bandCfg.offsetY !== 0) {
        bandY += (bandCfg.offsetY / 100) * nameFontSize * 1.5;
      }

      let bandX = nameStartX - (bandWidth - measuredNameWidth) / 2;
      if (bandCfg.offsetX !== undefined && bandCfg.offsetX !== 0) {
        bandX += (bandCfg.offsetX / 100) * measuredNameWidth;
      }

      const nameGoldTone = bandCfg.tone || card?.nomeTomDourado || 'classic_gold';
      const nameCustomColor = bandCfg.customColor || card?.nomeCorCustom;

      drawSmoothGoldBand(
        ctx,
        bandX,
        bandY,
        bandWidth,
        bandHeight,
        bandCfg.opacity ?? 0.9,
        bandCfg.softEdges ?? true,
        nameGoldTone,
        nameCustomColor
      );
    }

    ctx.font = `700 ${nameFontSize}px "${nameFontFamily}", serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = nameColor;
    ctx.fillText(formatted.nome, drawNameAnchorX, drawNameCurrentY);
  }

  // -------------------------------------------------------------
  // 2. INFORMAÇÕES (Fundo Difuso que segue os dados + Texto com separador •)
  // -------------------------------------------------------------
  if (formatted.parts.length > 0) {
    // 2a. Fundo / Sombra Difusa Dedicada das Informações (Segue os dados onde forem, ajusta de tamanho igual ao Logo)
    const isInfoShadowActive = Boolean(card?.infoSombraAtiva ?? config.infoOverlay?.shadowActive);
    if (isInfoShadowActive) {
      const infoDensity = (card?.infoSombraIntensidade ?? config.infoOverlay?.shadowIntensity ?? 65) / 100;
      if (infoDensity > 0) {
        const spreadMultiplier = ((card?.infoSombraTamanho ?? config.infoOverlay?.shadowSpread ?? 120) / 100);
        const blurAmount = card?.infoSombraBlur ?? config.infoOverlay?.shadowBlur ?? 16;
        const infoCenterX = infoStartX + infoLineWidth / 2;
        const infoCenterY = drawInfoCurrentY + infoFontSize / 2;

        const shadowRadiusX = Math.max((infoLineWidth / 2) * 1.35 * spreadMultiplier + blurAmount, 40);
        const shadowRadiusY = Math.max((infoFontSize / 2 + 12) * 1.5 * spreadMultiplier + blurAmount, 22);
        const maxRadius = Math.max(shadowRadiusX, shadowRadiusY);

        const style = card?.infoSombraEstilo || 'suave_radial';

        ctx.save();
        if (style === 'faixa_escura') {
          const padX = 20 * spreadMultiplier;
          const padY = 10 * spreadMultiplier;
          ctx.fillStyle = `rgba(0, 0, 0, ${infoDensity * 0.88})`;
          ctx.shadowColor = `rgba(0, 0, 0, ${infoDensity})`;
          ctx.shadowBlur = blurAmount;
          ctx.beginPath();
          safeRoundRect(
            ctx,
            infoStartX - padX,
            drawInfoCurrentY - padY,
            infoLineWidth + padX * 2,
            infoFontSize + padY * 2,
            14
          );
          ctx.fill();
        } else {
          // Degradê oval difuso suave idêntico ao do logo
          const infoShadowGrad = ctx.createRadialGradient(
            infoCenterX,
            infoCenterY,
            maxRadius * 0.1,
            infoCenterX,
            infoCenterY,
            maxRadius
          );
          infoShadowGrad.addColorStop(0, `rgba(0, 0, 0, ${infoDensity * 0.95})`);
          infoShadowGrad.addColorStop(0.45, `rgba(0, 0, 0, ${infoDensity * 0.55})`);
          infoShadowGrad.addColorStop(0.8, `rgba(0, 0, 0, ${infoDensity * 0.15})`);
          infoShadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = infoShadowGrad;
          ctx.beginPath();
          ctx.ellipse(infoCenterX, infoCenterY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // 2b. Renderização do Texto das Informações com os Pontos Divisores •
    ctx.save();
    ctx.font = `600 ${infoFontSize}px "${infoFontFamily}", sans-serif`;
    ctx.textBaseline = 'top';

    let drawX = infoStartX;
    const textMidY = drawInfoCurrentY + infoFontSize * 0.52;

    formatted.parts.forEach((p, idx) => {
      // Letras e números em branco (#FFFFFF) com sombra nítida de leitura
      ctx.font = `600 ${infoFontSize}px "${infoFontFamily}", sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = infoColor || '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillText(p, drawX, drawInfoCurrentY);
      drawX += partWidths[idx];

      // Pontos separadores na cor dourada (#d4af37) se ativo
      if (idx < formatted.parts.length - 1) {
        if (hasExplicitSeparator) {
          drawX += sepSpacing;

          ctx.save();
          ctx.fillStyle = goldSeparatorColor || '#d4af37';
          ctx.shadowColor = 'rgba(212, 175, 55, 0.85)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          if (isCircleBullet) {
            // Ponto esférico geométrico perfeito, 100% centralizado verticalmente
            const centerX = drawX + dotRadius;
            ctx.beginPath();
            ctx.arc(centerX, textMidY, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Outros símbolos de separador selecionados pelo usuário
            ctx.textBaseline = 'middle';
            ctx.font = `700 ${Math.round(infoFontSize * sepScale)}px "${infoFontFamily}", sans-serif`;
            ctx.fillText(sepSymbol, drawX, textMidY);
          }
          ctx.restore();

          drawX += separatorWidth + sepSpacing;
        } else {
          // Espaço simples e limpo entre as palavras
          drawX += sepSpacing;
        }
      }
    });

    ctx.restore();
  }

  // 3. FAIXA NOVIDADE (Horizontal Golden Gradient Strip BELOW info)
  if (tagActive && tagText) {
    // Bandagem Dourada da Novidade (Mesmo modelo suave e luxuoso da bandagem do nome)
    const bandCfg = card?.faixaBandagemDourada || {
      enabled: true,
      placement: 'half_bottom',
      width: 100,
      height: 36,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.9,
      style: 'shiny_gold',
      softEdges: true,
    };

    const isSmoothBandModel =
      card?.etiquetaEstilo === 'faixa_dourada' ||
      card?.etiquetaEstilo === 'brilhante' ||
      card?.etiquetaEstilo === 'gradiente_luxo' ||
      !card?.etiquetaEstilo ||
      bandCfg.enabled;

    if (isSmoothBandModel) {
      const faixaGoldTone = bandCfg.tone || card?.faixaTomDourado || 'classic_gold';
      const faixaCustomColor = bandCfg.customColor || card?.faixaCorCustom;

      // Desenha a bandagem dourada suave com desvanecimento lateral (modelo idêntico ao do nome)
      drawSmoothGoldBand(
        ctx,
        bandX,
        bandY,
        scaledTagBandWidth,
        scaledTagHeight,
        bandCfg.opacity ?? 0.9,
        bandCfg.softEdges ?? true,
        faixaGoldTone,
        faixaCustomColor
      );
    } else {
      // Estilo alternativo: retangular arredondado clássico
      const shadowIntensity = (card?.faixaSombraIntensidade ?? 75) / 100;
      const shadowBlur = card?.faixaSombraBlur ?? 8;
      const degradeIntensity = (card?.faixaDegradeIntensidade ?? 80) / 100;

      const startAlpha = 0.6 + 0.4 * degradeIntensity;
      const peakColor = degradeIntensity > 0.6 ? '#FFF4C8' : '#F4D675';
      const midColor = degradeIntensity > 0.4 ? '#D4AF37' : '#C59B27';
      const edgeColor = degradeIntensity > 0.5 ? '#7A5408' : '#A87916';

      const goldGradient = ctx.createLinearGradient(bandX, bandY, bandX + scaledTagBandWidth, bandY + scaledTagHeight);
      goldGradient.addColorStop(0, edgeColor);
      goldGradient.addColorStop(0.2, midColor);
      goldGradient.addColorStop(0.5, peakColor);
      goldGradient.addColorStop(0.8, midColor);
      goldGradient.addColorStop(1, edgeColor);

      ctx.save();
      if (shadowIntensity > 0) {
        ctx.shadowColor = `rgba(0, 0, 0, ${shadowIntensity})`;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetY = Math.max(1, Math.round(shadowBlur * 0.3));
      }

      ctx.fillStyle = goldGradient;
      ctx.beginPath();
      safeRoundRect(ctx, bandX, bandY, scaledTagBandWidth, scaledTagHeight, 3);
      ctx.fill();

      // Subtle sheen highlight in upper portion
      const sheen = ctx.createLinearGradient(bandX, bandY, bandX, bandY + scaledTagHeight * 0.5);
      sheen.addColorStop(0, `rgba(255, 255, 255, ${0.35 * startAlpha})`);
      sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sheen;
      ctx.beginPath();
      safeRoundRect(ctx, bandX, bandY, scaledTagBandWidth, scaledTagHeight * 0.5, [3, 3, 0, 0]);
      ctx.fill();
      ctx.restore();
    }

    // Text "NOVIDADE" centered inside golden ribbon in serif uppercase
    ctx.save();
    ctx.font = `700 ${scaledTagFontSize}px "${nameFontFamily}", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = card?.faixaCorTexto || '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 1;

    ctx.fillText(tagText, bandX + scaledTagBandWidth / 2, bandY + scaledTagHeight / 2);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Renders text with optional Gold Ribbon behind it.
 */
function renderTextWithOptionalGoldBand(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSizeScale: number,
  fontFamily: string,
  textColor: string,
  posXPercent: number,
  posYPercent: number,
  goldBandConfig: EditConfig['nameOverlay']['goldBand'],
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.save();

  const x = (posXPercent / 100) * canvasWidth;
  const y = (posYPercent / 100) * canvasHeight;

  // Scale font relative to canvas size
  const actualFontSize = Math.max(14, Math.round((fontSizeScale / 1000) * canvasWidth * 1.2));
  ctx.font = `600 ${actualFontSize}px "${fontFamily || 'Gilda Display'}", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;

  // Draw Gold Band if enabled
  if (goldBandConfig && goldBandConfig.enabled) {
    const bandWidth = (textWidth + 40) * (goldBandConfig.width / 100);
    const bandHeight = actualFontSize * 1.8 * (goldBandConfig.height / 48);
    const bandX = x + (goldBandConfig.offsetX / 100) * canvasWidth;
    const bandY = y + (goldBandConfig.offsetY / 100) * canvasHeight;

    drawGoldRibbon(
      ctx,
      bandX,
      bandY,
      bandWidth,
      bandHeight,
      goldBandConfig.opacity ?? 0.9,
      goldBandConfig.style ?? 'shiny_gold'
    );
  }

  // Text Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);

  ctx.restore();
}

/**
 * Renders Info Overlay with golden dots (pontos dourados).
 */
function renderInfoOverlay(
  ctx: CanvasRenderingContext2D,
  info: EditConfig['infoOverlay'],
  canvasWidth: number,
  canvasHeight: number
) {
  const formatted = formatProfileInfo(undefined, info.idade, info.altura, info.peso);
  if (formatted.parts.length === 0) return;

  ctx.save();

  const centerX = (info.positionX / 100) * canvasWidth;
  const centerY = (info.positionY / 100) * canvasHeight;

  const actualFontSize = Math.max(12, Math.round((info.fontSize / 1000) * canvasWidth));
  const fontFamily = info.fontFamily || 'Montserrat';
  ctx.font = `600 ${actualFontSize}px "${fontFamily}", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const separatorDot = '•';
  ctx.font = `700 ${actualFontSize}px "${fontFamily}", sans-serif`;
  const dotWidth = ctx.measureText(separatorDot).width;
  ctx.font = `600 ${actualFontSize}px "${fontFamily}", sans-serif`;
  const spaceWidth = ctx.measureText(' ').width;

  const partWidths = formatted.parts.map((p) => ctx.measureText(p).width);
  let totalWidth = 0;
  formatted.parts.forEach((p, idx) => {
    totalWidth += partWidths[idx];
    if (idx < formatted.parts.length - 1) {
      totalWidth += spaceWidth * 2.2 + dotWidth;
    }
  });

  let currentX = centerX - totalWidth / 2;
  const textColor = info.textColor || '#FFFFFF';
  const goldColor = '#d4af37';

  formatted.parts.forEach((partText, idx) => {
    // Letras e números em branco (#FFFFFF)
    ctx.fillStyle = textColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.fillText(partText, currentX, centerY);
    currentX += partWidths[idx];

    // Ponto dourado #d4af37
    if (idx < formatted.parts.length - 1) {
      currentX += spaceWidth * 1.1;
      ctx.fillStyle = goldColor;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(separatorDot, currentX, centerY);
      currentX += dotWidth + spaceWidth * 1.1;
    }
  });

  ctx.restore();
}

/**
 * Draws a luxury, smooth, borderless golden ribbon/band behind or under the name/faixa
 * with a horizontal fade-out effect on both edges (transparente -> dourado visível no centro -> transparente).
 * Supports classic gold, dark gold, antique bronze, aged gold, burnt gold, champagne, rose gold, and custom colors.
 */
export function drawSmoothGoldBand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  opacity: number = 0.88,
  softEdges: boolean = true,
  tone: string = 'classic_gold',
  customColor?: string
) {
  ctx.save();
  const baseAlpha = Math.max(0.05, Math.min(1.0, opacity));

  // Determine color palette stops based on tone
  let cEdge = 'rgba(156, 122, 40, 0)';
  let cSide = `rgba(180, 140, 48, ${0.25 * baseAlpha})`;
  let cMid = `rgba(216, 175, 68, ${0.75 * baseAlpha})`;
  let cPeak = `rgba(255, 242, 178, ${1.0 * baseAlpha})`;

  if (tone === 'dark_gold' || tone === 'dourado_escuro') {
    // Dourado Escuro Nobre (Ideal para fotos claras)
    cEdge = 'rgba(74, 49, 2, 0)';
    cSide = `rgba(120, 83, 24, ${0.35 * baseAlpha})`;
    cMid = `rgba(154, 107, 31, ${0.85 * baseAlpha})`;
    cPeak = `rgba(202, 145, 52, ${1.0 * baseAlpha})`;
  } else if (tone === 'antique_bronze' || tone === 'bronze_antigo') {
    // Bronze Antigo Profundo
    cEdge = 'rgba(61, 27, 3, 0)';
    cSide = `rgba(110, 57, 17, ${0.35 * baseAlpha})`;
    cMid = `rgba(146, 64, 14, ${0.85 * baseAlpha})`;
    cPeak = `rgba(194, 98, 30, ${1.0 * baseAlpha})`;
  } else if (tone === 'ouro_envelhecido') {
    // Ouro Envelhecido / Deep Gold
    cEdge = 'rgba(47, 34, 3, 0)';
    cSide = `rgba(107, 70, 7, ${0.35 * baseAlpha})`;
    cMid = `rgba(161, 98, 7, ${0.85 * baseAlpha})`;
    cPeak = `rgba(217, 145, 25, ${1.0 * baseAlpha})`;
  } else if (tone === 'dourado_queimado') {
    // Dourado Queimado / Chocolate Bronze
    cEdge = 'rgba(43, 21, 6, 0)';
    cSide = `rgba(88, 49, 14, ${0.35 * baseAlpha})`;
    cMid = `rgba(133, 77, 14, ${0.85 * baseAlpha})`;
    cPeak = `rgba(180, 110, 32, ${1.0 * baseAlpha})`;
  } else if (tone === 'champagne') {
    // Champagne Suave
    cEdge = 'rgba(140, 119, 72, 0)';
    cSide = `rgba(188, 161, 102, ${0.25 * baseAlpha})`;
    cMid = `rgba(226, 199, 138, ${0.75 * baseAlpha})`;
    cPeak = `rgba(255, 246, 224, ${1.0 * baseAlpha})`;
  } else if (tone === 'rose_gold') {
    // Rose Gold Luxo
    cEdge = 'rgba(111, 62, 55, 0)';
    cSide = `rgba(168, 92, 85, ${0.3 * baseAlpha})`;
    cMid = `rgba(214, 137, 126, ${0.8 * baseAlpha})`;
    cPeak = `rgba(255, 212, 201, ${1.0 * baseAlpha})`;
  } else if (tone === 'custom' && customColor) {
    // Custom Color: Convert HEX to RGB and create gradient stops
    const hex = customColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 212;
    const g = parseInt(hex.substring(2, 4), 16) || 175;
    const b = parseInt(hex.substring(4, 6), 16) || 55;

    cEdge = `rgba(${Math.round(r * 0.4)}, ${Math.round(g * 0.4)}, ${Math.round(b * 0.4)}, 0)`;
    cSide = `rgba(${Math.round(r * 0.7)}, ${Math.round(g * 0.7)}, ${Math.round(b * 0.7)}, ${0.35 * baseAlpha})`;
    cMid = `rgba(${r}, ${g}, ${b}, ${0.85 * baseAlpha})`;
    cPeak = `rgba(${Math.min(255, Math.round(r * 1.3))}, ${Math.min(255, Math.round(g * 1.3))}, ${Math.min(255, Math.round(b * 1.3))}, ${1.0 * baseAlpha})`;
  }

  // Horizontal gradient with smooth fade out on left and right edges
  const hGrad = ctx.createLinearGradient(x, y, x + width, y);
  hGrad.addColorStop(0, cEdge);
  hGrad.addColorStop(0.12, cSide);
  hGrad.addColorStop(0.28, cMid);
  hGrad.addColorStop(0.5, cPeak);
  hGrad.addColorStop(0.72, cMid);
  hGrad.addColorStop(0.88, cSide);
  hGrad.addColorStop(1, cEdge);

  // No border, no contour stroke!
  ctx.fillStyle = hGrad;
  ctx.fillRect(x, y, width, height);

  // Metallic sheen highlight in upper half with horizontal fade
  const sheenGrad = ctx.createLinearGradient(x, y, x + width, y);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(0.2, `rgba(255, 255, 255, ${0.08 * baseAlpha})`);
  sheenGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.35 * baseAlpha})`);
  sheenGrad.addColorStop(0.8, `rgba(255, 255, 255, ${0.08 * baseAlpha})`);
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = sheenGrad;
  ctx.fillRect(x, y, width, height * 0.5);

  ctx.restore();
}

/**
 * Draws an optional luxury dark band or soft diffuse shadow behind/under the name.
 */
export function drawBlackBandOrShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  opacity: number = 0.75,
  blur: number = 10,
  style: 'faixa' | 'capsula' | 'degrade' | 'sombra_suave' = 'capsula'
) {
  ctx.save();
  const alpha = Math.max(0.05, Math.min(1.0, opacity));

  if (style === 'capsula') {
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 0.95})`;
    ctx.shadowBlur = blur;
    ctx.beginPath();
    const radius = Math.min(16, height * 0.45);
    safeRoundRect(ctx, x, y, width, height, radius);
    ctx.fill();
  } else if (style === 'faixa') {
    // Faixa retangular com pontas gradientes horizontais suaves
    const grad = ctx.createLinearGradient(x, 0, x + width, 0);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.12, `rgba(0, 0, 0, ${alpha * 0.85})`);
    grad.addColorStop(0.5, `rgba(0, 0, 0, ${alpha})`);
    grad.addColorStop(0.88, `rgba(0, 0, 0, ${alpha * 0.85})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 0.8})`;
    ctx.shadowBlur = blur;
    ctx.fillRect(x, y, width, height);
  } else {
    // Sombra suave / Degradê radial oval
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radX = width / 2 + blur;
    const radY = height / 2 + blur;
    const maxR = Math.max(radX, radY);
    const grad = ctx.createRadialGradient(
      centerX,
      centerY,
      maxR * 0.1,
      centerX,
      centerY,
      maxR
    );
    grad.addColorStop(0, `rgba(0, 0, 0, ${alpha * 0.95})`);
    grad.addColorStop(0.4, `rgba(0, 0, 0, ${alpha * 0.65})`);
    grad.addColorStop(0.75, `rgba(0, 0, 0, ${alpha * 0.2})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, Math.max(10, radX), Math.max(10, radY), 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Applies Pixelate / Mosaico or Blur to specified regions (circles, freehand, rectangles).
 */
function applyPixelateBlur(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: EditConfig['pixelateBlur'],
  width: number,
  height: number
) {
  if (!config.active || !config.regions || config.regions.length === 0) {
    return;
  }

  const defaultDensity = Math.max(2, config.density || 18);

  ctx.save();

  const regions = config.regions;

  regions.forEach((region) => {
    const rx = (region.x / 100) * width;
    const ry = (region.y / 100) * height;
    const rw = Math.max(10, (region.width / 100) * width);
    const rh = Math.max(10, (region.height / 100) * height);
    const rotationRad = ((region.rotation ?? 0) * Math.PI) / 180;
    const regionType = region.type || config.type || 'blur';
    const regionDensity = Math.max(2, region.density || defaultDensity);

    const centerX = rx + rw / 2;
    const centerY = ry + rh / 2;

    // Helper to setup clipping path for region
    const setupClippingPath = () => {
      ctx.beginPath();
      if (rotationRad !== 0) {
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationRad);
        ctx.translate(-centerX, -centerY);
      }

      if ((region.shape === 'freehand' || region.shape === 'lasso') && region.points && region.points.length > 0) {
        region.points.forEach((pt, idx) => {
          const px = (pt.x / 100) * width;
          const py = (pt.y / 100) * height;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
      } else if (region.shape === 'rectangle') {
        ctx.rect(rx, ry, rw, rh);
      } else {
        ctx.ellipse(centerX, centerY, rw / 2, rh / 2, 0, 0, Math.PI * 2);
      }
    };

    if (regionType === 'pixelate') {
      // Mosaic / Pixelate
      const tempCanvas = document.createElement('canvas');
      const sampleScale = Math.max(0.02, 1 / regionDensity);

      let bboxX = rx;
      let bboxY = ry;
      let bboxW = rw;
      let bboxH = rh;

      if ((region.shape === 'freehand' || region.shape === 'lasso') && region.points && region.points.length > 0) {
        let minX = width, minY = height, maxX = 0, maxY = 0;
        region.points.forEach((pt) => {
          const px = (pt.x / 100) * width;
          const py = (pt.y / 100) * height;
          if (px < minX) minX = px;
          if (py < minY) minY = py;
          if (px > maxX) maxX = px;
          if (py > maxY) maxY = py;
        });
        bboxX = Math.max(0, minX - 10);
        bboxY = Math.max(0, minY - 10);
        bboxW = Math.max(20, maxX - minX + 20);
        bboxH = Math.max(20, maxY - minY + 20);
      }

      tempCanvas.width = Math.max(1, Math.floor(bboxW * sampleScale));
      tempCanvas.height = Math.max(1, Math.floor(bboxH * sampleScale));
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.imageSmoothingEnabled = false;
      tempCtx.drawImage(canvas, bboxX, bboxY, bboxW, bboxH, 0, 0, tempCanvas.width, tempCanvas.height);

      ctx.save();
      setupClippingPath();
      ctx.clip();

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, bboxX, bboxY, bboxW, bboxH);
      ctx.restore();
    } else {
      // Smooth Blur
      ctx.save();
      setupClippingPath();
      ctx.clip();
      ctx.filter = `blur(${Math.max(4, regionDensity)}px)`;
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
  });

  ctx.restore();
}

/**
 * Applies Magic Eraser strokes (Tattoo removal / Object removal).
 */
function applyMagicEraserStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: EditConfig['magicEraser']['strokes'],
  width: number,
  height: number
) {
  strokes.forEach((stroke) => {
    if (stroke.points.length < 2) return;

    ctx.save();
    // Fill mask with smart neighbor blending / clone patch blur
    stroke.points.forEach((pt, i) => {
      if (i === 0) return;
      const prev = stroke.points[i - 1];
      const px1 = (prev.x / 100) * width;
      const py1 = (prev.y / 100) * height;
      const px2 = (pt.x / 100) * width;
      const py2 = (pt.y / 100) * height;

      ctx.strokeStyle = 'rgba(235, 215, 195, 0.85)';
      ctx.lineWidth = stroke.brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.filter = 'blur(6px)';

      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();
    });
    ctx.restore();
  });
}

/**
 * Renders Logo with layout options (9 presets or free position), rotation, margin, and soft shaded background
 */
function renderLogo(
  ctx: CanvasRenderingContext2D,
  logoImg: HTMLImageElement,
  logoConfig: EditConfig['logoOverlay'],
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.save();
  ctx.globalAlpha = logoConfig.opacity ?? 0.95;

  const logoNatW = logoImg.naturalWidth || logoImg.width || 200;
  const logoNatH = logoImg.naturalHeight || logoImg.height || 60;
  const aspect = logoNatW > 0 && logoNatH > 0 ? logoNatW / logoNatH : 3.33;
  const baseSize = Math.min(canvasWidth, canvasHeight) * 0.18;
  const logoWidth = Math.max(10, baseSize * (logoConfig.scale / 100));
  const logoHeight = Math.max(10, logoWidth / (aspect || 1));

  const customMarginPercent = logoConfig.margin ?? 4.5;
  const margin = Math.round((customMarginPercent / 100) * canvasWidth);

  let x = margin;
  let y = margin;

  switch (logoConfig.position) {
    case 'top_left':
      x = margin;
      y = margin;
      break;
    case 'top_center':
      x = (canvasWidth - logoWidth) / 2;
      y = margin;
      break;
    case 'top_right':
      x = canvasWidth - logoWidth - margin;
      y = margin;
      break;
    case 'center_left':
      x = margin;
      y = (canvasHeight - logoHeight) / 2;
      break;
    case 'center':
      x = (canvasWidth - logoWidth) / 2;
      y = (canvasHeight - logoHeight) / 2;
      break;
    case 'center_right':
      x = canvasWidth - logoWidth - margin;
      y = (canvasHeight - logoHeight) / 2;
      break;
    case 'bottom_left':
      x = margin;
      y = canvasHeight - logoHeight - margin;
      break;
    case 'bottom_center':
      x = (canvasWidth - logoWidth) / 2;
      y = canvasHeight - logoHeight - margin;
      break;
    case 'bottom_right':
      x = canvasWidth - logoWidth - margin;
      y = canvasHeight - logoHeight - margin;
      break;
    case 'free':
    default:
      x = (logoConfig.freeX / 100) * canvasWidth - logoWidth / 2;
      y = (logoConfig.freeY / 100) * canvasHeight - logoHeight / 2;
      break;
  }

  const logoCenterX = x + logoWidth / 2;
  const logoCenterY = y + logoHeight / 2;

  // Draw smooth natural diffuse dark gradient shadow behind logo area if enabled (without solid square box)
  if (logoConfig.shadowActive !== false) {
    const shadowIntensity = (logoConfig.shadowIntensity ?? 60) / 100;
    const spreadMultiplier = (logoConfig.shadowSpread ?? 120) / 100;
    const shadowRadiusX = (logoWidth / 2) * 1.35 * spreadMultiplier;
    const shadowRadiusY = (logoHeight / 2) * 1.35 * spreadMultiplier;
    const maxRadius = Math.max(shadowRadiusX, shadowRadiusY);

    const logoShadowGrad = ctx.createRadialGradient(
      logoCenterX,
      logoCenterY,
      maxRadius * 0.1,
      logoCenterX,
      logoCenterY,
      maxRadius
    );
    logoShadowGrad.addColorStop(0, `rgba(0, 0, 0, ${shadowIntensity * 0.9})`);
    logoShadowGrad.addColorStop(0.5, `rgba(0, 0, 0, ${shadowIntensity * 0.4})`);
    logoShadowGrad.addColorStop(0.85, `rgba(0, 0, 0, ${shadowIntensity * 0.1})`);
    logoShadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.fillStyle = logoShadowGrad;
    ctx.beginPath();
    ctx.ellipse(logoCenterX, logoCenterY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw logo image with rotation if configured
  ctx.save();
  const rotationRad = ((logoConfig.rotation ?? 0) * Math.PI) / 180;
  if (rotationRad !== 0) {
    ctx.translate(logoCenterX, logoCenterY);
    ctx.rotate(rotationRad);
    ctx.translate(-logoCenterX, -logoCenterY);
  }

  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = logoConfig.shadowBlur ?? 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  ctx.drawImage(logoImg, x, y, logoWidth, logoHeight);
  ctx.restore();

  ctx.restore();
}
