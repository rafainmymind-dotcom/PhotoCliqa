import React, { useState } from 'react';
import { BrandConfig, ThemeColorKey, FontScaleKey } from '../types';
import { THEME_OPTIONS, DEFAULT_BRAND_CONFIG, getEffectiveTheme } from '../utils/theme';
import { AVAILABLE_FONTS } from '../utils/defaults';
import {
  X,
  Palette,
  Image as ImageIcon,
  Check,
  Sparkles,
  Upload,
  RotateCcw,
  Type,
  Sliders,
  Building2,
  Lock,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface BrandThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandConfig: BrandConfig;
  onSaveBrandConfig: (newConfig: BrandConfig) => void;
}

export const BrandThemeModal: React.FC<BrandThemeModalProps> = ({
  isOpen,
  onClose,
  brandConfig,
  onSaveBrandConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'brand' | 'colors' | 'typography'>('brand');

  const [name, setName] = useState(brandConfig.name || DEFAULT_BRAND_CONFIG.name);
  const [subtitle, setSubtitle] = useState(brandConfig.subtitle ?? DEFAULT_BRAND_CONFIG.subtitle ?? '');
  const [badgeText, setBadgeText] = useState(brandConfig.badgeText ?? DEFAULT_BRAND_CONFIG.badgeText ?? 'PRO');
  const [showBadge, setShowBadge] = useState(brandConfig.showBadge !== false);

  const [logoUrl, setLogoUrl] = useState(brandConfig.logoUrl || DEFAULT_BRAND_CONFIG.logoUrl);
  const [logoHeight, setLogoHeight] = useState(brandConfig.logoHeight ?? 36);

  const [selectedTheme, setSelectedTheme] = useState<ThemeColorKey>(brandConfig.themeColor || 'amber');
  const [customColorHex, setCustomColorHex] = useState(brandConfig.customColorHex || '#f59e0b');

  const [titleFont, setTitleFont] = useState(brandConfig.titleFont || 'Gilda Display');
  const [titleFontSize, setTitleFontSize] = useState(brandConfig.titleFontSize ?? 18);
  const [fontScale, setFontScale] = useState<FontScaleKey>(brandConfig.fontScale || 'normal');
  const [darkBgMode, setDarkBgMode] = useState<'slate' | 'charcoal' | 'black'>(brandConfig.darkBgMode || 'slate');

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setLogoUrl(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToFactoryDefaults = () => {
    setName(DEFAULT_BRAND_CONFIG.name);
    setSubtitle(DEFAULT_BRAND_CONFIG.subtitle || '');
    setBadgeText(DEFAULT_BRAND_CONFIG.badgeText || 'PRO');
    setShowBadge(true);
    setLogoUrl(DEFAULT_BRAND_CONFIG.logoUrl);
    setLogoHeight(36);
    setSelectedTheme('amber');
    setCustomColorHex('#f59e0b');
    setTitleFont('Gilda Display');
    setTitleFontSize(18);
    setFontScale('normal');
    setDarkBgMode('slate');
  };

  const handleSave = () => {
    const updated: BrandConfig = {
      name: name.trim() || 'PhotoCliqa',
      subtitle: subtitle.trim(),
      badgeText: badgeText.trim(),
      showBadge,
      logoUrl: logoUrl.trim(),
      logoHeight,
      themeColor: selectedTheme,
      customColorHex,
      titleFont,
      titleFontSize,
      fontScale,
      darkBgMode,
    };
    onSaveBrandConfig(updated);
    onClose();
  };

  const previewTheme = getEffectiveTheme({
    name,
    logoUrl,
    themeColor: selectedTheme,
    customColorHex,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl border flex items-center justify-center shadow-inner"
              style={{
                backgroundColor: `${previewTheme.colorHex}20`,
                borderColor: `${previewTheme.colorHex}40`,
                color: previewTheme.colorHex,
              }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-100">Menu Geral da Empresa</h3>
                <span className="flex items-center gap-1 text-[10px] bg-slate-800/90 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                  <Lock className="w-2.5 h-2.5" /> Acesso Administrativo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalize a logo do PhotoCliqa, cores corporativas, fontes e identidade visual da sua empresa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-6 pt-3 border-b border-slate-800 bg-slate-950/40">
          {[
            { id: 'brand', label: 'Logo & Nome da Empresa', icon: Building2 },
            { id: 'colors', label: 'Cores da Empresa', icon: Palette },
            { id: 'typography', label: 'Tipografia & Tamanho da Fonte', icon: Type },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${
                  isCurrent
                    ? 'border-amber-400 text-amber-300 bg-slate-900 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Live Preview Box */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/90 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Pré-visualização do Cabeçalho da Empresa:</span>
              <span className="text-amber-400/90 text-[10px] font-mono">Em tempo real</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl p-0.5 shadow-md flex items-center justify-center bg-slate-950 border overflow-hidden"
                  style={{
                    borderColor: `${previewTheme.colorHex}50`,
                    width: `${Math.max(32, logoHeight + 8)}px`,
                    height: `${Math.max(32, logoHeight + 8)}px`,
                  }}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      style={{ height: `${logoHeight}px` }}
                      className="max-w-full object-contain"
                    />
                  ) : (
                    <Sparkles className="w-5 h-5" style={{ color: previewTheme.colorHex }} />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{
                        fontFamily: titleFont,
                        fontSize: `${titleFontSize}px`,
                      }}
                      className="font-bold tracking-wide text-slate-100"
                    >
                      {name.toUpperCase()}
                    </span>
                    {showBadge && badgeText && (
                      <span
                        style={{
                          backgroundColor: `${previewTheme.colorHex}25`,
                          color: previewTheme.colorHex,
                          borderColor: `${previewTheme.colorHex}50`,
                        }}
                        className="text-[10px] font-sans px-2 py-0.5 rounded-full border font-bold"
                      >
                        {badgeText}
                      </span>
                    )}
                  </div>
                  {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
                </div>
              </div>

              {/* Botão de Amostra */}
              <button
                type="button"
                style={{
                  backgroundColor: previewTheme.colorHex,
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 shadow-md hidden sm:block pointer-events-none"
              >
                Botão Modelo
              </button>
            </div>
          </div>

          {/* TAB 1: BRAND & LOGO */}
          {activeTab === 'brand' && (
            <div className="space-y-5 animate-fadeIn">
              {/* 1. Troca da Logo */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Logotipo da Empresa (Ícone / Imagem)</span>
                  </label>
                  {logoUrl !== DEFAULT_BRAND_CONFIG.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl(DEFAULT_BRAND_CONFIG.logoUrl)}
                      className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Restaurar Logo Padrão
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-2 flex-shrink-0 overflow-hidden shadow-md">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-all shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Carregar Imagem da Logo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>

                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="text-xs text-rose-400 hover:text-rose-300 bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl transition-colors"
                        >
                          Remover Logo
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">Ou informe a URL direta da Logo:</label>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://minhaempresa.com/logo.png"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Altura da Logo no Cabeçalho */}
                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] text-slate-300">Tamanho da Logo no Cabeçalho</label>
                    <span className="text-[11px] text-amber-300 font-mono font-bold">{logoHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="64"
                    value={logoHeight}
                    onChange={(e) => setLogoHeight(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 2. Nome da Empresa & Textos */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <label className="text-xs font-bold text-slate-200 block">
                  Identidade Textual da Empresa
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Nome da Empresa / Sistema</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="PhotoCliqa"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 font-medium outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Slogan / Subtítulo</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Gerenciador & Editor de Fotos"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Texto da Badge (Selo)</label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      placeholder="PRO, VIP, STUDIO"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 self-end">
                    <span className="text-xs text-slate-300 font-medium">Exibir Badge</span>
                    <button
                      type="button"
                      onClick={() => setShowBadge(!showBadge)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        showBadge ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {showBadge ? 'Ativado' : 'Oculto'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Seletor de Paleta Corporativa */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <label className="text-xs font-bold text-slate-200 block">
                  Paleta de Cores Corporativas Pré-definidas
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(THEME_OPTIONS) as ThemeColorKey[])
                    .filter((k) => k !== 'custom')
                    .map((key) => {
                      const opt = THEME_OPTIONS[key];
                      const isSelected = selectedTheme === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedTheme(key)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-400 bg-slate-900 shadow-md ring-2 ring-amber-400/20'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm border border-white/20"
                            style={{ backgroundColor: opt.colorHex }}
                          />
                          <span className="truncate flex-1 text-[11px]">{opt.label.split(' ')[0]}</span>
                          {isSelected && <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Cor Personalizada da Empresa (Custom HEX) */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>Cor Exata da Empresa (Código Hexadecimal Personalizado)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSelectedTheme('custom')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'custom'
                        ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {selectedTheme === 'custom' ? 'Usando Cor Customizada' : 'Ativar Cor Customizada'}
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => {
                      setCustomColorHex(e.target.value);
                      setSelectedTheme('custom');
                    }}
                    className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-slate-400">Código Hexadecimal da Marca:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customColorHex}
                        onChange={(e) => {
                          setCustomColorHex(e.target.value);
                          setSelectedTheme('custom');
                        }}
                        placeholder="#f59e0b"
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono uppercase focus:border-amber-500 focus:outline-none w-32"
                      />
                      <span className="text-[11px] text-slate-400">
                        Aplica a cor da sua empresa em todos os botões e detalhes do sistema
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tonalidade de Fundo */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <label className="text-xs font-bold text-slate-200 block">
                  Tonalidade do Fundo da Interface
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'slate', label: 'Dark Slate (Padrão)', desc: 'Azul escuro moderno' },
                    { id: 'charcoal', label: 'Grafite / Charcoal', desc: 'Cinza escuro neutro' },
                    { id: 'black', label: 'Preto Absoluto', desc: 'Preto profundo OLED' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setDarkBgMode(bg.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        darkBgMode === bg.id
                          ? 'border-amber-400 bg-slate-900 shadow-md ring-2 ring-amber-400/20'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-100">{bg.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{bg.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY & FONT SIZES */}
          {activeTab === 'typography' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Fonte do Título / Logo */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <label className="text-xs font-bold text-slate-200 block">
                  Tipografia do Nome da Empresa / Logo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {AVAILABLE_FONTS.map((font) => (
                    <button
                      key={font.name}
                      type="button"
                      onClick={() => setTitleFont(font.name)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        titleFont === font.name
                          ? 'border-amber-400 bg-slate-900 shadow-md ring-2 ring-amber-400/20 text-amber-300'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div style={{ fontFamily: font.name }} className="text-base font-bold truncate">
                        {name || 'PhotoCliqa'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-sans">{font.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tamanho da Fonte do Título */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-200">Tamanho da Fonte do Nome da Marca</label>
                  <span className="text-xs text-amber-300 font-mono font-bold">{titleFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="28"
                  value={titleFontSize}
                  onChange={(e) => setTitleFontSize(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Escala Geral da Interface */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <label className="text-xs font-bold text-slate-200 block">
                  Escala Geral das Fontes da Interface (Densidade de Tela)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'compact', label: 'Compacto', scale: '92% - Maior densidade de botões' },
                    { id: 'normal', label: 'Padrão', scale: '100% - Equilibrado e nítido' },
                    { id: 'comfortable', label: 'Confortável', scale: '108% - Fontes maiores e leitura fácil' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFontScale(s.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fontScale === s.id
                          ? 'border-amber-400 bg-slate-900 shadow-md ring-2 ring-amber-400/20'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-100">{s.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.scale}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            type="button"
            onClick={handleResetToFactoryDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões de Fábrica</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              style={{
                backgroundColor: previewTheme.colorHex,
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black text-slate-950 transition-all shadow-lg hover:opacity-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Salvar Configurações da Empresa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

