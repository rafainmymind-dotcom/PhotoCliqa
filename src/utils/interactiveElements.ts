import { EditConfig, ModelData } from '../types';
import { formatProfileInfo } from './formatters';

export type InteractiveElementType =
  | 'nome'
  | 'informacoes'
  | 'faixa'
  | 'logo'
  | 'card_perfil'
  | string;

export interface ElementRect {
  x: number; // 0 - 100 %
  y: number; // 0 - 100 %
  width: number; // 0 - 100 %
  height: number; // 0 - 100 %
}

export interface InteractiveElement {
  id: InteractiveElementType;
  label: string;
  category: 'text' | 'badge' | 'logo' | 'blur' | 'group';
  rect: ElementRect;
  pixelRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SnapGuide {
  type: 'vertical' | 'horizontal';
  posPercent: number;
  label: string;
}

/**
 * Calculates interactive bounding boxes for all active overlay elements on canvas.
 */
export function getCanvasInteractiveElements(
  config: EditConfig,
  modelData: ModelData | undefined,
  canvasWidth: number,
  canvasHeight: number,
  logoImg?: HTMLImageElement | null
): InteractiveElement[] {
  const elements: InteractiveElement[] = [];
  if (canvasWidth <= 0 || canvasHeight <= 0) return elements;

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

  const isNameActive = Boolean(config.nameOverlay?.active || card?.active);
  const isInfoActive = Boolean(config.infoOverlay?.active || card?.active);
  const isTagActive = Boolean(
    modelData?.novidade ??
    modelData?.etiquetaAtiva ??
    card?.etiquetaAtiva ??
    config.highlightOverlay?.active ??
    true
  );
  const tagText = (
    modelData?.texto_novidade ||
    modelData?.etiquetaTexto ||
    card?.etiquetaTexto ||
    'NOVIDADE'
  ).toUpperCase();

  // Position Preset math
  const posPreset = card?.position || 'bottom_right';
  let anchorX = canvasWidth * 0.92;
  let anchorY = isTagActive ? canvasHeight * 0.77 : canvasHeight * 0.83;
  let align: 'left' | 'center' | 'right' = card?.align || 'right';

  if (posPreset === 'bottom_right') {
    anchorX = canvasWidth * 0.92;
    anchorY = isTagActive ? canvasHeight * 0.77 : canvasHeight * 0.83;
    if (!card?.align) align = 'right';
  } else if (posPreset === 'bottom_left') {
    anchorX = canvasWidth * 0.08;
    anchorY = isTagActive ? canvasHeight * 0.77 : canvasHeight * 0.83;
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
    anchorY = isTagActive ? canvasHeight * 0.77 : canvasHeight * 0.83;
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

  const nameFontSize = Math.max(20, Math.round(((card?.nomeTamanho || 34) / 1000) * canvasWidth * 1.15));
  const infoFontSize = Math.max(12, Math.round(((card?.infoTamanho || 18) / 1000) * canvasWidth * 1.05));

  // Estimated text widths
  const estimatedNameCharWidth = nameFontSize * 0.62;
  const measuredNameWidth = Math.max(80, (formatted.nome || 'Valentina').length * estimatedNameCharWidth);

  let currentY = anchorY;

  // 1. NOME BOUNDS
  if (isNameActive && formatted.nome) {
    let nameStartX = anchorX;
    if (align === 'right') {
      nameStartX = anchorX - measuredNameWidth;
    } else if (align === 'center') {
      nameStartX = anchorX - measuredNameWidth / 2;
    }

    if (card?.nomeOffsetX) {
      nameStartX += (card.nomeOffsetX / 100) * canvasWidth;
    }
    let nameY = currentY;
    if (card?.nomeOffsetY) {
      nameY += (card.nomeOffsetY / 100) * canvasHeight;
    }

    const nameW = measuredNameWidth + 24;
    const nameH = nameFontSize * 1.35;
    const pxX = Math.max(0, nameStartX - 12);
    const pxY = Math.max(0, nameY - 4);

    elements.push({
      id: 'nome',
      label: 'Nome',
      category: 'text',
      rect: {
        x: (pxX / canvasWidth) * 100,
        y: (pxY / canvasHeight) * 100,
        width: (nameW / canvasWidth) * 100,
        height: (nameH / canvasHeight) * 100,
      },
      pixelRect: {
        x: pxX,
        y: pxY,
        width: nameW,
        height: nameH,
      },
    });

    currentY += nameFontSize + Math.round(nameFontSize * 0.24);
  }

  // 2. INFORMAÇÕES BOUNDS
  if (isInfoActive && formatted.parts.length > 0) {
    const infoTextCombined = formatted.parts.join('  •  ');
    const measuredInfoWidth = Math.max(100, infoTextCombined.length * infoFontSize * 0.58);

    let infoStartX = anchorX;
    if (align === 'right') {
      infoStartX = anchorX - measuredInfoWidth;
    } else if (align === 'center') {
      infoStartX = anchorX - measuredInfoWidth / 2;
    }

    if (card?.infoOffsetX) {
      infoStartX += (card.infoOffsetX / 100) * canvasWidth;
    }
    let infoY = currentY;
    if (card?.infoOffsetY) {
      infoY += (card.infoOffsetY / 100) * canvasHeight;
    }

    const infoW = measuredInfoWidth + 20;
    const infoH = infoFontSize * 1.4;
    const pxX = Math.max(0, infoStartX - 10);
    const pxY = Math.max(0, infoY - 2);

    elements.push({
      id: 'informacoes',
      label: 'Informações',
      category: 'text',
      rect: {
        x: (pxX / canvasWidth) * 100,
        y: (pxY / canvasHeight) * 100,
        width: (infoW / canvasWidth) * 100,
        height: (infoH / canvasHeight) * 100,
      },
      pixelRect: {
        x: pxX,
        y: pxY,
        width: infoW,
        height: infoH,
      },
    });

    currentY += infoFontSize + Math.round(infoFontSize * 0.58);
  }

  // 3. FAIXA NOVIDADE BOUNDS
  if (isTagActive && tagText) {
    const scaleFactor = (card?.faixaTamanho ?? 100) / 100;
    const tagFontSize = Math.max(10, Math.round(infoFontSize * 0.82 * scaleFactor));
    const tagHeight = Math.round(tagFontSize * 2.2);
    const tagTextWidth = tagText.length * tagFontSize * 0.68;
    const tagBandWidth = Math.round((tagTextWidth + tagHeight * 1.5) * scaleFactor);

    let bandX = anchorX - tagBandWidth;
    if (align === 'left') {
      bandX = anchorX;
    } else if (align === 'center') {
      bandX = anchorX - tagBandWidth / 2;
    }

    if (card?.faixaOffsetX) {
      bandX += (card.faixaOffsetX / 100) * canvasWidth;
    }
    let bandY = currentY + 4;
    if (card?.faixaOffsetY) {
      bandY += (card.faixaOffsetY / 100) * canvasHeight;
    }

    const pxX = Math.max(0, bandX);
    const pxY = Math.max(0, bandY);

    elements.push({
      id: 'faixa',
      label: 'Faixa / Novidade',
      category: 'badge',
      rect: {
        x: (pxX / canvasWidth) * 100,
        y: (pxY / canvasHeight) * 100,
        width: (tagBandWidth / canvasWidth) * 100,
        height: (tagHeight / canvasHeight) * 100,
      },
      pixelRect: {
        x: pxX,
        y: pxY,
        width: tagBandWidth,
        height: tagHeight,
      },
    });
  }

  // 4. LOGO MIMUUS BOUNDS
  if (config.logoOverlay.active) {
    const aspect = logoImg ? logoImg.naturalWidth / (logoImg.naturalHeight || 1) : 3.2;
    const baseSize = Math.min(canvasWidth, canvasHeight) * 0.18;
    const logoWidth = baseSize * (config.logoOverlay.scale / 100);
    const logoHeight = logoWidth / aspect;
    const margin = Math.round(((config.logoOverlay.margin ?? 4.5) / 100) * canvasWidth);

    let x = margin;
    let y = margin;

    switch (config.logoOverlay.position) {
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
        x = (config.logoOverlay.freeX / 100) * canvasWidth - logoWidth / 2;
        y = (config.logoOverlay.freeY / 100) * canvasHeight - logoHeight / 2;
        break;
    }

    elements.push({
      id: 'logo',
      label: 'Logo Mimuus',
      category: 'logo',
      rect: {
        x: (x / canvasWidth) * 100,
        y: (y / canvasHeight) * 100,
        width: (logoWidth / canvasWidth) * 100,
        height: (logoHeight / canvasHeight) * 100,
      },
      pixelRect: {
        x,
        y,
        width: logoWidth,
        height: logoHeight,
      },
    });
  }

  // 5. BLUR / PIXELATE REGIONS
  if (config.pixelateBlur.active && config.pixelateBlur.regions) {
    config.pixelateBlur.regions.forEach((reg, idx) => {
      const rx = (reg.x / 100) * canvasWidth;
      const ry = (reg.y / 100) * canvasHeight;
      const rw = (reg.width / 100) * canvasWidth;
      const rh = (reg.height / 100) * canvasHeight;

      elements.push({
        id: `blur_${reg.id || idx}`,
        label: `Desfoque ${idx + 1}`,
        category: 'blur',
        rect: {
          x: reg.x,
          y: reg.y,
          width: reg.width,
          height: reg.height,
        },
        pixelRect: {
          x: rx,
          y: ry,
          width: rw,
          height: rh,
        },
      });
    });
  }

  return elements;
}

/**
 * Performs hit testing to check which element was clicked or hovered at (clickXPercent, clickYPercent).
 */
export function hitTestElements(
  elements: InteractiveElement[],
  xPercent: number,
  yPercent: number,
  paddingPercent: number = 3
): InteractiveElement | null {
  // Check in reverse order so topmost rendered elements get priority
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    const left = el.rect.x - paddingPercent;
    const right = el.rect.x + el.rect.width + paddingPercent;
    const top = el.rect.y - paddingPercent;
    const bottom = el.rect.y + el.rect.height + paddingPercent;

    if (xPercent >= left && xPercent <= right && yPercent >= top && yPercent <= bottom) {
      return el;
    }
  }
  return null;
}

/**
 * Magnetic Snapping calculation for centralizing and aligning freely dragged elements.
 */
export function calculateSnapping(
  xPercent: number,
  yPercent: number,
  threshold: number = 2.5
): {
  snappedX: number;
  snappedY: number;
  guides: SnapGuide[];
} {
  let snappedX = xPercent;
  let snappedY = yPercent;
  const guides: SnapGuide[] = [];

  // Horizontal Center Snap (50%)
  if (Math.abs(xPercent - 50) <= threshold) {
    snappedX = 50;
    guides.push({ type: 'vertical', posPercent: 50, label: 'Centro (50%)' });
  } else if (Math.abs(xPercent - 8) <= threshold) {
    snappedX = 8;
    guides.push({ type: 'vertical', posPercent: 8, label: 'Margem Esquerda (8%)' });
  } else if (Math.abs(xPercent - 92) <= threshold) {
    snappedX = 92;
    guides.push({ type: 'vertical', posPercent: 92, label: 'Margem Direita (92%)' });
  }

  // Vertical Center Snap (50%)
  if (Math.abs(yPercent - 50) <= threshold) {
    snappedY = 50;
    guides.push({ type: 'horizontal', posPercent: 50, label: 'Meio (50%)' });
  } else if (Math.abs(yPercent - 8) <= threshold) {
    snappedY = 8;
    guides.push({ type: 'horizontal', posPercent: 8, label: 'Topo (8%)' });
  } else if (Math.abs(yPercent - 83) <= threshold) {
    snappedY = 83;
    guides.push({ type: 'horizontal', posPercent: 83, label: 'Base Inferior (83%)' });
  }

  return { snappedX, snappedY, guides };
}
