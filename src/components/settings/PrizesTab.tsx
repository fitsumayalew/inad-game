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
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
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
                <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider ">
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
                      min={0}
                      max={1000}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      value={prize.amount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const clamped = Math.max(0, Math.min(1000, val));
                        handlePrizeChange(i, "amount", clamped);
                      }}
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
                  <td className=" w-128 px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-center space-y-1">
                      <ImageUpload
                        fileKey={prize.id}
                        previewUrl={prize.base64image || undefined}
                        onComplete={(base64) =>
                          handlePrizeChange(i, "base64image", base64)
                        }
                      />
                      <span className="text-[11px] text-gray-400 mt-1">Max 400×400px</span>
                    </div>
                    <div className="flex flex-col space-y-1  items-center">
                      {prize.base64image ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handlePrizeChange(i, "base64image", null)
                            }
                            className="text-red-600 hover:text-red-700 hover:underline text-xs font-medium"
                          >
                            Remove image
                          </button>
                          <span className="text-gray-400 text-xs">
                            Click image to change
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500 text-xs">No image</span>
                      )}
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