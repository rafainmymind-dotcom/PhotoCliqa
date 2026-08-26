import React from 'react';
import { InteractiveElement, SnapGuide } from '../utils/interactiveElements';
import { AlignCenter, Move, X, Check } from 'lucide-react';

interface InteractiveCanvasOverlayProps {
  elements: InteractiveElement[];
  selectedElementId: string | null;
  hoveredElementId: string | null;
  isDragging: boolean;
  activeSnapGuides: SnapGuide[];
  onSelectElement: (id: string | null) => void;
  onCenterElementHorizontal: (id: string) => void;
  onCenterElementVertical: (id: string) => void;
  onResetElementOffset: (id: string) => void;
}

export const InteractiveCanvasOverlay: React.FC<InteractiveCanvasOverlayProps> = ({
  elements,
  selectedElementId,
  hoveredElementId,
  isDragging,
  activeSnapGuides,
  onSelectElement,
  onCenterElementHorizontal,
  onCenterElementVertical,
  onResetElementOffset,
}) => {
  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const hoveredElement = elements.find((el) => el.id === hoveredElementId);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* 1. Snap Alignment Magnetic Guidelines (Linhas Guias de Centralização Magnética) */}
      {activeSnapGuides.map((guide, idx) => {
        if (guide.type === 'vertical') {
          return (
            <div
              key={`guide-v-${idx}`}
              style={{ left: `${guide.posPercent}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] z-30 pointer-events-none flex flex-col items-center justify-start pt-3"
            >
              <div className="bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md font-mono whitespace-nowrap">
                {guide.label}
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={`guide-h-${idx}`}
              style={{ top: `${guide.posPercent}%` }}
              className="absolute left-0 right-0 h-0.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] z-30 pointer-events-none flex items-center justify-start pl-3"
            >
              <div className="bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md font-mono whitespace-nowrap">
                {guide.label}
              </div>
            </div>
          );
        }
      })}

      {/* 2. Hover Outline (Feedback visual antes de clicar) */}
      {hoveredElement && hoveredElement.id !== selectedElementId && !isDragging && (
        <div
          style={{
            left: `${hoveredElement.rect.x}%`,
            top: `${hoveredElement.rect.y}%`,
            width: `${hoveredElement.rect.width}%`,
            height: `${hoveredElement.rect.height}%`,
          }}
          className="absolute border border-amber-400/60 border-dashed rounded bg-amber-500/5 transition-all duration-75 pointer-events-none"
        >
          <span className="absolute -top-4 left-0 text-[8px] bg-slate-950/90 text-amber-300 px-1 py-0.2 rounded border border-amber-500/40 font-semibold shadow-sm whitespace-nowrap">
            {hoveredElement.label} (Clique p/ arrastar)
          </span>
        </div>
      )}

      {/* 3. Selected Element Bounding Box & Quick Alignment Toolbar */}
      {selectedElement && (
        <div
          style={{
            left: `${selectedElement.rect.x}%`,
            top: `${selectedElement.rect.y}%`,
            width: `${selectedElement.rect.width}%`,
            height: `${selectedElement.rect.height}%`,
          }}
          className={`absolute border-2 ${
            isDragging
              ? 'border-amber-400 shadow-lg shadow-amber-500/30'
              : 'border-amber-400 border-dashed'
          } rounded-lg bg-amber-500/10 pointer-events-none transition-all duration-75`}
        >
          {/* Corner Handles */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950 shadow-sm" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950 shadow-sm" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950 shadow-sm" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950 shadow-sm" />

          {/* Quick Floating Toolbar above selected element */}
          {!isDragging && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-950/95 border border-amber-500/50 rounded-lg px-2 py-1 shadow-2xl pointer-events-auto z-40 whitespace-nowrap">
              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1 pr-1 border-r border-slate-800">
                <Move className="w-3 h-3 text-amber-400" />
                {selectedElement.label}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCenterElementHorizontal(selectedElement.id);
                }}
                title="Centralizar Horizontalmente (Centro X)"
                className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <AlignCenter className="w-2.5 h-2.5" />
                <span>Centro</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetElementOffset(selectedElement.id);
                }}
                title="Restaurar Posição Padrão"
                className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
              >
                Reset
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(null);
                }}
                title="Concluir Seleção"
                className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Check className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
