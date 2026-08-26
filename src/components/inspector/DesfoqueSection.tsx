import React, { useState } from 'react';
import { BlurRegion, BlurShape, BlurType, EditConfig, ImageItem } from '../../types';
import { Circle, Plus, RotateCw, ShieldAlert, Sparkles, Square, Trash2 } from 'lucide-react';
import { detectFacesInImage } from '../../utils/faceDetector';

interface DesfoqueSectionProps {
  currentImage: ImageItem;
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
}

export const DesfoqueSection: React.FC<DesfoqueSectionProps> = ({
  currentImage,
  config,
  updateConfig,
}) => {
  const [isDetectingFaces, setIsDetectingFaces] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState<string | null>(null);

  const blurConfig = config.pixelateBlur;

  const handleToggleActive = () => {
    updateConfig((prev) => ({
      ...prev,
      pixelateBlur: {
        ...prev.pixelateBlur,
        active: !prev.pixelateBlur.active,
      },
    }));
  };

  const handleDetectFaces = async () => {
    try {
      setIsDetectingFaces(true);
      setDetectionMessage(null);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = currentImage.dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const faces = await detectFacesInImage(img);

      if (faces.length === 0) {
        setDetectionMessage('Nenhum rosto detectado na imagem.');
        return;
      }

      const newRegions: BlurRegion[] = faces.map((face, index) => ({
        id: `face-${Date.now()}-${index}`,
        shape: 'rectangle',
        type: blurConfig.type || 'blur',
        density: blurConfig.density || 18,
        x: face.x,
        y: face.y,
        width: face.width,
        height: face.height,
        rotation: 0,
      }));

      updateConfig((prev) => ({
        ...prev,
        pixelateBlur: {
          ...prev.pixelateBlur,
          active: true,
          regions: [...prev.pixelateBlur.regions, ...newRegions],
        },
      }));

      setDetectionMessage(`${faces.length} rosto(s) detectado(s) e protegido(s)!`);
    } catch (err) {
      console.error('Face detection error:', err);
      setDetectionMessage('Erro ao executar detecção facial.');
    } finally {
      setIsDetectingFaces(false);
    }
  };

  const handleAddManualRegion = () => {
    const newRegion: BlurRegion = {
      id: `region-${Date.now()}`,
      shape: blurConfig.mode || 'rectangle',
      type: blurConfig.type || 'blur',
      density: blurConfig.density || 18,
      x: 50,
      y: 50,
      width: 25,
      height: 25,
      rotation: 0,
    };

    updateConfig((prev) => ({
      ...prev,
      pixelateBlur: {
        ...prev.pixelateBlur,
        active: true,
        regions: [...prev.pixelateBlur.regions, newRegion],
      },
    }));
  };

  const handleRemoveRegion = (id: string) => {
    updateConfig((prev) => ({
      ...prev,
      pixelateBlur: {
        ...prev.pixelateBlur,
        regions: prev.pixelateBlur.regions.filter((r) => r.id !== id),
      },
    }));
  };

  const handleClearAll = () => {
    updateConfig((prev) => ({
      ...prev,
      pixelateBlur: {
        ...prev.pixelateBlur,
        regions: [],
      },
    }));
  };

  const handleUpdateRegion = (id: string, updates: Partial<BlurRegion>) => {
    updateConfig((prev) => ({
      ...prev,
      pixelateBlur: {
        ...prev.pixelateBlur,
        regions: prev.pixelateBlur.regions.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Ativar/Desativar Desfoque */}
      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-slate-200">Desfoque & Proteção</span>
        </div>
        <button
          onClick={handleToggleActive}
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            blurConfig.active
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {blurConfig.active ? 'Ativado' : 'Desativado'}
        </button>
      </div>

      {/* Botão de Detecção Facial Automática */}
      <div className="space-y-1.5">
        <button
          onClick={handleDetectFaces}
          disabled={isDetectingFaces}
          className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isDetectingFaces ? 'Detectando Rostos...' : 'Detectar Rosto Automaticamente'}</span>
        </button>
        {detectionMessage && (
          <div className="text-[10px] text-amber-300 text-center font-medium bg-amber-500/10 py-1 rounded border border-amber-500/20">
            {detectionMessage}
          </div>
        )}
      </div>

      {/* Tipo de Desfoque (Blur Suave vs Mosaico / Pixelado) */}
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-200">Tipo de Efeito</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'blur' as BlurType, label: 'Desfoque (Blur Suave)' },
            { id: 'pixelate' as BlurType, label: 'Mosaico (Pixelado)' },
          ].map((type) => {
            const isSelected = blurConfig.type === type.id;
            return (
              <button
                key={type.id}
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    pixelateBlur: { ...prev.pixelateBlur, type: type.id },
                  }))
                }
                className={`p-2 rounded-lg border text-center text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Forma Padrão & Intensidade */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400">Forma da Seleção Manual</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'rectangle' as BlurShape, label: 'Retângulo', icon: Square },
              { id: 'circle' as BlurShape, label: 'Círculo', icon: Circle },
              { id: 'lasso' as BlurShape, label: 'Laço Livre', icon: ShieldAlert },
            ].map((mode) => {
              const isSelected = blurConfig.mode === mode.id;
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() =>
                    updateConfig((prev) => ({
                      ...prev,
                      pixelateBlur: { ...prev.pixelateBlur, mode: mode.id as any },
                    }))
                  }
                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 text-[10px] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensidade / Densidade */}
        <div className="space-y-1 pt-1 border-t border-slate-800">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Intensidade do Efeito</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {blurConfig.density ?? 18}
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="60"
            value={blurConfig.density ?? 18}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                pixelateBlur: { ...prev.pixelateBlur, density: val },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Botão Adicionar Região */}
        <button
          onClick={handleAddManualRegion}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Adicionar Região de Desfoque</span>
        </button>
      </div>

      {/* Lista de Regiões Ativas */}
      {blurConfig.regions.length > 0 && (
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-200">
              Regiões Aplicadas ({blurConfig.regions.length})
            </span>
            <button
              onClick={handleClearAll}
              className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Limpar Todas</span>
            </button>
          </div>

          <div className="space-y-2 pt-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {blurConfig.regions.map((reg, idx) => (
              <div
                key={reg.id}
                className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2 text-[10px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">
                    Região #{idx + 1} ({reg.shape === 'circle' ? 'Círculo' : 'Retângulo'})
                  </span>
                  <button
                    onClick={() => handleRemoveRegion(reg.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="Remover região"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-slate-400">Largura: {Math.round(reg.width)}%</label>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={reg.width}
                      onChange={(e) => handleUpdateRegion(reg.id, { width: parseInt(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-slate-400">Altura: {Math.round(reg.height)}%</label>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={reg.height}
                      onChange={(e) => handleUpdateRegion(reg.id, { height: parseInt(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-slate-400">Posição X: {Math.round(reg.x)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={reg.x}
                      onChange={(e) => handleUpdateRegion(reg.id, { x: parseInt(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-slate-400">Posição Y: {Math.round(reg.y)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={reg.y}
                      onChange={(e) => handleUpdateRegion(reg.id, { y: parseInt(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Rotação */}
                <div className="space-y-0.5 pt-1 border-t border-slate-800/80">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <RotateCw className="w-2.5 h-2.5 text-amber-400" />
                      Rotação
                    </span>
                    <span className="text-amber-300 font-mono">{reg.rotation ?? 0}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={reg.rotation ?? 0}
                    onChange={(e) => handleUpdateRegion(reg.id, { rotation: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
