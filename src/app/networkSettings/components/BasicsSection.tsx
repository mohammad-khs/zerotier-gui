import { Input } from "@/components/ui/input";
import { NetworkData } from "@/types/networkData";
import { FC } from "react";

interface BasicsSectionProps {
  networkData: Partial<NetworkData> | null;
  updateField: <K extends keyof NetworkData>(
    key: K,
    value: NetworkData[K]
  ) => void;
}

const BasicsSection: FC<BasicsSectionProps> = ({ networkData, updateField }) => {
  if (!networkData) return null;

  return (
    <div className="bg-card rounded-lg p-4 border">
      <h3 className="text-lg font-semibold mb-3">Basics</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            value={networkData.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Network name"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">MTU</label>
            <Input
              type="number"
              value={networkData.mtu || 0}
              onChange={(e) => updateField("mtu", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Multicast limit</label>
            <Input
              type="number"
              value={networkData.multicastLimit || 0}
              onChange={(e) =>
                updateField("multicastLimit", Number(e.target.value))
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!networkData.enableBroadcast}
              onChange={(e) =>
                updateField("enableBroadcast", e.target.checked)
              }
            />
            Enable broadcast
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!networkData.private}
              onChange={(e) => updateField("private", e.target.checked)}
            />
            Private
          </label>
        </div>
        <div>
          <label className="text-sm font-medium">Authorization endpoint</label>
          <Input
            value={networkData.authorizationEndpoint || ""}
            onChange={(e) =>
              updateField("authorizationEndpoint", e.target.value)
            }
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="text-sm font-medium">Client ID</label>
          <Input
            value={networkData.clientId || ""}
            onChange={(e) => updateField("clientId", e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!networkData.ssoEnabled}
            onChange={(e) => updateField("ssoEnabled", e.target.checked)}
          />
          SSO enabled
        </label>
      </div>
    </div>
  );
};

export default BasicsSection;