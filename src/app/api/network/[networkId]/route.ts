import { NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ networkId: string }> },
) {

  try {
    const { networkId } = await context.params;
    const baseUrl =
      process.env.ZEROTIER_CONTROLLER_URL;
    const token = process.env.ZEROTIER_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ZEROTIER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(`${baseUrl}/controller/network/${networkId}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch network (${res.status})`);
    }

    const network = await res.json();
    return NextResponse.json(network);
  } catch (error) {
    console.error("Error fetching network:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to fetch network" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ networkId: string }> },
) {

  try {
    const { networkId } = await context.params;
    const baseUrl =
      process.env.ZEROTIER_CONTROLLER_URL;
    const token = process.env.ZEROTIER_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ZEROTIER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();

    const res = await fetch(`${baseUrl}/controller/network/${networkId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to update network (${res.status})`);
    }

    const network = await res.json();
    return NextResponse.json(network);
  } catch (error) {
    console.error("Error updating network:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to update network" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ networkId: string }> },
) {

  try {
    const { networkId } = await context.params;
    const baseUrl =
      process.env.ZEROTIER_CONTROLLER_URL;
    const token = process.env.ZEROTIER_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ZEROTIER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(`${baseUrl}/controller/network/${networkId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete network (${res.status})`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting network:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to delete network" },
      { status: 500 },
    );
  }
}
