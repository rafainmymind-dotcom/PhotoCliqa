import { BrandConfig, ThemeColorKey } from '../types';

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  name: 'PhotoCliqa',
  subtitle: 'Gerenciador & Editor de Fotos',
  badgeText: 'PRO',
  showBadge: true,
  logoUrl: 'https://019bc6fe-722c-7e1d-a8b7-6793fe9b05ee.mochausercontent.com/icon-mimuus-logotipo-oficial.png',
  logoHeight: 36,
  themeColor: 'amber',
  customColorHex: '#f59e0b',
  titleFont: 'Gilda Display',
  titleFontSize: 18,
  fontScale: 'normal',
  darkBgMode: 'slate',
};

export interface ThemeOption {
  key: ThemeColorKey;
  label: string;
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  btnPrimary: string;
  gradientBg: string;
}

export const THEME_OPTIONS: Record<ThemeColorKey, ThemeOption> = {
  amber: {
    key: 'amber',
    label: 'Dourado / Luxo (Gold)',
    colorHex: '#f59e0b',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    border: 'border-amber-500/40',
    btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    gradientBg: 'from-amber-600 via-amber-400 to-yellow-200',
  },
  emerald: {
    key: 'emerald',
    label: 'Verde Esmeralda',
    colorHex: '#10b981',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    border: 'border-emerald-500/40',
    btnPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    gradientBg: 'from-emerald-600 via-emerald-400 to-teal-200',
  },
  sapphire: {
    key: 'sapphire',
    label: 'Azul Safira',
    colorHex: '#3b82f6',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    border: 'border-blue-500/40',
    btnPrimary: 'bg-blue-500 hover:bg-blue-400 text-white',
    gradientBg: 'from-blue-600 via-blue-400 to-cyan-200',
  },
  rose: {
    key: 'rose',
    label: 'Rosa Luxo (Rose Gold)',
    colorHex: '#f43f5e',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    border: 'border-rose-500/40',
    btnPrimary: 'bg-rose-500 hover:bg-rose-400 text-white',
    gradientBg: 'from-rose-600 via-rose-400 to-pink-200',
  },
  purple: {
    key: 'purple',
    label: 'Roxo Neon (Amethyst)',
    colorHex: '#a855f7',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    border: 'border-purple-500/40',
    btnPrimary: 'bg-purple-500 hover:bg-purple-400 text-white',
    gradientBg: 'from-purple-600 via-purple-400 to-fuchsia-200',
  },
  coral: {
    key: 'coral',
    label: 'Laranja Coral / Energia',
    colorHex: '#f97316',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-300',
    border: 'border-orange-500/40',
    btnPrimary: 'bg-orange-500 hover:bg-orange-400 text-slate-950',
    gradientBg: 'from-orange-600 via-orange-400 to-amber-200',
  },
  mono: {
    key: 'mono',
    label: 'Prata Minimalista (Silver)',
    colorHex: '#9ca3af',
    badgeBg: 'bg-slate-400/20',
    badgeText: 'text-slate-200',
    border: 'border-slate-400/40',
    btnPrimary: 'bg-slate-200 hover:bg-white text-slate-950',
    gradientBg: 'from-slate-400 via-slate-200 to-white',
  },
  custom: {
    key: 'custom',
    label: 'Cor Personalizada da Empresa',
    colorHex: '#f59e0b',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    border: 'border-amber-500/40',
    btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    gradientBg: 'from-amber-600 via-amber-400 to-yellow-200',
  },
};

export function getEffectiveTheme(brandConfig: BrandConfig): ThemeOption {
  const baseKey = brandConfig.themeColor || 'amber';
  const theme = THEME_OPTIONS[baseKey] || THEME_OPTIONS.amber;

  if (baseKey === 'custom' && brandConfig.customColorHex) {
    return {
      ...theme,
      colorHex: brandConfig.customColorHex,
    };
  }

  return theme;
}
