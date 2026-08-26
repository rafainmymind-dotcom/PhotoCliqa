import React from 'react';
import { GoldBandTone } from '../../types';

interface GoldTonePickerProps {
  label?: string;
  selectedTone?: GoldBandTone | string;
  customColor?: string;
  onSelectTone: (tone: GoldBandTone) => void;
  onChangeCustomColor?: (color: string) => void;
}

export const GOLD_TONES: { id: GoldBandTone; name: string; desc: string; sampleHex: string; gradientClass: string }[] = [
  {
    id: 'classic_gold',
    name: 'Ouro Clássico',
    desc: 'Brilho nobre vibrante',
    sampleHex: '#D4AF37',
    gradientClass: 'from-[#D4AF37] via-[#FFF2B2] to-[#AA7C11]',
  },
  {
    id: 'dark_gold',
    name: 'Dourado Escuro',
    desc: 'Mais contraste em fotos claras',
    sampleHex: '#9A6B1F',
    gradientClass: 'from-[#785318] via-[#CA9134] to-[#4A3102]',
  },
  {
    id: 'dourado_queimado',
    name: 'Ouro Queimado',
    desc: 'Tom chocolate bronze quente',
    sampleHex: '#854D0E',
    gradientClass: 'from-[#58310E] via-[#B46E20] to-[#2B1506]',
  },
  {
    id: 'ouro_envelhecido',
    name: 'Ouro Envelhecido',
    desc: 'Tom deep gold sofisticado',
    sampleHex: '#A16207',
    gradientClass: 'from-[#5A4209] via-[#D99119] to-[#2F2203]',
  },
  {
    id: 'antique_bronze',
    name: 'Bronze Antigo',
    desc: 'Bronze escuro acetinado',
    sampleHex: '#92400E',
    gradientClass: 'from-[#451A03] via-[#C2621E] to-[#250E02]',
  },
  {
    id: 'champagne',
    name: 'Champagne',
    desc: 'Dourado suave e claro',
    sampleHex: '#D9C394',
    gradientClass: 'from-[#BCA166] via-[#FFF5DB] to-[#8C7748]',
  },
  {
    id: 'rose_gold',
    name: 'Rose Gold',
    desc: 'Ouro rosé delicado',
    sampleHex: '#C47D75',
    gradientClass: 'from-[#A85C55] via-[#FFD4C9] to-[#6F3E37]',
  },
  {
    id: 'custom',
    name: 'Personalizado',
    desc: 'Escolha qualquer cor',
    sampleHex: '#D4AF37',
    gradientClass: 'from-amber-600 to-amber-300',
  },
];

export const GoldTonePicker: React.FC<GoldTonePickerProps> = ({
  label = 'Tonalidade do Dourado',
  selectedTone = 'classic_gold',
  customColor = '#D4AF37',
  onSelectTone,
  onChangeCustomColor,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold text-slate-300">{label}</label>
        <span className="text-[9px] text-amber-400 font-medium">✨ Tons claros e escuros</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {GOLD_TONES.map((t) => {
          const isSelected = selectedTone === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTone(t.id)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full shrink-0 border border-black/40 shadow-inner bg-gradient-to-br ${t.gradientClass}`}
                style={t.id === 'custom' && customColor ? { backgroundColor: customColor, backgroundImage: 'none' } : undefined}
              />
              <div className="truncate">
                <div className="text-[10px] font-semibold leading-tight truncate">{t.name}</div>
                <div className="text-[8px] text-slate-400 leading-tight truncate">{t.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedTone === 'custom' && onChangeCustomColor && (
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 mt-1">
          <input
            type="color"
            value={customColor || '#D4AF37'}
            onChange={(e) => onChangeCustomColor(e.target.value)}
            className="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={customColor || '#D4AF37'}
            onChange={(e) => onChangeCustomColor(e.target.value)}
            placeholder="#D4AF37"
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
