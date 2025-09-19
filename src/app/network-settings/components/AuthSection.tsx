import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkData } from "@/types/networkData";
import { FC } from "react";

interface AuthSectionProps {
  networkData: Partial<NetworkData>;
  updateField: <K extends keyof NetworkData>(
    key: K,
    value: NetworkData[K]
  ) => void;
  updateArrayItem: <T,>(arr: T[] | undefined, index: number, value: T) => T[];
}

const AuthSection: FC<AuthSectionProps> = ({
  networkData,
  updateField,
  updateArrayItem,
}) => {
  if (!networkData) return null;

  return (
    <div className="bg-card rounded-lg p-4 border">
      <h3 className="text-lg font-semibold mb-3">Auth Tokens</h3>
      <div className="space-y-3">
        {(networkData.authTokens || []).map((t, i) => (
          <div key={i} className="flex items-end gap-2">
            <Input
              className="flex-1"
              value={t ?? ""}
              onChange={(e) =>
                updateField(
                  "authTokens",
                  updateArrayItem(
                    networkData.authTokens,
                    i,
                    e.target.value || null
                  )
                )
              }
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                updateField(
                  "authTokens",
                  (networkData.authTokens || []).filter((_, idx) => idx !== i)
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
            updateField("authTokens", [
              ...(networkData.authTokens || []),
              null,
            ])
          }
        >
          + Add token
        </Button>
      </div>
    </div>
  );
};

export default AuthSection;