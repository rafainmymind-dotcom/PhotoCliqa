import React from 'react';
import { AspectDimension, EditConfig, ExportFormat, ImageItem } from '../../types';
import { RotateCcw, Image as ImageIcon, Upload, Download, FileImage, Sparkles } from 'lucide-react';

interface ProporcaoSectionProps {
  currentImage: ImageItem;
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
  onReplaceImage?: (id: string, file: File) => void;
  exportFormat?: ExportFormat;
  setExportFormat?: (fmt: ExportFormat) => void;
  onDownloadCurrent?: (imageId?: string) => void;
}

export const ProporcaoSection: React.FC<ProporcaoSectionProps> = ({
  currentImage,
  config,
  updateConfig,
  onReplaceImage,
  exportFormat = 'webp',
  setExportFormat,
  onDownloadCurrent,
}) => {
  const transform = config.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 };

  const dimensions: { id: AspectDimension; label: string; desc: string }[] = [
    { id: 'original', label: 'TAMANHO ORIGINAL', desc: 'Preserva proporção e resolução nativas' },
    { id: '1080x1080', label: '1:1 Quadrado', desc: '1080 × 1080 px (Feed Instagram)' },
    { id: '385x530', label: 'Card Padrão', desc: '385 × 530 px (Catálogo Mimuus)' },
    { id: '1067x1600', label: 'Retrato HD', desc: '1067 × 1600 px (Stories / Banner)' },
  ];

  return (
    <div className="space-y-4">
      {/* Substituir Foto Desta Composição */}
      {onReplaceImage && (
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              Substituir Imagem da Foto
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Troque o arquivo da foto atual sem perder seus textos, estilos, posições, filtros e faixas já configurados.
          </p>
          <label className="w-full py-2 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>Escolher Nova Foto</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onReplaceImage(currentImage.id, e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      )}

      {/* Seletor de Proporções */}
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-200">Proporção da Imagem</span>
        <div className="grid grid-cols-1 gap-1.5 pt-1">
          {dimensions.map((dim) => {
            const isSelected = config.dimension === dim.id;
            return (
              <button
                key={dim.id}
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    dimension: dim.id,
                  }))
                }
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">{dim.label}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{dim.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ajustes de Enquadramento, Zoom e Pan */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-200">Enquadramento & Zoom</span>
          <button
            onClick={() =>
              updateConfig((prev) => ({
                ...prev,
                imageTransform: { scale: 100, offsetX: 0, offsetY: 0 },
              }))
            }
            className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            title="Resetar enquadramento"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Resetar</span>
          </button>
        </div>

        {/* Zoom / Escala */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Zoom / Escala da Foto</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {transform.scale ?? 100}%
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="250"
            value={transform.scale ?? 100}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                imageTransform: {
                  ...(prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 }),
                  scale: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Deslocamento Horizontal (X) */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Deslocamento Horizontal (X)</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {transform.offsetX ?? 0}%
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={transform.offsetX ?? 0}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                imageTransform: {
                  ...(prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 }),
                  offsetX: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Deslocamento Vertical (Y) */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Deslocamento Vertical (Y)</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {transform.offsetY ?? 0}%
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={transform.offsetY ?? 0}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                imageTransform: {
                  ...(prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 }),
                  offsetY: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Formato do Arquivo de Exportação */}
      {setExportFormat && (
        <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
              <FileImage className="w-3.5 h-3.5 text-amber-400" />
              Formato do arquivo
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/40 uppercase">
              {exportFormat}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* PNG Option */}
            <button
              type="button"
              onClick={() => setExportFormat('png')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                exportFormat === 'png'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-1 ring-amber-500/50 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">PNG</span>
                <span className="text-[8px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded font-mono">.png</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-1 leading-tight">
                Sem compressão com perdas. Máxima qualidade, transparências e sombras suaves.
              </p>
            </button>

            {/* WebP Option */}
            <button
              type="button"
              onClick={() => setExportFormat('webp')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                exportFormat === 'webp'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-1 ring-amber-500/50 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">WebP</span>
                <span className="text-[8px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded font-mono">.webp</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-1 leading-tight">
                Arquivo ultra-otimizado e leve, ideal para web e carregamento instantâneo.
              </p>
            </button>
          </div>

          {onDownloadCurrent && (
            <button
              type="button"
              onClick={() => onDownloadCurrent(currentImage.id)}
              className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Imagem (. {exportFormat})</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
