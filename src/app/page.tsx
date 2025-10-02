import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import NetworkList from "../components/NetworkList";

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

        <NetworkList networkList={networkList} />
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
