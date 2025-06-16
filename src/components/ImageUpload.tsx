import { useRef, useState, useEffect } from "react";

interface ImageUploadProps {
  /**
   * Unique key for the image on the server. This will be combined with the
   * current timestamp to generate a unique file name when uploading.
   */
  fileKey: string;
  /**
   * Remote image URL to show initially (for example the URL of an already
   * uploaded image). If omitted, the placeholder will be shown until the user
   * selects a file.
   */
  previewUrl?: string | null;
  /** Optional label rendered above the upload area */
  label?: string;
  /**
   * Callback fired after a successful selection containing the Base64 string
   * of the uploaded image. A second argument with the file key is provided
   * for backwards compatibility.
   */
  onComplete?: (base64: string, uniqueName?: string) => void;
  placeholderClassName?: string;
  className?: string;
}

export default function ImageUpload({
  fileKey,
  previewUrl,
  label,
  onComplete,
  placeholderClassName = "w-32 h-32 mx-auto flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all",
  className = "w-32 h-32 object-cover rounded-lg mx-auto shadow-lg hover:shadow-xl transition-shadow cursor-pointer",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Track if the preview image failed to load
  const [hasError, setHasError] = useState(false);

  // Local preview URL (either remote string or ObjectURL while uploading)
  const [localPreview, setLocalPreview] = useState<string | null>(
    previewUrl ?? null
  );

  // Reset error state whenever the preview URL changes
  useEffect(() => {
    setHasError(false);
  }, [localPreview]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show an instant local preview using an ObjectURL
    const tempUrl = URL.createObjectURL(file);
    setLocalPreview(tempUrl);

    try {
      // Convert the selected file to a Base64 string
      const base64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      // Replace the temporary ObjectURL with the actual Base64 string for preview
      setLocalPreview(base64);

      // Notify parent component with the Base64 string.
      onComplete?.(base64, fileKey);
    } catch (err) {
      console.error(err);
      // On error, revert preview and show placeholder
      setLocalPreview(null);
    }
  };

  return (
    <div className="text-center space-y-2">
      {label && (
        <h4 className="font-medium text-gray-800 capitalize flex items-center justify-center">
          {label}
        </h4>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleChange}
        />
        {localPreview && !hasError ? (
          <img
            src={localPreview}
            alt={fileKey}
            className={className}
            onClick={() => inputRef.current?.click()}
            onError={() => setHasError(true)}
          />
        ) : (
          <div
            className={placeholderClassName}
            onClick={() => inputRef.current?.click()}
          >
            <svg
              className="w-8 h-8 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-sm text-gray-500 font-medium">Upload</span>
          </div>
        )}
      </div>
    </div>
  );
} 