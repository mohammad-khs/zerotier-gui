import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  console.log("🔍 DEBUG: Fetching network list from API...");
  const res = await fetch("http://5.57.32.82:8080/controller/network");
  const networkList: string[] = await res.json();

  console.log("🔍 DEBUG: Available networks:", networkList);

  if (session?.user.id === null) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <main>
        <h1 className="text-3xl font-bold underline">
          Welcome back, {session.user?.username}!
        </h1>
        <div>You are logged in.</div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Available Networks:</h2>
          <div className="space-y-3">
            {networkList.map((network, key) => (
              <div
                key={key}
                className="flex items-center justify-between dark:hover:bg-input/50 p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-sm bg-gray-100 dark:bg-input/30 dark:hover:bg-input/50  px-2 py-1 rounded">
                    {network}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/network/${network}/members`}>
                    <Button variant="outline" size="sm">
                      View Members
                    </Button>
                  </Link>
                  <Link href={`/network/${network}/settings`}>
                    <Button variant="outline" size="sm">
                      Settings
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1 className="text-3xl font-bold underline">Hello, world!</h1>
      <div className="">This is the home page.</div>
    </main>
  );
}
