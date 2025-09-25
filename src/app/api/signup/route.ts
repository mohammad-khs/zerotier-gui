import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validation";


export async function POST(request: Request) {
  const body = await request.json();
  const parsedResult = signupSchema.safeParse(body);
  if (!parsedResult.success) {
    return NextResponse.json(
      { success: false, errors: parsedResult.error },
      { status: 400 }
    );
  }
  const { username, password } = parsedResult.data;
  const userExists = await prisma.user.findUnique({
    where: { username: username },
  });

  if (userExists) {
    return NextResponse.json(
      { success: false, errors: "This user already exists." },
      { status: 400 }
    );
  }

  const bcryptedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: bcryptedPassword },
  });

  return NextResponse.json(
    {
      success: true,
      message: "User created successfully",
      user: user.username,
    },
    { status: 201 }
  );
}
