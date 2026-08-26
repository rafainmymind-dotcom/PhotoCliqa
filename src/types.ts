/**
 * Types for PhotoCliqa Editor Application
 */

export type ThemeColorKey = 'amber' | 'emerald' | 'sapphire' | 'rose' | 'purple' | 'mono' | 'coral' | 'custom';

export type FontScaleKey = 'compact' | 'normal' | 'comfortable';

export interface BrandConfig {
  name: string;
  subtitle?: string;
  badgeText?: string;
  showBadge?: boolean;
  logoUrl: string;
  logoHeight?: number; // 24 to 64 px
  themeColor: ThemeColorKey;
  customColorHex?: string; // e.g. '#2563eb'
  titleFont?: string;
  titleFontSize?: number; // 14 to 28 px
  fontScale?: FontScaleKey;
  darkBgMode?: 'slate' | 'charcoal' | 'black';
}

export type AspectDimension = '1080x1080' | '385x530' | '350x550' | '1067x1600' | 'original';

export interface ModelData {
  nome: string;
  idade: string | number;
  altura: string | number;
  peso: string | number;
  manequim?: string | number;
  pes?: string | number;
  novidade?: boolean;
  texto_novidade?: string;
  etiquetaAtiva?: boolean;
  etiquetaTexto?: string;
  logo?: string;
  foto?: string;
}

export type ProfilePositionPreset =
  | 'bottom_right'
  | 'bottom_left'
  | 'top_right'
  | 'top_left'
  | 'bottom_center'
  | 'top_center'
  | 'center'
  | 'custom';

export interface BlackBandConfig {
  enabled: boolean;
  opacity?: number; // 0.1 to 1.0 (default 0.75)
  blur?: number; // 0 to 40px (default 12)
  width?: number; // 50 to 200% (default 115)
  height?: number; // 10 to 80px (default 36)
  offsetX?: number; // -100 to 100
  offsetY?: number; // -100 to 100
  style?: 'faixa' | 'capsula' | 'degrade' | 'sombra_suave';
}

export interface ProfileCardConfig {
  active: boolean;
  position: ProfilePositionPreset;
  customX: number; // 0-100%
  customY: number; // 0-100%
  align?: 'left' | 'center' | 'right';
  nomeAlign?: 'left' | 'center' | 'right';
  infoAlign?: 'left' | 'center' | 'right';
  faixaAlign?: 'left' | 'center' | 'right';
  nomeCor: string;
  nomeFonte: string;
  nomeTamanho: number;
  nomeBandagemDourada?: GoldBandConfig;
  nomeFaixaPreta?: BlackBandConfig;
  nomeTomDourado?: 'ouro_classico' | 'dourado_escuro' | 'bronze_antigo' | 'ouro_envelhecido' | 'dourado_queimado' | 'champagne' | 'custom';
  nomeCorCustom?: string;
  nomeOffsetX?: number; // -100 to 100
  nomeOffsetY?: number; // -100 to 100
  infoCorTexto: string;
  infoCorSeparadores: string; // default #d4af37
  infoSeparadorSimbolo?: string; // '-' | '–' | '•' | '·' | '|' | '/' | '★' | '♦'
  infoSeparadorTamanho?: number; // 50 to 200% (default 100)
  infoFonte: string;
  infoTamanho: number;
  infoEspacamento?: number; // spacing around separator in px (default 14)
  infoIdadeFormato?: 'anos' | 'sem_espaco' | 'apenas_numero'; // '29 anos' | '29anos' | '29'
  infoAlturaFormato?: 'virgula' | 'virgula_m'; // '1,69' | '1,69 m'
  infoPesoFormato?: 'kg_espaco' | 'kg_junto' | 'apenas_numero'; // '66 kg' | '66kg' | '66'
  infoOffsetX?: number; // -100 to 100
  infoOffsetY?: number; // -100 to 100
  infoSombraAtiva?: boolean;
  infoSombraIntensidade?: number; // 0 - 100%
  infoSombraBlur?: number; // 0 - 50px
  infoSombraTamanho?: number; // 50 - 250% (spread)
  infoSombraEstilo?: 'suave_radial' | 'faixa_escura';
  sombraIntensidade?: number; // 0 to 100% (densidade)
  sombraDensidade?: number; // 0 to 100%
  sombraBlur?: number; // 0 to 100px (suavidade)
  sombraRaioHorizontal?: number; // 40 to 300% (largura)
  sombraRaioVertical?: number; // 40 to 300% (altura)
  sombraEstilo?: 'suave_radial' | 'degrade_inferior' | 'faixa_escura' | 'vinheta_focal';
  sombraOffsetX?: number; // -100 to 100%
  sombraOffsetY?: number; // -100 to 100%
  sombraAtiva?: boolean;
  etiquetaAtiva: boolean;
  etiquetaTexto: string;
  etiquetaCaixaAlta: boolean;
  etiquetaEstilo:
    | 'faixa_dourada'
    | 'degrade_dourado'
    | 'brilhante'
    | 'pill_dourado'
    | 'badge_elegante'
    | 'gradiente_luxo';
  faixaBandagemDourada?: GoldBandConfig;
  faixaTomDourado?: 'ouro_classico' | 'dourado_escuro' | 'bronze_antigo' | 'ouro_envelhecido' | 'dourado_queimado' | 'champagne' | 'custom';
  faixaCorCustom?: string;
  faixaSombraIntensidade?: number; // 0 - 100%
  faixaSombraBlur?: number; // 0 - 40px
  faixaDegradeIntensidade?: number; // 0 - 100%
  faixaTamanho?: number; // scale 50% - 150%
  faixaOffsetX?: number; // -100 to 100
  faixaOffsetY?: number; // -100 to 100
  faixaCorTexto?: string;
}

