import { Prize, Settings } from "../../../worker/helpers";
import ToggleSwitch from "../ToggleSwitch";
import ImageUpload from "../ImageUpload";

interface Props {
  settings: Settings;
  handlePrizeChange: (
    index: number,
    field: keyof Settings["prizes"][number],
    value: unknown
  ) => void;
}

export default function PrizesTab({
  settings,
  handlePrizeChange,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Prize Configuration
        </h3>
        <p className="text-gray-600">
          Manage your game prizes and their settings
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-red-600 to-red-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Prize ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Image
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {settings.prizes.map((prize: Prize, i: number) => (
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
                      onChange={(e) =>
                        handlePrizeChange(i, "name", e.target.value)
                      }
                      placeholder="Prize name..."
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      value={prize.amount}
                      onChange={(e) =>
                        handlePrizeChange(i, "amount", Number(e.target.value))
                      }
                      placeholder="0"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <ToggleSwitch
                      checked={prize.isActive}
                      onChange={(value) =>
                        handlePrizeChange(i, "isActive", value)
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <ImageUpload
                        fileKey={prize.id}
                        previewUrl={prize.base64image || undefined}
                        onComplete={(base64) =>
                          handlePrizeChange(i, "base64image", base64)
                        }
                      />
                      <div className="text-xs text-gray-500">
                        {prize.base64image ? (
                          <span className="text-green-600 font-medium">
                            ✓ Uploaded
                          </span>
                        ) : (
                          "No image"
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
  );
} 