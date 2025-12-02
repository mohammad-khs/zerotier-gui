import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkData } from "@/types/networkData";
import { FC } from "react";

interface RulesSectionProps {
  networkData: Partial<NetworkData>;
  updateField: <K extends keyof NetworkData>(
    key: K,
    value: NetworkData[K]
  ) => void;
  updateArrayItem: <T>(arr: T[] | undefined, index: number, value: T) => T[];
}

const RulesSection: FC<RulesSectionProps> = ({
  networkData,
  updateField,
  updateArrayItem,
}) => {
  if (!networkData) return null;

  return (
    <div className="bg-card rounded-lg p-4 border">
      <h3 className="text-lg font-semibold mb-3">Rules</h3>
      <div className="space-y-4">
        <div className="space-y-3">
          {(networkData.rules || []).map((rule, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <label className="col-span-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!rule.not}
                  onChange={(e) =>
                    updateField(
                      "rules",
                      updateArrayItem(networkData.rules, i, {
                        ...rule,
                        not: e.target.checked,
                      })
                    )
                  }
                />
                not
              </label>
              <label className="col-span-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!rule.or}
                  onChange={(e) =>
                    updateField(
                      "rules",
                      updateArrayItem(networkData.rules, i, {
                        ...rule,
                        or: e.target.checked,
                      })
                    )
                  }
                />
                or
              </label>
              <div className="col-span-4">
                <Input
                  value={rule.type}
                  onChange={(e) =>
                    updateField(
                      "rules",
                      updateArrayItem(networkData.rules, i, {
                        ...rule,
                        type: e.target.value,
                      })
                    )
                  }
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="col-span-2"
                onClick={() =>
                  updateField(
                    "rules",
                    (networkData.rules || []).filter((_, idx) => idx !== i)
                  )
                }
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateField("rules", [
                ...(networkData.rules || []),
                { not: false, or: false, type: "" },
              ])
            }
            disabled={(networkData.rules || []).some((r) => !r.type?.trim())}
          >
            + Add rule
          </Button>
        </div>
        <div>
          <label className="text-sm font-medium">Rules source</label>
          <textarea
            className="mt-1 w-full bg-background border border-input rounded px-3 py-2 h-24"
            value={networkData.rulesSource || ""}
            onChange={(e) => updateField("rulesSource", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RulesSection;
