// components/AuthenticatedHome.tsx
import NetworkList from "@/components/NetworkList";

interface AuthenticatedHomeProps {
  networkList: string[];
  fetchError: string | null;
}

export default function AuthenticatedHome({
  networkList,
  fetchError,
}: AuthenticatedHomeProps) {
  return (
    <main className="space-y-10 px-4 sm:px-6 lg:px-8">
      {fetchError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p>Error loading networks: {fetchError}</p>
        </div>
      ) : (
        <NetworkList networkList={networkList} />
      )}
    </main>
  );
}
