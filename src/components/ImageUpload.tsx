import { useState, useRef } from 'react';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../utils/constants';
import { compressImage } from '../utils/imageUtils';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  disabled?: boolean;
}

export default function ImageUpload({ onImageUpload, disabled }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Vérification du type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Format d\'image non supporté. Utilisez JPG, PNG ou WebP.');
      return;
    }

    // Vérification de la taille
    if (file.size > MAX_IMAGE_SIZE) {
      setError('L\'image est trop volumineuse (max 5MB).');
      return;
    }

    try {
      // Compression de l'image
      const compressedBlob = await compressImage(file, 800, 800, 0.8);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      // Création de l'URL pour la prévisualisation
      const preview = URL.createObjectURL(compressedBlob);
      setPreviewUrl(preview);
      onImageUpload(compressedFile);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la compression de l\'image');
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        disabled={disabled}
      />
      <div
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-primary-500'
        } ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 rounded-md mb-2"
            />
            <p className="text-sm text-gray-500">Cliquez pour changer</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-500">
              {disabled ? 'Téléchargement désactivé' : 'Cliquez pour télécharger une image'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG, WebP (max 5MB)
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}