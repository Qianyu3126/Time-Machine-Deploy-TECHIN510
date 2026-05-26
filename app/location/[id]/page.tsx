import Link from "next/link";
import { locations } from "@/data/locations";
import { photos } from "@/data/photos";
import { Timeline } from "@/components/Timeline";

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

function getPhotosByLocationId(locationId: number) {
  return photos.filter((photo) => photo.locationId === locationId);
}

export default async function LocationPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const location = findLocationByParamId(idParam);
  const locationPhotos = location ? getPhotosByLocationId(location.id) : [];

  const yearRange =
    locationPhotos.length > 0
      ? `${Math.min(...locationPhotos.map((p) => p.year))} – ${Math.max(
          ...locationPhotos.map((p) => p.year)
        )}`
      : null;

  return (
    <div className="vintage-bg min-h-screen relative">
      <div className="relative z-10">
        {/* Top navigation bar — like a journal header */}
        <header className="border-b border-zinc-800 bg-zinc-950">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-3 sm:px-6 lg:px-8">
            <Link href="/" className="vintage-btn shrink-0">
              ← Back
            </Link>
            <p className="caption-typewriter gold-foil hidden text-[11px] uppercase tracking-[0.3em] sm:block sm:text-sm">
              ✦ The Time Machine ✦
            </p>
            <div className="caption-typewriter gold-foil shrink-0 text-[11px] uppercase tracking-[0.2em] sm:text-sm">
              {yearRange ?? 'Archive'}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          {!location ? (
            <div className="text-center py-24">
              <p className="heading-serif text-3xl italic mb-4">
                Location not found
              </p>
              <p className="body-serif">Perhaps it has been lost to time…</p>
            </div>
          ) : (
            <article className="space-y-10 sm:space-y-14">
              {/* Title block — like an old book title page */}
              <div className="text-center space-y-3 sm:space-y-4">
                <p className="caption-typewriter text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#8b6f47]">
                  ── A Visual Chronicle of ──
                </p>
                <h1 className="heading-serif text-4xl sm:text-5xl lg:text-7xl font-bold italic px-2">
                  {location.name}
                </h1>
                <hr className="vintage-rule mx-auto max-w-md" />
                <p className="body-serif text-base sm:text-lg lg:text-xl leading-relaxed italic max-w-2xl mx-auto pt-2 sm:pt-4 px-3">
                  {location.description}
                </p>
              </div>

              {/* Timeline section */}
              <div className="pt-4 sm:pt-8">
                {locationPhotos.length > 0 ? (
                  <Timeline photos={locationPhotos} />
                ) : (
                  <div className="rounded border border-[#5c4a32] bg-[#faf2dc] px-6 py-12 text-center">
                    <p className="body-serif text-xl italic">
                      No historical photographs in our archive yet…
                    </p>
                  </div>
                )}
              </div>

              {/* Footer note */}
              <footer className="pt-6 sm:pt-8 text-center">
                <hr className="vintage-rule mx-auto max-w-md mb-5 sm:mb-6" />
                <p className="caption-typewriter text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#8b6f47]">
                  ✦ End of the chronicle ✦
                </p>
              </footer>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
