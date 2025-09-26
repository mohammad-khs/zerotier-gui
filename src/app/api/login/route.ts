import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsedResult = authSchema.safeParse(body);
  if (!parsedResult.success) {
    return NextResponse.json(
      { success: false, errors: parsedResult.error },
      { status: 400 }
    );
  }

  const { username, password } = parsedResult.data;

  const userExists = await prisma.user.findUnique({
    where: { username },
  });
  if (!userExists) {
    return NextResponse.json({ error: "Username not found." }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, userExists.password);
  console.log("Entered:", password, "Stored hash:", userExists.password, "Valid?", isPasswordValid);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid password." }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Login successful" }, { status: 200 });
}
