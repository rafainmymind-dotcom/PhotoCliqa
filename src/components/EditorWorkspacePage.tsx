import React, { useState, useEffect, useRef } from 'react';
import {
  AspectDimension,
  BlurRegion,
  BlurShape,
  EditConfig,
  ExportFormat,
  ImageItem,
  LogoPosition,
  ModelData,
  Preset,
} from '../types';
import { renderImageToCanvas } from '../utils/canvasRenderer';
import { detectFacesInImage } from '../utils/faceDetector';
import {
  AVAILABLE_FONTS,
  DEFAULT_EDIT_CONFIG,
  OFFICIAL_MIMUUS_LOGO,
  DEFAULT_MIMUUS_LOGO_SVG,
  DEFAULT_SAMPLE_PORTRAIT,
} from '../utils/defaults';
import {
  getCanvasInteractiveElements,
  hitTestElements,
  calculateSnapping,
  InteractiveElement,
  SnapGuide,
} from '../utils/interactiveElements';
import { InteractiveCanvasOverlay } from './InteractiveCanvasOverlay';
import { NomeSection } from './inspector/NomeSection';
import { InformacoesSection } from './inspector/InformacoesSection';
import { FaixaSection } from './inspector/FaixaSection';
import { OrganizacaoSection } from './inspector/OrganizacaoSection';
import { ElementAlignmentControl } from './inspector/ElementAlignmentControl';
import { ProporcaoSection } from './inspector/ProporcaoSection';
import { DesfoqueSection } from './inspector/DesfoqueSection';
import { LogoSection } from './inspector/LogoSection';
import { FiltrosSection } from './inspector/FiltrosSection';
import { FundoPretoSection } from './inspector/FundoPretoSection';
import { PresetsSection } from './inspector/PresetsSection';
import { SavePresetModal } from './SavePresetModal';
import {
  Upload,
  Download,
  X,
  Image as ImageIcon,
  Grid,
  Sparkles,
  Bookmark,
  Type,
  Info,
  Award,
  CircleDot,
  Eye,
  EyeOff,
  Sliders,
  Moon,
  Eraser,
  Maximize2,
  Minimize2,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Move,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Circle,
  Square,
  Pencil,
  Compass,
  Hand,
  PanelLeftClose,
  PanelLeftOpen,
  Copy,
  Layers,
  Palette,
  Sparkle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  ChevronLeft,
  Images,
  Trash2,
} from 'lucide-react';

interface EditorWorkspacePageProps {
  images: ImageItem[];
  selectedImageId: string;
  onSelectImage: (id: string) => void;
  onRemoveImage: (id: string) => void;
  onDuplicateImage?: (id?: string) => void;
  onReplaceImage?: (id: string, file: File) => void;
  onUploadMoreImages: (files: FileList | File[]) => void;
  onUpdateImageConfig: (id: string, newConfig: EditConfig) => void;
  onUpdateImageModelData: (id: string, newModelData: ModelData) => void;
  presets: Preset[];
  onSelectPreset?: (preset: Preset) => void;
  onCreatePreset?: (presetData: {
    name: string;
    description: string;
    category: string;
    customConfig: EditConfig;
    customModelData: ModelData;
  }) => void;
  onRemovePreset?: (presetId: string) => void;
  onApplyPresetToImage: (imageId: string, preset: Preset) => void;
  onDuplicateToAll: () => void;
  exportFormat?: ExportFormat;
  setExportFormat?: (fmt: ExportFormat) => void;
  onDownloadCurrent?: (imageId?: string) => void;
  onDownloadZipAll?: () => void;
  isProcessingZip?: boolean;
}

