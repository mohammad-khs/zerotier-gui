"use client";

import { Button } from "@/components/ui/button";
import BasicsSection from "./components/BasicsSection";
import AddressingSection from "./components/AddressingSection";
import RulesSection from "./components/RulesSection";
import AdvancedSection from "./components/AdvancedSection";
import IdentifiersSection from "./components/IdentifiersSection";
import AuthSection from "./components/AuthSection";
import { useNetworkState } from "@/stores/store";
import { NetworkData } from "@/types/networkData";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface NetworkSettingsSectionProps {
  fetchedNetworkData: NetworkData;
  networkId: string
}

const NetworkSettingsSection: FC<NetworkSettingsSectionProps> = ({networkId,
  fetchedNetworkData,
}) => {
  const { networkData, setNetworkData, updateNetworkData } = useNetworkState();

  const [saving, setSaving] = useState(false);

  const API_URL = `http://5.57.32.82:8080/controller/network/${networkId}`;

  useEffect(() => {
    setNetworkData(fetchedNetworkData);
  }, [fetchedNetworkData]);

  const updateField = <K extends keyof NetworkData>(
    key: K,
    value: NetworkData[K]
  ) => {
    updateNetworkData({ [key]: value });
  };

  const updateArrayItem = <T,>(
    arr: T[] | undefined,
    index: number,
    value: T
  ): T[] => {
    return (arr || []).map((item, i) => (i === index ? value : item));
  };

  const sendData = useCallback(async () => {
    if (!networkData) return;
    setSaving(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(networkData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      toast.success("Network settings saved successfully!");
      setNetworkData(json);
    } catch (e) {
      toast.error("Failed to save network settings.");
    } finally {
      setSaving(false);
    }
  }, [networkData, setNetworkData]);

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-4xl">Network Settings</h1>
        <Button onClick={sendData} disabled={saving || !networkData}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {networkData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicsSection networkData={networkData} updateField={updateField} />
          <AddressingSection
            networkData={networkData}
            updateField={updateField}
            updateArrayItem={updateArrayItem}
          />
          <RulesSection
            networkData={networkData}
            updateField={updateField}
            updateArrayItem={updateArrayItem}
          />
          <AdvancedSection
            networkData={networkData}
            updateField={updateField}
          />
          <IdentifiersSection
            networkData={networkData}
            updateField={updateField}
          />
          <AuthSection
            networkData={networkData}
            updateField={updateField}
            updateArrayItem={updateArrayItem}
          />
        </div>
      )}
    </div>
  );
};

export default NetworkSettingsSection;
