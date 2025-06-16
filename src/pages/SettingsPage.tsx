import { useEffect, useState, useRef } from 'react'
import { Settings, Prize } from '../types/settings'
import ToggleSwitch from '../components/ToggleSwitch'
import backPlayerSvg from '../assets/back-player-multimedia-svgrepo-com.svg'
import { Link } from '@tanstack/react-router'

const LOCAL_STORAGE_KEY = 'inad_settings'

const DEFAULT_SETTINGS: Settings = {
  prizes: [],
  colors: { primary: '', secondary: '' },
  images: { cap: null, header: null, banner: null },
  texts: {
    am: { win: '', lose: '' },
    en: { win: '', lose: '' },
  },
}

type PreviewMap = Record<string, string>

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<PreviewMap>({})
  const [activeTab, setActiveTab] = useState<'general' | 'images' | 'prizes'>('general')
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
 const [selectedFileName, setSelectedFileName] = useState<{ [key: string]: string }>({});

  // Load settings either from localStorage or remote
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Settings
        setSettings(parsed)
        setLoading(false)
        // preload image previews if prize.image exists
        const map: PreviewMap = {}
        parsed.prizes.forEach((p) => {
          if (p.image) map[p.id] = p.image
        })
        setPreviews(map)
        return
      } catch {
        // fallthrough to remote fetch
      }
    }

    fetchRemote()
  }, [])

  // Anytime settings change (after initial load), store them locally
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings))
    }
  }, [settings, loading])

  const fetchRemote = () => {
    setLoading(true)
    setError(null)
    fetch('/api/settings')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load settings')
        return r.json()
      })
      .then((data: Settings) => {
        setSettings(data)
        // preload image previews if prize.image exists
        const map: PreviewMap = {}
        data.prizes.forEach((p) => {
          if (p.image) map[p.id] = p.image
        })
        setPreviews(map)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  const handlePrizeChange = (index: number, field: keyof Prize, value: unknown) => {
    setSettings((prev) => {
      const prizes = [...prev.prizes]
      prizes[index] = { ...prizes[index], [field]: value }
      return { ...prev, prizes }
    })
  }

  const handleColorChange = (field: 'primary' | 'secondary', value: string) => {
    setSettings((prev) => ({ ...prev, colors: { ...prev.colors, [field]: value } }))
  }

  const handleTextChange = (
    lang: 'am' | 'en',
    field: 'win' | 'lose',
    value: string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      texts: { ...prev.texts, [lang]: { ...prev.texts[lang], [field]: value } },
    }))
  }

  const handleImageUpload = async (file: File, type: 'cap' | 'header' | 'banner') => {
    // local preview instantly
    setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }))

    const formData = new FormData()
    formData.append('file', file)
    formData.append('file_name', type)

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    // Update settings with the new image
    setSettings((prev) => ({
      ...prev,
      images: { ...prev.images, [type]: type }
    }))
  }

  const handlePrizeUpload = async (file: File, prizeId: string) => {
    // local preview instantly
    setPreviews((prev) => ({ ...prev, [prizeId]: URL.createObjectURL(file) }))

    const formData = new FormData()
    formData.append('file', file)
    formData.append('file_name', prizeId)

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to save')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="text-gray-700 font-medium">Loading settings...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-600 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Error Loading Settings</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="group">
                <div className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200">
                  <img src={backPlayerSvg} alt="Back" className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Back</span>
                </div>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
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
                Refresh
              </button>
          <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
                {saving ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Settings'
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
                { id: 'general', label: 'General', icon: '⚙️' },
                { id: 'images', label: 'Images', icon: '🖼️' },
                { id: 'prizes', label: 'Prizes', icon: '🏆' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            {activeTab === 'general' && (
              <div className="space-y-8">
                {/* Colors Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🎨</span>
                    Brand Colors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.colors.primary || '#ef4444'}
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="h-12 w-20 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={settings.colors.primary || '#ef4444'}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="#ef4444"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.colors.secondary || '#f97316'}
                          onChange={(e) => handleColorChange('secondary', e.target.value)}
                          className="h-12 w-20 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={settings.colors.secondary || '#f97316'}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
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
                    {(['am', 'en'] as const).map((lang) => (
                      <div key={lang} className="space-y-4">
                        <h4 className="font-medium text-gray-700 flex items-center">
                          <span className="mr-2">{lang === 'am' ? '🇪🇹' : '🇺🇸'}</span>
                          {lang.toUpperCase()} Messages
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(['win', 'lose'] as const).map((field) => (
                            <div key={field} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 capitalize">
                                {field} Message
                              </label>
                              <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                rows={3}
                                value={settings.texts[lang][field] || ''}
                                onChange={(e) => handleTextChange(lang, field, e.target.value)}
                                placeholder={`Enter ${field} message in ${lang.toUpperCase()}...`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Game Images</h3>
                  <p className="text-gray-600">Upload images for different parts of your game</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['cap', 'header', 'banner'] as const).map((type) => (
                    <div key={type} className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-400 transition-colors group">
                      <div className="text-center">
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 capitalize mb-2 flex items-center justify-center">
                            <span className="mr-2">
                              {type === 'cap' ? '🧢' : type === 'header' ? '📄' : '🎯'}
                            </span>
                            {type}
                          </h4>
                        </div>
                        
                        <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFileName((prev) => ({ ...prev, [type]: file.name }))
                      await handleImageUpload(file, type);
                    }
                  }}
                  ref={(el) => {
                    inputRefs.current[type] = el;
                  }}
                />
                          
                {previews[type] ? (
                            <div className="space-y-3">
                  <img
                    src={previews[type]}
                    alt={type}
                                className="w-32 h-32 object-cover rounded-lg mx-auto shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => inputRefs.current[type]?.click()}
                              />
                              <button
                                onClick={() => inputRefs.current[type]?.click()}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                              >
                                Change Image
                              </button>
                            </div>
                ) : (
                  <div
                              className="w-32 h-32 mx-auto flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all group-hover:scale-105"
                    onClick={() => inputRefs.current[type]?.click()}
                  >
                              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span className="text-sm text-gray-500 font-medium">Upload Image</span>
                  </div>
                )}
                </div>
                        
                        {selectedFileName[type] && (
                          <p className="text-xs text-gray-500 mt-2 truncate">
                            {selectedFileName[type]}
                          </p>
                        )}
              </div>
            </div>
          ))}
        </div>
              </div>
            )}

            {activeTab === 'prizes' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Prize Configuration</h3>
                  <p className="text-gray-600">Manage your game prizes and their settings</p>
          </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-red-600 to-red-700">
              <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Prize ID</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">Active</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
              </tr>
            </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
              {settings.prizes.map((prize, i) => (
                          <tr key={prize.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-mono font-medium text-gray-900 bg-gray-100 rounded px-2 py-1 inline-block">
                    {prize.id}
                              </div>
                  </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                    <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      value={prize.name}
                      onChange={(e) => handlePrizeChange(i, 'name', e.target.value)}
                                placeholder="Prize name..."
                    />
                  </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      value={prize.amount}
                      onChange={(e) => handlePrizeChange(i, 'amount', Number(e.target.value))}
                                placeholder="0"
                    />
                  </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                    <ToggleSwitch
                      checked={prize.isActive}
                      onChange={(value) => handlePrizeChange(i, 'isActive', value)}
                    />
                  </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFileName((prev) => ({ ...prev, [prize.id]: file.name }))
                            await handlePrizeUpload(file, prize.id);
                          }
                        }}
                        ref={(el) => {
                          inputRefs.current[prize.id] = el;
                        }}
                      />

                      {previews[prize.id] ? (
                        <img
                          src={previews[prize.id]}
                          alt="preview"
                                      className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity shadow-md"
                          onClick={() => inputRefs.current[prize.id]?.click()}
                        />
                      ) : (
                        <div
                                      className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all"
                          onClick={() => inputRefs.current[prize.id]?.click()}
                        >
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                      </svg>
                        </div>
                      )}
                                </div>

                                <div className="text-xs text-gray-500">
                                  {selectedFileName[prize.id] ? (
                                    <span className="text-green-600 font-medium">✓ Uploaded</span>
                                  ) : (
                                    'No image'
                                  )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 