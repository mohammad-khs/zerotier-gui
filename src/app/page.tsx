import Login from "@/components/login";
import SignUp from "@/components/signup";
import { getServerSession } from "next-auth";

import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user.id === null) {
    return <div>Loading...</div>;
  }
  console.log("this is the real session : ", session?.expires);

  if (session) {
    return (
      <main>
        <h1 className="text-3xl font-bold underline">
          Welcome back, {session.user?.username}!
        </h1>
        <div>You are logged in.</div>
        {/* <Button onClick={() => signOut()} className="mt-4">
          Logout
        </Button> */}
      </main>
    );
  }

  return (
    <main>
      <h1 className="text-3xl font-bold underline">Hello, world!</h1>
      <div className="">This is the home page.</div>

      <h1>login</h1>
      <Login />
      <h1>signup</h1>
      <SignUp />
    </main>
  );
}
