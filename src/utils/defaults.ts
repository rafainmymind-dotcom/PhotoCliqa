import { EditConfig, ModelData, Preset } from '../types';

export const DEFAULT_MIMUUS_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2B2" />
      <stop offset="30%" stop-color="#D4AF37" />
      <stop offset="60%" stop-color="#AA7C11" />
      <stop offset="85%" stop-color="#F3E5AB" />
      <stop offset="100%" stop-color="#8C6207" />
    </linearGradient>
  </defs>
  <g fill="url(#goldGrad)">
    <path d="M 50,25 C 65,10 85,25 70,55 C 85,45 95,65 75,85 C 55,75 52,60 50,55 C 48,60 45,75 25,85 C 5,65 15,45 30,55 C 15,25 35,10 50,25 Z" />
    <text x="110" y="70" font-family="'Gilda Display', 'Playfair Display', serif" font-size="46" font-weight="bold" letter-spacing="6">MIMUUS</text>
    <text x="115" y="92" font-family="'Montserrat', sans-serif" font-size="12" font-weight="600" letter-spacing="7">EXCLUSIVE MODELS</text>
  </g>
</svg>
`)}`;

export const DEFAULT_SAMPLE_PORTRAIT = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#2a2d3d" />
      <stop offset="50%" stop-color="#141722" />
      <stop offset="100%" stop-color="#08090f" />
    </radialGradient>
    <linearGradient id="skinGrad" x1="30%" y1="20%" x2="70%" y2="80%">
      <stop offset="0%" stop-color="#e8c39e" />
      <stop offset="50%" stop-color="#c99770" />
      <stop offset="100%" stop-color="#8a5a3c" />
    </linearGradient>
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2b1a15" />
      <stop offset="50%" stop-color="#150d0a" />
      <stop offset="100%" stop-color="#090504" />
    </linearGradient>
    <linearGradient id="clothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e2230" />
      <stop offset="100%" stop-color="#0b0d13" />
    </linearGradient>
    <radialGradient id="lighting" cx="35%" cy="30%" r="45%">
      <stop offset="0%" stop-color="rgba(255,230,200,0.25)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0)" />
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#bgGrad)" />
  <circle cx="450" cy="380" r="400" fill="url(#lighting)" />
  <path d="M 320,320 C 280,480 300,750 360,880 C 460,920 620,920 720,880 C 780,750 800,480 760,320 C 730,180 350,180 320,320 Z" fill="url(#hairGrad)" />
  <path d="M 220,1080 C 250,880 360,780 440,740 L 640,740 C 720,780 830,880 860,1080 Z" fill="url(#clothGrad)" />
  <path d="M 470,620 L 470,750 L 610,750 L 610,620 Z" fill="url(#skinGrad)" opacity="0.9" />
  <ellipse cx="540" cy="460" rx="160" ry="210" fill="url(#skinGrad)" />
  <path d="M 340,360 C 370,220 710,220 740,360 C 710,320 620,290 540,290 C 440,290 370,320 340,360 Z" fill="url(#hairGrad)" />
  <path d="M 340,360 C 380,440 380,560 360,650 C 340,540 320,440 340,360 Z" fill="url(#hairGrad)" />
  <path d="M 740,360 C 700,440 700,560 720,650 C 740,540 760,440 740,360 Z" fill="url(#hairGrad)" />
  <path d="M 440,410 C 470,400 500,410 500,410" stroke="#150d0a" stroke-width="6" stroke-linecap="round" fill="none" />
  <path d="M 580,410 C 610,400 640,410 640,410" stroke="#150d0a" stroke-width="6" stroke-linecap="round" fill="none" />
  <ellipse cx="470" cy="445" rx="22" ry="12" fill="#ffffff" />
  <circle cx="470" cy="445" r="9" fill="#3d271d" />
  <circle cx="473" cy="442" r="3" fill="#ffffff" />
  <ellipse cx="610" cy="445" rx="22" ry="12" fill="#ffffff" />
  <circle cx="610" cy="445" r="9" fill="#3d271d" />
  <circle cx="613" cy="442" r="3" fill="#ffffff" />
  <path d="M 540,440 L 535,510 L 555,510" stroke="#8a5a3c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <path d="M 495,570 C 520,555 560,555 585,570 C 560,600 520,600 495,570 Z" fill="#a84343" />
  <path d="M 505,570 C 525,565 555,565 575,570" stroke="#682121" stroke-width="2" fill="none" />
</svg>
`)}`;

export const OFFICIAL_MIMUUS_LOGO =
  'https://019bc6fe-722c-7e1d-a8b7-6793fe9b05ee.mochausercontent.com/icon-mimuus-logotipo-oficial.png';

export const DEFAULT_MODEL_DATA: ModelData = {
  nome: 'Valentina',
  idade: 29,
  altura: '1,69',
  peso: 66,
  novidade: true,
  texto_novidade: 'NOVIDADE',
  etiquetaAtiva: true,
  etiquetaTexto: 'NOVIDADE',
};

