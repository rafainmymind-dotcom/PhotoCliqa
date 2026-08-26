import React from 'react';
import { EditConfig } from '../../types';
import { RotateCcw, Sliders } from 'lucide-react';

interface FiltrosSectionProps {
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
}

export const FiltrosSection: React.FC<FiltrosSectionProps> = ({
  config,
  updateConfig,
}) => {
  const filters = config.filters || { brightness: 100, contrast: 100, saturation: 100, vignette: 0 };

  const handleReset = () => {
    updateConfig((prev) => ({
      ...prev,
      filters: { brightness: 100, contrast: 100, saturation: 100, vignette: 0 },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-slate-200">Ajustes & Filtros de Imagem</span>
        </div>
        <button
          onClick={handleReset}
          className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          title="Restaurar padrão"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Resetar</span>
        </button>
      </div>

      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        {/* Brilho */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Brilho</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {filters.brightness}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={filters.brightness}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                filters: { ...(prev.filters || filters), brightness: val },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Contraste */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Contraste</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {filters.contrast}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={filters.contrast}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                filters: { ...(prev.filters || filters), contrast: val },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Saturação */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Saturação</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {filters.saturation}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.saturation}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                filters: { ...(prev.filters || filters), saturation: val },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Vinheta */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Vinheta Escura (Bordas)</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {filters.vignette}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.vignette}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                filters: { ...(prev.filters || filters), vignette: val },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Fundo Preto Degradê Inferior */}
        <div className="space-y-1 pt-2 border-t border-slate-850">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-amber-300 font-bold">Degradê Fundo Preto (Base da Imagem)</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {filters.fundoPretoInferiorDensidade || 0}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.fundoPretoInferiorDensidade || 0}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                filters: {
                  ...(prev.filters || filters),
                  fundoPretoInferiorAtivo: val > 0,
                  fundoPretoInferiorDensidade: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
