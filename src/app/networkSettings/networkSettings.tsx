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

const NetworkSettingsSection: FC = () => {
  const { networkData, setNetworkData, updateNetworkData } = useNetworkState();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_URL = "http://5.57.32.82:8080/controller/network/fc796798fac7d37c";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await NetworkDataFetcher();
      if (typeof result === "string") {
        setError(result);
        setNetworkData(null);
      } else {
        setNetworkData(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
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

  const updateArrayItem = <T,>(arr: T[] | undefined, index: number, value: T): T[] => {
    return (arr || []).map((item, i) => (i === index ? value : item));
  };

  const sendData = useCallback(async () => {
    if (!networkData) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(networkData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSuccess("Saved successfully");
      setNetworkData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [networkData, setNetworkData]);

  if (!networkData && loading) {
    return <div>Loading...</div>;
  }

  if (!networkData && !loading) {
    return <div>No data available</div>;
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
        <Button
          onClick={sendData}
          disabled={saving || loading || !networkData}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      {networkData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicsSection
            networkData={networkData}
            updateField={updateField}
          />
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

