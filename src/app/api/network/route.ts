import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.ZEROTIER_CONTROLLER_URL;
    const token = process.env.ZEROTIER_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ZEROTIER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    console.log("🔗 Fetching networks from:", baseUrl);
    const res = await fetch(`${baseUrl}/controller/network`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`❌ ZeroTier Controller returned ${res.status}:`, body);
      throw new Error(`Failed to fetch network list (${res.status}): ${body}`);
    }

    const networkList = await res.json();
    console.log(
      "✅ Networks fetched successfully:",
      Object.keys(networkList).length,
    );
    return NextResponse.json(networkList);
  } catch (error) {
    console.error("Error fetching network list:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to fetch network list" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const baseUrl =
      process.env.ZEROTIER_CONTROLLER_URL;
    const token = process.env.ZEROTIER_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ZEROTIER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(`${baseUrl}/controller/network`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      throw new Error(`Failed to create network: ${res.status}`);
    }

    const newNetwork = await res.json();
    return NextResponse.json(newNetwork);
  } catch (error) {
    console.error("Error creating network:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to create network" },
      { status: 500 },
    );
  }
}
