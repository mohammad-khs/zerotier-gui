import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import NetworkList from "../components/NetworkList";

export default async function Home() {
  const session = await getServerSession(authOptions);

  
  let networkList: string[] = [];
  let fetchError: string | null = null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    if (!baseUrl) {
      throw new Error("BASE_URL or NEXT_PUBLIC_BASE_URL is not defined");
    }
    const res = await fetch(`${baseUrl}/controller/network`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to fetch network list (${res.status}): ${body}`);
    }
    networkList = await res.json();
  } catch (error) {
    fetchError = error instanceof Error ? error.message : String(error);
    console.error("Failed to load network list:", fetchError);
  }

  if (session?.user.id === null) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <main className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-700/70 bg-slate-950/95 p-8 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.75)] text-slate-50 sm:p-10">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-slate-500/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute left-0 bottom-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-400/10 blur-3xl animate-[pulse_10s_ease-in-out_0.5s_infinite]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex rounded-full bg-slate-900/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200 shadow-sm shadow-slate-950/40">
                Dashboard ready
              </div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-5xl">
                Hi {session.user?.username}, your controller workspace is live.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Manage ZeroTier networks with confidence. Live updates, network
                summary, and smart status feedback are all within reach.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-700/60 bg-slate-900/75 p-5 text-sm text-slate-100 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-900/85">
                  <p className="font-medium text-cyan-200">Session active</p>
                  <p className="mt-2 text-slate-400">
                    Your login is valid and API access is ready.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-700/60 bg-slate-900/75 p-5 text-sm text-slate-100 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-900/85">
                  <p className="font-medium text-cyan-200">Network insights</p>
                  <p className="mt-2 text-slate-400">
                    Data appears below as soon as the controller responds.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative rounded-[1.75rem] border border-slate-700/50 bg-slate-900/60 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.8)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Overview
                </span>
                <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-200">
                  Live
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-300 shadow-inner shadow-slate-950/30">
                  <p className="font-semibold text-slate-100">
                    Networks loaded
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-cyan-300">
                    {networkList.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-300 shadow-inner shadow-slate-950/30">
                  <p className="font-semibold text-slate-100">
                    Controller status
                  </p>
                  <p className="mt-2 text-slate-400">
                    Realtime fetch on each page load.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {fetchError ? (
          <div className="rounded-3xl border border-red-300/40 bg-red-50/80 p-4 text-sm text-red-800 shadow-sm sm:max-w-3xl">
            Failed to load networks: {fetchError}
          </div>
        ) : null}

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
