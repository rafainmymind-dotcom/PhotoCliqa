import React from 'react';
import { EditConfig, ImageItem } from '../../types';
import { Moon, Sliders, Sparkles, RotateCcw, Layers, Eye, EyeOff } from 'lucide-react';
import { DEFAULT_EDIT_CONFIG } from '../../utils/defaults';

interface FundoPretoSectionProps {
  currentImage?: ImageItem;
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
}

export const FundoPretoSection: React.FC<FundoPretoSectionProps> = ({
  config,
  updateConfig,
}) => {
  const profile = config.profileCard || DEFAULT_EDIT_CONFIG.profileCard!;
  const filters = config.filters || { brightness: 100, contrast: 100, saturation: 100, vignette: 0 };
  const blackStrip = config.blackStrip || DEFAULT_EDIT_CONFIG.blackStrip;

  const rawDensity = profile.sombraDensidade ?? profile.sombraIntensidade ?? 60;
  const isProfileShadowActive = profile.sombraAtiva !== false;

  const handleResetFundoPreto = () => {
    updateConfig((prev) => ({
      ...prev,
      profileCard: {
        ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
        sombraAtiva: true,
        sombraIntensidade: 60,
        sombraDensidade: 60,
        sombraBlur: 26,
        sombraRaioHorizontal: 100,
        sombraRaioVertical: 100,
        sombraEstilo: 'suave_radial',
        sombraOffsetX: 0,
        sombraOffsetY: 0,
      },
      filters: {
        ...(prev.filters || filters),
        fundoPretoInferiorAtivo: false,
        fundoPretoInferiorDensidade: 0,
        fundoPretoInferiorAltura: 45,
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-amber-400" />
          <div>
            <span className="font-bold text-slate-100 text-xs block">Ajuste de Fundo Preto & Sombras</span>
            <span className="text-[10px] text-slate-400">Controle a densidade, cobertura e estilo do fundo escuro</span>
          </div>
        </div>
        <button
          onClick={handleResetFundoPreto}
          className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          title="Restaurar padrão"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Resetar</span>
        </button>
      </div>

      {/* 1. FUNDO PRETO / SOMBRA DO BLOCO DE PERFIL (NOME + DADOS) */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-200">Fundo Preto do Perfil (Atrás dos Textos)</span>
          </div>
          <button
            onClick={() =>
              updateConfig((prev) => ({
                ...prev,
                profileCard: {
                  ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
                  sombraAtiva: !isProfileShadowActive,
                },
              }))
            }
            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isProfileShadowActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isProfileShadowActive ? (
              <>
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Ativo</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 text-slate-500" />
                <span>Desativado</span>
              </>
            )}
          </button>
        </div>

        {/* Slider Principal de Densidade */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-semibold text-slate-300">
              Densidade do Fundo Preto
            </label>
            <span className="text-[11px] text-amber-300 font-mono font-bold px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
              {rawDensity}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={rawDensity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                profileCard: {
                  ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
                  sombraAtiva: true,
                  sombraIntensidade: val,
                  sombraDensidade: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />

          {/* Atalhos Rápidos de Densidade */}
          <div className="grid grid-cols-5 gap-1 pt-0.5">
            {[
              { label: '0%', val: 0 },
              { label: '30%', val: 30 },
              { label: '60%', val: 60 },
              { label: '85%', val: 85 },
              { label: '100%', val: 100 },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: {
                      ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
                      sombraAtiva: true,
                      sombraIntensidade: item.val,
                      sombraDensidade: item.val,
                    },
                  }))
                }
                className={`py-1 text-[9px] font-mono rounded border transition-all cursor-pointer ${
                  rawDensity === item.val
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estilo do Fundo Preto */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[10px] text-slate-400 block font-medium">Estilo / Formato do Fundo</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'suave_radial', label: 'Degradê Oval Suave' },
              { id: 'degrade_inferior', label: 'Degradê da Base' },
              { id: 'faixa_escura', label: 'Faixa Translúcida' },
              { id: 'vinheta_focal', label: 'Foco Intenso' },
            ].map((st) => {
              const isSel = (profile.sombraEstilo || 'suave_radial') === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() =>
                    updateConfig((prev) => ({
                      ...prev,
                      profileCard: {
                        ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
                        sombraEstilo: st.id as any,
                      },
                    }))
                  }
                  className={`p-2 rounded-lg text-left text-[10px] font-medium border transition-all cursor-pointer ${
                    isSel
                      ? 'bg-amber-500/15 border-amber-500/80 text-amber-200 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800/80 text-slate-400 hover:bg-slate-850 hover:text-slate-300'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Suavidade / Desfoque (Blur) */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Suavidade / Difusão das Bordas</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {profile.sombraBlur ?? 26}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            value={profile.sombraBlur ?? 26}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                profileCard: {
                  ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
                  sombraBlur: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Cobertura Horizontal (Largura) */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Espalhamento Horizontal (Largura)</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {profile.sombraRaioHorizontal ?? 100}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="250"
            value={profile.sombraRaioHorizontal ?? 100}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                profileCard: {
                  ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
                  sombraRaioHorizontal: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Cobertura Vertical (Altura) */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Espalhamento Vertical (Altura)</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {profile.sombraRaioVertical ?? 100}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="250"
            value={profile.sombraRaioVertical ?? 100}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                profileCard: {
                  ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
                  sombraRaioVertical: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 2. DEGRADÊ PRETO INFERIOR GERAL DA FOTO */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-200">Degradê Preto Inferior (Base Completa)</span>
          </div>
          <button
            onClick={() =>
              updateConfig((prev) => {
                const curFilters = prev.filters || filters;
                const active = !curFilters.fundoPretoInferiorAtivo;
                return {
                  ...prev,
                  filters: {
                    ...curFilters,
                    fundoPretoInferiorAtivo: active,
                    fundoPretoInferiorDensidade: active ? (curFilters.fundoPretoInferiorDensidade || 65) : 0,
                  },
                };
              })
            }
            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              filters.fundoPretoInferiorAtivo || (filters.fundoPretoInferiorDensidade && filters.fundoPretoInferiorDensidade > 0)
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {filters.fundoPretoInferiorAtivo ? 'Ativo' : 'Desativado'}
          </button>
        </div>

        {/* Densidade do Degradê Inferior */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Densidade do Preto na Base</label>
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

        {/* Altura do Degradê Inferior */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Altura da Cobertura do Degradê</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {filters.fundoPretoInferiorAltura || 45}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={filters.fundoPretoInferiorAltura || 45}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                filters: {
                  ...(prev.filters || filters),
                  fundoPretoInferiorAltura: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 3. VINHETA ESCURA (BORDAS GERAIS) */}
      <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex justify-between">
          <label className="text-[10px] font-bold text-slate-300">Vinheta Escura (Bordas & Cantos)</label>
          <span className="text-[10px] text-amber-300 font-mono font-bold">
            {filters.vignette || 0}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={filters.vignette || 0}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            updateConfig((prev) => ({
              ...prev,
              filters: {
                ...(prev.filters || filters),
                vignette: val,
              },
            }));
          }}
          className="w-full accent-amber-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
