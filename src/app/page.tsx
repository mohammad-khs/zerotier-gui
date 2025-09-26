import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

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
