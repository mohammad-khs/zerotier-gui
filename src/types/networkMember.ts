export interface Member {
  activeBridge: boolean;
  address: string;
  authenticationExpiryTime: number;
  authorized: boolean;
  capabilities: string[];
  creationTime: number;
  id: string;
  identity: string;
  ipAssignments: string[];
  lastAuthorizedCredential: string | null;
  lastAuthorizedCredentialType: string;
  lastAuthorizedTime: number;
  lastDeauthorizedTime: number;
  noAutoAssignIps: boolean;
  nwid: string;
  objtype: string;
  remoteTraceLevel: number;
  remoteTraceTarget: string | null;
  revision: number;
  ssoExempt: boolean;
  tags: string[];
  vMajor: number;
  vMinor: number;
  vProto: number;
  vRev: number;
}
