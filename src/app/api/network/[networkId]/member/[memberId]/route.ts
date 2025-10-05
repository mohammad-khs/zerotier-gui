import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { networkId: string; memberId: string } }
) {
  try {
    const { networkId, memberId } = params;
    const res = await fetch(`http://5.57.32.82:8080/controller/network/${networkId}/member/${memberId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete member ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: (error as any)?.message || "Failed to delete member" }, { status: 500 });
  }
}