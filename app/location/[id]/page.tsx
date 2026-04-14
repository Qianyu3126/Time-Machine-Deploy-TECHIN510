import Link from "next/link";
import { locations } from "@/data/locations";

type PageProps = {
  params: Promise<{ id: string }>;
};

function findLocationByParamId(idParam: string) {
  const id = Number.parseInt(idParam, 10);
  if (Number.isNaN(id)) {
    return undefined;
  }
  return locations.find((loc) => loc.id === id);
}

export default async function LocationPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const location = findLocationByParamId(idParam);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
        >
          ← Back
        </Link>

        {!location ? (
          <p className="mt-10 text-lg text-zinc-400">Location not found</p>
        ) : (
          <article className="mt-10">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              {location.name}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              {location.description}
            </p>
            <div
              className="mt-10 rounded-xl border border-zinc-700 bg-zinc-900/80 px-6 py-10 text-center text-xl font-semibold text-zinc-200 shadow-lg sm:text-2xl"
              role="status"
              aria-live="polite"
            >
              📸 Timeline coming soon...
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
