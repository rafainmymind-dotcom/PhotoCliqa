import React, { useRef } from 'react';
import { EditConfig, LogoPosition } from '../../types';
import { RotateCw, Sparkles, Upload } from 'lucide-react';
import { OFFICIAL_MIMUUS_LOGO } from '../../utils/defaults';

interface LogoSectionProps {
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  config,
  updateConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logo = config.logoOverlay;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (url) {
          updateConfig((prev) => ({
            ...prev,
            logoOverlay: {
              ...prev.logoOverlay,
              imageUrl: url,
              active: true,
            },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const POSITIONS: { id: LogoPosition; label: string }[] = [
    { id: 'top_left', label: '↖ Superior Esq.' },
    { id: 'top_center', label: '↑ Superior Centro' },
    { id: 'top_right', label: '↗ Superior Dir.' },
    { id: 'center_left', label: '← Meio Esq.' },
    { id: 'center', label: '• Centro' },
    { id: 'center_right', label: '→ Meio Dir.' },
    { id: 'bottom_left', label: '↙ Inferior Esq.' },
    { id: 'bottom_center', label: '↓ Inferior Centro' },
    { id: 'bottom_right', label: '↘ Inferior Dir.' },
  ];

  return (
    <div className="space-y-4">
      {/* Ativar/Desativar Logo */}
      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-slate-200">Exibir Logo / Marca D’água</span>
        </div>
        <button
          onClick={() =>
            updateConfig((prev) => ({
              ...prev,
              logoOverlay: {
                ...prev.logoOverlay,
                active: !prev.logoOverlay.active,
              },
            }))
          }
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            logo.active
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {logo.active ? 'Ativado' : 'Desativado'}
        </button>
      </div>

      {/* Imagem do Logotipo & Upload */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-200">Imagem do Logotipo</span>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center p-1.5 shrink-0 shadow-inner">
            {logo.imageUrl ? (
              <img
                src={logo.imageUrl}
                alt="Logo Preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <Sparkles className="w-6 h-6 text-slate-600" />
            )}
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Trocar Logotipo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {logo.imageUrl !== OFFICIAL_MIMUUS_LOGO && (
              <button
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    logoOverlay: {
                      ...prev.logoOverlay,
                      imageUrl: OFFICIAL_MIMUUS_LOGO,
                    },
                  }))
                }
                className="text-[9px] text-slate-400 hover:text-amber-300 transition-colors text-left"
              >
                Restaurar logotipo oficial Mimuus
              </button>
            )}
          </div>
        </div>
      </div>

      {logo.active && (
        <>
          {/* Posicionamento em Grade 3x3 */}
          <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-200">Posição na Imagem (Grade 3×3)</span>
              <button
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    logoOverlay: { ...prev.logoOverlay, position: 'free' },
                  }))
                }
                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                  logo.position === 'free'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Posição Livre
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {POSITIONS.map((pos) => {
                const isSelected = logo.position === pos.id;
                return (
                  <button
                    key={pos.id}
                    onClick={() =>
                      updateConfig((prev) => ({
                        ...prev,
                        logoOverlay: { ...prev.logoOverlay, position: pos.id },
                      }))
                    }
                    className={`p-2 rounded-lg border text-center text-[10px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {pos.label}
                  </button>
                );
              })}
            </div>

            {/* Posição Livre Sliders */}
            {logo.position === 'free' && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] text-slate-400">Posição X</label>
                    <span className="text-[10px] text-amber-300 font-mono">{logo.freeX ?? 10}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={logo.freeX ?? 10}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateConfig((prev) => ({
                        ...prev,
                        logoOverlay: { ...prev.logoOverlay, freeX: val },
                      }));
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] text-slate-400">Posição Y</label>
                    <span className="text-[10px] text-amber-300 font-mono">{logo.freeY ?? 10}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={logo.freeY ?? 10}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateConfig((prev) => ({
                        ...prev,
                        logoOverlay: { ...prev.logoOverlay, freeY: val },
                      }));
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Margem, Escala, Rotação e Opacidade */}
          <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-200">Dimensões & Aparência</span>

            {/* Margem de Afastamento das Bordas */}
            {logo.position !== 'free' && (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[10px] text-slate-400">Margem das Bordas</label>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    {logo.margin ?? 4}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={logo.margin ?? 4}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateConfig((prev) => ({
                      ...prev,
                      logoOverlay: { ...prev.logoOverlay, margin: val },
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}

            {/* Escala / Tamanho */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-400">Tamanho / Escala</label>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {logo.scale ?? 65}%
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                value={logo.scale ?? 65}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    logoOverlay: { ...prev.logoOverlay, scale: val },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Rotação */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-amber-400" />
                  Rotação do Logo
                </label>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {logo.rotation ?? 0}°
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={logo.rotation ?? 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    logoOverlay: { ...prev.logoOverlay, rotation: val },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Opacidade */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-400">Opacidade</label>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {Math.round((logo.opacity ?? 0.95) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={logo.opacity ?? 0.95}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    logoOverlay: { ...prev.logoOverlay, opacity: val },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Sombra de Fundo Difusa do Logo */}
          <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-200">Sombra de Fundo Difusa</span>
                <span className="text-[9px] text-slate-400">
                  Garante destaque do logo sobre qualquer cor de fundo
                </span>
              </div>
              <input
                type="checkbox"
                checked={logo.shadowActive !== false}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  updateConfig((prev) => ({
                    ...prev,
                    logoOverlay: { ...prev.logoOverlay, shadowActive: isChecked },
                  }));
                }}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {logo.shadowActive !== false && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                {/* Intensidade */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] text-slate-300">Intensidade da Sombra</label>
                    <span className="text-[10px] text-amber-300 font-mono font-bold">
                      {logo.shadowIntensity ?? 60}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={logo.shadowIntensity ?? 60}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateConfig((prev) => ({
                        ...prev,
                        logoOverlay: { ...prev.logoOverlay, shadowIntensity: val },
                      }));
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Desfoque / Blur */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] text-slate-300">Desfoque / Difusão</label>
                    <span className="text-[10px] text-amber-300 font-mono font-bold">
                      {logo.shadowBlur ?? 14}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={logo.shadowBlur ?? 14}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateConfig((prev) => ({
                        ...prev,
                        logoOverlay: { ...prev.logoOverlay, shadowBlur: val },
                      }));
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Extensão / Spread */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] text-slate-300">Extensão do Degradê</label>
                    <span className="text-[10px] text-amber-300 font-mono font-bold">
                      {logo.shadowSpread ?? 120}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={logo.shadowSpread ?? 120}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateConfig((prev) => ({
                        ...prev,
                        logoOverlay: { ...prev.logoOverlay, shadowSpread: val },
                      }));
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
