import React from "react";
import ImageUpload from "../ImageUpload";
import { PUBLIC_IMAGE_URL } from "../../../worker/config";

export default function ImagesTab() {
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
        {["cap", "header", "banner"].map((type) => (
          <div
            key={type}
            className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-400 transition-colors"
          >
            {(() => {
              const previewUrl = `${PUBLIC_IMAGE_URL}/${type}`;
              return (
                <ImageUpload
                  fileKey={type}
                  label={type}
                  previewUrl={previewUrl}
                />
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
} 