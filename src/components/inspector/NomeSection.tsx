import React from 'react';
import { EditConfig, ImageItem, ModelData, BottomNameBandConfig, GoldBandTone } from '../../types';
import { AVAILABLE_FONTS } from '../../utils/defaults';
import { GoldTonePicker } from './GoldTonePicker';
import {
  Layers,
  Sparkles,
  Type,
  Sliders,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  RotateCcw,
  Palette,
  Check,
} from 'lucide-react';

interface NomeSectionProps {
  currentImage: ImageItem;
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
  onUpdateImageModelData: (id: string, newModelData: ModelData) => void;
}

export const NomeSection: React.FC<NomeSectionProps> = ({
  currentImage,
  config,
  updateConfig,
  onUpdateImageModelData,
}) => {
  const isNameActive = Boolean(config.nameOverlay?.active || config.profileCard?.active);

  return (
    <div className="space-y-4">
      {/* Ativar/Desativar Nome */}
      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <span className="font-medium text-slate-200">Exibir Nome na Foto</span>
        <button
          onClick={() =>
            updateConfig((prev) => ({
              ...prev,
              nameOverlay: {
                ...prev.nameOverlay,
                active: !prev.nameOverlay.active,
              },
              profileCard: prev.profileCard
                ? { ...prev.profileCard, active: !prev.profileCard.active }
                : undefined,
            }))
          }
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            isNameActive
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isNameActive ? 'Ativado' : 'Desativado'}
        </button>
      </div>

      {/* Configurações do Nome */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-medium">Nome do Modelo / Perfil</label>
          <input
            type="text"
            value={currentImage.modelData.nome || config.nameOverlay.text || ''}
            onChange={(e) => {
              const val = e.target.value;
              updateConfig((prev) => ({
                ...prev,
                nameOverlay: { ...prev.nameOverlay, text: val },
              }));
              onUpdateImageModelData(currentImage.id, {
                ...currentImage.modelData,
                nome: val,
              });
            }}
            placeholder="Ex: Valentina"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-semibold focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[11px] text-slate-400">Tamanho da Fonte</label>
              <span className="text-[10px] text-amber-300 font-mono">
                {config.profileCard?.nomeTamanho || config.nameOverlay.fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="16"
              max="80"
              value={config.profileCard?.nomeTamanho || config.nameOverlay.fontSize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  nameOverlay: { ...prev.nameOverlay, fontSize: val },
                  profileCard: prev.profileCard ? { ...prev.profileCard, nomeTamanho: val } : undefined,
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Tipografia</label>
            <select
              value={config.profileCard?.nomeFonte || config.nameOverlay.fontFamily}
              onChange={(e) => {
                const val = e.target.value;
                updateConfig((prev) => ({
                  ...prev,
                  nameOverlay: { ...prev.nameOverlay, fontFamily: val },
                  profileCard: prev.profileCard ? { ...prev.profileCard, nomeFonte: val } : undefined,
                }));
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              {AVAILABLE_FONTS.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cor do Nome */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] text-slate-400">Cor do Nome</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.profileCard?.nomeCor || config.nameOverlay.textColor || '#FFFFFF'}
              onChange={(e) => {
                const val = e.target.value;
                updateConfig((prev) => ({
                  ...prev,
                  nameOverlay: { ...prev.nameOverlay, textColor: val },
                  profileCard: prev.profileCard ? { ...prev.profileCard, nomeCor: val } : undefined,
                }));
              }}
              className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
            />
            <div className="flex items-center gap-1">
              {[
                { label: 'Branco', color: '#FFFFFF' },
                { label: 'Marfim', color: '#FDFBF7' },
                { label: 'Ouro Claro', color: '#F9E7BA' },
                { label: 'Dourado', color: '#D4AF37' },
              ].map((c) => (
                <button
                  key={c.color}
                  onClick={() =>
                    updateConfig((prev) => ({
                      ...prev,
                      nameOverlay: { ...prev.nameOverlay, textColor: c.color },
                      profileCard: prev.profileCard ? { ...prev.profileCard, nomeCor: c.color } : undefined,
                    }))
                  }
                  className="w-5 h-5 rounded-full border border-slate-600 hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bandagem Dourada Suave e Flexível */}
      <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-amber-300">Bandagem Dourada no Nome</span>
            <span className="text-[9px] text-slate-400">Efeito suave e difuso nas laterais</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(config.nameOverlay.goldBand?.enabled || config.profileCard?.nomeBandagemDourada?.enabled)}
            onChange={(e) => {
              const isChecked = e.target.checked;
              updateConfig((prev) => ({
                ...prev,
                nameOverlay: {
                  ...prev.nameOverlay,
                  goldBand: {
                    ...prev.nameOverlay.goldBand,
                    enabled: isChecked,
                  },
                },
                profileCard: {
                  ...(prev.profileCard || {
                    active: true,
                    position: 'bottom_right',
                    customX: 85,
                    customY: 88,
                    align: 'right',
                    nomeCor: '#FFFFFF',
                    nomeFonte: 'Gilda Display',
                    nomeTamanho: 34,
                    infoCorTexto: '#FFFFFF',
                    infoCorSeparadores: '#D4AF37',
                    infoFonte: 'Montserrat',
                    infoTamanho: 18,
                    etiquetaAtiva: true,
                    etiquetaTexto: 'NOVIDADE',
                    etiquetaCaixaAlta: true,
                    etiquetaEstilo: 'faixa_dourada',
                  }),
                  nomeBandagemDourada: {
                    ...(prev.profileCard?.nomeBandagemDourada || {
                      enabled: false,
                      placement: 'half_bottom',
                      width: 108,
                      height: 36,
                      offsetX: 0,
                      offsetY: 6,
                      opacity: 0.9,
                      style: 'shiny_gold',
                      softEdges: true,
                    }),
                    enabled: isChecked,
                  },
                },
              }));
            }}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {(config.nameOverlay.goldBand?.enabled || config.profileCard?.nomeBandagemDourada?.enabled) && (
          <div className="space-y-3 pt-2 border-t border-slate-800 text-[10px]">
            {/* Seletor de Posição / Modo da Bandagem */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-300">Posição da Bandagem no Nome</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'half_bottom', label: 'Metade p/ Baixo (Padrão)', desc: 'Do meio do nome até a base' },
                  { id: 'full_name', label: 'Atrás do Nome', desc: 'Cobre o nome completo' },
                  { id: 'underline', label: 'Sublinhado Fino', desc: 'Faixa dourada inferior' },
                  { id: 'custom', label: 'Livre / Custom', desc: 'Ajuste livre de X e Y' },
                ].map((mode) => {
                  const activePlacement =
                    config.profileCard?.nomeBandagemDourada?.placement ||
                    config.nameOverlay.goldBand?.placement ||
                    'half_bottom';
                  const isSelected = activePlacement === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          nameOverlay: {
                            ...prev.nameOverlay,
                            goldBand: {
                              ...prev.nameOverlay.goldBand,
                              placement: mode.id as any,
                            },
                          },
                          profileCard: {
                            ...prev.profileCard,
                            nomeBandagemDourada: {
                              ...(prev.profileCard?.nomeBandagemDourada || {
                                enabled: true,
                                width: 108,
                                height: 36,
                                offsetX: 0,
                                offsetY: 6,
                                opacity: 0.9,
                                style: 'shiny_gold',
                                softEdges: true,
                              }),
                              enabled: true,
                              placement: mode.id as any,
                            },
                          },
                        }))
                      }
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-semibold leading-tight">{mode.label}</div>
                      <div className="text-[8px] text-slate-400 leading-tight mt-0.5">{mode.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seletor de Tonalidade de Dourado */}
            <div className="pt-2 border-t border-slate-800">
              <GoldTonePicker
                label="Tonalidade do Dourado no Nome"
                selectedTone={
                  config.profileCard?.nomeBandagemDourada?.tone ||
                  config.nameOverlay.goldBand?.tone ||
                  config.profileCard?.nomeTomDourado ||
                  'classic_gold'
                }
                customColor={
                  config.profileCard?.nomeBandagemDourada?.customColor ||
                  config.nameOverlay.goldBand?.customColor ||
                  config.profileCard?.nomeCorCustom ||
                  '#D4AF37'
                }
                onSelectTone={(tone: GoldBandTone) => {
                  updateConfig((prev) => ({
                    ...prev,
                    nameOverlay: {
                      ...prev.nameOverlay,
                      goldBand: {
                        ...prev.nameOverlay.goldBand,
                        tone: tone,
                      },
                    },
                    profileCard: {
                      ...prev.profileCard,
                      nomeTomDourado: tone,
                      nomeBandagemDourada: {
                        ...(prev.profileCard?.nomeBandagemDourada || {
                          enabled: true,
                          placement: 'half_bottom',
                          width: 108,
                          height: 36,
                          offsetX: 0,
                          offsetY: 6,
                          opacity: 0.9,
                          style: 'shiny_gold',
                          softEdges: true,
                        }),
                        enabled: true,
                        tone: tone,
                      },
                    },
                  }));
                }}
                onChangeCustomColor={(color: string) => {
                  updateConfig((prev) => ({
                    ...prev,
                    nameOverlay: {
                      ...prev.nameOverlay,
                      goldBand: {
                        ...prev.nameOverlay.goldBand,
                        customColor: color,
                      },
                    },
                    profileCard: {
                      ...prev.profileCard,
                      nomeCorCustom: color,
                      nomeBandagemDourada: {
                        ...(prev.profileCard?.nomeBandagemDourada || {
                          enabled: true,
                          placement: 'half_bottom',
                          width: 108,
                          height: 36,
                          offsetX: 0,
                          offsetY: 6,
                          opacity: 0.9,
                          style: 'shiny_gold',
                          softEdges: true,
                        }),
                        enabled: true,
                        customColor: color,
                      },
                    },
                  }));
                }}
              />
            </div>

            {/* Deslocamento Vertical Y */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Deslocamento Vertical (Y)</span>
                <span className="text-amber-300 font-mono font-bold">
                  {(config.profileCard?.nomeBandagemDourada?.offsetY ?? config.nameOverlay.goldBand?.offsetY) || 0}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="60"
                value={(config.profileCard?.nomeBandagemDourada?.offsetY ?? config.nameOverlay.goldBand?.offsetY) || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    nameOverlay: {
                      ...prev.nameOverlay,
                      goldBand: { ...prev.nameOverlay.goldBand, offsetY: val },
                    },
                    profileCard: {
                      ...prev.profileCard,
                      nomeBandagemDourada: {
                        ...(prev.profileCard?.nomeBandagemDourada || {
                          enabled: true,
                          placement: 'half_bottom',
                          width: 108,
                          height: 36,
                          offsetX: 0,
                          offsetY: val,
                          opacity: 0.9,
                          style: 'shiny_gold',
                          softEdges: true,
                        }),
                        enabled: true,
                        offsetY: val,
                      },
                    },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Deslocamento Horizontal X */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Deslocamento Horizontal (X)</span>
                <span className="text-amber-300 font-mono font-bold">
                  {(config.profileCard?.nomeBandagemDourada?.offsetX ?? config.nameOverlay.goldBand?.offsetX) || 0}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={(config.profileCard?.nomeBandagemDourada?.offsetX ?? config.nameOverlay.goldBand?.offsetX) || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    nameOverlay: {
                      ...prev.nameOverlay,
                      goldBand: { ...prev.nameOverlay.goldBand, offsetX: val },
                    },
                    profileCard: {
                      ...prev.profileCard,
                      nomeBandagemDourada: {
                        ...(prev.profileCard?.nomeBandagemDourada || {
                          enabled: true,
                          placement: 'half_bottom',
                          width: 108,
                          height: 36,
                          offsetX: val,
                          offsetY: 6,
                          opacity: 0.9,
                          style: 'shiny_gold',
                          softEdges: true,
                        }),
                        enabled: true,
                        offsetX: val,
                      },
                    },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Largura da Bandagem */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Largura / Extensão</span>
                <span className="text-amber-300 font-mono font-bold">
                  {config.profileCard?.nomeBandagemDourada?.width ?? config.nameOverlay.goldBand?.width ?? 108}%
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                value={config.profileCard?.nomeBandagemDourada?.width ?? config.nameOverlay.goldBand?.width ?? 108}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    nameOverlay: {
                      ...prev.nameOverlay,
                      goldBand: { ...prev.nameOverlay.goldBand, width: val },
                    },
                    profileCard: {
                      ...prev.profileCard,
                      nomeBandagemDourada: {
                        ...(prev.profileCard?.nomeBandagemDourada || {
                          enabled: true,
                          placement: 'half_bottom',
                          width: val,
                          height: 36,
                          offsetX: 0,
                          offsetY: 6,
                          opacity: 0.9,
                          style: 'shiny_gold',
                          softEdges: true,
                        }),
                        enabled: true,
                        width: val,
                      },
                    },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Altura / Espessura */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Altura / Espessura</span>
                <span className="text-amber-300 font-mono font-bold">
                  {(config.profileCard?.nomeBandagemDourada?.height ?? config.nameOverlay.goldBand?.height) || 36}px
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={(config.profileCard?.nomeBandagemDourada?.height ?? config.nameOverlay.goldBand?.height) || 36}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    nameOverlay: {
                      ...prev.nameOverlay,
                      goldBand: { ...prev.nameOverlay.goldBand, height: val },
                    },
                    profileCard: {
                      ...prev.profileCard,
                      nomeBandagemDourada: {
                        ...(prev.profileCard?.nomeBandagemDourada || {
                          enabled: true,
                          placement: 'half_bottom',
                          width: 108,
                          height: val,
                          offsetX: 0,
                          offsetY: 6,
                          opacity: 0.9,
                          style: 'shiny_gold',
                          softEdges: true,
                        }),
                        enabled: true,
                        height: val,
                      },
                    },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Opacidade */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Opacidade do Ouro</span>
                <span className="text-amber-300 font-mono font-bold">
                  {Math.round(((config.profileCard?.nomeBandagemDourada?.opacity ?? config.nameOverlay.goldBand?.opacity) ?? 0.9) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={(config.profileCard?.nomeBandagemDourada?.opacity ?? config.nameOverlay.goldBand?.opacity) ?? 0.9}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    nameOverlay: {
                      ...prev.nameOverlay,
                      goldBand: { ...prev.nameOverlay.goldBand, opacity: val },
                    },
                    profileCard: {
                      ...prev.profileCard,
                      nomeBandagemDourada: {
                        ...(prev.profileCard?.nomeBandagemDourada || {
                          enabled: true,
                          placement: 'half_bottom',
                          width: 108,
                          height: 36,
                          offsetX: 0,
                          offsetY: 6,
                          opacity: val,
                          style: 'shiny_gold',
                          softEdges: true,
                        }),
                        enabled: true,
                        opacity: val,
                      },
                    },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* FAIXA / FUNDO PRETO NO NOME (OPCIONAL - O USUÁRIO ATIVA QUANDO QUISER!) */}
      <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-200">Faixa / Fundo Preto no Nome</span>
            <span className="text-[9px] text-slate-400">Opção manual para destacar o nome (não automática)</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(config.profileCard?.nomeFaixaPreta?.enabled || config.nameOverlay?.blackBand?.enabled)}
            onChange={(e) => {
              const isChecked = e.target.checked;
              updateConfig((prev) => ({
                ...prev,
                nameOverlay: {
                  ...prev.nameOverlay,
                  blackBand: {
                    ...(prev.nameOverlay.blackBand || {
                      opacity: 0.75,
                      blur: 10,
                      width: 115,
                      height: 36,
                      offsetX: 0,
                      offsetY: 4,
                      style: 'capsula',
                    }),
                    enabled: isChecked,
                  },
                },
                profileCard: {
                  ...(prev.profileCard || {
                    active: true,
                    position: 'bottom_right',
                    customX: 85,
                    customY: 88,
                    align: 'right',
                    nomeCor: '#FFFFFF',
                    nomeFonte: 'Gilda Display',
                    nomeTamanho: 34,
                    infoCorTexto: '#FFFFFF',
                    infoCorSeparadores: '#d4af37',
                    infoFonte: 'Montserrat',
                    infoTamanho: 18,
                    etiquetaAtiva: true,
                    etiquetaTexto: 'NOVIDADE',
                    etiquetaCaixaAlta: true,
                    etiquetaEstilo: 'faixa_dourada',
                  }),
                  nomeFaixaPreta: {
                    ...(prev.profileCard?.nomeFaixaPreta || {
                      opacity: 0.75,
                      blur: 10,
                      width: 115,
                      height: 36,
                      offsetX: 0,
                      offsetY: 4,
                      style: 'capsula',
                    }),
                    enabled: isChecked,
                  },
                },
              }));
            }}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {Boolean(config.profileCard?.nomeFaixaPreta?.enabled || config.nameOverlay?.blackBand?.enabled) && (
          <div className="space-y-3 pt-2 border-t border-slate-800 text-[10px]">
            {/* Estilo da Faixa */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-300 font-semibold">Estilo do Fundo Escuro</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'capsula', label: 'Cápsula' },
                  { id: 'faixa', label: 'Faixa Larga' },
                  { id: 'sombra_suave', label: 'Sombra Oval' },
                ].map((st) => {
                  const currentStyle =
                    config.profileCard?.nomeFaixaPreta?.style ||
                    config.nameOverlay?.blackBand?.style ||
                    'capsula';
                  const isSel = currentStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          nameOverlay: {
                            ...prev.nameOverlay,
                            blackBand: {
                              ...(prev.nameOverlay.blackBand || {
                                enabled: true,
                                opacity: 0.75,
                                blur: 10,
                                width: 115,
                                height: 36,
                                offsetX: 0,
                                offsetY: 4,
                              }),
                              style: st.id as any,
                            },
                          },
                          profileCard: {
                            ...(prev.profileCard || {
                              active: true,
                              position: 'bottom_right',
                              customX: 85,
                              customY: 88,
                              align: 'right',
                              nomeCor: '#FFFFFF',
                              nomeFonte: 'Gilda Display',
                              nomeTamanho: 34,
                              infoCorTexto: '#FFFFFF',
                              infoCorSeparadores: '#d4af37',
                              infoFonte: 'Montserrat',
                              infoTamanho: 18,
                              etiquetaAtiva: true,
                              etiquetaTexto: 'NOVIDADE',
                              etiquetaCaixaAlta: true,
                              etiquetaEstilo: 'faixa_dourada',
                            }),
                            nomeFaixaPreta: {
                              ...(prev.profileCard?.nomeFaixaPreta || {
                                enabled: true,
                                opacity: 0.75,
                                blur: 10,
                                width: 115,
                                height: 36,
                                offsetX: 0,
                                offsetY: 4,
                              }),
                              style: st.id as any,
                            },
                          },
                        }))
                      }
                      className={`py-1 rounded text-[10px] font-medium border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opacidade */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Opacidade / Densidade</span>
                <span className="text-amber-300 font-mono">
                  {Math.round((config.profileCard?.nomeFaixaPreta?.opacity ?? config.nameOverlay?.blackBand?.opacity ?? 0.75) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={Math.round((config.profileCard?.nomeFaixaPreta?.opacity ?? config.nameOverlay?.blackBand?.opacity ?? 0.75) * 100)}
                onChange={(e) => {
                  const val = parseInt(e.target.value) / 100;
                  updateConfig((prev) => ({
                    ...prev,
                    nameOverlay: {
                      ...prev.nameOverlay,
                      blackBand: {
                        ...(prev.nameOverlay.blackBand || {
                          enabled: true,
                          blur: 10,
                          width: 115,
                          height: 36,
                          offsetX: 0,
                          offsetY: 4,
                          style: 'capsula',
                        }),
                        opacity: val,
                      },
                    },
                    profileCard: {
                      ...(prev.profileCard || {
                        active: true,
                        position: 'bottom_right',
                        customX: 85,
                        customY: 88,
                        align: 'right',
                        nomeCor: '#FFFFFF',
                        nomeFonte: 'Gilda Display',
                        nomeTamanho: 34,
                        infoCorTexto: '#FFFFFF',
                        infoCorSeparadores: '#d4af37',
                        infoFonte: 'Montserrat',
                        infoTamanho: 18,
                        etiquetaAtiva: true,
                        etiquetaTexto: 'NOVIDADE',
                        etiquetaCaixaAlta: true,
                        etiquetaEstilo: 'faixa_dourada',
                      }),
                      nomeFaixaPreta: {
                        ...(prev.profileCard?.nomeFaixaPreta || {
                          enabled: true,
                          blur: 10,
                          width: 115,
                          height: 36,
                          offsetX: 0,
                          offsetY: 4,
                          style: 'capsula',
                        }),
                        opacity: val,
                      },
                    },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Largura e Desfoque */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Largura</span>
                  <span className="text-amber-300 font-mono">
                    {config.profileCard?.nomeFaixaPreta?.width ?? config.nameOverlay?.blackBand?.width ?? 115}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={config.profileCard?.nomeFaixaPreta?.width ?? config.nameOverlay?.blackBand?.width ?? 115}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateConfig((prev) => ({
                      ...prev,
                      profileCard: {
                        ...(prev.profileCard || {
                          active: true,
                          position: 'bottom_right',
                          customX: 85,
                          customY: 88,
                          align: 'right',
                          nomeCor: '#FFFFFF',
                          nomeFonte: 'Gilda Display',
                          nomeTamanho: 34,
                          infoCorTexto: '#FFFFFF',
                          infoCorSeparadores: '#d4af37',
                          infoFonte: 'Montserrat',
                          infoTamanho: 18,
                          etiquetaAtiva: true,
                          etiquetaTexto: 'NOVIDADE',
                          etiquetaCaixaAlta: true,
                          etiquetaEstilo: 'faixa_dourada',
                        }),
                        nomeFaixaPreta: {
                          ...(prev.profileCard?.nomeFaixaPreta || {
                            enabled: true,
                            opacity: 0.75,
                            blur: 10,
                            height: 36,
                            offsetX: 0,
                            offsetY: 4,
                            style: 'capsula',
                          }),
                          width: val,
                        },
                      },
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Desfoque (Blur)</span>
                  <span className="text-amber-300 font-mono">
                    {config.profileCard?.nomeFaixaPreta?.blur ?? config.nameOverlay?.blackBand?.blur ?? 10}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={config.profileCard?.nomeFaixaPreta?.blur ?? config.nameOverlay?.blackBand?.blur ?? 10}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateConfig((prev) => ({
                      ...prev,
                      profileCard: {
                        ...(prev.profileCard || {
                          active: true,
                          position: 'bottom_right',
                          customX: 85,
                          customY: 88,
                          align: 'right',
                          nomeCor: '#FFFFFF',
                          nomeFonte: 'Gilda Display',
                          nomeTamanho: 34,
                          infoCorTexto: '#FFFFFF',
                          infoCorSeparadores: '#d4af37',
                          infoFonte: 'Montserrat',
                          infoTamanho: 18,
                          etiquetaAtiva: true,
                          etiquetaTexto: 'NOVIDADE',
                          etiquetaCaixaAlta: true,
                          etiquetaEstilo: 'faixa_dourada',
                        }),
                        nomeFaixaPreta: {
                          ...(prev.profileCard?.nomeFaixaPreta || {
                            enabled: true,
                            opacity: 0.75,
                            width: 115,
                            height: 36,
                            offsetX: 0,
                            offsetY: 4,
                            style: 'capsula',
                          }),
                          blur: val,
                        },
                      },
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posicionamento e Deslocamento Livre do Nome */}
      <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-300">Posicionamento Livre do Nome</span>
          <span className="text-[9px] text-slate-400">Arraste na tela ou ajuste fino</span>
        </div>

        {/* Dica de arraste com mouse */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-center gap-2 text-[10px] text-amber-300">
          <span className="text-base">🖱️</span>
          <span>Você pode clicar e arrastar o Nome diretamente na foto com o mouse!</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] text-slate-400">Deslocamento X</label>
              <span className="text-[9px] text-amber-300 font-mono font-bold">
                {config.profileCard?.nomeOffsetX ?? 0}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={config.profileCard?.nomeOffsetX ?? 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? { ...prev.profileCard, nomeOffsetX: val }
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
                {config.profileCard?.nomeOffsetY ?? 0}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={config.profileCard?.nomeOffsetY ?? 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? { ...prev.profileCard, nomeOffsetY: val }
                    : undefined,
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {(config.profileCard?.nomeOffsetX !== 0 || config.profileCard?.nomeOffsetY !== 0) && (
          <button
            onClick={() =>
              updateConfig((prev) => ({
                ...prev,
                profileCard: prev.profileCard
                  ? { ...prev.profileCard, nomeOffsetX: 0, nomeOffsetY: 0 }
                  : undefined,
              }))
            }
            className="w-full py-1 text-[10px] text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-800 rounded-md transition-all cursor-pointer"
          >
            Centralizar Posição do Nome
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* NOVA OPÇÃO: FAIXA INFERIOR COM NOME (Bottom Name Band)                    */}
      {/* ========================================================================= */}
      <div className="space-y-3 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 shadow-md">
        {/* Switch / Ativação */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-xs text-slate-100">Faixa inferior com nome</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Faixa horizontal preta com nome em caixa alta encostada na borda inferior da foto
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const currentBand = config.bottomNameBand || {
                enabled: false,
                height: 58,
                backgroundColor: '#000000',
                backgroundOpacity: 78,
                textColor: '#FFFFFF',
                fontSize: 26,
                fontFamily: 'Montserrat',
                fontWeight: '700',
                letterSpacing: 4,
                verticalAlign: 'middle' as const,
                offsetX: 0,
                offsetY: 0,
              };
              updateConfig((prev) => ({
                ...prev,
                bottomNameBand: {
                  ...currentBand,
                  enabled: !currentBand.enabled,
                },
              }));
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1 shrink-0 ${
              config.bottomNameBand?.enabled
                ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {config.bottomNameBand?.enabled && <Check className="w-3 h-3 stroke-[3]" />}
            {config.bottomNameBand?.enabled ? 'Ativada' : 'Desativada'}
          </button>
        </div>

        {/* Controles da Faixa Inferior (exibidos quando ativada) */}
        {config.bottomNameBand?.enabled && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80 animate-fadeIn">
            {/* Live Preview / Informativo de sincronização automática com o campo Nome */}
            <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Texto da Faixa (Caixa Alta automática):</span>
                <span className="text-amber-400/90 font-mono text-[9px]">Sincronizado com Nome</span>
              </div>
              <div
                style={{
                  backgroundColor: config.bottomNameBand.backgroundColor || '#000000',
                  opacity: (config.bottomNameBand.backgroundOpacity ?? 78) / 100,
                  color: config.bottomNameBand.textColor || '#FFFFFF',
                  fontFamily: config.bottomNameBand.fontFamily || 'Montserrat',
                  fontWeight: config.bottomNameBand.fontWeight || '700',
                  letterSpacing: `${config.bottomNameBand.letterSpacing ?? 4}px`,
                }}
                className="w-full py-2 px-3 rounded text-center text-xs tracking-widest uppercase truncate border border-white/10 shadow-inner font-semibold"
              >
                {(currentImage.modelData.nome || config.nameOverlay.text || 'VALENTINA').trim() || 'NOME DO PERFIL'}
              </div>
            </div>

            {/* 1. Altura da Faixa & 2. Opacidade do Fundo */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-slate-300">Altura da Faixa</label>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    {config.bottomNameBand.height ?? 58}px
                  </span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="140"
                  value={config.bottomNameBand.height ?? 58}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateConfig((prev) => ({
                      ...prev,
                      bottomNameBand: {
                        ...(prev.bottomNameBand || {
                          enabled: true,
                          height: 58,
                          backgroundColor: '#000000',
                          backgroundOpacity: 78,
                          textColor: '#FFFFFF',
                          fontSize: 26,
                          fontFamily: 'Montserrat',
                          fontWeight: '700',
                          letterSpacing: 4,
                          verticalAlign: 'middle',
                          offsetX: 0,
                          offsetY: 0,
                        }),
                        height: val,
                      },
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-slate-300">Opacidade do Fundo</label>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    {config.bottomNameBand.backgroundOpacity ?? 78}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={config.bottomNameBand.backgroundOpacity ?? 78}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateConfig((prev) => ({
                      ...prev,
                      bottomNameBand: {
                        ...(prev.bottomNameBand || {
                          enabled: true,
                          height: 58,
                          backgroundColor: '#000000',
                          backgroundOpacity: 78,
                          textColor: '#FFFFFF',
                          fontSize: 26,
                          fontFamily: 'Montserrat',
                          fontWeight: '700',
                          letterSpacing: 4,
                          verticalAlign: 'middle',
                          offsetX: 0,
                          offsetY: 0,
                        }),
                        backgroundOpacity: val,
                      },
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Cor do Fundo & 4. Cor do Texto */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Cor do Fundo */}
              <div className="space-y-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-medium text-slate-300">Cor do Fundo</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={config.bottomNameBand.backgroundColor || '#000000'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => ({
                          ...prev,
                          bottomNameBand: {
                            ...(prev.bottomNameBand || {
                              enabled: true,
                              height: 58,
                              backgroundColor: '#000000',
                              backgroundOpacity: 78,
                              textColor: '#FFFFFF',
                              fontSize: 26,
                              fontFamily: 'Montserrat',
                              fontWeight: '700',
                              letterSpacing: 4,
                              verticalAlign: 'middle',
                              offsetX: 0,
                              offsetY: 0,
                            }),
                            backgroundColor: val,
                          },
                        }));
                      }}
                      className="w-5 h-5 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-[9px] font-mono text-slate-400">
                      {config.bottomNameBand.backgroundColor || '#000000'}
                    </span>
                  </div>
                </div>
                {/* Paleta rápida fundo */}
                <div className="flex items-center gap-1 pt-0.5">
                  {[
                    { label: 'Preto', color: '#000000' },
                    { label: 'Grafite', color: '#181a20' },
                    { label: 'Azul Noite', color: '#0b1220' },
                    { label: 'Vinho', color: '#1c080e' },
                    { label: 'Dourado Escuro', color: '#2b1f09' },
                  ].map((swatch) => (
                    <button
                      key={swatch.color}
                      type="button"
                      title={swatch.label}
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          bottomNameBand: {
                            ...(prev.bottomNameBand || {
                              enabled: true,
                              height: 58,
                              backgroundColor: '#000000',
                              backgroundOpacity: 78,
                              textColor: '#FFFFFF',
                              fontSize: 26,
                              fontFamily: 'Montserrat',
                              fontWeight: '700',
                              letterSpacing: 4,
                              verticalAlign: 'middle',
                              offsetX: 0,
                              offsetY: 0,
                            }),
                            backgroundColor: swatch.color,
                          },
                        }))
                      }
                      style={{ backgroundColor: swatch.color }}
                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                        config.bottomNameBand?.backgroundColor?.toLowerCase() === swatch.color.toLowerCase()
                          ? 'border-amber-400 scale-110 shadow-sm'
                          : 'border-slate-700 hover:border-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Cor do Texto */}
              <div className="space-y-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-medium text-slate-300">Cor do Texto</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={config.bottomNameBand.textColor || '#FFFFFF'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => ({
                          ...prev,
                          bottomNameBand: {
                            ...(prev.bottomNameBand || {
                              enabled: true,
                              height: 58,
                              backgroundColor: '#000000',
                              backgroundOpacity: 78,
                              textColor: '#FFFFFF',
                              fontSize: 26,
                              fontFamily: 'Montserrat',
                              fontWeight: '700',
                              letterSpacing: 4,
                              verticalAlign: 'middle',
                              offsetX: 0,
                              offsetY: 0,
                            }),
                            textColor: val,
                          },
                        }));
                      }}
                      className="w-5 h-5 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-[9px] font-mono text-slate-400">
                      {config.bottomNameBand.textColor || '#FFFFFF'}
                    </span>
                  </div>
                </div>
                {/* Paleta rápida texto */}
                <div className="flex items-center gap-1 pt-0.5">
                  {[
                    { label: 'Branco', color: '#FFFFFF' },
                    { label: 'Marfim', color: '#FDFBF7' },
                    { label: 'Dourado', color: '#D4AF37' },
                    { label: 'Ouro Claro', color: '#F9E7BA' },
                    { label: 'Prata', color: '#E2E8F0' },
                  ].map((swatch) => (
                    <button
                      key={swatch.color}
                      type="button"
                      title={swatch.label}
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          bottomNameBand: {
                            ...(prev.bottomNameBand || {
                              enabled: true,
                              height: 58,
                              backgroundColor: '#000000',
                              backgroundOpacity: 78,
                              textColor: '#FFFFFF',
                              fontSize: 26,
                              fontFamily: 'Montserrat',
                              fontWeight: '700',
                              letterSpacing: 4,
                              verticalAlign: 'middle',
                              offsetX: 0,
                              offsetY: 0,
                            }),
                            textColor: swatch.color,
                          },
                        }))
                      }
                      style={{ backgroundColor: swatch.color }}
                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                        config.bottomNameBand?.textColor?.toLowerCase() === swatch.color.toLowerCase()
                          ? 'border-amber-400 scale-110 shadow-sm'
                          : 'border-slate-700 hover:border-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Tamanho do Texto & 6. Tipo de Fonte */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-slate-300">Tamanho do Texto</label>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    {config.bottomNameBand.fontSize ?? 26}px
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="64"
                  value={config.bottomNameBand.fontSize ?? 26}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateConfig((prev) => ({
                      ...prev,
                      bottomNameBand: {
                        ...(prev.bottomNameBand || {
                          enabled: true,
                          height: 58,
                          backgroundColor: '#000000',
                          backgroundOpacity: 78,
                          textColor: '#FFFFFF',
                          fontSize: 26,
                          fontFamily: 'Montserrat',
                          fontWeight: '700',
                          letterSpacing: 4,
                          verticalAlign: 'middle',
                          offsetX: 0,
                          offsetY: 0,
                        }),
                        fontSize: val,
                      },
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Tipo de Fonte</label>
                <select
                  value={config.bottomNameBand.fontFamily || 'Montserrat'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateConfig((prev) => ({
                      ...prev,
                      bottomNameBand: {
                        ...(prev.bottomNameBand || {
                          enabled: true,
                          height: 58,
                          backgroundColor: '#000000',
                          backgroundOpacity: 78,
                          textColor: '#FFFFFF',
                          fontSize: 26,
                          fontFamily: 'Montserrat',
                          fontWeight: '700',
                          letterSpacing: 4,
                          verticalAlign: 'middle',
                          offsetX: 0,
                          offsetY: 0,
                        }),
                        fontFamily: val,
                      },
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none cursor-pointer font-medium"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font.name} value={font.name}>
                      {font.label || font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 7. Peso da Fonte & 8. Espaçamento entre Letras */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Peso da Fonte</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { label: 'Normal', value: '400' },
                    { label: 'Médio', value: '600' },
                    { label: 'Negrito', value: '700' },
                    { label: 'Extra', value: '800' },
                  ].map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          bottomNameBand: {
                            ...(prev.bottomNameBand || {
                              enabled: true,
                              height: 58,
                              backgroundColor: '#000000',
                              backgroundOpacity: 78,
                              textColor: '#FFFFFF',
                              fontSize: 26,
                              fontFamily: 'Montserrat',
                              fontWeight: '700',
                              letterSpacing: 4,
                              verticalAlign: 'middle',
                              offsetX: 0,
                              offsetY: 0,
                            }),
                            fontWeight: w.value,
                          },
                        }))
                      }
                      className={`py-1 text-[10px] rounded border font-semibold transition-all cursor-pointer text-center ${
                        String(config.bottomNameBand?.fontWeight ?? '700') === w.value
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-slate-300">Espaçamento Letras</label>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    {config.bottomNameBand.letterSpacing ?? 4}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={config.bottomNameBand.letterSpacing ?? 4}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateConfig((prev) => ({
                      ...prev,
                      bottomNameBand: {
                        ...(prev.bottomNameBand || {
                          enabled: true,
                          height: 58,
                          backgroundColor: '#000000',
                          backgroundOpacity: 78,
                          textColor: '#FFFFFF',
                          fontSize: 26,
                          fontFamily: 'Montserrat',
                          fontWeight: '700',
                          letterSpacing: 4,
                          verticalAlign: 'middle',
                          offsetX: 0,
                          offsetY: 0,
                        }),
                        letterSpacing: val,
                      },
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 9. Alinhamento Vertical do Nome */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300">Alinhamento Vertical do Nome na Faixa</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Topo', value: 'top' as const, icon: AlignVerticalJustifyStart },
                  { label: 'Centro (Padrão)', value: 'middle' as const, icon: AlignVerticalJustifyCenter },
                  { label: 'Base', value: 'bottom' as const, icon: AlignVerticalJustifyEnd },
                ].map((align) => {
                  const Icon = align.icon;
                  const isSelected = (config.bottomNameBand?.verticalAlign || 'middle') === align.value;
                  return (
                    <button
                      key={align.value}
                      type="button"
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          bottomNameBand: {
                            ...(prev.bottomNameBand || {
                              enabled: true,
                              height: 58,
                              backgroundColor: '#000000',
                              backgroundOpacity: 78,
                              textColor: '#FFFFFF',
                              fontSize: 26,
                              fontFamily: 'Montserrat',
                              fontWeight: '700',
                              letterSpacing: 4,
                              verticalAlign: 'middle',
                              offsetX: 0,
                              offsetY: 0,
                            }),
                            verticalAlign: align.value,
                          },
                        }))
                      }
                      className={`py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                          : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{align.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 10. Deslocamento Horizontal & 11. Deslocamento Vertical */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-400">Deslocamento X</label>
                  <span className="text-[9px] text-amber-300 font-mono font-bold">
                    {config.bottomNameBand.offsetX ?? 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={config.bottomNameBand.offsetX ?? 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateConfig((prev) => ({
                      ...prev,
                      bottomNameBand: {
                        ...(prev.bottomNameBand || {
                          enabled: true,
                          height: 58,
                          backgroundColor: '#000000',
                          backgroundOpacity: 78,
                          textColor: '#FFFFFF',
                          fontSize: 26,
                          fontFamily: 'Montserrat',
                          fontWeight: '700',
                          letterSpacing: 4,
                          verticalAlign: 'middle',
                          offsetX: 0,
                          offsetY: 0,
                        }),
                        offsetX: val,
                      },
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-400">Deslocamento Y</label>
                  <span className="text-[9px] text-amber-300 font-mono font-bold">
                    {config.bottomNameBand.offsetY ?? 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={config.bottomNameBand.offsetY ?? 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateConfig((prev) => ({
                      ...prev,
                      bottomNameBand: {
                        ...(prev.bottomNameBand || {
                          enabled: true,
                          height: 58,
                          backgroundColor: '#000000',
                          backgroundOpacity: 78,
                          textColor: '#FFFFFF',
                          fontSize: 26,
                          fontFamily: 'Montserrat',
                          fontWeight: '700',
                          letterSpacing: 4,
                          verticalAlign: 'middle',
                          offsetX: 0,
                          offsetY: 0,
                        }),
                        offsetY: val,
                      },
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Botão Centralizar Nome na Faixa */}
            {((config.bottomNameBand.offsetX ?? 0) !== 0 || (config.bottomNameBand.offsetY ?? 0) !== 0) && (
              <button
                type="button"
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    bottomNameBand: {
                      ...(prev.bottomNameBand || {
                        enabled: true,
                        height: 58,
                        backgroundColor: '#000000',
                        backgroundOpacity: 78,
                        textColor: '#FFFFFF',
                        fontSize: 26,
                        fontFamily: 'Montserrat',
                        fontWeight: '700',
                        letterSpacing: 4,
                        verticalAlign: 'middle',
                        offsetX: 0,
                        offsetY: 0,
                      }),
                      offsetX: 0,
                      offsetY: 0,
                    },
                  }))
                }
                className="w-full py-1 text-[10px] text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-800 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Centralizar Nome na Faixa</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
