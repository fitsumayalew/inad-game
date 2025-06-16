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

  if (loading) return <div className="p-4">Loading settings…</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="p-4 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center">
        <Link to="/" className="block">
          <button
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 -ml-20 cursor-pointer"
          >
            <img src={backPlayerSvg} alt="Back" className="w-7 h-7" />
          </button>
        </Link>
        <h1 className="text-2xl font-bold">Game Settings</h1>
      </div>

      {/* Images */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Images</h2>
        <div className="grid grid-cols-3 gap-4">
          {(['cap', 'header', 'banner'] as const).map((type) => (
            <div key={type} className="flex flex-col gap-2">
              <label className="text-sm capitalize">{type}</label>
              <div className="flex items-center gap-2 relative">
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
                  <img
                    src={previews[type]}
                    alt={type}
                    className="w-24 h-24 object-cover rounded"
                    onClick={() => inputRefs.current[type]?.click()}
                    title="Click to change the image"
                  />
                ) : (
                  <div
                    className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded text-gray-400 text-xl leading-none cursor-pointer"
                    onClick={() => inputRefs.current[type]?.click()}
                    title="Click to upload image"
                  >
                    +
                  </div>
                )}
                <div className="text-sm text-gray-700">
                  {selectedFileName[type] ? 'Change the file' : 'Choose a file'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Colors</h2>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label className="text-sm">Primary</label>
            <input
              type="color"
              value={settings.colors.primary || '#ffffff'}
              onChange={(e) => handleColorChange('primary', e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm">Secondary</label>
            <input
              type="color"
              value={settings.colors.secondary || '#ffffff'}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Texts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Texts</h2>
        {(['am', 'en'] as const).map((lang) => (
          <div key={lang} className="grid grid-cols-2 gap-4">
            {(['win', 'lose'] as const).map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm capitalize">
                  {lang.toUpperCase()} {field}
                </label>
                <input
                  type="text"
                  className="border p-1 rounded"
                  value={settings.texts[lang][field] || ''}
                  onChange={(e) => handleTextChange(lang, field, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Prizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Prizes</h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Image</th>
              </tr>
            </thead>
            <tbody>
              {settings.prizes.map((prize, i) => (
                <tr key={prize.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                  <td className="px-4 py-2 align-middle text-center font-mono text-xs">
                    {prize.id}
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <input
                      className="w-full border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-red-600"
                      value={prize.name}
                      onChange={(e) => handlePrizeChange(i, 'name', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-red-600"
                      value={prize.amount}
                      onChange={(e) => handlePrizeChange(i, 'amount', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-4 py-2 align-middle text-center">
                    <ToggleSwitch
                      checked={prize.isActive}
                      onChange={(value) => handlePrizeChange(i, 'isActive', value)}
                    />
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <div className="flex items-center gap-2 relative">
                      {/* Hidden file input */}
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

                      {/* Preview or + Button */}
                      {previews[prize.id] ? (
                        <img
                          src={previews[prize.id]}
                          alt="preview"
                          className="w-12 h-12 object-cover rounded"
                          onClick={() => inputRefs.current[prize.id]?.click()}
                          title="Click to change the image"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-300 rounded text-gray-400 text-xl leading-none cursor-pointer"
                          onClick={() => inputRefs.current[prize.id]?.click()}
                          title="Click to upload image"
                        >
                          +
                        </div>
                      )}

                      {/* Custom label and file name */}
                      <div className="text-sm text-gray-700">
                        {selectedFileName[prize.id]
                          ? `Change the file`
                          : 'Choose a file'}
                      </div>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-4">
        <button
          className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? 'Pushing..' : 'Push Settings to Server'}
        </button>
        <button
          type="button"
          className="border border-gray-400 hover:bg-gray-100 font-semibold py-2 px-6 rounded"
          onClick={fetchRemote}
        >
          Refresh from Server
        </button>
        {error && <span className="text-red-600">{error}</span>}
      </div>
    </div>
  )
} 