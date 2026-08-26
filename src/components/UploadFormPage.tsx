import React, { useState } from 'react';
import { ModelData, Preset } from '../types';
import { formatProfileInfo } from '../utils/formatters';
import {
  Upload,
  User,
  Calendar,
  Ruler,
  Weight,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Trash2,
  EyeOff,
  Eye,
  Layers,
} from 'lucide-react';

interface UploadFormPageProps {
  modelData: ModelData;
  setModelData: React.Dispatch<React.SetStateAction<ModelData>>;
  startWithCleanPhoto?: boolean;
  setStartWithCleanPhoto?: (clean: boolean) => void;
  presets: Preset[];
  selectedPresetId: string;
  onSelectPreset: (preset: Preset) => void;
  onUploadImages: (files: FileList | File[]) => void;
  uploadedImagesCount: number;
  onGoToEditor: () => void;
  onGoToPresets?: () => void;
  onClearAllImages: () => void;
}

export const UploadFormPage: React.FC<UploadFormPageProps> = ({
  modelData,
  setModelData,
  startWithCleanPhoto = true,
  setStartWithCleanPhoto,
  presets,
  selectedPresetId,
  onSelectPreset,
  onUploadImages,
  uploadedImagesCount,
  onGoToEditor,
  onGoToPresets,
  onClearAllImages,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const formatted = formatProfileInfo(
    modelData.nome || 'Valentina',
    modelData.idade ?? 29,
    modelData.altura ?? '1,69',
    modelData.peso ?? 66
  );

  const handleInputChange = (field: keyof ModelData, value: string) => {
    setModelData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadImages(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadImages(e.dataTransfer.files);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Página 1 • Upload de Fotos & Informações</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-100 tracking-tight">
          Upload de Fotos & Cadastro da Modelo
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Adicione suas fotos e preencha as informações do modelo. O sistema formatará automaticamente no padrão limpo e elegante.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Form Info */}
        <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="font-serif font-semibold text-lg text-amber-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-amber-400" />
            <span>Dados da Modelo / Modelo</span>
          </h3>

          <div className="space-y-4">
            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Nome</span>
              </label>
              <input
                type="text"
                value={modelData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Valentina"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors"
              />
            </div>

            {/* Idade */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Idade (ex: 29 ou 29anos)</span>
              </label>
              <input
                type="text"
                value={modelData.idade}
                onChange={(e) => handleInputChange('idade', e.target.value)}
                placeholder="Ex: 29"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors"
              />
            </div>

            {/* Altura */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-amber-400" />
                <span>Altura (ex: 1,69m ou 1,69)</span>
              </label>
              <input
                type="text"
                value={modelData.altura}
                onChange={(e) => handleInputChange('altura', e.target.value)}
                placeholder="Ex: 1,69"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors"
              />
            </div>

            {/* Peso */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-amber-400" />
                <span>Peso (ex: 66kg ou 66)</span>
              </label>
              <input
                type="text"
                value={modelData.peso}
                onChange={(e) => handleInputChange('peso', e.target.value)}
                placeholder="Ex: 66"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors"
              />
            </div>

            {/* Etiqueta Novidade */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Etiqueta de Novidade (Faixa Dourada)</span>
                </label>
                <input
                  type="checkbox"
                  checked={modelData.etiquetaAtiva ?? true}
                  onChange={(e) =>
                    setModelData((prev) => ({
                      ...prev,
                      etiquetaAtiva: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {(modelData.etiquetaAtiva ?? true) && (
                <input
                  type="text"
                  value={modelData.etiquetaTexto ?? 'NOVIDADE'}
                  onChange={(e) =>
                    setModelData((prev) => ({
                      ...prev,
                      etiquetaTexto: e.target.value,
                    }))
                  }
                  placeholder="NOVIDADE"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 uppercase focus:outline-none focus:border-amber-500/80 transition-colors"
                />
              )}
            </div>

            {/* Preview da Linha Formada (Sem pontos de separação: 29anos 1,69m 66kg) */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/25 space-y-1.5 text-center">
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
                Formatação das Informações (Preview)
              </span>
              <p className="font-serif font-bold text-lg text-white">
                {formatted.nome || 'Valentina'}
              </p>
              <p className="text-xs text-slate-200 font-mono font-medium tracking-wide">
                {formatted.combinedInfo || '29anos 1,69m 66kg'}
              </p>

              {(modelData.etiquetaAtiva ?? true) && (
                <div className="pt-1.5 flex justify-center">
                  <span className="inline-block bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 text-white font-bold text-[10px] px-3 py-0.5 rounded shadow">
                    {(modelData.etiquetaTexto || 'NOVIDADE').toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Opção de Iniciar com Fotos Desativadas (Foto Limpa) */}
          <div className="pt-2 border-t border-slate-800">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {startWithCleanPhoto ? (
                  <EyeOff className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <Eye className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-semibold text-slate-100 block">
                    Iniciar com Elementos Desativados (Foto Limpa)
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {startWithCleanPhoto
                      ? 'Fotos iniciarão sem nome/dados na tela. Você ativa manualmente se desejar.'
                      : 'Fotos iniciarão com nome e informações visíveis na tela.'}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={startWithCleanPhoto}
                onChange={(e) => setStartWithCleanPhoto && setStartWithCleanPhoto(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer shrink-0"
              />
            </div>
          </div>

          {/* Quick Preset Choice */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-amber-300/90 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Presets Salvos</span>
              </label>
              {onGoToPresets && (
                <button
                  type="button"
                  onClick={onGoToPresets}
                  className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-medium"
                >
                  <Layers className="w-3 h-3" />
                  <span>Ver Página 2 (Presets)</span>
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              {presets.length > 0 ? (
                presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedPresetId === preset.id
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-200'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="font-medium">{preset.name}</span>
                    {selectedPresetId === preset.id && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                  <span className="text-xs text-slate-400 block">Nenhum preset salvo no momento.</span>
                  <span className="text-[11px] text-amber-300/80 block">
                    Você pode selecionar ou criar presets na Página 2!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upload Box & Image List Status */}
        <div className="md:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg text-amber-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Upload className="w-5 h-5 text-amber-400" />
              <span>Upload das Imagens</span>
            </h3>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative group ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                  : 'border-slate-700 hover:border-amber-500/50 bg-slate-950/60 hover:bg-slate-950/90'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/10">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Clique ou arraste suas fotos aqui
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Suporta PNG, JPG, WEBP. Você pode enviar várias fotos de uma vez.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded-full">
                  <span>Proporções suportadas: 1080x1080 • 385x530 • 1067x1600 • Original</span>
                </div>
              </div>
            </div>

            {/* Images status badge & clear button */}
            {uploadedImagesCount > 0 && (
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-300">
                    {uploadedImagesCount} {uploadedImagesCount === 1 ? 'imagem carregada' : 'imagens carregadas'} com sucesso!
                  </span>
                </div>
                <button
                  onClick={onClearAllImages}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar todas</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Step Buttons (Página 1 -> Página 2 ou Página 3) */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            {onGoToPresets && (
              <button
                type="button"
                onClick={onGoToPresets}
                className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-3 px-4 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Escolher Presets (Página 2)</span>
              </button>
            )}

            <button
              onClick={onGoToEditor}
              className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Ir para o Editor de Fotos (Página 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
