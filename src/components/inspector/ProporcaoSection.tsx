import React from 'react';
import { AspectDimension, EditConfig, ExportFormat, ImageItem } from '../../types';
import {
  RotateCcw,
  RotateCw,
  RefreshCw,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  Upload,
  Download,
  FileImage,
  Sparkles,
} from 'lucide-react';

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
  const transform = config.imageTransform || {
    scale: 100,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  };

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

      {/* Inverter & Rotacionar Foto */}
      <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/90 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            Inverter & Rotacionar Imagem
          </span>
          {((transform.rotation || 0) !== 0 || transform.flipHorizontal || transform.flipVertical) && (
            <button
              type="button"
              onClick={() => {
                updateConfig((prev) => ({
                  ...prev,
                  imageTransform: {
                    ...(prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 }),
                    rotation: 0,
                    flipHorizontal: false,
                    flipVertical: false,
                  },
                }));
              }}
              className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
              title="Resetar rotação e espelhamento"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resetar</span>
            </button>
          )}
        </div>

        {/* Inverter Orientação (Espelhamento) */}
        <div className="space-y-1.5">
          <div className="text-[10px] text-slate-400 font-medium">Inverter Imagem (Espelhar)</div>
          <div className="grid grid-cols-2 gap-2">
            {/* Inverter Horizontalmente */}
            <button
              type="button"
              onClick={() => {
                updateConfig((prev) => {
                  const current = prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
                  return {
                    ...prev,
                    imageTransform: {
                      ...current,
                      flipHorizontal: !current.flipHorizontal,
                    },
                  };
                });
              }}
              className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${
                transform.flipHorizontal
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700'
              }`}
              title="Inverter horizontalmente (espelho lateral esquerda/direita)"
            >
              <FlipHorizontal className="w-4 h-4 text-amber-400" />
              <span>Inverter Horiz.</span>
            </button>

            {/* Inverter Verticalmente */}
            <button
              type="button"
              onClick={() => {
                updateConfig((prev) => {
                  const current = prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
                  return {
                    ...prev,
                    imageTransform: {
                      ...current,
                      flipVertical: !current.flipVertical,
                    },
                  };
                });
              }}
              className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${
                transform.flipVertical
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700'
              }`}
              title="Inverter verticalmente (de ponta cabeça)"
            >
              <FlipVertical className="w-4 h-4 text-amber-400" />
              <span>Inverter Vert.</span>
            </button>
          </div>
        </div>

        {/* Rotacionar Imagem (Giro) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">Rotacionar Foto</span>
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              {transform.rotation ? `${transform.rotation}°` : '0°'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {/* Girar -90° */}
            <button
              type="button"
              onClick={() => {
                updateConfig((prev) => {
                  const current = prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
                  const nextRot = ((current.rotation || 0) - 90 + 360) % 360;
                  return {
                    ...prev,
                    imageTransform: {
                      ...current,
                      rotation: nextRot === 0 ? 0 : nextRot > 180 ? nextRot - 360 : nextRot,
                    },
                  };
                });
              }}
              className="py-1.5 px-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Girar 90 graus à esquerda (anti-horário)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>-90°</span>
            </button>

            {/* Girar +90° */}
            <button
              type="button"
              onClick={() => {
                updateConfig((prev) => {
                  const current = prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
                  const nextRot = ((current.rotation || 0) + 90) % 360;
                  return {
                    ...prev,
                    imageTransform: {
                      ...current,
                      rotation: nextRot === 0 ? 0 : nextRot > 180 ? nextRot - 360 : nextRot,
                    },
                  };
                });
              }}
              className="py-1.5 px-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Girar 90 graus à direita (horário)"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>+90°</span>
            </button>

            {/* Girar 180° */}
            <button
              type="button"
              onClick={() => {
                updateConfig((prev) => {
                  const current = prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
                  const nextRot = ((current.rotation || 0) + 180) % 360;
                  return {
                    ...prev,
                    imageTransform: {
                      ...current,
                      rotation: nextRot === 0 ? 0 : nextRot > 180 ? nextRot - 360 : nextRot,
                    },
                  };
                });
              }}
              className="py-1.5 px-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Girar 180 graus (inverter orientação)"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>180°</span>
            </button>
          </div>

          {/* Ajuste Fino de Ângulo (Slider + Controles) */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Ajuste Fino de Inclinação</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    updateConfig((prev) => {
                      const current = prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
                      return {
                        ...prev,
                        imageTransform: {
                          ...current,
                          rotation: Math.max(-180, (current.rotation || 0) - 1),
                        },
                      };
                    });
                  }}
                  className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-mono cursor-pointer transition-colors"
                  title="Diminuir 1 grau (-1°)"
                >
                  -1°
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateConfig((prev) => {
                      const current = prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
                      return {
                        ...prev,
                        imageTransform: {
                          ...current,
                          rotation: Math.min(180, (current.rotation || 0) + 1),
                        },
                      };
                    });
                  }}
                  className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-mono cursor-pointer transition-colors"
                  title="Aumentar 1 grau (+1°)"
                >
                  +1°
                </button>
              </div>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={transform.rotation || 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  imageTransform: {
                    ...(prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 }),
                    rotation: val,
                  },
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            {/* Quick Angle Chips */}
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono px-0.5">
              <button
                type="button"
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    imageTransform: {
                      ...(prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 }),
                      rotation: -90,
                    },
                  }))
                }
                className="hover:text-amber-300 cursor-pointer"
              >
                -90°
              </button>
              <button
                type="button"
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    imageTransform: {
                      ...(prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 }),
                      rotation: 0,
                    },
                  }))
                }
                className={`cursor-pointer ${
                  (transform.rotation || 0) === 0 ? 'text-amber-400 font-bold' : 'hover:text-amber-300'
                }`}
              >
                0°
              </button>
              <button
                type="button"
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    imageTransform: {
                      ...(prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 }),
                      rotation: 90,
                    },
                  }))
                }
                className="hover:text-amber-300 cursor-pointer"
              >
                +90°
              </button>
              <button
                type="button"
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    imageTransform: {
                      ...(prev.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 }),
                      rotation: 180,
                    },
                  }))
                }
                className="hover:text-amber-300 cursor-pointer"
              >
                180°
              </button>
            </div>
          </div>
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
                imageTransform: {
                  ...(prev.imageTransform || { rotation: 0, flipHorizontal: false, flipVertical: false }),
                  scale: 100,
                  offsetX: 0,
                  offsetY: 0,
                },
              }))
            }
            className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            title="Resetar escala e posição"
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
