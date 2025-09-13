"use client";
import { Button } from "@/components/ui/button";
import { FC, useCallback, useEffect, useState } from "react";

interface IpAssignmentPool {
  ipRangeStart: string;
  ipRangeEnd: string;
}

interface RouteEntry {
  target: string;
  via: string | null;
}

interface RuleEntry {
  not: boolean;
  or: boolean;
  type: string;
}

interface AssignModeV4 {
  zt: boolean;
}

interface AssignModeV6 {
  [key: string]: boolean;
}

interface NetworkData {
  authTokens: (string | null)[];
  authorizationEndpoint: string;
  capabilities: string[];
  clientId: string;
  creationTime: number;
  dns: string[];
  enableBroadcast: boolean;
  id: string;
  ipAssignmentPools: IpAssignmentPool[];
  mtu: number;
  multicastLimit: number;
  name: string;
  nwid: string;
  objtype: string;
  private: boolean;
  remoteTraceLevel: number;
  remoteTraceTarget: string | null;
  revision: number;
  routes: RouteEntry[];
  rules: RuleEntry[];
  rulesSource: string;
  ssoEnabled: boolean;
  tags: string[];
  v4AssignMode: AssignModeV4;
  v6AssignMode: AssignModeV6;
}

interface PostDataProps {
  responseData?: Partial<NetworkData> | null;
}

