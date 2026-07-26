import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { clsx, type ClassValue } from "clsx";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkAuth(redirectTo?: string) {

  const session = await getServerSession(authOptions);
  
  if (!session?.user.id || !session?.user.username) {

    redirect(redirectTo || "/");

  } else return session;
}