export type BlurType = 'pixelate' | 'blur';
export type BlurMode = 'circle' | 'rectangle' | 'freehand' | 'lasso' | 'auto_face';
export type BlurShape = 'circle' | 'rectangle' | 'freehand' | 'lasso';

export interface BlurRegion {
  id: string;
  shape: BlurShape;
  type?: BlurType; // blur or pixelate
  density?: number; // intensity
  x: number; // percentage 0-100 or center X
  y: number; // percentage 0-100 or center Y
  width: number; // percentage 0-100 or diameter/width
  height: number; // percentage 0-100 or diameter/height
  rotation?: number; // rotation in degrees (-180 to 180)
  points?: { x: number; y: number }[]; // points for freehand draw path
}

export interface PixelateBlurConfig {
  active: boolean;
  type: BlurType;
  mode: BlurMode;
  density: number; // 1 to 100
  regions: BlurRegion[];
}

export interface ImageTransformConfig {
  scale: number; // 30% to 300% (default 100)
  offsetX: number; // -100 to 100 (% offset X)
  offsetY: number; // -100 to 100 (% offset Y)
}

export type MagicEraserMode = 'tattoo' | 'object';

export interface EraserStroke {
  id: string;
  mode: MagicEraserMode;
  brushSize: number;
  points: { x: number; y: number }[];
}

export interface MagicEraserConfig {
  active: boolean;
  mode: MagicEraserMode;
  brushSize: number;
  strokes: EraserStroke[];
}

export type GoldBandPlacement = 'half_bottom' | 'full_name' | 'underline' | 'custom';
export type GoldBandTone =
  | 'classic_gold'
  | 'dark_gold'
  | 'antique_bronze'
  | 'ouro_envelhecido'
  | 'dourado_queimado'
  | 'champagne'
  | 'rose_gold'
  | 'custom';

export interface GoldBandConfig {
  enabled: boolean;
  placement?: GoldBandPlacement;
  width: number; // 30 - 200 %
  height: number; // 10 - 150 px or %
  offsetX: number; // -100 to 100 px or %
  offsetY: number; // -100 to 100 px or %
  opacity: number; // 0.1 - 1.0
  style?: 'classic_gold' | 'shiny_gold' | 'rose_gold';
  tone?: GoldBandTone;
  customColor?: string;
  softEdges?: boolean;
}

export interface NameOverlayConfig {
  active: boolean;
  text: string;
  fontSize: number; // 12 - 96 px
  fontFamily: string; // 'Gilda Display', 'Playfair Display', 'Cinzel', 'Montserrat', etc.
  textColor: string;
  goldBand: GoldBandConfig;
  blackBand?: BlackBandConfig;
  positionY: number; // 0 - 100 % from top
  positionX: number; // 0 - 100 %
}

