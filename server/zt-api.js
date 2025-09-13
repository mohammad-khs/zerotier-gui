// server/zt-api.js
import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 3001;
const ZT_BASE_URL = "http://localhost:9993";

app.use(cors());
app.use(express.json());

// Load ZeroTier API token
const tokenPath = process.platform === "win32"
  ? "C:/ProgramData/ZeroTier/One/authtoken.secret"
  : "/var/lib/zerotier-one/authtoken.secret";

const apiToken = fs.readFileSync(tokenPath, "utf8").trim();

const zt = axios.create({
  baseURL: ZT_BASE_URL,
  headers: {
    Authorization: `bearer ${apiToken}`,
    "Content-Type": "application/json",
  },
});

// List all members of a network
app.get("/api/:networkId/members", async (req, res) => {
  try {
    const { networkId } = req.params;
    const response = await zt.get(`/controller/network/${networkId}/member`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authorize or deauthorize a member
app.post("/api/:networkId/member/:memberId/auth", async (req, res) => {
  try {
    const { networkId, memberId } = req.params;
    const { authorized } = req.body;

    await zt.post(`/controller/network/${networkId}/member/${memberId}`, {
      authorized,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign static IP to a member
app.post("/api/:networkId/member/:memberId/ip", async (req, res) => {
  try {
    const { networkId, memberId } = req.params;
    const { ip } = req.body;

    await zt.post(`/controller/network/${networkId}/member/${memberId}`, {
      ipAssignments: [ip],
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ZT backend API running on http://localhost:${PORT}`);
});
