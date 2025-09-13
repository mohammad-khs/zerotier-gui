"use client";

import { Button } from "@/components/ui/button";
import BasicsSection from "./components/BasicsSection";
import AddressingSection from "./components/AddressingSection";
import RulesSection from "./components/RulesSection";
import AdvancedSection from "./components/AdvancedSection";
import IdentifiersSection from "./components/IdentifiersSection";
import AuthSection from "./components/AuthSection";
import NetworkDataFetcher from "@/hooks/NetworkDataFetcher";
import { useNetworkState } from "@/stores/store";
import { NetworkData } from "@/types/networkData";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const NetworkSettingsSection: FC = () => {
  const { networkData, setNetworkData, updateNetworkData } = useNetworkState();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const API_URL = `http://5.57.32.82:8080/controller/network/${process.env.NEXT_PUBLIC_NETWORK_ID}`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await NetworkDataFetcher();
      if (typeof result === "string") {
        toast.error(result);
        setNetworkData(null);
      } else {
        setNetworkData(result);
      }
    } catch (e) {
      toast.error("An unexpected error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [setNetworkData]);

  useEffect(() => {
    if (!networkData) {
      fetchData();
    }
  }, [networkData, fetchData]);

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

  if (!networkData && loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="transition-all animate-spin h-20 w-20" />
      </div>
    );
  }

  if (!networkData && !loading) {
    return <div className="text-yellow-500 text-2xl">No data available...</div>;
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-4xl">Network Settings</h1>
        <Button
          className="ml-auto"
          variant="outline"
          onClick={fetchData}
          disabled={loading || saving}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
        <Button onClick={sendData} disabled={saving || loading || !networkData}>
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
