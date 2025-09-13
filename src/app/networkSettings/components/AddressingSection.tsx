import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkData } from "@/types/networkData";
import { FC } from "react";

interface AddressingSectionProps {
  networkData?: Partial<NetworkData>;
  updateField: <K extends keyof NetworkData>(
    key: K,
    value: NetworkData[K]
  ) => void;
  updateArrayItem: <T>(arr: T[] | undefined, index: number, value: T) => T[];
}

const AddressingSection: FC<AddressingSectionProps> = ({
  networkData,
  updateField,
  updateArrayItem,
}) => {
  if (!networkData) return null;

  return (
    <div className="bg-card rounded-lg p-4 border">
      <h3 className="text-lg font-semibold mb-3">Addressing</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            IP assignment pools
          </label>
          <div className="space-y-3">
            {(networkData.ipAssignmentPools || []).map((p, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Input
                    placeholder="Start"
                    value={p.ipRangeStart}
                    onChange={(e) =>
                      updateField(
                        "ipAssignmentPools",
                        updateArrayItem(networkData.ipAssignmentPools, i, {
                          ...p,
                          ipRangeStart: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    placeholder="End"
                    value={p.ipRangeEnd}
                    onChange={(e) =>
                      updateField(
                        "ipAssignmentPools",
                        updateArrayItem(networkData.ipAssignmentPools, i, {
                          ...p,
                          ipRangeEnd: e.target.value,
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
                      "ipAssignmentPools",
                      (networkData.ipAssignmentPools || []).filter(
                        (_, idx) => idx !== i
                      )
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateField("ipAssignmentPools", [
                  ...(networkData.ipAssignmentPools || []),
                  { ipRangeStart: "", ipRangeEnd: "" },
                ])
              }
            >
              + Add pool
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Routes</label>
          <div className="space-y-3">
            {(networkData.routes || []).map((r, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-6">
                  <Input
                    placeholder="Target"
                    value={r.target}
                    onChange={(e) =>
                      updateField(
                        "routes",
                        updateArrayItem(networkData.routes, i, {
                          ...r,
                          target: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    placeholder="Via"
                    value={r.via ?? ""}
                    onChange={(e) =>
                      updateField(
                        "routes",
                        updateArrayItem(networkData.routes, i, {
                          ...r,
                          via: e.target.value || null,
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
                      "routes",
                      (networkData.routes || []).filter((_, idx) => idx !== i)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateField("routes", [
                  ...(networkData.routes || []),
                  { target: "", via: null },
                ])
              }
            >
              + Add route
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">DNS servers</label>
          <div className="space-y-3">
            {(networkData.dns || []).map((d, i) => (
              <div key={i} className="flex items-end gap-2">
                <Input
                  className="flex-1"
                  value={d}
                  onChange={(e) =>
                    updateField(
                      "dns",
                      updateArrayItem(networkData.dns, i, e.target.value)
                    )
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    updateField(
                      "dns",
                      (networkData.dns || []).filter((_, idx) => idx !== i)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateField("dns", [...(networkData.dns || []), ""])
              }
            >
              + Add DNS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressingSection;
