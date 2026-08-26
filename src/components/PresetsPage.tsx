import React, { useState } from 'react';
import { EditConfig, ModelData, Preset } from '../types';
import {
  Sliders,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Info,
  Clock,
  Layers,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Search,
  Copy,
  Layout,
  Type,
  Palette,
  Upload,
} from 'lucide-react';
import { SavePresetModal } from './SavePresetModal';

interface PresetsPageProps {
  presets: Preset[];
  selectedPresetId: string;
  onSelectPreset: (preset: Preset) => void;
  onCreatePreset: (presetData: {
    name: string;
    description: string;
    category: string;
    customConfig: EditConfig;
    customModelData: ModelData;
  }) => void;
  onRemovePreset: (presetId: string) => void;
  currentModelData: ModelData;
  currentEditConfig: EditConfig;
  onGoToEditor: () => void;
  onGoToUpload?: () => void;
}

export const PresetsPage: React.FC<PresetsPageProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  onCreatePreset,
  onRemovePreset,
  currentModelData,
  currentEditConfig,
  onGoToEditor,
  onGoToUpload,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(presets.map((p) => p.category || 'Geral').filter(Boolean)))];

  const filteredPresets = presets.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || (p.category || 'Geral') === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Presets & Modelos Pré-Programados</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-100 tracking-tight">
          Gerenciador de Presets Personalizados
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Salve e aplique combinações de enquadramento, fontes, posições, bandagens douradas e logotipos na forma que você quiser.
        </p>
      </div>

      {/* Action Header: Create New Preset button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Configurações Atuais da Foto Ativa</h3>
            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
              <span>Proporção: <strong className="text-amber-300 font-mono">{currentEditConfig.dimension}</strong></span>
              <span>•</span>
              <span>Card / Textos: <strong className="text-amber-300">{currentEditConfig.profileCard?.active ? 'Ativo' : 'Personalizado'}</strong></span>
              <span>•</span>
              <span>Logo: <strong className="text-amber-300">{currentEditConfig.logoOverlay?.active ? 'Ativo' : 'Inativo'}</strong></span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs py-2.5 px-5 rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Salvar Foto Atual como Novo Preset</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, tag ou estilo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <span className="text-[11px] text-slate-400 mr-1 shrink-0 font-medium">Categorias:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Cards Grid */}
      {filteredPresets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPresets.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                className={`bg-slate-900/90 border rounded-2xl p-5 space-y-4 shadow-xl transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500/80 ring-2 ring-amber-500/20 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <h4 className="font-serif font-bold text-base text-amber-100">{preset.name}</h4>
                      </div>
                      {preset.category && (
                        <span className="inline-block text-[10px] bg-slate-800 text-amber-300/90 px-2 py-0.5 rounded font-mono border border-slate-700">
                          {preset.category}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ativo
                      </span>
                    )}
                  </div>

                  {preset.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{preset.description}</p>
                  )}

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dimensão / Tamanho:</span>
                      <span className="text-amber-300 font-semibold">{preset.editConfig?.dimension || '1:1'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fonte Principal:</span>
                      <span className="text-slate-200">{preset.editConfig?.profileCard?.nomeFonte || preset.editConfig?.nameOverlay?.fontFamily || 'Gilda Display'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bandagem Dourada:</span>
                      <span className="text-slate-200">
                        {preset.editConfig?.profileCard?.nomeBandagemDourada?.enabled || preset.editConfig?.nameOverlay?.goldBand?.enabled ? 'Ativa' : 'Desativada'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Logotipo Mimuus:</span>
                      <span className="text-slate-200">
                        {preset.editConfig?.logoOverlay?.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preset Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectPreset(preset)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Preset em Uso' : 'Aplicar Este Preset'}</span>
                  </button>

                  <button
                    onClick={() => onRemovePreset(preset.id)}
                    title="Excluir Preset"
                    className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-10 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Sliders className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="font-serif font-bold text-lg text-slate-100">Nenhum preset encontrado</h4>
            <p className="text-xs text-slate-400">
              Crie presets sob medida para salvar proporção da foto, textos, tipografia e bandagem dourada com facilidade.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs py-2.5 px-5 rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Meu Preset Agora</span>
          </button>
        </div>
      )}

      {/* Navigation Step CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-800">
        {onGoToUpload ? (
          <button
            type="button"
            onClick={onGoToUpload}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-3 px-5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Página 1 (Upload & Dados)</span>
          </button>
        ) : <div />}

        <button
          onClick={onGoToEditor}
          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm py-3 px-7 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>Ir para o Editor de Fotos (Página 3)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Save Preset Modal */}
      {showCreateModal && (
        <SavePresetModal
          currentConfig={currentEditConfig}
          currentModelData={currentModelData}
          onSave={(presetData) => {
            onCreatePreset(presetData);
            setShowCreateModal(false);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};
