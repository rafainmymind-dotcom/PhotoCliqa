import React from 'react';
import { ActiveTab, BrandConfig, ExportFormat } from '../types';
import { getEffectiveTheme } from '../utils/theme';
import {
  Upload,
  Sliders,
  Image as ImageIcon,
  Copy,
  Download,
  Archive,
  Sparkles,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  imageCount: number;
  brandConfig: BrandConfig;
  exportFormat: ExportFormat;
  setExportFormat: (fmt: ExportFormat) => void;
  onOpenThemeModal: () => void;
  onDuplicateToAll: () => void;
  onDownloadCurrent: () => void;
  onDownloadZipAll: () => void;
  isProcessingZip: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  imageCount,
  brandConfig,
  exportFormat,
  setExportFormat,
  onOpenThemeModal,
  onDuplicateToAll,
  onDownloadCurrent,
  onDownloadZipAll,
  isProcessingZip,
}) => {
  const themeOpt = getEffectiveTheme(brandConfig);
  const logoH = brandConfig.logoHeight || 36;
  const titleFont = brandConfig.titleFont || 'Gilda Display';
  const titleFontSize = brandConfig.titleFontSize || 18;
  const showBadge = brandConfig.showBadge !== false;
  const badgeText = brandConfig.badgeText ?? 'PRO';
  const subtitle = brandConfig.subtitle ?? 'Gerenciador & Editor de Fotos';

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveTab('editor')}>
            <div
              style={{
                borderColor: `${themeOpt.colorHex}40`,
                width: `${Math.max(34, logoH + 6)}px`,
                height: `${Math.max(34, logoH + 6)}px`,
              }}
              className="rounded-xl bg-slate-950 p-1 border shadow-md flex items-center justify-center overflow-hidden flex-shrink-0"
            >
              {brandConfig.logoUrl ? (
                <img
                  src={brandConfig.logoUrl}
                  alt="Logo"
                  style={{ maxHeight: `${logoH}px` }}
                  className="max-w-full object-contain"
                />
              ) : (
                <Sparkles className="w-5 h-5" style={{ color: themeOpt.colorHex }} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1
                  style={{
                    fontFamily: titleFont,
                    fontSize: `${titleFontSize}px`,
                  }}
                  className="font-bold tracking-wide text-slate-100 leading-tight"
                >
                  {(brandConfig.name || 'PhotoCliqa').toUpperCase()}
                </h1>

                {showBadge && badgeText && (
                  <span
                    style={{
                      backgroundColor: `${themeOpt.colorHex}20`,
                      color: themeOpt.colorHex,
                      borderColor: `${themeOpt.colorHex}40`,
                    }}
                    className="text-[10px] font-sans px-2 py-0.2 rounded-full border font-bold"
                  >
                    {badgeText}
                  </span>
                )}

                {/* Ícone discreto e pequeno para o Menu Geral / Configurações da Empresa */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenThemeModal();
                  }}
                  title="Configurações gerais do sistema"
                  className="opacity-30 hover:opacity-100 text-slate-500 hover:text-slate-300 p-1 rounded-md transition-all cursor-pointer ml-0.5"
                >
                  <Settings className="w-3 h-3" />
                </button>
              </div>
              {subtitle && <p className="text-[11px] text-slate-400 font-sans leading-tight">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span
              style={{
                backgroundColor: `${themeOpt.colorHex}20`,
                color: themeOpt.colorHex,
                borderColor: `${themeOpt.colorHex}40`,
              }}
              className="text-xs px-2.5 py-1 rounded-lg border font-semibold"
            >
              {imageCount} {imageCount === 1 ? 'foto' : 'fotos'}
            </span>
          </div>
        </div>

        {/* Page Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('upload_form')}
            style={
              activeTab === 'upload_form'
                ? {
                    backgroundColor: themeOpt.colorHex,
                    color: '#020617',
                  }
                : undefined
            }
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'upload_form'
                ? 'font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Página 1: Upload / Dados</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            style={
              activeTab === 'presets'
                ? {
                    backgroundColor: themeOpt.colorHex,
                    color: '#020617',
                  }
                : undefined
            }
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'presets'
                ? 'font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Página 2: Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            style={
              activeTab === 'editor'
                ? {
                    backgroundColor: themeOpt.colorHex,
                    color: '#020617',
                  }
                : undefined
            }
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'editor'
                ? 'font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Página 3: Editor</span>
            {imageCount > 0 && (
              <span className="ml-1 text-[10px] bg-slate-900 text-slate-200 font-bold px-1.5 py-0.5 rounded-full border border-slate-700">
                {imageCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {imageCount > 1 && (
            <button
              onClick={onDuplicateToAll}
              title="Duplicar alterações da foto atual para todas as outras fotos"
              className="hidden lg:flex items-center gap-1.5 text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-300" />
              <span>Duplicar em Todas</span>
            </button>
          )}

          {/* Formato do Arquivo (PNG / WebP) */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-700/80">
            <span className="text-[10px] text-slate-400 font-semibold pl-1 whitespace-nowrap hidden sm:inline">
              Formato:
            </span>
            <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-800">
              <button
                type="button"
                onClick={() => setExportFormat('png')}
                title="Exportar em PNG (MIME image/png, máxima nitidez, sem perdas, transparências preservadas)"
                style={exportFormat === 'png' ? { backgroundColor: themeOpt.colorHex, color: '#020617' } : undefined}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  exportFormat === 'png'
                    ? 'shadow-sm font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                PNG
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('webp')}
                title="Exportar em WebP (MIME image/webp, superleve e otimizado para web)"
                style={exportFormat === 'webp' ? { backgroundColor: themeOpt.colorHex, color: '#020617' } : undefined}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  exportFormat === 'webp'
                    ? 'shadow-sm font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                WebP
              </button>
            </div>
          </div>

          {/* Baixar Imagem Atual */}
          <button
            onClick={onDownloadCurrent}
            disabled={imageCount === 0}
            title={`Baixar foto atual no formato ${exportFormat.toUpperCase()} (.${exportFormat})`}
            style={{
              backgroundColor: `${themeOpt.colorHex}20`,
              color: themeOpt.colorHex,
              borderColor: `${themeOpt.colorHex}40`,
            }}
            className="flex items-center gap-1.5 text-xs border hover:opacity-90 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer font-semibold shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Foto (.{exportFormat})</span>
          </button>

          {/* Baixar Todas em ZIP */}
          <button
            onClick={onDownloadZipAll}
            disabled={imageCount === 0 || isProcessingZip}
            title={`Baixar todas as fotos em ZIP no formato ${exportFormat.toUpperCase()} (.${exportFormat})`}
            style={{
              backgroundColor: themeOpt.colorHex,
              color: '#020617',
            }}
            className="flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-lg shadow-md transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer hover:opacity-95"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{isProcessingZip ? 'Gerando ZIP...' : `Baixar ZIP (${exportFormat.toUpperCase()})`}</span>
          </button>

          {/* Ícone discreto final adicional no canto direito */}
          <button
            type="button"
            onClick={onOpenThemeModal}
            title="Configurações gerais"
            className="opacity-25 hover:opacity-90 text-slate-500 hover:text-slate-300 p-1.5 rounded-lg transition-all cursor-pointer hidden md:flex items-center justify-center"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

