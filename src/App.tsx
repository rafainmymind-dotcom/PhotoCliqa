import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  ActiveTab,
  BrandConfig,
  EditConfig,
  ExportFormat,
  ImageItem,
  ModelData,
  Preset,
} from './types';
import {
  CLEAN_EDIT_CONFIG,
  DEFAULT_EDIT_CONFIG,
  DEFAULT_MODEL_DATA,
  DEFAULT_SAMPLE_PORTRAIT,
  INITIAL_PRESETS,
  OFFICIAL_MIMUUS_LOGO,
} from './utils/defaults';
import { renderImageToCanvas } from './utils/canvasRenderer';
import { DEFAULT_BRAND_CONFIG } from './utils/theme';
import { Navbar } from './components/Navbar';
import { UploadFormPage } from './components/UploadFormPage';
import { PresetsPage } from './components/PresetsPage';
import { EditorWorkspacePage } from './components/EditorWorkspacePage';
import { BrandThemeModal } from './components/BrandThemeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('upload_form');
  const [modelData, setModelData] = useState<ModelData>(DEFAULT_MODEL_DATA);
  const [startWithCleanPhoto, setStartWithCleanPhoto] = useState<boolean>(false);
  const [presets, setPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem('mimuus_presets');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string>('');
  const [isProcessingZip, setIsProcessingZip] = useState<boolean>(false);

  // Formato do Arquivo de Exportação: PNG ou WebP
  const [exportFormat, setExportFormat] = useState<ExportFormat>(() => {
    const saved = localStorage.getItem('photocliqa_export_format');
    return saved === 'png' || saved === 'webp' ? saved : 'webp';
  });

  useEffect(() => {
    localStorage.setItem('photocliqa_export_format', exportFormat);
  }, [exportFormat]);

  // Brand and Theme customization state
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    const saved = localStorage.getItem('photocliqa_brand');
    return saved
      ? { ...DEFAULT_BRAND_CONFIG, ...JSON.parse(saved) }
      : { ...DEFAULT_BRAND_CONFIG };
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Save brand config to localStorage
  useEffect(() => {
    localStorage.setItem('photocliqa_brand', JSON.stringify(brandConfig));
  }, [brandConfig]);

  // Save presets to localStorage
  useEffect(() => {
    localStorage.setItem('mimuus_presets', JSON.stringify(presets));
  }, [presets]);

  // Remove single image [X]
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (selectedImageId === id && filtered.length > 0) {
        setSelectedImageId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Deep clone duplicate of specific image / composition
  const handleDuplicateImage = (idToDuplicate?: string) => {
    const targetId = idToDuplicate || selectedImageId;
    const targetIndex = images.findIndex((img) => img.id === targetId);
    if (targetIndex === -1) return;

    const original = images[targetIndex];
    const clone: ImageItem = typeof structuredClone === 'function'
      ? structuredClone(original)
      : JSON.parse(JSON.stringify(original));

    const newId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    clone.id = newId;
    clone.name = `${original.name.replace(/\.[^/.]+$/, '')}_copia.jpg`;
    clone.createdAt = new Date().toISOString();

    const newImages = [...images];
    newImages.splice(targetIndex + 1, 0, clone);

    setImages(newImages);
    setSelectedImageId(newId);
  };

  // Replace only the image file in the active composition, preserving all styles, texts, and overlays
  const handleReplaceImage = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setImages((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                name: file.name,
                dataUrl,
                aspectWidth: img.naturalWidth,
                aspectHeight: img.naturalHeight,
                // Preserves 100% of editConfig and modelData
              };
            }
            return item;
          })
        );
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Upload handler for multiple image files
  const handleUploadImages = (files: FileList | File[], forceClean?: boolean) => {
    const isClean = forceClean !== undefined ? forceClean : startWithCleanPhoto;
    const baseConfig = isClean ? CLEAN_EDIT_CONFIG : DEFAULT_EDIT_CONFIG;

    const newItems: Promise<ImageItem>[] = Array.from(files).map((file, idx) => {
      return new Promise<ImageItem>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const img = new Image();
          img.onload = () => {
            resolve({
              id: `img_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              dataUrl,
              aspectWidth: img.naturalWidth,
              aspectHeight: img.naturalHeight,
              modelData: { ...modelData },
              editConfig: JSON.parse(JSON.stringify(baseConfig)),
              createdAt: new Date().toISOString(),
            });
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newItems).then((loadedImages) => {
      setImages((prev) => [...prev, ...loadedImages]);
      if (loadedImages.length > 0) {
        setSelectedImageId(loadedImages[0].id);
      }
    });
  };

  // Clear all images
  const handleClearAllImages = () => {
    setImages([]);
    setSelectedImageId('');
  };

  // Select Preset and apply to active photo
  const handleSelectPreset = (preset: Preset) => {
    setSelectedPresetId(preset.id);
    if (selectedImageId) {
      handleApplyPresetToImage(selectedImageId, preset);
    }
  };

  // Apply Preset directly to a specific image (applies complete visual style and dimensions)
  const handleApplyPresetToImage = (imageId: string, preset: Preset) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === imageId) {
          const newConfig: EditConfig = JSON.parse(JSON.stringify(preset.editConfig));
          return {
            ...img,
            editConfig: newConfig,
            modelData: preset.modelData
              ? JSON.parse(JSON.stringify(preset.modelData))
              : img.modelData,
          };
        }
        return img;
      })
    );
  };

  // Create new preset from current settings (Flexible saving)
  const handleCreatePreset = (
    nameOrData:
      | string
      | {
          name: string;
          description?: string;
          category?: string;
          customConfig?: EditConfig;
          customModelData?: ModelData;
        },
    descriptionParam?: string
  ) => {
    const currentImg = images.find((i) => i.id === selectedImageId) || images[0];

    let name = '';
    let description = '';
    let category = 'Personalizado';
    let targetConfig: EditConfig = currentImg ? JSON.parse(JSON.stringify(currentImg.editConfig)) : { ...DEFAULT_EDIT_CONFIG };
    let targetModelData: ModelData = currentImg?.modelData ? JSON.parse(JSON.stringify(currentImg.modelData)) : { ...modelData };

    if (typeof nameOrData === 'object' && nameOrData !== null) {
      name = nameOrData.name;
      description = nameOrData.description || '';
      category = nameOrData.category || 'Personalizado';
      if (nameOrData.customConfig) {
        targetConfig = JSON.parse(JSON.stringify(nameOrData.customConfig));
      }
      if (nameOrData.customModelData) {
        targetModelData = JSON.parse(JSON.stringify(nameOrData.customModelData));
      }
    } else if (typeof nameOrData === 'string') {
      name = nameOrData;
      description = descriptionParam || '';
    }

    const newPreset: Preset = {
      id: `preset_custom_${Date.now()}`,
      name: name.trim() || 'Meu Preset Personalizado',
      description: description.trim(),
      category,
      modelData: targetModelData,
      editConfig: targetConfig,
      createdAt: new Date().toISOString(),
    };

    setPresets((prev) => [newPreset, ...prev]);
    setSelectedPresetId(newPreset.id);
  };

  // Remove custom preset
  const handleRemovePreset = (presetId: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
    if (selectedPresetId === presetId) {
      setSelectedPresetId('');
    }
  };

  // Update image config
  const handleUpdateImageConfig = (id: string, newConfig: EditConfig) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, editConfig: newConfig } : img))
    );
  };

  // Update image model data
  const handleUpdateImageModelData = (id: string, newModelData: ModelData) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, modelData: newModelData } : img))
    );
  };

  // Duplicar alterações, proporção, enquadramento e edições da foto atual para TODAS as fotos
  const handleDuplicateToAll = () => {
    const currentImg = images.find((i) => i.id === selectedImageId) || images[0];
    if (!currentImg) return;

    const clonedConfig = JSON.parse(JSON.stringify(currentImg.editConfig));
    const clonedModelData = currentImg.modelData ? JSON.parse(JSON.stringify(currentImg.modelData)) : undefined;

    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        editConfig: JSON.parse(JSON.stringify(clonedConfig)),
        modelData: clonedModelData ? JSON.parse(JSON.stringify(clonedModelData)) : img.modelData,
      }))
    );
  };

  // Helper to sanitize filename base while preserving readable characters
  const getSanitizedFileName = (name: string) => {
    return (
      name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-zA-Z0-9_-]/g, '_') // remove invalid characters
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '') || 'foto'
    );
  };

  // Single Image Download (True PNG or WebP format based on exportFormat state)
  const handleDownloadCurrent = async (customImageId?: string) => {
    const targetId = customImageId || selectedImageId;
    const currentImg = images.find((i) => i.id === targetId) || images[0];
    if (!currentImg) return;

    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';
    baseImg.src = currentImg.dataUrl;

    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = currentImg.editConfig.logoOverlay.imageUrl || OFFICIAL_MIMUUS_LOGO;

    await new Promise((res) => (baseImg.onload = res));
    await new Promise((res) => (logoImg.onload = res));

    const renderedCanvas = await renderImageToCanvas(
      baseImg,
      currentImg.editConfig,
      logoImg,
      currentImg.modelData
    );

    const personName = currentImg.modelData?.nome?.trim() || currentImg.name.replace(/\.[^/.]+$/, '');
    const cleanName = getSanitizedFileName(personName);
    const fileName = `mimuus_${cleanName}_${currentImg.editConfig.dimension}.${exportFormat}`;

    if (exportFormat === 'png') {
      renderedCanvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        'image/png'
      );
    } else {
      renderedCanvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        'image/webp',
        0.92
      );
    }
  };

  // Download ZIP of all images (all true PNG or all WebP according to exportFormat)
  const handleDownloadZipAll = async () => {
    if (images.length === 0) return;
    setIsProcessingZip(true);

    try {
      const zip = new JSZip();
      const folderName = `mimuus_editadas_${exportFormat}`;
      const folder = zip.folder(folderName);

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const baseImg = new Image();
        baseImg.crossOrigin = 'anonymous';
        baseImg.src = item.dataUrl;

        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.src = item.editConfig.logoOverlay.imageUrl || OFFICIAL_MIMUUS_LOGO;

        await new Promise((res) => (baseImg.onload = res));
        await new Promise((res) => (logoImg.onload = res));

        const canvas = await renderImageToCanvas(baseImg, item.editConfig, logoImg, item.modelData);
        
        let base64Data: string;
        if (exportFormat === 'png') {
          const dataUrl = canvas.toDataURL('image/png');
          base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        } else {
          const dataUrl = canvas.toDataURL('image/webp', 0.92);
          base64Data = dataUrl.replace(/^data:image\/webp;base64,/, '');
        }

        const personName = item.modelData?.nome?.trim() || item.name.replace(/\.[^/.]+$/, '') || `foto_${i + 1}`;
        const cleanName = getSanitizedFileName(personName);
        const fileName = `foto_${i + 1}_${cleanName}_${item.editConfig.dimension}.${exportFormat}`;
        folder?.file(fileName, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      const zipUrl = URL.createObjectURL(content);
      a.href = zipUrl;
      const personBatch = modelData.nome ? `_${getSanitizedFileName(modelData.nome)}` : '';
      a.download = `mimuus_todas_fotos${personBatch}_${exportFormat}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error('Erro ao gerar arquivo ZIP:', err);
      alert('Houve um erro ao gerar o arquivo ZIP. Tente novamente.');
    } finally {
      setIsProcessingZip(false);
    }
  };

  const currentImg = images.find((i) => i.id === selectedImageId) || images[0];

  const bgClass =
    brandConfig.darkBgMode === 'black'
      ? 'bg-black'
      : brandConfig.darkBgMode === 'charcoal'
      ? 'bg-[#121417]'
      : 'bg-slate-950';

  const fontScaleClass =
    brandConfig.fontScale === 'compact'
      ? 'text-[13px]'
      : brandConfig.fontScale === 'comfortable'
      ? 'text-[15px]'
      : '';

  return (
    <div className={`min-h-screen ${bgClass} ${fontScaleClass} text-slate-100 font-sans flex flex-col justify-between transition-colors`}>
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        imageCount={images.length}
        brandConfig={brandConfig}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onDuplicateToAll={handleDuplicateToAll}
        onDownloadCurrent={handleDownloadCurrent}
        onDownloadZipAll={handleDownloadZipAll}
        isProcessingZip={isProcessingZip}
      />

      {/* Brand & Theme Config Modal */}
      {isThemeModalOpen && (
        <BrandThemeModal
          isOpen={isThemeModalOpen}
          brandConfig={brandConfig}
          onSaveBrandConfig={(updated) => setBrandConfig(updated)}
          onClose={() => setIsThemeModalOpen(false)}
        />
      )}

      {/* Main Container Views */}
      <main className="flex-1">
        {activeTab === 'upload_form' && (
          <UploadFormPage
            modelData={modelData}
            setModelData={setModelData}
            startWithCleanPhoto={startWithCleanPhoto}
            setStartWithCleanPhoto={setStartWithCleanPhoto}
            presets={presets}
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
            onUploadImages={handleUploadImages}
            uploadedImagesCount={images.length}
            onGoToEditor={() => setActiveTab('editor')}
            onGoToPresets={() => setActiveTab('presets')}
            onClearAllImages={handleClearAllImages}
          />
        )}

        {activeTab === 'presets' && (
          <PresetsPage
            presets={presets}
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
            onCreatePreset={handleCreatePreset}
            onRemovePreset={handleRemovePreset}
            currentModelData={modelData}
            currentEditConfig={currentImg ? currentImg.editConfig : DEFAULT_EDIT_CONFIG}
            onGoToEditor={() => setActiveTab('editor')}
            onGoToUpload={() => setActiveTab('upload_form')}
          />
        )}

        {activeTab === 'editor' && (
          <EditorWorkspacePage
            images={images}
            selectedImageId={selectedImageId}
            onSelectImage={setSelectedImageId}
            onRemoveImage={handleRemoveImage}
            onDuplicateImage={handleDuplicateImage}
            onReplaceImage={handleReplaceImage}
            onUploadMoreImages={handleUploadImages}
            onUpdateImageConfig={handleUpdateImageConfig}
            onUpdateImageModelData={handleUpdateImageModelData}
            presets={presets}
            onSelectPreset={handleSelectPreset}
            onCreatePreset={handleCreatePreset}
            onRemovePreset={handleRemovePreset}
            onApplyPresetToImage={handleApplyPresetToImage}
            onDuplicateToAll={handleDuplicateToAll}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            onDownloadCurrent={handleDownloadCurrent}
            onDownloadZipAll={handleDownloadZipAll}
            isProcessingZip={isProcessingZip}
          />
        )}
      </main>
    </div>
  );
}
