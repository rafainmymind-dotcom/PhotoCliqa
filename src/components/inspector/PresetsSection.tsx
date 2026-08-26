import React, { useState } from 'react';
import { EditConfig, ImageItem, ModelData, Preset } from '../../types';
import {
  Compass,
  Sparkles,
  Bookmark,
  Plus,
  Trash2,
  Check,
  Layers,
  Copy,
  Search,
  Filter,
  Sliders,
} from 'lucide-react';
import { DEFAULT_EDIT_CONFIG } from '../../utils/defaults';

interface PresetsSectionProps {
  currentImage: ImageItem;
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
  onUpdateImageModelData: (id: string, newModelData: ModelData) => void;
  presets?: Preset[];
  onSelectPreset?: (preset: Preset) => void;
  onRemovePreset?: (presetId: string) => void;
  onOpenSavePresetModal?: () => void;
}

export const PresetsSection: React.FC<PresetsSectionProps> = ({
  currentImage,
  config,
  updateConfig,
  presets = [],
  onSelectPreset,
  onRemovePreset,
  onOpenSavePresetModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'custom' | 'system'>('all');

  const SYSTEM_PRESET_STYLES = [
    {
      id: 'luxury_gold_center',
      title: 'Mimuus Gold Centro',
      category: 'Dourado VIP',
      desc: 'Alinhamento centralizado com bandagem dourada suave e tag Novidade',
      apply: () => {
        updateConfig((prev) => ({
          ...prev,
          profileCard: {
            ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
            active: true,
            position: 'bottom_center',
            align: 'center',
            customX: 50,
            customY: 80,
            nomeCor: '#FFFFFF',
            infoCorTexto: '#FFFFFF',
            infoCorSeparadores: '#D4AF37',
            etiquetaAtiva: true,
            etiquetaTexto: 'NOVIDADE',
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
          },
        }));
      },
    },
    {
      id: 'luxury_gold_right',
      title: 'Mimuus Clássico Canto Direito',
      category: 'Clássico',
      desc: 'Alinhado à direita com bandagem dourada e sombra difusa',
      apply: () => {
        updateConfig((prev) => ({
          ...prev,
          profileCard: {
            ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
            active: true,
            position: 'bottom_right',
            align: 'right',
            customX: 85,
            customY: 88,
            nomeCor: '#FFFFFF',
            infoCorTexto: '#FFFFFF',
            infoCorSeparadores: '#D4AF37',
            etiquetaAtiva: true,
            etiquetaTexto: 'NOVIDADE',
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
          },
        }));
      },
    },
    {
      id: 'minimal_white',
      title: 'Minimalista Clean',
      category: 'Minimalista',
      desc: 'Tipografia limpa sem bandagem dourada, foco total na modelo',
      apply: () => {
        updateConfig((prev) => ({
          ...prev,
          profileCard: {
            ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
            active: true,
            position: 'bottom_center',
            align: 'center',
            customX: 50,
            customY: 82,
            nomeCor: '#FFFFFF',
            infoCorTexto: '#F1F5F9',
            infoCorSeparadores: '#CBD5E1',
            etiquetaAtiva: false,
            nomeBandagemDourada: {
              enabled: false,
              placement: 'half_bottom',
              width: 100,
              height: 30,
              offsetX: 0,
              offsetY: 0,
              opacity: 0.8,
            },
          },
        }));
      },
    },
    {
      id: 'dark_editorial',
      title: 'Editorial Escuro Sofisticado',
      category: 'Editorial',
      desc: 'Fundo preto inferior com degradê suave e tipografia serifada',
      apply: () => {
        updateConfig((prev) => ({
          ...prev,
          dimension: '385x530',
          filters: {
            brightness: 100,
            contrast: 105,
            saturation: 98,
            vignette: 15,
            fundoPretoInferiorAtivo: true,
            fundoPretoInferiorDensidade: 70,
            fundoPretoInferiorAltura: 45,
          },
          profileCard: {
            ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
            active: true,
            position: 'bottom_center',
            align: 'center',
            customX: 50,
            customY: 82,
            nomeFonte: 'Gilda Display',
            nomeTamanho: 36,
            nomeCor: '#FFFFFF',
            infoCorTexto: '#F8FAFC',
            infoCorSeparadores: '#E2E8F0',
            etiquetaAtiva: true,
            etiquetaTexto: 'EXCLUSIVA',
          },
        }));
      },
    },
  ];

  // Filtered Custom Presets
  const filteredCustomPresets = presets.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q));
  });

  // Filtered System Presets
  const filteredSystemPresets = SYSTEM_PRESET_STYLES.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Save Current as Preset Banner / Button */}
      <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-950 p-3.5 rounded-xl border border-amber-500/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-100 text-xs">Salvar Configuração Atual</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-mono border border-amber-500/30">
            {config.dimension}
          </span>
        </div>
        <p className="text-[11px] text-slate-300">
          Gostou do enquadramento, fontes, bandagem e logotipo da foto atual? Salve como preset para reutilizar em qualquer sessão.
        </p>
        <button
          onClick={onOpenSavePresetModal}
          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Salvar Foto Atual como Novo Preset</span>
        </button>
      </div>

      {/* Search & Category Filter Tabs */}
      <div className="space-y-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar presets salvos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Todos ({presets.length + SYSTEM_PRESET_STYLES.length})
          </button>
          <button
            onClick={() => setActiveCategory('custom')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              activeCategory === 'custom'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bookmark className="w-3 h-3 text-amber-400" />
            Meus Presets ({presets.length})
          </button>
          <button
            onClick={() => setActiveCategory('system')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeCategory === 'system'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Padrões ({SYSTEM_PRESET_STYLES.length})
          </button>
        </div>
      </div>

      {/* 1. User's Custom Presets */}
      {(activeCategory === 'all' || activeCategory === 'custom') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              Meus Presets Salvos ({filteredCustomPresets.length})
            </span>
          </div>

          {filteredCustomPresets.length > 0 ? (
            <div className="space-y-2">
              {filteredCustomPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 bg-slate-950/90 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-400 rounded-xl transition-all shadow-sm space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-amber-200 group-hover:text-amber-300">
                          {preset.name}
                        </span>
                        {preset.category && (
                          <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-medium border border-slate-700">
                            {preset.category}
                          </span>
                        )}
                      </div>
                      {preset.description && (
                        <p className="text-[10px] text-slate-400 line-clamp-1">{preset.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {onRemovePreset && (
                        <button
                          onClick={() => onRemovePreset(preset.id)}
                          title="Excluir preset"
                          className="p-1 rounded bg-slate-900 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 font-mono">
                      <span>{preset.editConfig?.dimension || '1:1'}</span>
                      <span>•</span>
                      <span>{preset.editConfig?.nameOverlay?.fontFamily || 'Gilda'}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (onSelectPreset) {
                          onSelectPreset(preset);
                        } else {
                          updateConfig(() => JSON.parse(JSON.stringify(preset.editConfig)));
                        }
                      }}
                      className="px-3 py-1 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Aplicar à Foto</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center space-y-1">
              <p className="text-[11px] text-slate-400">Você ainda não tem presets personalizados salvos.</p>
              <button
                onClick={onOpenSavePresetModal}
                className="text-[10px] text-amber-400 hover:underline font-semibold"
              >
                + Criar meu primeiro preset agora
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. System Presets */}
      {(activeCategory === 'all' || activeCategory === 'system') && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Presets Rápidos do Sistema
            </span>
          </div>

          <div className="space-y-2">
            {filteredSystemPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={preset.apply}
                className="w-full p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {preset.title}
                  </span>
                  <span className="text-[9px] bg-amber-500/10 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/20">
                    Aplicar
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
