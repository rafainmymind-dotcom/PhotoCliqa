import React from 'react';
import { EditConfig, ImageItem, ModelData } from '../../types';
import { AVAILABLE_FONTS } from '../../utils/defaults';
import { formatProfileInfo } from '../../utils/formatters';

interface InformacoesSectionProps {
  currentImage: ImageItem;
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
  onUpdateImageModelData: (id: string, newModelData: ModelData) => void;
}

export const InformacoesSection: React.FC<InformacoesSectionProps> = ({
  currentImage,
  config,
  updateConfig,
  onUpdateImageModelData,
}) => {
  const isInfoActive = Boolean(config.infoOverlay?.active || config.profileCard?.active);

  const rawNome = currentImage.modelData.nome ?? config.nameOverlay.text ?? 'Valentina';
  const rawIdade = currentImage.modelData.idade ?? config.infoOverlay.idade ?? 29;
  const rawAltura = currentImage.modelData.altura ?? config.infoOverlay.altura ?? '1,69';
  const rawPeso = currentImage.modelData.peso ?? config.infoOverlay.peso ?? 66;

  const formatted = formatProfileInfo(rawNome, rawIdade, rawAltura, rawPeso);

  return (
    <div className="space-y-4">
      {/* Ativar/Desativar Informações */}
      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <span className="font-medium text-slate-200">Exibir Informações na Foto</span>
        <button
          onClick={() =>
            updateConfig((prev) => ({
              ...prev,
              infoOverlay: {
                ...prev.infoOverlay,
                active: !prev.infoOverlay.active,
              },
            }))
          }
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            isInfoActive
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isInfoActive ? 'Ativado' : 'Desativado'}
        </button>
      </div>

      {/* Prévia Formatada em Tempo Real */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Prévia da Linha Formatada:
          </span>
          <span className="text-[9px] text-amber-400 font-mono font-medium">
            {config.profileCard?.infoSeparadorSimbolo ? `${config.profileCard.infoSeparadorSimbolo} Separador Ativo` : 'Sem Separador (Padrão Limpo)'}
          </span>
        </div>
        <div className="text-xs font-mono bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 flex items-center justify-center gap-2 overflow-x-auto">
          {formatted.parts.length > 0 ? (
            formatted.parts.map((p, idx) => (
              <React.Fragment key={idx}>
                <span className="text-white font-bold tracking-wide">{p}</span>
                {idx < formatted.parts.length - 1 && config.profileCard?.infoSeparadorSimbolo && (
                  <span
                    style={{ color: config.profileCard?.infoCorSeparadores || '#d4af37' }}
                    className="font-bold text-sm leading-none drop-shadow-[0_0_6px_rgba(212,175,55,0.7)]"
                  >
                    {config.profileCard.infoSeparadorSimbolo}
                  </span>
                )}
              </React.Fragment>
            ))
          ) : (
            <span className="text-slate-500 italic">(Nenhuma informação preenchida)</span>
          )}
        </div>
      </div>

      {/* Ajuste e Estilização dos Pontos de Separação */}
      <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-amber-300">Separador (29anos 1,69m 66kg)</span>
            <span className="text-[9px] text-slate-400">Padrão sem separador ou escolha símbolos opcionais</span>
          </div>
          <span
            style={{ color: config.profileCard?.infoCorSeparadores || '#d4af37' }}
            className="text-xs font-black px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
          >
            {config.profileCard?.infoSeparadorSimbolo || 'Sem Ponto'}
          </span>
        </div>

        {/* 1. Escolha do Símbolo */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-300 font-semibold">Símbolo do Separador</label>
          <div className="grid grid-cols-8 gap-1">
            {[
              { id: '', label: '∅', desc: 'Nenhum' },
              { id: '-', label: '-', desc: 'Traço' },
              { id: '•', label: '•', desc: 'Ponto' },
              { id: '·', label: '·', desc: 'Suave' },
              { id: '|', label: '|', desc: 'Barra' },
              { id: '/', label: '/', desc: 'Diagonal' },
              { id: '★', label: '★', desc: 'Estrela' },
              { id: '♦', label: '♦', desc: 'Losango' },
            ].map((sym) => {
              const currentSym = config.profileCard?.infoSeparadorSimbolo !== undefined ? config.profileCard.infoSeparadorSimbolo : '';
              const isSel = currentSym === sym.id;
              return (
                <button
                  key={sym.id || 'none'}
                  onClick={() =>
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
                        infoSeparadorSimbolo: sym.id,
                      },
                    }))
                  }
                  className={`flex flex-col items-center justify-center py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSel
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-black shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title={sym.desc}
                >
                  <span className="text-sm font-bold">{sym.label}</span>
                  <span className="text-[8px] opacity-70">{sym.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Cor do Separador com Paleta Dourada Rápida */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-300 font-semibold">Cor dos Pontos Separadores</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={config.profileCard?.infoCorSeparadores || '#d4af37'}
                onChange={(e) => {
                  const val = e.target.value;
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard ? { ...prev.profileCard, infoCorSeparadores: val } : undefined,
                  }));
                }}
                className="w-5 h-5 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                {config.profileCard?.infoCorSeparadores || '#d4af37'}
              </span>
            </div>
          </div>

          {/* Atalhos de cores */}
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Dourado Clássico', color: '#d4af37' },
              { label: 'Ouro Vivo', color: '#FFD700' },
              { label: 'Champagne', color: '#E5C158' },
              { label: 'Âmbar', color: '#F59E0B' },
              { label: 'Branco Puro', color: '#FFFFFF' },
            ].map((c) => (
              <button
                key={c.color}
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard ? { ...prev.profileCard, infoCorSeparadores: c.color } : undefined,
                  }))
                }
                style={{ backgroundColor: c.color }}
                className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${
                  (config.profileCard?.infoCorSeparadores || '#d4af37').toLowerCase() === c.color.toLowerCase()
                    ? 'border-white scale-110 shadow-md shadow-amber-500/50'
                    : 'border-slate-800'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* 3. Espaçamento e Tamanho dos Separadores */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-slate-800">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] text-slate-400">Espaço Entre Itens</label>
              <span className="text-[10px] text-amber-300 font-mono font-bold">
                {config.profileCard?.infoEspacamento ?? 14}px
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="32"
              value={config.profileCard?.infoEspacamento ?? 14}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard ? { ...prev.profileCard, infoEspacamento: val } : undefined,
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] text-slate-400">Tamanho do Ponto</label>
              <span className="text-[10px] text-amber-300 font-mono font-bold">
                {config.profileCard?.infoSeparadorTamanho ?? 100}%
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="180"
              value={config.profileCard?.infoSeparadorTamanho ?? 100}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard ? { ...prev.profileCard, infoSeparadorTamanho: val } : undefined,
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Formato das Unidades (Idade / Altura / Peso) */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <label className="text-[10px] text-slate-300 font-semibold">Padrão de Exibição das Unidades</label>
          <div className="grid grid-cols-3 gap-1.5 text-[9px]">
            {/* Formato Idade */}
            <div className="space-y-1">
              <span className="text-slate-400">Idade</span>
              <select
                value={config.profileCard?.infoIdadeFormato || 'anos'}
                onChange={(e) => {
                  const val = e.target.value as any;
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard ? { ...prev.profileCard, infoIdadeFormato: val } : undefined,
                  }));
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="anos">29 anos</option>
                <option value="sem_espaco">29anos</option>
                <option value="apenas_numero">29</option>
              </select>
            </div>

            {/* Formato Altura */}
            <div className="space-y-1">
              <span className="text-slate-400">Altura</span>
              <select
                value={config.profileCard?.infoAlturaFormato || 'virgula'}
                onChange={(e) => {
                  const val = e.target.value as any;
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard ? { ...prev.profileCard, infoAlturaFormato: val } : undefined,
                  }));
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="virgula">1,69</option>
                <option value="virgula_m">1,69 m</option>
              </select>
            </div>

            {/* Formato Peso */}
            <div className="space-y-1">
              <span className="text-slate-400">Peso</span>
              <select
                value={config.profileCard?.infoPesoFormato || 'kg_espaco'}
                onChange={(e) => {
                  const val = e.target.value as any;
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard ? { ...prev.profileCard, infoPesoFormato: val } : undefined,
                  }));
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="kg_espaco">66 kg</option>
                <option value="kg_junto">66kg</option>
                <option value="apenas_numero">66</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Campos de Dados do Modelo */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-200">Dados Pessoais</span>

        <div className="grid grid-cols-3 gap-2">
          {/* Idade */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-medium">Idade</label>
            <input
              type="text"
              value={currentImage.modelData.idade !== undefined ? currentImage.modelData.idade : ''}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateImageModelData(currentImage.id, {
                  ...currentImage.modelData,
                  idade: val,
                });
                updateConfig((prev) => ({
                  ...prev,
                  infoOverlay: { ...prev.infoOverlay, idade: val },
                }));
              }}
              placeholder="29"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-medium focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Altura */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-medium">Altura</label>
            <input
              type="text"
              value={currentImage.modelData.altura !== undefined ? currentImage.modelData.altura : ''}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateImageModelData(currentImage.id, {
                  ...currentImage.modelData,
                  altura: val,
                });
                updateConfig((prev) => ({
                  ...prev,
                  infoOverlay: { ...prev.infoOverlay, altura: val },
                }));
              }}
              placeholder="1,69"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-medium focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Peso */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-medium">Peso</label>
            <input
              type="text"
              value={currentImage.modelData.peso !== undefined ? currentImage.modelData.peso : ''}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateImageModelData(currentImage.id, {
                  ...currentImage.modelData,
                  peso: val,
                });
                updateConfig((prev) => ({
                  ...prev,
                  infoOverlay: { ...prev.infoOverlay, peso: val },
                }));
              }}
              placeholder="66"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-medium focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tipografia & Estilo das Informações */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-200">Estilo das Informações</span>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[11px] text-slate-400">Tamanho da Fonte</label>
              <span className="text-[10px] text-amber-300 font-mono">
                {config.profileCard?.infoTamanho || config.infoOverlay.fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="36"
              value={config.profileCard?.infoTamanho || config.infoOverlay.fontSize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  infoOverlay: { ...prev.infoOverlay, fontSize: val },
                  profileCard: prev.profileCard ? { ...prev.profileCard, infoTamanho: val } : undefined,
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Tipografia</label>
            <select
              value={config.profileCard?.infoFonte || config.infoOverlay.fontFamily}
              onChange={(e) => {
                const val = e.target.value;
                updateConfig((prev) => ({
                  ...prev,
                  infoOverlay: { ...prev.infoOverlay, fontFamily: val },
                  profileCard: prev.profileCard ? { ...prev.profileCard, infoFonte: val } : undefined,
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

        {/* Cores das Informações e dos Pontos Separadores */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Cor do Texto</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={config.profileCard?.infoCorTexto || config.infoOverlay.textColor || '#FFFFFF'}
                onChange={(e) => {
                  const val = e.target.value;
                  updateConfig((prev) => ({
                    ...prev,
                    infoOverlay: { ...prev.infoOverlay, textColor: val },
                    profileCard: prev.profileCard ? { ...prev.profileCard, infoCorTexto: val } : undefined,
                  }));
                }}
                className="w-6 h-6 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-300">
                {config.profileCard?.infoCorTexto || '#FFFFFF'}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Pontos Separadores (•)</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={config.profileCard?.infoCorSeparadores || '#d4af37'}
                onChange={(e) => {
                  const val = e.target.value;
                  updateConfig((prev) => ({
                    ...prev,
                    profileCard: prev.profileCard ? { ...prev.profileCard, infoCorSeparadores: val } : undefined,
                  }));
                }}
                className="w-6 h-6 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                {config.profileCard?.infoCorSeparadores || '#d4af37'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sombra / Fundo de Destaque dos Dados (SEGUE OS DADOS PRA ONDE FOR E AJUSTA O TAMANHO - IGUAL AO LOGO) */}
      <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-200">Fundo / Sombra dos Dados</span>
            <span className="text-[9px] text-slate-400">
              Segue os dados para onde forem com ajuste de tamanho
            </span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(config.profileCard?.infoSombraAtiva ?? config.infoOverlay?.shadowActive ?? false)}
            onChange={(e) => {
              const isChecked = e.target.checked;
              updateConfig((prev) => ({
                ...prev,
                infoOverlay: {
                  ...prev.infoOverlay,
                  shadowActive: isChecked,
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
                  infoSombraAtiva: isChecked,
                },
              }));
            }}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {Boolean(config.profileCard?.infoSombraAtiva ?? config.infoOverlay?.shadowActive ?? false) && (
          <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
            {/* Estilo do Fundo dos Dados */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-300 font-semibold">Estilo da Sombra / Fundo</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'suave_radial', label: 'Degradê Oval Suave' },
                  { id: 'faixa_escura', label: 'Cápsula Translúcida' },
                ].map((st) => {
                  const currentStyle = config.profileCard?.infoSombraEstilo || 'suave_radial';
                  const isSel = currentStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() =>
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
                            infoSombraEstilo: st.id as any,
                          },
                        }))
                      }
                      className={`py-1 px-2 rounded text-[10px] font-medium border transition-all cursor-pointer ${
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

            {/* Intensidade */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-300">Intensidade / Densidade</label>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {config.profileCard?.infoSombraIntensidade ?? config.infoOverlay?.shadowIntensity ?? 65}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.profileCard?.infoSombraIntensidade ?? config.infoOverlay?.shadowIntensity ?? 65}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    infoOverlay: { ...prev.infoOverlay, shadowIntensity: val },
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
                      infoSombraIntensidade: val,
                    },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Tamanho / Extensão / Spread */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-300">Tamanho / Extensão do Degradê</label>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {config.profileCard?.infoSombraTamanho ?? config.infoOverlay?.shadowSpread ?? 120}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                value={config.profileCard?.infoSombraTamanho ?? config.infoOverlay?.shadowSpread ?? 120}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    infoOverlay: { ...prev.infoOverlay, shadowSpread: val },
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
                      infoSombraTamanho: val,
                    },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Desfoque / Blur */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-300">Desfoque / Difusão (Blur)</label>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {config.profileCard?.infoSombraBlur ?? config.infoOverlay?.shadowBlur ?? 16}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={config.profileCard?.infoSombraBlur ?? config.infoOverlay?.shadowBlur ?? 16}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateConfig((prev) => ({
                    ...prev,
                    infoOverlay: { ...prev.infoOverlay, shadowBlur: val },
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
                      infoSombraBlur: val,
                    },
                  }));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Posicionamento e Deslocamento Livre das Informações */}
      <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-300">Posicionamento Livre das Informações</span>
          <span className="text-[9px] text-slate-400">Arraste na tela ou ajuste fino</span>
        </div>

        {/* Dica de arraste com mouse */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-center gap-2 text-[10px] text-amber-300">
          <span className="text-base">🖱️</span>
          <span>Você pode clicar e arrastar a linha de Informações diretamente na foto com o mouse!</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] text-slate-400">Deslocamento X</label>
              <span className="text-[9px] text-amber-300 font-mono font-bold">
                {config.profileCard?.infoOffsetX ?? 0}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={config.profileCard?.infoOffsetX ?? 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? { ...prev.profileCard, infoOffsetX: val }
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
                {config.profileCard?.infoOffsetY ?? 0}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={config.profileCard?.infoOffsetY ?? 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig((prev) => ({
                  ...prev,
                  profileCard: prev.profileCard
                    ? { ...prev.profileCard, infoOffsetY: val }
                    : undefined,
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {(config.profileCard?.infoOffsetX !== 0 || config.profileCard?.infoOffsetY !== 0) && (
          <button
            onClick={() =>
              updateConfig((prev) => ({
                ...prev,
                profileCard: prev.profileCard
                  ? { ...prev.profileCard, infoOffsetX: 0, infoOffsetY: 0 }
                  : undefined,
              }))
            }
            className="w-full py-1 text-[10px] text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-800 rounded-md transition-all cursor-pointer"
          >
            Centralizar Posição das Informações
          </button>
        )}
      </div>
    </div>
  );
};
