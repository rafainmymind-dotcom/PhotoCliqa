import React, { useState } from 'react';
import { EditConfig } from '../../types';
import { AlignLeft, AlignCenter, AlignRight, CheckSquare, Square, RotateCcw } from 'lucide-react';
import { DEFAULT_EDIT_CONFIG } from '../../utils/defaults';

interface ElementAlignmentControlProps {
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
  compact?: boolean;
}

export const ElementAlignmentControl: React.FC<ElementAlignmentControlProps> = ({
  config,
  updateConfig,
  compact = false,
}) => {
  const profile = config.profileCard || DEFAULT_EDIT_CONFIG.profileCard!;

  // Seleção local de quais elementos o usuário quer manipular/alinhar
  const [selectedElements, setSelectedElements] = useState<{
    nome: boolean;
    informacoes: boolean;
    faixa: boolean;
  }>({
    nome: true,
    informacoes: true,
    faixa: true,
  });

  const toggleElement = (key: 'nome' | 'informacoes' | 'faixa') => {
    setSelectedElements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const selectAll = () => {
    setSelectedElements({ nome: true, informacoes: true, faixa: true });
  };

  const selectOnly = (key: 'nome' | 'informacoes' | 'faixa') => {
    setSelectedElements({
      nome: key === 'nome',
      informacoes: key === 'informacoes',
      faixa: key === 'faixa',
    });
  };

  const hasAnySelected = selectedElements.nome || selectedElements.informacoes || selectedElements.faixa;

  // Função para aplicar alinhamento (Esquerda, Centro, Direita) SOMENTE nos elementos selecionados!
  const handleAlignSelected = (alignment: 'left' | 'center' | 'right') => {
    updateConfig((prev) => {
      const currentProfile = prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!;
      const currentOrg = prev.organization || DEFAULT_EDIT_CONFIG.organization!;

      let newCustomX = currentProfile.customX;
      if (alignment === 'center') newCustomX = 50;
      else if (alignment === 'left') newCustomX = 8;
      else if (alignment === 'right') newCustomX = 92;

      const isAllSelected = selectedElements.nome && selectedElements.informacoes && selectedElements.faixa;

      return {
        ...prev,
        profileCard: {
          ...currentProfile,
          // Se todos selecionados, atualiza o alinhamento geral do card também
          ...(isAllSelected
            ? {
                align: alignment,
                position: alignment === 'center' ? 'bottom_center' : alignment === 'left' ? 'bottom_left' : 'bottom_right',
                customX: newCustomX,
              }
            : {}),
          // Alinhamento e offset específicos do NOME se selecionado
          ...(selectedElements.nome
            ? {
                nomeAlign: alignment,
                nomeOffsetX: 0,
                nomeBandagemDourada: currentProfile.nomeBandagemDourada
                  ? { ...currentProfile.nomeBandagemDourada, offsetX: 0 }
                  : undefined,
              }
            : {}),
          // Alinhamento e offset específicos das INFORMAÇÕES se selecionado
          ...(selectedElements.informacoes
            ? {
                infoAlign: alignment,
                infoOffsetX: 0,
              }
            : {}),
          // Alinhamento e offset específicos da FAIXA NOVIDADE se selecionado
          ...(selectedElements.faixa
            ? {
                faixaAlign: alignment,
                faixaOffsetX: 0,
                faixaBandagemDourada: currentProfile.faixaBandagemDourada
                  ? { ...currentProfile.faixaBandagemDourada, offsetX: 0 }
                  : undefined,
              }
            : {}),
        },
        organization: {
          ...currentOrg,
          selectedElements: {
            ...currentOrg.selectedElements,
            nome: selectedElements.nome,
            informacoes: selectedElements.informacoes,
            faixa: selectedElements.faixa,
          },
          ...(isAllSelected ? { groupX: newCustomX } : {}),
        },
      };
    });
  };

  // Resetar offsets apenas dos elementos selecionados
  const handleResetSelectedOffsets = () => {
    updateConfig((prev) => {
      const currentProfile = prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!;
      return {
        ...prev,
        profileCard: {
          ...currentProfile,
          ...(selectedElements.nome ? { nomeOffsetX: 0, nomeOffsetY: 0 } : {}),
          ...(selectedElements.informacoes ? { infoOffsetX: 0, infoOffsetY: 0 } : {}),
          ...(selectedElements.faixa ? { faixaOffsetX: 0, faixaOffsetY: 0 } : {}),
        },
      };
    });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
        {/* Toggle Elements Checkboxes */}
        <div className="flex items-center gap-1 pr-1 border-r border-slate-800">
          <button
            type="button"
            onClick={() => toggleElement('nome')}
            title="Selecionar Nome para alinhar"
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              selectedElements.nome ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nome
          </button>
          <button
            type="button"
            onClick={() => toggleElement('informacoes')}
            title="Selecionar Informações para alinhar"
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              selectedElements.informacoes ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Info
          </button>
          <button
            type="button"
            onClick={() => toggleElement('faixa')}
            title="Selecionar Faixa Novidade para alinhar"
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              selectedElements.faixa ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Faixa
          </button>
        </div>

        {/* Alignment Buttons */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => handleAlignSelected('left')}
            disabled={!hasAnySelected}
            title="Alinhar à Esquerda os elementos selecionados"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAlignSelected('center')}
            disabled={!hasAnySelected}
            title="Centralizar no Meio os elementos selecionados"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAlignSelected('right')}
            disabled={!hasAnySelected}
            title="Alinhar à Direita os elementos selecionados"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-200">Seleção & Alinhamento de Elementos</span>
          <span className="text-[9px] text-slate-400">Escolha os elementos e alinhe apenas o que selecionar</span>
        </div>
        <button
          type="button"
          onClick={selectAll}
          title="Selecionar todos os 3 elementos"
          className="text-[9px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
        >
          Marcar os 3
        </button>
      </div>

      {/* Seleção dos 3 elementos com Checkboxes */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { key: 'nome' as const, label: 'Nome', desc: 'Perfil do Modelo' },
          { key: 'informacoes' as const, label: 'Informações', desc: 'Idade/Altura/Peso' },
          { key: 'faixa' as const, label: 'Faixa', desc: 'Tag Novidade' },
        ].map((item) => {
          const isChecked = selectedElements[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleElement(item.key)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isChecked
                  ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[11px] font-bold">{item.label}</span>
                {isChecked ? (
                  <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
              <span className="text-[8px] text-slate-400 leading-tight">{item.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Botões de Alinhamento Dedicados */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[10px] font-semibold text-slate-300">
          Alinhar Elementos Selecionados:
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleAlignSelected('left')}
            disabled={!hasAnySelected}
            className="py-2 px-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
            title="Alinhar à esquerda apenas os itens marcados"
          >
            <AlignLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>À Esquerda</span>
          </button>

          <button
            type="button"
            onClick={() => handleAlignSelected('center')}
            disabled={!hasAnySelected}
            className="py-2 px-2.5 rounded-lg border border-amber-500/60 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-md"
            title="Centralizar no meio perfeitamente apenas os itens marcados"
          >
            <AlignCenter className="w-3.5 h-3.5 text-amber-400" />
            <span>No Meio</span>
          </button>

          <button
            type="button"
            onClick={() => handleAlignSelected('right')}
            disabled={!hasAnySelected}
            className="py-2 px-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
            title="Alinhar à direita apenas os itens marcados"
          >
            <AlignRight className="w-3.5 h-3.5 text-amber-400" />
            <span>À Direita</span>
          </button>
        </div>
      </div>

      {/* Botões de atalhos rápidos */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Atalhos:</span>
          <button
            type="button"
            onClick={() => selectOnly('nome')}
            className="text-slate-300 hover:text-amber-400 underline cursor-pointer"
          >
            Só Nome
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => selectOnly('informacoes')}
            className="text-slate-300 hover:text-amber-400 underline cursor-pointer"
          >
            Só Info
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => selectOnly('faixa')}
            className="text-slate-300 hover:text-amber-400 underline cursor-pointer"
          >
            Só Faixa
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetSelectedOffsets}
          disabled={!hasAnySelected}
          title="Zerar deslocamentos manuais dos itens marcados"
          className="flex items-center gap-1 text-slate-400 hover:text-amber-300 disabled:opacity-30 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Zerar Deslocamentos</span>
        </button>
      </div>
    </div>
  );
};
