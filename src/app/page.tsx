// app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import AuthenticatedHome  from "@/components/authenticatedHome";
import UnauthenticatedHome from "@/components/unauthenticatedHome";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const isAuthenticated = session?.user?.id && session?.user?.username;

  let networkList: string[] = [];
  let fetchError: string | null = null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (isAuthenticated) {
    try {
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
      }
      const res = await fetch(`${baseUrl}/api/network`, {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(
          `Failed to fetch network list (${res.status}): ${body}`,
        );
      }
      networkList = await res.json();
      console.log(networkList);
    } catch (error) {
      fetchError = error instanceof Error ? error.message : String(error);
      console.error("Failed to load network list:", fetchError);
    }
  }

  // Return the appropriate component based on authentication status
  return isAuthenticated ? (
    <AuthenticatedHome networkList={networkList} fetchError={fetchError} />
  ) : (
    <UnauthenticatedHome />
  );
}