const PostData: FC<PostDataProps> = ({ responseData }) => {
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const networkId = process.env.NEXT_PUBLIC_NETWORK_ID;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `http://5.57.32.82:8080/controller/network/${networkId}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json as NetworkData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [networkId]);
  
  useEffect(() => {
    if (responseData && Object.keys(responseData).length > 0) {
      setData((prev) => ({
        ...(prev as NetworkData),
        ...(responseData as any),
      }));
    } else {
      fetchData();
    }
  }, [responseData, fetchData]);

  const updateField = <K extends keyof NetworkData>(
    key: K,
    value: NetworkData[K]
  ) => {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateArrayItem = <T,>(arr: T[], index: number, value: T): T[] => {
    return arr.map((item, i) => (i === index ? value : item));
  };

  const sendData = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `http://5.57.32.82:8080/controller/network/${networkId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSuccess("Saved successfully");
      setData(json as NetworkData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [data, networkId]);

  return (
    <section className="container mx-auto my-8 px-4">
      <div className="mb-6 flex items-center gap-3">
        <h2 className=" text-2xl font-semibold">Network Settings</h2>
        <Button
          className="ml-auto"
          variant={"blue"}
          onClick={fetchData}
          disabled={loading || saving}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
        <Button
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-lg px-4 py-2"
          onClick={sendData}
          disabled={saving || loading || !data}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {error && <div className="text-red-400 mb-4">{error}</div>}
      {success && <div className="text-green-400 mb-4">{success}</div>}

      {!data ? (
        <div className="text-white">{loading ? "Loading..." : "No data"}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700">
            <h3 className="text-white text-lg mb-3">Basics</h3>
            <div className="space-y-3">
              <label className="block text-sm text-zinc-300">
                Name
                <input
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={data.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Network name"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm text-zinc-300">
                  MTU
                  <input
                    type="number"
                    className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                    value={Number(data.mtu) || 0}
                    onChange={(e) => updateField("mtu", Number(e.target.value))}
                  />
                </label>
                <label className="block text-sm text-zinc-300">
                  Multicast limit
                  <input
                    type="number"
                    className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                    value={Number(data.multicastLimit) || 0}
                    onChange={(e) =>
                      updateField("multicastLimit", Number(e.target.value))
                    }
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={!!data.enableBroadcast}
                    onChange={(e) =>
                      updateField("enableBroadcast", e.target.checked)
                    }
                  />
                  Enable broadcast
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={!!data.private}
                    onChange={(e) => updateField("private", e.target.checked)}
                  />
                  Private
                </label>
              </div>
              <label className="block text-sm text-zinc-300">
                Authorization endpoint
                <input
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={data.authorizationEndpoint || ""}
                  onChange={(e) =>
                    updateField("authorizationEndpoint", e.target.value)
                  }
                  placeholder="https://..."
                />
              </label>
              <label className="block text-sm text-zinc-300">
                Client ID
                <input
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={data.clientId || ""}
                  onChange={(e) => updateField("clientId", e.target.value)}
                />
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={!!data.ssoEnabled}
                  onChange={(e) => updateField("ssoEnabled", e.target.checked)}
                />
                SSO enabled
              </label>
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700">
            <h3 className="text-white text-lg mb-3">Addressing</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-zinc-300 mb-2">
                  IP assignment pools
                </div>
                <div className="space-y-3">
                  {data.ipAssignmentPools?.map((p, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <label className="block text-xs text-zinc-300">
                          Start
                          <input
                            className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                            value={p.ipRangeStart}
                            onChange={(e) =>
                              updateField(
                                "ipAssignmentPools",
                                updateArrayItem(data.ipAssignmentPools, i, {
                                  ...p,
                                  ipRangeStart: e.target.value,
                                })
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs text-zinc-300">
                          End
                          <input
                            className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                            value={p.ipRangeEnd}
                            onChange={(e) =>
                              updateField(
                                "ipAssignmentPools",
                                updateArrayItem(data.ipAssignmentPools, i, {
                                  ...p,
                                  ipRangeEnd: e.target.value,
                                })
                              )
                            }
                          />
                        </label>
                      </div>
                      <Button
                        className="col-span-2 bg-rose-600 hover:bg-rose-500 text-white rounded px-3 py-2"
                        onClick={() =>
                          updateField(
                            "ipAssignmentPools",
                            data.ipAssignmentPools.filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    className="bg-zinc-600 hover:bg-zinc-500 text-white rounded px-3 py-2"
                    onClick={() =>
                      updateField("ipAssignmentPools", [
                        ...(data.ipAssignmentPools || []),
                        { ipRangeStart: "", ipRangeEnd: "" },
                      ])
                    }
                  >
                    + Add pool
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm text-zinc-300 mb-2">Routes</div>
                <div className="space-y-3">
                  {data.routes?.map((r, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-6">
                        <label className="block text-xs text-zinc-300">
                          Target
                          <input
                            className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                            value={r.target}
                            onChange={(e) =>
                              updateField(
                                "routes",
                                updateArrayItem(data.routes, i, {
                                  ...r,
                                  target: e.target.value,
                                })
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs text-zinc-300">
                          Via
                          <input
                            className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                            value={r.via ?? ""}
                            onChange={(e) =>
                              updateField(
                                "routes",
                                updateArrayItem(data.routes, i, {
                                  ...r,
                                  via: e.target.value || null,
                                })
                              )
                            }
                          />
                        </label>
                      </div>
                      <Button
                        className="col-span-2 bg-rose-600 hover:bg-rose-500 text-white rounded px-3 py-2"
                        onClick={() =>
                          updateField(
                            "routes",
                            data.routes.filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    className="bg-zinc-600 hover:bg-zinc-500 text-white rounded px-3 py-2"
                    onClick={() =>
                      updateField("routes", [
                        ...(data.routes || []),
                        { target: "", via: null },
                      ])
                    }
                  >
                    + Add route
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm text-zinc-300 mb-2">DNS servers</div>
                <div className="space-y-3">
                  {data.dns?.map((d, i) => (
                    <div key={i} className="flex items-end gap-2">
                      <input
                        className="flex-1 bg-zinc-100 text-black rounded px-3 py-2"
                        value={d}
                        onChange={(e) =>
                          updateField(
                            "dns",
                            updateArrayItem(data.dns, i, e.target.value)
                          )
                        }
                      />
                      <Button
                        className="bg-rose-600 hover:bg-rose-500 text-white rounded px-3 py-2"
                        onClick={() =>
                          updateField(
                            "dns",
                            data.dns.filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    className="bg-zinc-600 hover:bg-zinc-500 text-white rounded px-3 py-2"
                    onClick={() =>
                      updateField("dns", [...(data.dns || []), ""])
                    }
                  >
                    + Add DNS
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700">
            <h3 className="text-white text-lg mb-3">Rules</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                {data.rules?.map((rule, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-end">
                    <label className="col-span-4 inline-flex items-center gap-2 text-sm text-zinc-300">
                      <input
                        type="checkbox"
                        checked={!!rule.not}
                        onChange={(e) =>
                          updateField(
                            "rules",
                            updateArrayItem(data.rules, i, {
                              ...rule,
                              not: e.target.checked,
                            })
                          )
                        }
                      />
                      not
                    </label>
                    <label className="col-span-4 inline-flex items-center gap-2 text-sm text-zinc-300">
                      <input
                        type="checkbox"
                        checked={!!rule.or}
                        onChange={(e) =>
                          updateField(
                            "rules",
                            updateArrayItem(data.rules, i, {
                              ...rule,
                              or: e.target.checked,
                            })
                          )
                        }
                      />
                      or
                    </label>
                    <div className="col-span-4">
                      <input
                        className="w-full bg-zinc-100 text-black rounded px-3 py-2"
                        value={rule.type}
                        onChange={(e) =>
                          updateField(
                            "rules",
                            updateArrayItem(data.rules, i, {
                              ...rule,
                              type: e.target.value,
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  className="bg-zinc-600 hover:bg-zinc-500 text-white rounded px-3 py-2"
                  onClick={() =>
                    updateField("rules", [
                      ...(data.rules || []),
                      { not: false, or: false, type: "" },
                    ])
                  }
                >
                  + Add rule
                </Button>
              </div>
              <label className="block text-sm text-zinc-300">
                Rules source
                <textarea
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2 h-24"
                  value={data.rulesSource || ""}
                  onChange={(e) => updateField("rulesSource", e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700">
            <h3 className="text-white text-lg mb-3">Advanced</h3>
            <div className="space-y-3">
              <label className="block text-sm text-zinc-300">
                Capabilities (comma separated)
                <input
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={(data.capabilities || []).join(", ")}
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
              </label>
              <label className="block text-sm text-zinc-300">
                Tags (comma separated)
                <input
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={(data.tags || []).join(", ")}
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
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm text-zinc-300">
                  Remote trace level
                  <input
                    type="number"
                    className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                    value={Number(data.remoteTraceLevel) || 0}
                    onChange={(e) =>
                      updateField("remoteTraceLevel", Number(e.target.value))
                    }
                  />
                </label>
                <label className="block text-sm text-zinc-300">
                  Remote trace target
                  <input
                    className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                    value={data.remoteTraceTarget ?? ""}
                    onChange={(e) =>
                      updateField("remoteTraceTarget", e.target.value || null)
                    }
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-zinc-300 mb-1">
                    IPv4 assign mode
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={!!data.v4AssignMode?.zt}
                      onChange={(e) =>
                        updateField("v4AssignMode", {
                          ...(data.v4AssignMode || { zt: false }),
                          zt: e.target.checked,
                        })
                      }
                    />
                    zt
                  </label>
                </div>
                <div>
                  <div className="text-sm text-zinc-300 mb-1">
                    IPv6 assign mode
                  </div>
                  {Object.entries(
                    data.v6AssignMode || {
                      "6plane": false,
                      rfc4193: false,
                      zt: false,
                    }
                  ).map(([k, v]) => (
                    <label
                      key={k}
                      className="block inline-flex items-center gap-2 text-sm text-zinc-300"
                    >
                      <input
                        type="checkbox"
                        checked={!!v}
                        onChange={(e) =>
                          updateField("v6AssignMode", {
                            ...(data.v6AssignMode || {}),
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

          <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700">
            <h3 className="text-white text-lg mb-3">
              Identifiers (read/write)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block text-sm text-zinc-300">
                ID
                <input
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={data.id || ""}
                  onChange={(e) => updateField("id", e.target.value)}
                />
              </label>
              <label className="block text-sm text-zinc-300">
                Network ID (nwid)
                <input
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={data.nwid || ""}
                  onChange={(e) => updateField("nwid", e.target.value)}
                />
              </label>
              <label className="block text-sm text-zinc-300">
                Object type
                <input
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={data.objtype || ""}
                  onChange={(e) => updateField("objtype", e.target.value)}
                />
              </label>
              <label className="block text-sm text-zinc-300">
                Creation time (ms)
                <input
                  type="number"
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={Number(data.creationTime) || 0}
                  onChange={(e) =>
                    updateField("creationTime", Number(e.target.value))
                  }
                />
              </label>
              <label className="block text-sm text-zinc-300">
                Revision
                <input
                  type="number"
                  className="mt-1 w-full bg-zinc-100 text-black rounded px-3 py-2"
                  value={Number(data.revision) || 0}
                  onChange={(e) =>
                    updateField("revision", Number(e.target.value))
                  }
                />
              </label>
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700">
            <h3 className="text-white text-lg mb-3">Auth</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-zinc-300 mb-2">Auth tokens</div>
                <div className="space-y-2">
                  {(data.authTokens || []).map((t, i) => (
                    <div key={i} className="flex items-end gap-2">
                      <input
                        className="flex-1 bg-zinc-100 text-black rounded px-3 py-2"
                        value={t ?? ""}
                        onChange={(e) =>
                          updateField(
                            "authTokens",
                            updateArrayItem(
                              data.authTokens,
                              i,
                              e.target.value || null
                            )
                          )
                        }
                      />
                      <Button
                        className="bg-rose-600 hover:bg-rose-500 text-white rounded px-3 py-2"
                        onClick={() =>
                          updateField(
                            "authTokens",
                            data.authTokens.filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    className="bg-zinc-600 hover:bg-zinc-500 text-white rounded px-3 py-2"
                    onClick={() =>
                      updateField("authTokens", [
                        ...(data.authTokens || []),
                        null,
                      ])
                    }
                  >
                    + Add token
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostData;
