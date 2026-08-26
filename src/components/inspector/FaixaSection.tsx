import React from 'react';
import { EditConfig, ImageItem, ModelData, GoldBandTone } from '../../types';
import { GoldTonePicker } from './GoldTonePicker';

interface FaixaSectionProps {
  currentImage: ImageItem;
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
  onUpdateImageModelData: (id: string, newModelData: ModelData) => void;
}

export const FaixaSection: React.FC<FaixaSectionProps> = ({
  currentImage,
  config,
  updateConfig,
  onUpdateImageModelData,
}) => {
  const isTagActive =
    currentImage.modelData.novidade ??
    currentImage.modelData.etiquetaAtiva ??
    config.profileCard?.etiquetaAtiva ??
    true;

  const currentTagText =
    currentImage.modelData.texto_novidade ||
    currentImage.modelData.etiquetaTexto ||
    config.profileCard?.etiquetaTexto ||
    'NOVIDADE';

  return (
    <div className="space-y-4">
      {/* Ativar/Desativar Faixa / Tag */}
      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <div className="flex flex-col">
          <span className="font-medium text-slate-200">Exibir Faixa na Foto</span>
          <span className="text-[9px] text-slate-400">Faixa dourada destacada abaixo das informações</span>
        </div>
        <button
          onClick={() => {
            const nextVal = !isTagActive;
            onUpdateImageModelData(currentImage.id, {
              ...currentImage.modelData,
              novidade: nextVal,
              etiquetaAtiva: nextVal,
            });
            updateConfig((prev) => ({
              ...prev,
              profileCard: prev.profileCard
                ? { ...prev.profileCard, etiquetaAtiva: nextVal }
                : undefined,
            }));
          }}
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            isTagActive
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isTagActive ? 'Ativado' : 'Desativado'}
        </button>
      </div>

      {isTagActive && (
        <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          {/* Texto da Faixa */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Texto da Faixa / Selo</label>
            <input
              type="text"
              value={currentTagText}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateImageModelData(currentImage.id, {
                  ...currentImage.modelData,
                  texto_novidade: val,
                  etiquetaTexto: val,
                });
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? { ...prev.profileCard, etiquetaTexto: val }
                    : undefined,
                }));
              }}
              placeholder="NOVIDADE"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:border-amber-500 focus:outline-none uppercase"
            />
          </div>

          {/* Opção Caixa Alta */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-300">Transformar em Caixa Alta (MAIÚSCULAS)</span>
            <input
              type="checkbox"
              checked={config.profileCard?.etiquetaCaixaAlta ?? true}
              onChange={(e) => {
                const isChecked = e.target.checked;
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? { ...prev.profileCard, etiquetaCaixaAlta: isChecked }
                    : undefined,
                }));
              }}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Estilo Visual da Faixa Dourada */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-300 font-medium">Modelo da Bandagem Dourada</label>
              <span className="text-[9px] text-amber-400 font-semibold">✨ Mesmo modelo do Nome</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'faixa_dourada', label: 'Bandagem Suave Luxo', desc: 'Desvanecimento lateral (Igual ao Nome)' },
                { id: 'brilhante', label: 'Ouro Real Brilhante', desc: 'Reflexo metálico com brilho vivo' },
                { id: 'pill_dourado', label: 'Pill Arredondado', desc: 'Cápsula suave e moderna' },
                { id: 'badge_elegante', label: 'Selo Compacto', desc: 'Badge sutil e discreta' },
              ].map((style) => {
                const isSelected = (config.profileCard?.etiquetaEstilo || 'faixa_dourada') === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() =>
                      updateConfig((prev) => ({
                        ...prev,
                        profileCard: prev.profileCard
                          ? { ...prev.profileCard, etiquetaEstilo: style.id as any }
                          : undefined,
                      }))
                    }
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-semibold leading-tight">{style.label}</div>
                    <div className="text-[8px] text-slate-400 leading-tight mt-0.5">{style.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seletor de Tonalidade de Dourado (Clássico, Escuro, Bronze, Ouro Queimado, etc.) */}
          <div className="pt-2 border-t border-slate-800">
            <GoldTonePicker
              label="Tonalidade do Dourado da Faixa"
              selectedTone={config.profileCard?.faixaBandagemDourada?.tone || config.profileCard?.faixaTomDourado || 'classic_gold'}
              customColor={config.profileCard?.faixaBandagemDourada?.customColor || config.profileCard?.faixaCorCustom || '#D4AF37'}
              onSelectTone={(tone: GoldBandTone) => {
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? {
                        ...prev.profileCard,
                        faixaTomDourado: tone,
                        faixaBandagemDourada: {
                          ...(prev.profileCard.faixaBandagemDourada || {
                            enabled: true,
                            width: 100,
                            height: 36,
                            offsetX: 0,
                            offsetY: 0,
                            opacity: 0.9,
                            style: 'shiny_gold',
                            softEdges: true,
                          }),
                          tone: tone,
                        },
                      }
                    : undefined,
                }));
              }}
              onChangeCustomColor={(color: string) => {
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? {
                        ...prev.profileCard,
                        faixaCorCustom: color,
                        faixaBandagemDourada: {
                          ...(prev.profileCard.faixaBandagemDourada || {
                            enabled: true,
                            width: 100,
                            height: 36,
                            offsetX: 0,
                            offsetY: 0,
                            opacity: 0.9,
                            style: 'shiny_gold',
                            softEdges: true,
                          }),
                          customColor: color,
                        },
                      }
                    : undefined,
                }));
              }}
            />
          </div>

          {/* Opacidade da Bandagem */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between">
              <label className="text-[11px] text-slate-400">Opacidade da Bandagem</label>
              <span className="text-[10px] text-amber-300 font-mono">
                {Math.round((config.profileCard?.faixaBandagemDourada?.opacity ?? 0.9) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={Math.round((config.profileCard?.faixaBandagemDourada?.opacity ?? 0.9) * 100)}
              onChange={(e) => {
                const val = parseInt(e.target.value) / 100;
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? {
                        ...prev.profileCard,
                        faixaBandagemDourada: {
                          ...(prev.profileCard.faixaBandagemDourada || {
                            enabled: true,
                            width: 100,
                            height: 36,
                            offsetX: 0,
                            offsetY: 0,
                            opacity: 0.9,
                            style: 'shiny_gold',
                            softEdges: true,
                          }),
                          opacity: val,
                        },
                      }
                    : undefined,
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Escala / Tamanho da Faixa */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between">
              <label className="text-[11px] text-slate-400">Tamanho / Escala da Faixa</label>
              <span className="text-[10px] text-amber-300 font-mono">
                {config.profileCard?.faixaTamanho ?? 100}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={config.profileCard?.faixaTamanho ?? 100}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? { ...prev.profileCard, faixaTamanho: val }
                    : undefined,
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Dica de Arraste Interativo Direto com Mouse */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-center gap-2 text-[10px] text-amber-300">
            <span className="text-base">🖱️</span>
            <span>Você pode clicar e arrastar a faixa diretamente na imagem com o mouse para posicioná-la livremente!</span>
          </div>

          {/* Deslocamentos X e Y */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-400">Deslocamento X</label>
                <span className="text-[9px] text-amber-300 font-mono font-bold">
                  {config.profileCard?.faixaOffsetX ?? 0}%
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={config.profileCard?.faixaOffsetX ?? 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard
                      ? { ...prev.profileCard, faixaOffsetX: val }
                      : undefined,
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-400">Deslocamento Y</label>
                <span className="text-[9px] text-amber-300 font-mono font-bold">
                  {config.profileCard?.faixaOffsetY ?? 0}%
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={config.profileCard?.faixaOffsetY ?? 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard
                      ? { ...prev.profileCard, faixaOffsetY: val }
                      : undefined,
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Resetar Posição */}
          {(config.profileCard?.faixaOffsetX !== 0 || config.profileCard?.faixaOffsetY !== 0) && (
            <button
              onClick={() =>
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? { ...prev.profileCard, faixaOffsetX: 0, faixaOffsetY: 0 }
                    : undefined,
                }))
              }
              className="w-full py-1 text-[10px] text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-800 rounded-md transition-all cursor-pointer"
            >
              Centralizar Posição da Faixa
            </button>
          )}
        </div>
      )}

      {/* Sombra de Fundo Degradê Difusa (45-70%) */}
      <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-200">Sombra Degradê de Fundo</span>
            <span className="text-[9px] text-slate-400">
              Garante legibilidade sobre fundos claros (45% a 70% de opacidade suave)
            </span>
          </div>
          <input
            type="checkbox"
            checked={config.profileCard?.sombraAtiva !== false}
            onChange={(e) => {
              const isChecked = e.target.checked;
              updateConfig((prev) => ({
                ...prev,
                profileCard: prev.profileCard
                  ? { ...prev.profileCard, sombraAtiva: isChecked }
                  : undefined,
              }));
            }}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {config.profileCard?.sombraAtiva !== false && (
          <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-300">Intensidade da Sombra (45% a 70%)</label>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {config.profileCard?.sombraIntensidade ?? 60}%
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="70"
                value={config.profileCard?.sombraIntensidade ?? 60}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard
                      ? { ...prev.profileCard, sombraIntensidade: val }
                      : undefined,
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-300">Desfoque / Difusão</label>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {config.profileCard?.sombraBlur ?? 26}px
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={config.profileCard?.sombraBlur ?? 26}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard
                      ? { ...prev.profileCard, sombraBlur: val }
                      : undefined,
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
