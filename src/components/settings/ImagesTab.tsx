import ImageUpload from "../ImageUpload";
import { Settings } from "../../../worker/helpers";

interface Props {
  settings: Settings;
  handleImageUpload: (type: keyof Settings["base64Images"], base64: string) => void;
}

export default function ImagesTab({ settings, handleImageUpload }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Game Images
        </h3>
        <p className="text-gray-600">
          Upload images for different parts of your game
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(settings.base64Images) as Array<keyof Settings["base64Images"]>).map((type) => (
          <div
            key={type}
            className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-400 transition-colors"
          >
            <ImageUpload
              fileKey={type}
              label={type}
              previewUrl={settings.base64Images[type] || undefined}
              onComplete={(base64) => handleImageUpload(type, base64)}
            />
            {/* Dimension hint */}
            {(() => {
              const dims: Record<string, string> = {
                cap: '400×400px',
                header: '1024×256px',
                banner: '400×300px',
                lose: '400×400px',
                // backCap: '400×400px',
              };
              return dims[type] ? (
                <p className="mt-2 text-center text-[11px] text-gray-400">Required: {dims[type]}</p>
              ) : null;
            })()}
          </div>
        ))}
      </div>
    </div>
  );
} 