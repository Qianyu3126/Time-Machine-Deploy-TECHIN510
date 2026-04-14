"use client";

import dynamic from "next/dynamic";
import { locations } from "@/data/locations";

const Map = dynamic(() => import("@/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-zinc-950 text-zinc-400">
      Loading map...
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="shrink-0 border-b border-zinc-800 bg-zinc-950">
        <nav
          className="mx-auto flex h-14 min-w-0 max-w-7xl items-center gap-2 px-3 sm:px-6 lg:px-8"
          aria-label="Primary"
        >
          <h1 className="min-w-0 truncate text-base font-semibold tracking-tight text-zinc-100 sm:text-lg">
            Time Machine
          </h1>
        </nav>
      </header>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Map locations={locations} />
      </main>
    </div>
  );
}
