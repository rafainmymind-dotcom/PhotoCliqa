import React, { useState } from 'react';
import { EditConfig, ModelData, Preset } from '../types';
import {
  Bookmark,
  X,
  Check,
  Sparkles,
  Layers,
  Crop,
  Type,
  ShieldAlert,
  Image as ImageIcon,
  SunMedium,
  Palette,
} from 'lucide-react';

interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: EditConfig;
  currentModelData: ModelData;
  onSavePreset: (presetData: {
    name: string;
    description: string;
    category: string;
    customConfig: EditConfig;
    customModelData: ModelData;
  }) => void;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  currentModelData,
  onSavePreset,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personalizado');

  // Modular inclusions
  const [includeDimension, setIncludeDimension] = useState(true);
  const [includeTransform, setIncludeTransform] = useState(true);
  const [includeProfileCard, setIncludeProfileCard] = useState(true);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeFilters, setIncludeFilters] = useState(true);

  if (!isOpen) return null;

  const card = currentConfig.profileCard;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Clone the configuration based on user's selective inclusion
    const presetConfig: EditConfig = JSON.parse(JSON.stringify(currentConfig));

    if (!includeDimension) {
      presetConfig.dimension = '1080x1080';
    }
    if (!includeTransform && presetConfig.imageTransform) {
      presetConfig.imageTransform = { scale: 100, offsetX: 0, offsetY: 0 };
    }
    if (!includeFilters && presetConfig.filters) {
      presetConfig.filters = { brightness: 100, contrast: 100, saturation: 100, vignette: 0 };
    }
    if (!includeLogo) {
      presetConfig.logoOverlay.active = false;
    }

    onSavePreset({
      name: name.trim(),
      description: description.trim(),
      category: category.trim() || 'Personalizado',
      customConfig: presetConfig,
      customModelData: JSON.parse(JSON.stringify(currentModelData)),
    });

    setName('');
    setDescription('');
    onClose();
  };

  const CATEGORY_SUGGESTIONS = [
    'Feed Instagram (4:5)',
    'Stories / Reels (9:16)',
    'Quadrado (1:1)',
    'Banner (16:9)',
    'Editorial Dourado',
    'Minimalista Clean',
    'Novidade VIP',
    'Personalizado',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Salvar Preset Personalizado</h3>
              <p className="text-[11px] text-slate-400">
                Salve as edições, proporções, textos e estilos da foto atual
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Preset Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>Nome do Preset</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ex: Meu Estilo Dourado 4:5, Feed Editorial, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Category / Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200">Categoria / Tipo de Post</label>
            <input
              type="text"
              placeholder="Ex: Feed Instagram, Stories, Catálogo..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              Descrição / Observações <span className="text-slate-500 font-normal">(Opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Padrão com proporção 4:5, fonte Gilda Display, bandagem dourada suave e logotipo no canto superior."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Inclusion Toggles */}
          <div className="space-y-2.5 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              O que salvar neste Preset?
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeDimension}
                  onChange={(e) => setIncludeDimension(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <Crop className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Proporção ({currentConfig.dimension})</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeTransform}
                  onChange={(e) => setIncludeTransform(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Enquadramento & Zoom</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeProfileCard}
                  onChange={(e) => setIncludeProfileCard(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <Type className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Card, Textos & Bandagem</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeLogo}
                  onChange={(e) => setIncludeLogo(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <ImageIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Logotipo & Posição</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-slate-300 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={includeFilters}
                  onChange={(e) => setIncludeFilters(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <SunMedium className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Filtros & Fundo Preto Inferior</span>
              </label>
            </div>
          </div>

          {/* Quick Summary of Current Values */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 space-y-1 text-[11px] text-slate-400">
            <div className="font-semibold text-slate-300">Resumo da Configuração Atual:</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
              <span>Proporção: <strong className="text-amber-300">{currentConfig.dimension}</strong></span>
              <span>Fonte: <strong className="text-slate-200">{card?.nomeFonte || currentConfig.nameOverlay.fontFamily}</strong></span>
              <span>Bandagem: <strong className="text-slate-200">{card?.nomeBandagemDourada?.enabled ? 'Ativa' : 'Inativa'}</strong></span>
              <span>Novidade: <strong className="text-slate-200">{card?.etiquetaAtiva ? 'Sim' : 'Não'}</strong></span>
              <span>Logo: <strong className="text-slate-200">{currentConfig.logoOverlay.active ? 'Ativo' : 'Inativo'}</strong></span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Preset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