export const DEFAULT_EDIT_CONFIG: EditConfig = {
  dimension: 'original',
  imageTransform: {
    scale: 100,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  },
  blackStrip: {
    active: false, // Desativado por padrão para não fixar barra no rodapé
    opacity: 0.5,
    text: '',
    fontSize: 28,
    fontFamily: 'Gilda Display',
    position: 'bottom',
  },
  pixelateBlur: {
    active: false,
    type: 'blur',
    mode: 'rectangle',
    density: 18,
    regions: [],
  },
  magicEraser: {
    active: false,
    mode: 'tattoo',
    brushSize: 25,
    strokes: [],
  },
  profileCard: {
    active: true,
    position: 'bottom_right',
    customX: 85,
    customY: 88,
    align: 'right',
    nomeCor: '#FFFFFF',
    nomeFonte: 'Gilda Display',
    nomeTamanho: 34,
    nomeBandagemDourada: {
      enabled: true,
      placement: 'half_bottom',
      width: 108,
      height: 36,
      offsetX: 0,
      offsetY: 6,
      opacity: 0.9,
      style: 'shiny_gold',
      softEdges: true,
    },
    nomeFaixaPreta: {
      enabled: false, // Opcional! O usuário ativa quando quiser e NÃO automático
      opacity: 0.75,
      blur: 10,
      width: 115,
      height: 36,
      offsetX: 0,
      offsetY: 4,
      style: 'capsula',
    },
    infoCorTexto: '#FFFFFF',
    infoCorSeparadores: '#d4af37',
    infoSeparadorSimbolo: '',
    infoSeparadorTamanho: 100,
    infoFonte: 'Montserrat',
    infoTamanho: 18,
    infoEspacamento: 12,
    infoIdadeFormato: 'sem_espaco',
    infoAlturaFormato: 'virgula_m',
    infoPesoFormato: 'kg_junto',
    infoSombraAtiva: false, // Fundo/Sombra dedicada que segue as informações (igual ao logo)
    infoSombraIntensidade: 65,
    infoSombraBlur: 16,
    infoSombraTamanho: 120, // 50% - 250%
    infoSombraEstilo: 'suave_radial',
    sombraAtiva: false, // Desativada a sombra global automática para não sujar o nome
    sombraIntensidade: 0,
    sombraBlur: 26,
    etiquetaAtiva: true,
    etiquetaTexto: 'NOVIDADE',
    etiquetaCaixaAlta: true,
    etiquetaEstilo: 'faixa_dourada',
    faixaSombraIntensidade: 75,
    faixaSombraBlur: 8,
    faixaDegradeIntensidade: 80,
    faixaTamanho: 100,
    faixaOffsetX: 0,
    faixaOffsetY: 0,
  },
  nameOverlay: {
    active: true,
    text: 'Valentina',
    fontSize: 32,
    fontFamily: 'Gilda Display',
    textColor: '#FFFFFF',
    goldBand: {
      enabled: true,
      width: 105,
      height: 48,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.9,
      style: 'shiny_gold',
    },
    blackBand: {
      enabled: false,
      opacity: 0.75,
      blur: 10,
      width: 115,
      height: 36,
      offsetX: 0,
      offsetY: 4,
      style: 'capsula',
    },
    positionX: 85,
    positionY: 82,
  },
  infoOverlay: {
    active: true,
    idade: '29anos',
    altura: '1,69m',
    peso: '66kg',
    fontSize: 18,
    fontFamily: 'Montserrat',
    textColor: '#FFFFFF',
    goldDots: false,
    shadowActive: false,
    shadowIntensity: 65,
    shadowBlur: 16,
    shadowSpread: 120,
    positionX: 85,
    positionY: 88,
  },
  highlightOverlay: {
    active: true,
    text: 'NOVIDADE',
    fontSize: 16,
    fontFamily: 'Montserrat',
    textColor: '#FFFFFF',
    goldBand: {
      enabled: true,
      width: 85,
      height: 32,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.9,
      style: 'classic_gold',
    },
    positionX: 85,
    positionY: 94,
  },
  logoOverlay: {
    active: true,
    imageUrl: OFFICIAL_MIMUUS_LOGO,
    position: 'top_left',
    freeX: 10,
    freeY: 6,
    scale: 65,
    opacity: 0.95,
    margin: 4,
    rotation: 0,
    shadowActive: true,
    shadowIntensity: 60,
    shadowBlur: 14,
    shadowSpread: 120,
  },
  organization: {
    selectedElements: {
      nome: true,
      informacoes: true,
      bandagem: true,
      faixa: true,
      sombra: true,
    },
    spacing: 14,
    groupY: 80,
    groupX: 50,
    isGrouped: false,
  },
  bottomNameBand: {
    enabled: false, // Desativada por padrão
    height: 58,
    backgroundColor: '#000000',
    backgroundOpacity: 78,
    textColor: '#FFFFFF',
    fontSize: 26,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    letterSpacing: 4,
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
  },
};

export const INITIAL_PRESETS: Preset[] = [];

export const CLEAN_EDIT_CONFIG: EditConfig = {
  ...DEFAULT_EDIT_CONFIG,
  bottomNameBand: {
    ...DEFAULT_EDIT_CONFIG.bottomNameBand!,
    enabled: false,
  },
  blackStrip: {
    ...DEFAULT_EDIT_CONFIG.blackStrip,
    active: false,
  },
  profileCard: {
    ...DEFAULT_EDIT_CONFIG.profileCard,
    active: false,
  },
  nameOverlay: {
    ...DEFAULT_EDIT_CONFIG.nameOverlay,
    active: false,
  },
  infoOverlay: {
    ...DEFAULT_EDIT_CONFIG.infoOverlay,
    active: false,
  },
  highlightOverlay: {
    ...DEFAULT_EDIT_CONFIG.highlightOverlay,
    active: false,
  },
  logoOverlay: {
    ...DEFAULT_EDIT_CONFIG.logoOverlay,
    active: false,
  },
};


export const AVAILABLE_FONTS = [
  { name: 'Gilda Display', label: 'Gilda Display (Preferencial)' },
  { name: 'Playfair Display', label: 'Playfair Display' },
  { name: 'Cinzel', label: 'Cinzel (Clássica Roman)' },
  { name: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { name: 'Montserrat', label: 'Montserrat (Moderna Minimalista)' },
];
