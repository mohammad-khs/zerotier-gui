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

export interface NetworkData {
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

export interface PostDataProps {
  networkData: Partial<NetworkData> | null;
  setNetworkData: (data: Partial<NetworkData> | null) => void;
  updateNetworkData: (updates: Partial<NetworkData>) => void;
}