export interface InfoOverlayConfig {
  active: boolean;
  idade: string;
  altura: string;
  peso: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  goldDots: boolean;
  shadowActive?: boolean;
  shadowIntensity?: number;
  shadowBlur?: number;
  shadowSpread?: number;
  positionX: number; // 0 - 100 %
  positionY: number; // 0 - 100 %
}

export interface HighlightOverlayConfig {
  active: boolean;
  text: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  goldBand: GoldBandConfig;
  positionX: number;
  positionY: number;
}

export type LogoPosition =
  | 'top_left'
  | 'top_center'
  | 'top_right'
  | 'center_left'
  | 'center'
  | 'center_right'
  | 'bottom_left'
  | 'bottom_center'
  | 'bottom_right'
  | 'free';

export interface LogoOverlayConfig {
  active: boolean;
  imageUrl: string;
  position: LogoPosition;
  freeX: number; // 0 - 100 %
  freeY: number; // 0 - 100 %
  scale: number; // 10 - 200 %
  opacity: number; // 0.1 - 1.0
  margin?: number; // 0 - 15%
  rotation?: number; // -180 to 180 deg
  shadowActive?: boolean;
  shadowIntensity?: number; // 0 - 100%
  shadowBlur?: number; // 0 - 50px
  shadowSpread?: number; // 50 - 200%
}

export interface OrganizationConfig {
  selectedElements: {
    nome: boolean;
    informacoes: boolean;
    bandagem: boolean;
    faixa: boolean;
    sombra: boolean;
  };
  spacing: number; // spacing between elements (e.g. 4 to 40px)
  groupY: number; // 0 - 100% vertical group position
  groupX: number; // 0 - 100% horizontal group position
  isGrouped: boolean;
}

export interface BottomNameBandConfig {
  enabled: boolean;
  height: number; // 24 to 200 px (default ~56)
  backgroundColor: string; // default '#000000'
  backgroundOpacity: number; // 0 to 100% (default 78%)
  textColor: string; // default '#FFFFFF'
  fontSize: number; // 12 to 80 px (default 26)
  fontFamily: string; // default 'Montserrat' or 'Gilda Display'
  fontWeight: string | number; // '400', '600', '700', '800'
  letterSpacing: number; // 0 to 24 px (default 4)
  verticalAlign: 'middle' | 'top' | 'bottom';
  offsetX: number; // -100 to 100%
  offsetY: number; // -50 to 50%
}

export interface BlackStripConfig {
  active: boolean;
  opacity: number; // 0.1 - 1.0 (default 0.5)
  text: string;
  fontSize: number;
  fontFamily: string;
  position: 'bottom' | 'top';
}

export interface ImageFiltersConfig {
  brightness: number; // 50 to 150 (default 100)
  contrast: number; // 50 to 150 (default 100)
  saturation: number; // 0 to 200 (default 100)
  vignette: number; // 0 to 100 (default 0)
  fundoPretoInferiorAtivo?: boolean;
  fundoPretoInferiorDensidade?: number; // 0 to 100 (default 60)
  fundoPretoInferiorAltura?: number; // 10 to 100 (default 45%)
}

export interface EditConfig {
  dimension: AspectDimension;
  imageTransform?: ImageTransformConfig;
  filters?: ImageFiltersConfig;
  blackStrip: BlackStripConfig;
  pixelateBlur: PixelateBlurConfig;
  magicEraser: MagicEraserConfig;
  nameOverlay: NameOverlayConfig;
  infoOverlay: InfoOverlayConfig;
  highlightOverlay: HighlightOverlayConfig;
  logoOverlay: LogoOverlayConfig;
  profileCard?: ProfileCardConfig;
  organization?: OrganizationConfig;
  bottomNameBand?: BottomNameBandConfig;
}

export interface ImageItem {
  id: string;
  name: string;
  dataUrl: string;
  aspectWidth: number;
  aspectHeight: number;
  modelData: ModelData;
  editConfig: EditConfig;
  createdAt: string;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  category?: string;
  includedModules?: string[];
  modelData: ModelData;
  editConfig: EditConfig;
  createdAt: string;
}

export type ActiveTab = 'upload_form' | 'presets' | 'editor';

export type ExportFormat = 'png' | 'webp';
