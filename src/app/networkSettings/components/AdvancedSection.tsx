import { Input } from "@/components/ui/input";
import { NetworkData } from "@/types/networkData";
import { FC } from "react";

interface AdvancedSectionProps {
  networkData: Partial<NetworkData>;
  updateField: <K extends keyof NetworkData>(
    key: K,
    value: NetworkData[K]
  ) => void;
}

const AdvancedSection: FC<AdvancedSectionProps> = ({ networkData, updateField }) => {
  if (!networkData) return null;

  return (
    <div className="bg-card rounded-lg p-4 border">
      <h3 className="text-lg font-semibold mb-3">Advanced</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Capabilities (comma separated)</label>
          <Input
            value={(networkData.capabilities || []).join(", ")}
            onChange={(e) =>
              updateField(
                "capabilities",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tags (comma separated)</label>
          <Input
            value={(networkData.tags || []).join(", ")}
            onChange={(e) =>
              updateField(
                "tags",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Remote trace level</label>
            <Input
              type="number"
              value={networkData.remoteTraceLevel || 0}
              onChange={(e) =>
                updateField("remoteTraceLevel", Number(e.target.value))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Remote trace target</label>
            <Input
              value={networkData.remoteTraceTarget ?? ""}
              onChange={(e) =>
                updateField("remoteTraceTarget", e.target.value || null)
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">IPv4 assign mode</label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!networkData.v4AssignMode?.zt}
                onChange={(e) =>
                  updateField("v4AssignMode", {
                    ...(networkData.v4AssignMode || { zt: false }),
                    zt: e.target.checked,
                  })
                }
              />
              zt
            </label>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">IPv6 assign mode</label>
            {Object.entries(
              networkData.v6AssignMode || {
                "6plane": false,
                rfc4193: false,
                zt: false,
              }
            ).map(([k, v]) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!v}
                  onChange={(e) =>
                    updateField("v6AssignMode", {
                      ...(networkData.v6AssignMode || {}),
                      [k]: e.target.checked,
                    })
                  }
                />
                {k}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSection;