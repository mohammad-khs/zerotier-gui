import { useNetworkState } from "@/stores/store";

export default async function Home() {
  const { networkData } = useNetworkState.getState();

  return (
    <main>
      <h1 className="text-3xl font-bold underline">Hello, world!</h1>
      <div className="">This is the home page.</div>
      <h2>{networkData?.name}</h2>
    </main>
  );
}
