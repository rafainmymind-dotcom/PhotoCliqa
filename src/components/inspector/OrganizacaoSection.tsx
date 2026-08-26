import React from 'react';
import { EditConfig, ImageItem } from '../../types';
import { Layers, Move } from 'lucide-react';
import { DEFAULT_EDIT_CONFIG } from '../../utils/defaults';
import { ElementAlignmentControl } from './ElementAlignmentControl';

interface OrganizacaoSectionProps {
  currentImage: ImageItem;
  config: EditConfig;
  updateConfig: (updater: (prev: EditConfig) => EditConfig) => void;
}

export const OrganizacaoSection: React.FC<OrganizacaoSectionProps> = ({
  config,
  updateConfig,
}) => {
  const org = config.organization || DEFAULT_EDIT_CONFIG.organization!;
  const profile = config.profileCard || DEFAULT_EDIT_CONFIG.profileCard!;

  return (
    <div className="space-y-4">
      {/* Cabeçalho da Seção de Organização */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-100 text-xs">Organização & Alinhamento de Elementos</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Selecione Nome, Informações e/ou Faixa Novidade e alinhe no centro/meio, à esquerda ou à direita com precisão cirúrgica.
        </p>
      </div>

      {/* Controle Avançado de Seleção e Alinhamento Dedicado */}
      <ElementAlignmentControl config={config} updateConfig={updateConfig} />

      {/* Posição do Bloco (Eixo Y) */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Move className="w-3.5 h-3.5 text-amber-400" />
          <span>Posição Vertical do Conjunto (Eixo Y)</span>
        </div>

        {/* Posição Vertical Y */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-[10px] text-slate-400">Altura no Card</label>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              {profile.customY || org.groupY || 80}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            value={profile.customY || org.groupY || 80}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              updateConfig((prev) => ({
                ...prev,
                profileCard: {
                  ...(prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!),
                  customY: val,
                },
                organization: {
                  ...(prev.organization || DEFAULT_EDIT_CONFIG.organization!),
                  groupY: val,
                },
              }));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
