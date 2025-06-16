import { Settings } from "../../../worker/helpers";

interface Props {
  settings: Settings;
  handleColorChange: (field: "primary" | "secondary", value: string) => void;
  handleTextChange: (
    lang: "am" | "en",
    field: "win" | "lose",
    value: string
  ) => void;
  handleProbabilityChange: (value: number) => void;
}

export default function GeneralTab({
  settings,
  handleColorChange,
  handleTextChange,
  handleProbabilityChange,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Colors Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🎨</span>
          Brand Colors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.colors.primary || "#ef4444"}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="h-12 w-20 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={settings.colors.primary || "#ef4444"}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="#ef4444"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.colors.secondary || "#f97316"}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                className="h-12 w-20 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={settings.colors.secondary || "#f97316"}
                  onChange={(e) => handleColorChange("secondary", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="#f97316"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Messages Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💬</span>
          Game Messages
        </h3>
        <div className="space-y-6">
          {["am", "en"].map((lang) => (
            <div key={lang} className="space-y-4">
              <h4 className="font-medium text-gray-700 flex items-center">
                <span className="mr-2">{lang === "am" ? "🇪🇹" : "🇺🇸"}</span>
                {lang.toUpperCase()} Messages
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["win", "lose"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field} Message
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows={3}
                      value={settings.texts[lang as "am" | "en"][field as "win" | "lose"] || ""}
                      onChange={(e) =>
                        handleTextChange(
                          lang as "am" | "en",
                          field as "win" | "lose",
                          e.target.value
                        )
                      }
                      placeholder={`Enter ${field} message in ${lang.toUpperCase()}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Winning Probability Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🎲</span>
          Winning Probability
        </h3>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min={10}
            max={90}
            step={1}
            value={Math.round((settings.winningProbability || 0) * 100)}
            onChange={(e) => handleProbabilityChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-14 text-right font-medium text-gray-700">
            {Math.round((settings.winningProbability || 0) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
} 