export const EditorWorkspacePage: React.FC<EditorWorkspacePageProps> = ({
  images,
  selectedImageId,
  onSelectImage,
  onRemoveImage,
  onDuplicateImage,
  onReplaceImage,
  onUploadMoreImages,
  onUpdateImageConfig,
  onUpdateImageModelData,
  presets,
  onSelectPreset,
  onCreatePreset,
  onRemovePreset,
  onApplyPresetToImage,
  onDuplicateToAll,
  exportFormat = 'webp',
  setExportFormat,
  onDownloadCurrent,
  onDownloadZipAll,
  isProcessingZip,
}) => {
  const currentImage = images.find((img) => img.id === selectedImageId) || images[0];
  const currentImageIndex = images.findIndex((img) => img.id === currentImage?.id);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active Tool in Left Toolbar (Photoshop/Photopea style)
  const [activeMenu, setActiveMenu] = useState<string>('nome');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isPhotoDropdownOpen, setIsPhotoDropdownOpen] = useState<boolean>(false);
  const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const [logoImgElement, setLogoImgElement] = useState<HTMLImageElement | null>(null);
  const [baseImgElement, setBaseImgElement] = useState<HTMLImageElement | null>(null);

  // Viewport Preview Zoom & Pan (apenas visualização sem afetar dimensões de exportação/edição)
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [viewportPan, setViewportPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isViewportPanMode, setIsViewportPanMode] = useState<boolean>(false);
  const [isDraggingViewport, setIsDraggingViewport] = useState<boolean>(false);
  const [viewportDragStart, setViewportDragStart] = useState<{ x: number; y: number } | null>(null);

  // Drawing & Panning States
  const [isDrawingEraser, setIsDrawingEraser] = useState(false);
  const [eraserPath, setEraserPath] = useState<{ x: number; y: number }[]>([]);

  const [isDrawingBlur, setIsDrawingBlur] = useState(false);
  const [blurPath, setBlurPath] = useState<{ x: number; y: number }[]>([]);

  const [isDetectingFaces, setIsDetectingFaces] = useState(false);
  const [faceDetectStatus, setFaceDetectStatus] = useState<string | null>(null);

  const handleAutoDetectFace = async () => {
    if (!baseImgElement) return;
    setIsDetectingFaces(true);
    setFaceDetectStatus('Analisando traços e rostos na foto...');

    try {
      const detectedRegions = await detectFacesInImage(baseImgElement);
      if (detectedRegions.length > 0) {
        updateConfig((prev) => ({
          ...prev,
          pixelateBlur: {
            ...prev.pixelateBlur,
            active: true,
            mode: 'auto_face',
            regions: [...prev.pixelateBlur.regions, ...detectedRegions],
          },
        }));
        setFaceDetectStatus(`${detectedRegions.length} rosto(s) detectado(s) com sucesso!`);
      } else {
        setFaceDetectStatus('Região de rosto posicionada com sucesso.');
      }
    } catch (err) {
      console.error('Erro na detecção de rostos:', err);
      setFaceDetectStatus('Ajuste de rosto aplicado.');
    } finally {
      setIsDetectingFaces(false);
      setTimeout(() => setFaceDetectStatus(null), 4000);
    }
  };

  const [isPanningImage, setIsPanningImage] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);

  // Live Interactive Canvas Dragging & Selection State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [activeSnapGuides, setActiveSnapGuides] = useState<SnapGuide[]>([]);
  const [dragStartData, setDragStartData] = useState<{
    elementId: string;
    startMouseXPercent: number;
    startMouseYPercent: number;
    initialNomeOffsetX: number;
    initialNomeOffsetY: number;
    initialInfoOffsetX: number;
    initialInfoOffsetY: number;
    initialFaixaOffsetX: number;
    initialFaixaOffsetY: number;
    initialCustomX: number;
    initialCustomY: number;
    initialLogoX: number;
    initialLogoY: number;
    initialRegionX?: number;
    initialRegionY?: number;
  } | null>(null);

  const [isDraggingProfileCard, setIsDraggingProfileCard] = useState(false);

  // Drag Profile Card (Nome, Informações e Etiqueta Novidade) em forma livre (apenas quando em modo custom/livre)
  const handleDragProfileCard = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.max(4, Math.min(96, ((clientY - rect.top) / rect.height) * 100)));

    updateConfig((prev) => {
      const currentCard = prev.profileCard || DEFAULT_EDIT_CONFIG.profileCard!;
      return {
        ...prev,
        profileCard: {
          ...currentCard,
          position: 'custom',
          customX: x,
          customY: y,
        },
      };
    });
  };

  const config = currentImage?.editConfig;

  // Helper to update specific sub-config
  const updateConfig = (updater: (prev: EditConfig) => EditConfig) => {
    if (!currentImage || !config) return;
    const newConfig = updater(config);
    onUpdateImageConfig(currentImage.id, newConfig);
  };

  const isAnyOverlayActive = Boolean(
    config?.profileCard?.active ||
    config?.blackStrip?.active ||
    config?.nameOverlay?.active ||
    config?.infoOverlay?.active ||
    config?.highlightOverlay?.active ||
    config?.logoOverlay?.active
  );

  const handleToggleAllOverlays = (active: boolean) => {
    updateConfig((prev) => ({
      ...prev,
      profileCard: prev.profileCard
        ? { ...prev.profileCard, active }
        : {
            active,
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
          },
      blackStrip: { ...prev.blackStrip, active },
      nameOverlay: { ...prev.nameOverlay, active },
      infoOverlay: { ...prev.infoOverlay, active },
      highlightOverlay: { ...prev.highlightOverlay, active },
      logoOverlay: { ...prev.logoOverlay, active },
    }));
  };

  // Load logo image object with graceful CORS and SVG fallbacks
  useEffect(() => {
    if (!currentImage?.editConfig) return;
    const logoUrl = currentImage.editConfig.logoOverlay?.imageUrl || OFFICIAL_MIMUUS_LOGO;
    let isCancelled = false;

    const img = new Image();
    if (!logoUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      if (!isCancelled) setLogoImgElement(img);
    };

    img.onerror = () => {
      if (isCancelled) return;
      // Fallback 1: Try without crossOrigin
      const retryImg = new Image();
      retryImg.onload = () => {
        if (!isCancelled) setLogoImgElement(retryImg);
      };
      retryImg.onerror = () => {
        if (isCancelled) return;
        // Fallback 2: Use built-in SVG logo
        const svgFallback = new Image();
        svgFallback.onload = () => {
          if (!isCancelled) setLogoImgElement(svgFallback);
        };
        svgFallback.src = DEFAULT_MIMUUS_LOGO_SVG;
      };
      retryImg.src = logoUrl;
    };

    img.src = logoUrl;

    if (img.complete && img.naturalWidth > 0) {
      setLogoImgElement(img);
    }

    return () => {
      isCancelled = true;
    };
  }, [currentImage?.editConfig?.logoOverlay?.imageUrl]);

  // Load base image object with graceful CORS and Studio Portrait fallbacks
  useEffect(() => {
    if (!currentImage) return;
    let isCancelled = false;

    const img = new Image();
    const dataUrl = currentImage.dataUrl;

    if (!dataUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      if (!isCancelled) setBaseImgElement(img);
    };

    img.onerror = () => {
      if (isCancelled) return;
      // Fallback 1: Try without crossOrigin
      const retryImg = new Image();
      retryImg.onload = () => {
        if (!isCancelled) setBaseImgElement(retryImg);
      };
      retryImg.onerror = () => {
        if (isCancelled) return;
        // Fallback 2: Use built-in Studio Portrait SVG
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          if (!isCancelled) setBaseImgElement(fallbackImg);
        };
        fallbackImg.src = DEFAULT_SAMPLE_PORTRAIT;
      };
      retryImg.src = dataUrl;
    };

    img.src = dataUrl;

    if (img.complete && img.naturalWidth > 0) {
      setBaseImgElement(img);
    }

    return () => {
      isCancelled = true;
    };
  }, [currentImage?.dataUrl]);

  // Re-render canvas whenever image or config or modelData changes
  useEffect(() => {
    if (!canvasRef.current || !currentImage) return;

    let isMounted = true;

    // Use current base image element or create an immediate fallback image
    const sourceImg =
      baseImgElement ||
      (() => {
        const fallback = new Image();
        fallback.src = DEFAULT_SAMPLE_PORTRAIT;
        return fallback;
      })();

    renderImageToCanvas(
      sourceImg,
      currentImage.editConfig,
      logoImgElement,
      currentImage.modelData
    )
      .then((renderedCanvas) => {
        if (!isMounted || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        canvasRef.current.width = renderedCanvas.width;
        canvasRef.current.height = renderedCanvas.height;
        ctx.clearRect(0, 0, renderedCanvas.width, renderedCanvas.height);
        ctx.drawImage(renderedCanvas, 0, 0);

        // Draw active lasso drawing stroke
        if (blurPath.length > 0) {
          ctx.save();
          ctx.strokeStyle = '#F59E0B';
          ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
          ctx.lineWidth = Math.max(3, Math.round(renderedCanvas.width * 0.005));
          ctx.setLineDash([8, 5]);
          ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          blurPath.forEach((pt, idx) => {
            const px = (pt.x / 100) * renderedCanvas.width;
            const py = (pt.y / 100) * renderedCanvas.height;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        }

        // Draw active magic eraser stroke
        if (eraserPath.length > 0) {
          ctx.save();
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
          ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
          ctx.lineWidth = ((config?.magicEraser?.brushSize || 30) / 1080) * renderedCanvas.width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          eraserPath.forEach((pt, idx) => {
            const px = (pt.x / 100) * renderedCanvas.width;
            const py = (pt.y / 100) * renderedCanvas.height;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
          ctx.restore();
        }
      })
      .catch((err) => {
        console.error('Error rendering image to canvas:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [baseImgElement, currentImage?.editConfig, currentImage?.modelData, logoImgElement, blurPath, eraserPath]);

  // Calculate All Interactive Elements in Scene
  const interactiveElements = React.useMemo(() => {
    if (!config) return [];
    return getCanvasInteractiveElements(
      config,
      currentImage?.modelData,
      canvasRef.current?.width || 1080,
      canvasRef.current?.height || 1080,
      logoImgElement
    );
  }, [config, currentImage?.modelData, logoImgElement]);

  // Quick Alignment & Centering Helpers for Dragged Elements
  const handleCenterElementHorizontal = (id: string) => {
    if (id === 'faixa') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard ? { ...prev.profileCard, faixaOffsetX: 0 } : undefined,
      }));
    } else if (id === 'nome') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard ? { ...prev.profileCard, nomeOffsetX: 0 } : undefined,
      }));
    } else if (id === 'informacoes') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard ? { ...prev.profileCard, infoOffsetX: 0 } : undefined,
      }));
    } else if (id === 'logo') {
      updateConfig((prev) => ({
        ...prev,
        logoOverlay: { ...prev.logoOverlay, position: 'free', freeX: 50 },
      }));
    } else if (id === 'card_perfil') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard
          ? { ...prev.profileCard, position: 'bottom_center', customX: 50, align: 'center' }
          : undefined,
      }));
    }
  };

  const handleCenterElementVertical = (id: string) => {
    if (id === 'faixa') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard ? { ...prev.profileCard, faixaOffsetY: 0 } : undefined,
      }));
    } else if (id === 'nome') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard ? { ...prev.profileCard, nomeOffsetY: 0 } : undefined,
      }));
    } else if (id === 'informacoes') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard ? { ...prev.profileCard, infoOffsetY: 0 } : undefined,
      }));
    } else if (id === 'logo') {
      updateConfig((prev) => ({
        ...prev,
        logoOverlay: { ...prev.logoOverlay, position: 'free', freeY: 50 },
      }));
    }
  };

  const handleResetElementOffset = (id: string) => {
    if (id === 'faixa') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard ? { ...prev.profileCard, faixaOffsetX: 0, faixaOffsetY: 0 } : undefined,
      }));
    } else if (id === 'nome') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard ? { ...prev.profileCard, nomeOffsetX: 0, nomeOffsetY: 0 } : undefined,
      }));
    } else if (id === 'informacoes') {
      updateConfig((prev) => ({
        ...prev,
        profileCard: prev.profileCard ? { ...prev.profileCard, infoOffsetX: 0, infoOffsetY: 0 } : undefined,
      }));
    } else if (id === 'logo') {
      updateConfig((prev) => ({
        ...prev,
        logoOverlay: { ...prev.logoOverlay, position: 'top_left', freeX: 10, freeY: 10 },
      }));
    }
  };

  // Canvas Mouse & Touch Interactions
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    // 0. Viewport Pan Mode (navegar livremente pela imagem com zoom em todos os sentidos)
    if (isViewportPanMode || e.button === 1 || e.altKey) {
      setIsDraggingViewport(true);
      setViewportDragStart({ x: e.clientX - viewportPan.x, y: e.clientY - viewportPan.y });
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (config.magicEraser.active) {
      setIsDrawingEraser(true);
      setEraserPath([{ x, y }]);
      return;
    }

    if (config.pixelateBlur.active) {
      const isLassoOrFree =
        config.pixelateBlur.mode === 'lasso' || config.pixelateBlur.mode === 'free_draw';
      if (isLassoOrFree) {
        setIsDrawingBlur(true);
        setBlurPath([{ x, y }]);
      } else {
        // Place shape at clicked location
        const isRect = config.pixelateBlur.mode === 'rectangle';
        updateConfig((prev) => {
          const newRegion: BlurRegion = {
            id: `region_${Date.now()}`,
            shape: isRect ? 'rectangle' : 'circle',
            x: Math.max(0, Math.round(x - 15)),
            y: Math.max(0, Math.round(y - 15)),
            width: 30,
            height: isRect ? 22 : 30,
          };
          return {
            ...prev,
            pixelateBlur: {
              ...prev.pixelateBlur,
              regions: [...prev.pixelateBlur.regions, newRegion],
            },
          };
        });
      }
      return;
    }

    if (activeMenu === 'ajuste_imagem') {
      setIsPanningImage(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    // Direct Element Hit-Testing: Check if user clicked on Name, Info, Faixa, Logo, etc.
    const hit = hitTestElements(interactiveElements, x, y, 3.5);
    if (hit) {
      setSelectedElementId(hit.id);
      setIsDraggingElement(true);

      // Auto-open corresponding inspector panel
      if (hit.id === 'nome') {
        setActiveMenu('nome');
        setIsInspectorOpen(true);
      } else if (hit.id === 'faixa') {
        setActiveMenu('faixa');
        setIsInspectorOpen(true);
      } else if (hit.id === 'informacoes') {
        setActiveMenu('informacoes');
        setIsInspectorOpen(true);
      } else if (hit.id === 'logo') {
        setActiveMenu('logo');
        setIsInspectorOpen(true);
      } else if (hit.id.startsWith('blur_')) {
        setActiveMenu('desfoque');
        setIsInspectorOpen(true);
      }

      setDragStartData({
        elementId: hit.id,
        startMouseXPercent: x,
        startMouseYPercent: y,
        initialNomeOffsetX: config.profileCard?.nomeOffsetX ?? 0,
        initialNomeOffsetY: config.profileCard?.nomeOffsetY ?? 0,
        initialInfoOffsetX: config.profileCard?.infoOffsetX ?? 0,
        initialInfoOffsetY: config.profileCard?.infoOffsetY ?? 0,
        initialFaixaOffsetX: config.profileCard?.faixaOffsetX ?? 0,
        initialFaixaOffsetY: config.profileCard?.faixaOffsetY ?? 0,
        initialCustomX: config.profileCard?.customX ?? 85,
        initialCustomY: config.profileCard?.customY ?? 85,
        initialLogoX: config.logoOverlay?.freeX ?? 10,
        initialLogoY: config.logoOverlay?.freeY ?? 10,
      });
      return;
    }

    // Only drag profile card if user explicitly selected 'custom' (livre/arrastar) mode
    if (config.profileCard?.position === 'custom' && activeMenu === 'card_perfil') {
      setIsDraggingProfileCard(true);
      handleDragProfileCard(e.clientX, e.clientY);
      return;
    }

    // Clicked empty area on canvas: clear element selection
    setSelectedElementId(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isDraggingViewport && viewportDragStart) {
      setViewportPan({
        x: e.clientX - viewportDragStart.x,
        y: e.clientY - viewportDragStart.y,
      });
      return;
    }

    // Live Element Dragging with Magnetic Snapping
    if (isDraggingElement && dragStartData) {
      const dx = x - dragStartData.startMouseXPercent;
      const dy = y - dragStartData.startMouseYPercent;

      // Smart snapping calculation
      const { snappedX, snappedY, guides } = calculateSnapping(x, y, 2.5);
      setActiveSnapGuides(guides);

      const targetId = dragStartData.elementId;

      if (targetId === 'faixa') {
        const newOffsetX = Math.round(dragStartData.initialFaixaOffsetX + dx);
        const newOffsetY = Math.round(dragStartData.initialFaixaOffsetY + dy);
        updateConfig((prev) => ({
          ...prev,
          profileCard: prev.profileCard
            ? { ...prev.profileCard, faixaOffsetX: newOffsetX, faixaOffsetY: newOffsetY }
            : undefined,
        }));
      } else if (targetId === 'nome') {
        const newOffsetX = Math.round(dragStartData.initialNomeOffsetX + dx);
        const newOffsetY = Math.round(dragStartData.initialNomeOffsetY + dy);
        updateConfig((prev) => ({
          ...prev,
          profileCard: prev.profileCard
            ? { ...prev.profileCard, nomeOffsetX: newOffsetX, nomeOffsetY: newOffsetY }
            : undefined,
        }));
      } else if (targetId === 'informacoes') {
        const newOffsetX = Math.round(dragStartData.initialInfoOffsetX + dx);
        const newOffsetY = Math.round(dragStartData.initialInfoOffsetY + dy);
        updateConfig((prev) => ({
          ...prev,
          profileCard: prev.profileCard
            ? { ...prev.profileCard, infoOffsetX: newOffsetX, infoOffsetY: newOffsetY }
            : undefined,
        }));
      } else if (targetId === 'logo') {
        updateConfig((prev) => ({
          ...prev,
          logoOverlay: {
            ...prev.logoOverlay,
            position: 'free',
            freeX: Math.round(snappedX),
            freeY: Math.round(snappedY),
          },
        }));
      } else if (targetId === 'card_perfil') {
        updateConfig((prev) => ({
          ...prev,
          profileCard: prev.profileCard
            ? {
                ...prev.profileCard,
                position: 'custom',
                customX: Math.round(snappedX),
                customY: Math.round(snappedY),
              }
            : undefined,
        }));
      }
      return;
    }

    if (isDraggingProfileCard) {
      handleDragProfileCard(e.clientX, e.clientY);
      return;
    }

    if (isDrawingEraser) {
      setEraserPath((prev) => [...prev, { x, y }]);
      return;
    }

    if (isDrawingBlur) {
      setBlurPath((prev) => [...prev, { x, y }]);
      return;
    }

    if (isPanningImage && panStart) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPanStart({ x: e.clientX, y: e.clientY });

      const currentTransform = config.imageTransform || { scale: 100, offsetX: 0, offsetY: 0 };
      const deltaX = Math.round((dx / canvasRef.current.width) * 80);
      const deltaY = Math.round((dy / canvasRef.current.height) * 80);

      updateConfig((prev) => ({
        ...prev,
        imageTransform: {
          scale: currentTransform.scale,
          offsetX: Math.max(-100, Math.min(100, (currentTransform.offsetX || 0) + deltaX)),
          offsetY: Math.max(-100, Math.min(100, (currentTransform.offsetY || 0) + deltaY)),
        },
      }));
      return;
    }

    // Hover testing to provide responsive cursor feedback
    const hit = hitTestElements(interactiveElements, x, y, 3.5);
    setHoveredElementId(hit ? hit.id : null);
  };

  const handleCanvasMouseUp = () => {
    if (isDraggingViewport) {
      setIsDraggingViewport(false);
      setViewportDragStart(null);
    }
    if (isDraggingElement) {
      setIsDraggingElement(false);
      setDragStartData(null);
      setActiveSnapGuides([]);
    }
    if (isDraggingProfileCard) {
      setIsDraggingProfileCard(false);
    }
    if (isDrawingEraser) {
      setIsDrawingEraser(false);
      if (eraserPath.length > 1) {
        updateConfig((prev) => ({
          ...prev,
          magicEraser: {
            ...prev.magicEraser,
            strokes: [
              ...prev.magicEraser.strokes,
              {
                id: `stroke_${Date.now()}`,
                mode: prev.magicEraser.mode,
                brushSize: prev.magicEraser.brushSize,
                points: eraserPath,
              },
            ],
          },
        }));
      }
      setEraserPath([]);
    }
    if (isDrawingBlur) {
      setIsDrawingBlur(false);
      if (blurPath.length > 1) {
        updateConfig((prev) => {
          const isLassoMode = prev.pixelateBlur.mode === 'lasso';
          const newRegion: BlurRegion = {
            id: `region_lasso_${Date.now()}`,
            shape: isLassoMode ? 'lasso' : 'freehand',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            points: blurPath,
          };
          return {
            ...prev,
            pixelateBlur: {
              ...prev.pixelateBlur,
              regions: [...prev.pixelateBlur.regions, newRegion],
            },
          };
        });
      }
      setBlurPath([]);
    }
    if (isPanningImage) {
      setIsPanningImage(false);
      setPanStart(null);
    }
  };

  // Empty state if no current image exists
  if (!currentImage || !config) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-[calc(100vh-76px)] bg-slate-950 text-slate-100 p-8 text-center space-y-6 select-none">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <ImageIcon className="w-10 h-10" />
        </div>
        <h3 className="font-serif font-bold text-2xl text-slate-100">Nenhuma Imagem Carregada</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Adicione uma ou mais fotos para iniciar a edição profissional no PhotoCliqa com ferramentas de perfil, filtros e faixas douradas.
        </p>
        <label className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-amber-500/20 transition-all">
          <Upload className="w-5 h-5" />
          <span>Carregar Minhas Fotos</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && onUploadMoreImages(e.target.files)}
          />
        </label>
      </div>
    );
  }

  // Tools definition for Photoshop / Photopea Left Toolbar
  const TOOLS = [
    { id: 'nome', label: 'Nome', icon: Type, shortcut: 'N', activeState: Boolean(config.nameOverlay.active || config.profileCard?.active) },
    { id: 'informacoes', label: 'Informações', icon: Info, shortcut: 'I', activeState: Boolean(config.infoOverlay.active || config.profileCard?.active) },
    { id: 'faixa', label: 'Faixa', icon: Award, shortcut: 'F', activeState: Boolean(currentImage.modelData.novidade ?? currentImage.modelData.etiquetaAtiva ?? config.profileCard?.etiquetaAtiva) },
    { id: 'fundo_preto', label: 'Fundo Preto & Sombra', icon: Moon, shortcut: 'B', activeState: Boolean(config.profileCard?.sombraAtiva !== false || (config.filters && config.filters.fundoPretoInferiorDensidade && config.filters.fundoPretoInferiorDensidade > 0)) },
    { id: 'organizacao', label: 'Organização', icon: Layers, shortcut: 'O', activeState: Boolean(config.organization?.isGrouped) },
    { id: 'ajuste_imagem', label: 'Proporção & Enquadrar', icon: Move, shortcut: 'P', activeState: true },
    { id: 'desfoque', label: 'Desfoque', icon: ShieldAlert, shortcut: 'D', activeState: Boolean(config.pixelateBlur.active) },
    { id: 'logo', label: 'Logo', icon: Sparkles, shortcut: 'L', activeState: Boolean(config.logoOverlay.active) },
    { id: 'filtros', label: 'Filtros & Cores', icon: Sliders, shortcut: 'C', activeState: Boolean(config.filters && (config.filters.brightness !== 100 || config.filters.contrast !== 100 || config.filters.saturation !== 100 || config.filters.vignette > 0)) },
    { id: 'presets', label: 'Presets Rápidos', icon: Compass, shortcut: 'R', activeState: false },
  ];

  return (
    <div className="w-full flex flex-col h-[calc(100vh-76px)] bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* ------------------------------------------------------------- */}
      {/* TOP CONTROL BAR (Photoshop / Photopea style tool options header) */}
      {/* ------------------------------------------------------------- */}
      <div className="h-11 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-xs shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Photo Switcher / Carousel Controller */}
          <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 shadow-inner">
            <button
              onClick={() => currentImageIndex > 0 && onSelectImage(images[currentImageIndex - 1].id)}
              disabled={currentImageIndex <= 0}
              title="Foto anterior"
              className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsPhotoDropdownOpen((prev) => !prev)}
              title="Alternar ou selecionar fotos"
              className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800/80 text-slate-200 transition-all cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="font-mono text-[10px] font-bold text-amber-300">
                {currentImageIndex >= 0 ? `${currentImageIndex + 1}/${images.length}` : '1/1'}
              </span>
              <span className="font-serif font-semibold text-slate-200 truncate max-w-[110px] sm:max-w-[160px]">
                {currentImage.modelData.nome || currentImage.name}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isPhotoDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => currentImageIndex < images.length - 1 && onSelectImage(images[currentImageIndex + 1].id)}
              disabled={currentImageIndex >= images.length - 1}
              title="Próxima foto"
              className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown de Miniaturas e Seleção de Fotos */}
            {isPhotoDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-slate-900/98 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-2.5 z-50 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 px-1">
                  <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5 text-amber-400" />
                    Fotos Carregadas ({images.length})
                  </span>
                  <label
                    title="Adicionar mais fotos"
                    className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adicionar</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          onUploadMoreImages(e.target.files);
                          setIsPhotoDropdownOpen(false);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                  {images.map((img, idx) => {
                    const isSel = img.id === currentImage.id;
                    return (
                      <div
                        key={img.id}
                        onClick={() => {
                          onSelectImage(img.id);
                          setIsPhotoDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between p-1.5 rounded-lg border cursor-pointer transition-all ${
                          isSel
                            ? 'bg-amber-500/15 border-amber-500/80 text-amber-200 shadow-sm'
                            : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={img.dataUrl}
                            alt=""
                            className="w-8 h-8 rounded object-cover border border-slate-700 shrink-0"
                          />
                          <div className="truncate text-left">
                            <p className="text-[11px] font-semibold truncate leading-tight">
                              {img.modelData.nome || `Foto ${idx + 1}`}
                            </p>
                            <span className="text-[9px] text-slate-400">
                              Foto #{idx + 1} • {img.editConfig.dimension}
                            </span>
                          </div>
                        </div>

                        {images.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveImage(img.id);
                            }}
                            title="Remover foto"
                            className="p-1 rounded hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Adicionar Foto */}
          <label
            title="Adicionar mais fotos"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 text-amber-300 hover:text-amber-200 text-xs font-semibold cursor-pointer transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Foto</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && onUploadMoreImages(e.target.files)}
            />
          </label>

          {/* Trocar Foto Atual (Substitui imagem preservando edições) */}
          {onReplaceImage && (
            <label
              title="Trocar a foto atual preservando todas as edições, textos, posições e estilos"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-amber-300 text-xs font-semibold cursor-pointer transition-all shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Trocar Foto</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0] && currentImage) {
                    onReplaceImage(currentImage.id, e.target.files[0]);
                  }
                }}
              />
            </label>
          )}

          {/* Duplicar Foto Atual */}
          {onDuplicateImage && (
            <button
              type="button"
              onClick={() => onDuplicateImage(currentImage?.id)}
              title="Criar uma cópia independente desta foto mantendo todas as edições atuais"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-amber-300 text-xs font-semibold cursor-pointer transition-all shadow-sm"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Duplicar Foto</span>
            </button>
          )}

          {/* Foto Limpa / Alternar Textos */}
          <button
            type="button"
            onClick={() => handleToggleAllOverlays(!isAnyOverlayActive)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-sm cursor-pointer ${
              isAnyOverlayActive
                ? 'bg-slate-950 border-slate-700 text-slate-300 hover:text-rose-300 hover:border-rose-700'
                : 'bg-emerald-950/50 border-emerald-600/80 text-emerald-300 hover:bg-emerald-900/60'
            }`}
            title={
              isAnyOverlayActive
                ? 'Desativar temporariamente todos os textos e marcas na tela (Foto Limpa)'
                : 'Ativar todos os elementos de perfil e logotipo'
            }
          >
            {isAnyOverlayActive ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Foto Limpa</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Ativar Textos</span>
              </>
            )}
          </button>

          <div className="h-4 w-px bg-slate-800 hidden lg:block" />

          {/* Controle Compacto de Alinhamento (Nome / Info / Faixa -> Esquerda / Centro / Direita) */}
          <div className="hidden xl:flex items-center">
            <ElementAlignmentControl config={config} updateConfig={updateConfig} compact={true} />
          </div>
        </div>

        {/* Right side of Top Bar: Actions */}
        <div className="flex items-center gap-2">
          {/* Preset Salvar / Abrir */}
          <button
            type="button"
            onClick={() => setIsSavePresetModalOpen(true)}
            title="Salvar enquadramento, fontes, bandagem e estilos da foto atual como Preset personalizado"
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-700 hover:border-amber-500/60 flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Preset</span>
          </button>

          {/* Formato do Arquivo (PNG / WebP) */}
          {setExportFormat && (
            <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setExportFormat('png')}
                title="Exportar em PNG (image/png, qualidade máxima sem perdas)"
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  exportFormat === 'png'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PNG
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('webp')}
                title="Exportar em WebP (image/webp, otimizado para web)"
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  exportFormat === 'webp'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                WebP
              </button>
            </div>
          )}

          {/* Baixar Foto */}
          {onDownloadCurrent && (
            <button
              type="button"
              onClick={() => onDownloadCurrent(currentImage?.id)}
              title={`Baixar foto atual (.${exportFormat})`}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/10 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Foto</span>
            </button>
          )}

          {/* Toggle Inspector Sidebar */}
          <button
            onClick={() => setIsInspectorOpen((prev) => !prev)}
            title={isInspectorOpen ? 'Recolher Painel de Opções' : 'Expandir Painel de Opções'}
            className={`p-1.5 rounded-md border transition-all cursor-pointer ${
              isInspectorOpen
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-amber-300'
            }`}
          >
            {isInspectorOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN WORKSPACE BODY: LEFT TOOLBAR + PROPERTIES + CANVAS       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 1. LEFT ICON TOOLBAR (Estilo Photoshop / Photopea vertical) */}
        <div className="w-14 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-2 space-y-1 shrink-0 z-30 shadow-2xl">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeMenu === tool.id && isInspectorOpen;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (activeMenu === tool.id && isInspectorOpen) {
                    // Already open, keep open
                  } else {
                    setActiveMenu(tool.id);
                    setIsInspectorOpen(true);
                  }
                }}
                title={`${tool.label} (${tool.shortcut})`}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-2 ring-amber-400'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

                {/* Active Tool Dot Indicator */}
                {tool.activeState && !isSelected && (
                  <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}

                {/* Hover Tooltip */}
                <span className="absolute left-14 bg-slate-950 border border-slate-700 text-slate-100 text-[11px] font-medium px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {tool.label} <span className="text-amber-400 font-bold font-mono">[{tool.shortcut}]</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. PROPERTIES / INSPECTOR FLYOUT PANEL (Opções da ferramenta ativa) */}
        {isInspectorOpen && (
          <div className="w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col shrink-0 z-20 shadow-2xl overflow-hidden animate-fade-in">
            {/* Panel Header */}
            <div className="h-11 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                {(() => {
                  const curr = TOOLS.find((t) => t.id === activeMenu);
                  if (!curr) return null;
                  const Icon = curr.icon;
                  return (
                    <>
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span className="font-serif font-bold text-xs text-amber-200 tracking-wide">
                        {curr.label}
                      </span>
                    </>
                  );
                })()}
              </div>

              <button
                onClick={() => setIsInspectorOpen(false)}
                title="Fechar painel de opções"
                className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body: Active Tool Options */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
              {activeMenu === 'nome' && (
                <NomeSection
                  currentImage={currentImage}
                  config={config}
                  updateConfig={updateConfig}
                  onUpdateImageModelData={onUpdateImageModelData}
                />
              )}

              {(activeMenu === 'informacoes' || activeMenu === 'dados_modelo') && (
                <InformacoesSection
                  currentImage={currentImage}
                  config={config}
                  updateConfig={updateConfig}
                  onUpdateImageModelData={onUpdateImageModelData}
                />
              )}

              {(activeMenu === 'faixa' || activeMenu === 'card_perfil') && (
                <FaixaSection
                  currentImage={currentImage}
                  config={config}
                  updateConfig={updateConfig}
                  onUpdateImageModelData={onUpdateImageModelData}
                />
              )}

              {activeMenu === 'organizacao' && (
                <OrganizacaoSection
                  currentImage={currentImage}
                  config={config}
                  updateConfig={updateConfig}
                />
              )}

              {activeMenu === 'ajuste_imagem' && (
                <ProporcaoSection
                  currentImage={currentImage}
                  config={config}
                  updateConfig={updateConfig}
                  onReplaceImage={onReplaceImage}
                  exportFormat={exportFormat}
                  setExportFormat={setExportFormat}
                  onDownloadCurrent={onDownloadCurrent}
                />
              )}

              {activeMenu === 'desfoque' && (
                <DesfoqueSection
                  currentImage={currentImage}
                  config={config}
                  updateConfig={updateConfig}
                />
              )}

              {activeMenu === 'logo' && (
                <LogoSection
                  config={config}
                  updateConfig={updateConfig}
                />
              )}

              {activeMenu === 'fundo_preto' && (
                <FundoPretoSection
                  currentImage={currentImage}
                  config={config}
                  updateConfig={updateConfig}
                />
              )}

              {activeMenu === 'filtros' && (
                <FiltrosSection
                  config={config}
                  updateConfig={updateConfig}
                />
              )}

              {activeMenu === 'presets' && (
                <PresetsSection
                  currentImage={currentImage}
                  config={config}
                  updateConfig={updateConfig}
                  onUpdateImageModelData={onUpdateImageModelData}
                  presets={presets}
                  onSelectPreset={(preset) => {
                    onApplyPresetToImage(currentImage.id, preset);
                    showToast(`Preset "${preset.name}" aplicado à foto!`);
                  }}
                  onRemovePreset={onRemovePreset}
                  onOpenSavePresetModal={() => setIsSavePresetModalOpen(true)}
                />
              )}
            </div>
          </div>
        )}

        {/* 3. CENTER: LIVE CANVAS STUDIO VIEWPORT (Fit to screen & comfortable distance) */}
        <div
          ref={containerRef}
          className={`flex-1 flex items-center justify-center relative p-4 sm:p-6 bg-zinc-950 overflow-hidden select-none ${
            isViewportPanMode ? (isDraggingViewport ? 'cursor-grabbing' : 'cursor-grab') : ''
          }`}
          onMouseDown={(e) => {
            if (isViewportPanMode || e.button === 1 || e.altKey) {
              setIsDraggingViewport(true);
              setViewportDragStart({ x: e.clientX - viewportPan.x, y: e.clientY - viewportPan.y });
            }
          }}
          onMouseMove={(e) => {
            if (isDraggingViewport && viewportDragStart) {
              setViewportPan({
                x: e.clientX - viewportDragStart.x,
                y: e.clientY - viewportDragStart.y,
              });
            }
          }}
          onMouseUp={() => {
            if (isDraggingViewport) {
              setIsDraggingViewport(false);
              setViewportDragStart(null);
            }
          }}
          onWheel={(e) => {
            if (e.ctrlKey || e.metaKey || isViewportPanMode) {
              e.preventDefault();
              if (e.deltaY < 0) {
                setPreviewZoom((prev) => Math.min(300, prev + 25));
              } else {
                setPreviewZoom((prev) => Math.max(40, prev - 25));
              }
            }
          }}
        >
          {/* Dedicated Zoom & Pan Tool (Docked top right of canvas stage) */}
          <div className="absolute right-4 top-4 z-30 flex flex-col items-center bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl space-y-1.5">
            <div className="text-[10px] text-amber-400 font-semibold px-1 pt-0.5 flex flex-col items-center gap-0.5" title="Zoom & Navegação Panorâmica">
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Zoom</span>
            </div>

            {/* Zoom In (+) */}
            <button
              onClick={() => setPreviewZoom((prev) => Math.min(300, prev + 25))}
              disabled={previewZoom >= 300}
              title="Aumentar Zoom (+25%)"
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Current Zoom Level Badge */}
            <div
              className="px-1.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-amber-300 min-w-[42px] text-center shadow-inner"
              title="Nível de zoom da visualização"
            >
              {previewZoom}%
            </div>

            {/* Zoom Out (-) */}
            <button
              onClick={() => setPreviewZoom((prev) => Math.max(40, prev - 25))}
              disabled={previewZoom <= 40}
              title="Diminuir Zoom (-25%)"
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Separator */}
            <div className="w-6 h-px bg-slate-700/60 my-0.5" />

            {/* Pan / Move Tool Toggle (Mãozinha para arrastar e ver todos os cantos) */}
            <button
              onClick={() => setIsViewportPanMode((prev) => !prev)}
              title={
                isViewportPanMode
                  ? 'Desativar Modo Pan (Arrastar Tela)'
                  : 'Ativar Modo Pan / Mover Foto (Navegar por todos os cantos da imagem)'
              }
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isViewportPanMode
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-2 ring-amber-400'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-amber-300'
              }`}
            >
              <Hand className="w-4 h-4" />
            </button>

            {/* Quick Reset 100% (1:1) & Center */}
            <button
              onClick={() => {
                setPreviewZoom(100);
                setViewportPan({ x: 0, y: 0 });
              }}
              title="Ajustar à Tela (100% Fit)"
              className={`w-8 h-8 rounded-xl text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                previewZoom === 100 && viewportPan.x === 0 && viewportPan.y === 0
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-amber-300'
              }`}
            >
              Fit
            </button>

            {/* Directional Nudge Pad (quando em zoom para explorar cantos) */}
            {(previewZoom > 100 || viewportPan.x !== 0 || viewportPan.y !== 0) && (
              <>
                <div className="w-6 h-px bg-slate-700/60 my-0.5" />
                <div className="flex flex-col items-center gap-0.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewportPan((p) => ({ ...p, y: p.y + 60 }))}
                    className="p-1 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded"
                    title="Navegar para Cima"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewportPan((p) => ({ ...p, x: p.x + 60 }))}
                      className="p-1 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded"
                      title="Navegar para Esquerda"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setViewportPan({ x: 0, y: 0 })}
                      className="text-[8px] font-mono text-amber-400 hover:bg-slate-800 px-1 py-0.5 rounded"
                      title="Centralizar Pan"
                    >
                      •
                    </button>
                    <button
                      onClick={() => setViewportPan((p) => ({ ...p, x: p.x - 60 }))}
                      className="p-1 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded"
                      title="Navegar para Direita"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => setViewportPan((p) => ({ ...p, y: p.y - 60 }))}
                    className="p-1 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded"
                    title="Navegar para Baixo"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Canvas Wrapper with Zoom & 2D Pan Transform */}
          <div
            style={{
              transform: `translate(${viewportPan.x}px, ${viewportPan.y}px) scale(${previewZoom / 100})`,
              transformOrigin: 'center center',
              transition: isDraggingViewport ? 'none' : 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className="flex items-center justify-center m-auto pointer-events-auto p-2"
          >
            <div className="relative inline-block">
              <canvas
                ref={canvasRef}
                width={1080}
                height={1080}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onTouchStart={(e) => {
                  const t = e.touches[0];
                  if (t) handleCanvasMouseDown({ clientX: t.clientX, clientY: t.clientY } as any);
                }}
                onTouchMove={(e) => {
                  const t = e.touches[0];
                  if (t) handleCanvasMouseMove({ clientX: t.clientX, clientY: t.clientY } as any);
                }}
                onTouchEnd={handleCanvasMouseUp}
                className={`max-h-[min(72vh,780px)] max-w-[min(90vw,780px)] w-auto h-auto object-contain rounded-lg shadow-2xl transition-transform border border-slate-800/80 ${
                  config.magicEraser.active
                    ? 'cursor-crosshair'
                    : isViewportPanMode
                    ? 'cursor-grab'
                    : hoveredElementId
                    ? 'cursor-pointer'
                    : 'cursor-move'
                }`}
              />

              {/* Live Drag & Drop Overlay with Magnetic Snap Guides & Bounding Box Handles */}
              <InteractiveCanvasOverlay
                elements={interactiveElements}
                selectedElementId={selectedElementId}
                hoveredElementId={hoveredElementId}
                isDragging={isDraggingElement}
                activeSnapGuides={activeSnapGuides}
                onSelectElement={setSelectedElementId}
                onCenterElementHorizontal={handleCenterElementHorizontal}
                onCenterElementVertical={handleCenterElementVertical}
                onResetElementOffset={handleResetElementOffset}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. BOTTOM FILMSTRIP (Prévia de Miniaturas e Carrossel de Fotos) */}
      {/* ------------------------------------------------------------- */}
      <div className="h-18 bg-slate-900 border-t border-slate-800 px-3.5 flex items-center gap-2.5 shrink-0 z-30 shadow-2xl">
        {/* Upload Button */}
        <label
          title="Adicionar mais fotos"
          className="h-13 w-16 rounded-lg bg-slate-950 hover:bg-slate-800 border border-dashed border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all shrink-0 group"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover:scale-110" />
          <span className="text-[8px] font-bold uppercase tracking-wider text-center">Adicionar</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && onUploadMoreImages(e.target.files)}
          />
        </label>

        <div className="h-10 w-px bg-slate-800 shrink-0" />

        {/* Horizontal Filmstrip Carousel */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
          {images.map((img, index) => {
            const isSelected = img.id === currentImage.id;
            return (
              <div
                key={img.id}
                onClick={() => onSelectImage(img.id)}
                className={`group relative h-13 w-19 rounded-lg border overflow-hidden cursor-pointer transition-all shrink-0 ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-500/60 bg-slate-950 scale-105 shadow-md shadow-amber-500/20'
                    : 'border-slate-800 hover:border-slate-600 bg-slate-950/70 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Dark Gradient Overlay for Name Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />

                {/* Image Index / Title */}
                <div className="absolute bottom-0.5 left-1 right-1 flex items-center justify-between">
                  <span className="text-[8px] text-slate-200 font-semibold truncate leading-none">
                    {img.modelData.nome || `Foto ${index + 1}`}
                  </span>
                </div>

                {/* Active Indicator Badge */}
                {isSelected && (
                  <span className="absolute top-0.5 left-0.5 bg-amber-500 text-slate-950 text-[6px] font-black px-1 rounded-sm uppercase tracking-tighter">
                    Ativa
                  </span>
                )}

                {/* Action buttons on thumbnail hover */}
                <div className="absolute top-0.5 right-0.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onDuplicateImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateImage(img.id);
                      }}
                      title="Duplicar esta foto"
                      className="w-4 h-4 rounded bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-all shadow"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                  )}

                  {images.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage(img.id);
                      }}
                      title="Remover foto"
                      className="w-4 h-4 rounded bg-slate-950/90 hover:bg-rose-600 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Counter */}
        <div className="hidden md:flex flex-col items-end text-[9px] text-slate-400 shrink-0 border-l border-slate-800 pl-2.5">
          <span className="text-amber-300 font-bold">{images.length} foto(s)</span>
          <span className="text-slate-400">Total na fila</span>
        </div>
      </div>

      {/* Save Preset Modal */}
      {isSavePresetModalOpen && (
        <SavePresetModal
          currentConfig={config}
          currentModelData={currentImage.modelData}
          onSave={(presetData) => {
            if (onCreatePreset) {
              onCreatePreset(presetData);
            }
            showToast(`Preset "${presetData.name}" salvo com sucesso!`);
          }}
          onClose={() => setIsSavePresetModalOpen(false)}
        />
      )}

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-slate-100 border border-amber-500/50 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 animate-fadeIn pointer-events-none">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
