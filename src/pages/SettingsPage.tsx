import { useEffect, useState } from "react";
import back from '../assets/back.svg'
import { Link } from "@tanstack/react-router";
import GeneralTab from "../components/settings/GeneralTab";
import ImagesTab from "../components/settings/ImagesTab";
import PrizesTab from "../components/settings/PrizesTab";
import { DEFAULT_SETTINGS, Settings } from "../../worker/helpers";
import { getSettingsFromDB, saveSettingsToDB } from "../utils/db";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "images" | "prizes">(
    "general"
  );

  // Load settings either from IndexedDB or remote
  useEffect(() => {
    (async () => {
      try {
        const stored = await getSettingsFromDB();
        if (stored) {
          setSettings(stored);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to read settings from IndexedDB", err);
      }

      // Fallback to remote fetch if nothing in DB
      fetchRemote();
    })();
  }, []);

  // Anytime settings change (after initial load), store them locally
  useEffect(() => {
    if (!loading) {
      saveSettingsToDB(settings);
    }
  }, [settings, loading]);

  const fetchRemote = () => {
    setLoading(true);
    setError(null);
    fetch("/api/settings")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load settings");
        return r.json();
      })
      .then((data: Settings) => {
        setSettings(data);
        saveSettingsToDB(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handlePrizeChange = (
    index: number,
    field: keyof Settings["prizes"][number],
    value: unknown
  ) => {
    setSettings((prev) => {
      const prizes = [...prev.prizes];
      prizes[index] = { ...prizes[index], [field]: value };
      return { ...prev, prizes };
    });
  };

  const handleColorChange = (field: "primary" | "secondary", value: string) => {
    setSettings((prev) => ({
      ...prev,
      colors: { ...prev.colors, [field]: value },
    }));
  };

  const handleProbabilityChange = (percent: number) => {
    // Convert percentage (10-90) to decimal (0.1-0.9)
    const clamped = Math.max(10, Math.min(90, percent));
    setSettings((prev) => ({ ...prev, winningProbability: clamped / 100 }));
  };

  const handleTextChange = (
    lang: "am" | "en",
    field: "win" | "lose",
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      texts: { ...prev.texts, [lang]: { ...prev.texts[lang], [field]: value } },
    }));
  };

  const handleImageUpload = (
    type: keyof Settings["base64Images"],
    base64: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      base64Images: { ...prev.base64Images, [type]: base64 },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#242021]"></div>
          <span className="text-gray-700 font-medium">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-[#242021] text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Error Loading Settings</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="group">
                <div className="flex items-center space-x-2 text-gray-600 group-hover:opacity-50 transition-colors duration-200">
                  <img
                    src={back}
                    alt="Back"
                    className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                  />
                  <span className="font-medium">Back</span>
                </div>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-[#242021]">
                Game Settings
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {error && (
                <div className="text-red-600 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
                  {error}
                </div>
              )}
              <button
                onClick={fetchRemote}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                Load From Server
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-[#242021] text-white rounded-lg hover:bg-[#2a2526] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Pushing...</span>
                  </div>
                ) : (
                  "Push to Server"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "general", label: "General", icon: "⚙️" },
                { id: "images", label: "Images", icon: "🖼️" },
                { id: "prizes", label: "Prizes", icon: "🏆" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-[#242021] text-[#242021]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "general" && (
              <GeneralTab
                settings={settings}
                handleColorChange={handleColorChange}
                handleTextChange={handleTextChange}
                handleProbabilityChange={handleProbabilityChange}
              />
            )}

            {activeTab === "images" && (
              <ImagesTab
                settings={settings}
                handleImageUpload={handleImageUpload}
              />
            )}

            {activeTab === "prizes" && (
              <PrizesTab
                settings={settings}
                handlePrizeChange={handlePrizeChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
