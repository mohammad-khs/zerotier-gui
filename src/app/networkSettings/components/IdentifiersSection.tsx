import { Input } from "@/components/ui/input";
import { NetworkData } from "@/types/networkData";
import { FC } from "react";

interface IdentifiersSectionProps {
  networkData: Partial<NetworkData>;
  updateField: <K extends keyof NetworkData>(
    key: K,
    value: NetworkData[K]
  ) => void;
}

const IdentifiersSection: FC<IdentifiersSectionProps> = ({ networkData, updateField }) => {
  if (!networkData) return null;

  return (
    <div className="bg-card rounded-lg p-4 border">
      <h3 className="text-lg font-semibold mb-3">Identifiers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">ID</label>
          <Input
            value={networkData.id || ""}
            onChange={(e) => updateField("id", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Network ID (nwid)</label>
          <Input
            value={networkData.nwid || ""}
            onChange={(e) => updateField("nwid", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Object type</label>
          <Input
            value={networkData.objtype || ""}
            onChange={(e) => updateField("objtype", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Creation time (ms)</label>
          <Input
            type="number"
            value={networkData.creationTime || 0}
            onChange={(e) =>
              updateField("creationTime", Number(e.target.value))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Revision</label>
          <Input
            type="number"
            value={networkData.revision || 0}
            onChange={(e) =>
              updateField("revision", Number(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default IdentifiersSection;