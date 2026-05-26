'use client'

import { useEffect, useRef, useState } from 'react'
import type { HistoricalPhoto } from '@/types'

interface TimelineProps {
  photos: HistoricalPhoto[]
}

/**
 * Era → background music track. Coarse buckets so we only need four loops.
 * Drop the matching .mp3 files into /public/music/ — the filenames below
 * are the contract. All audio must be public-domain or royalty-free.
 *
 * Suggested sources:
 *   - archive.org (early 20th-century recordings — many now PD)
 *   - musopen.org (PD classical)
 *   - freemusicarchive.org (CC-licensed)
 *   - mixkit.co / pixabay.com/music (royalty-free modern)
 */
const ERA_MUSIC = [
  { maxYear: 1919, src: '/music/era_silent.mp3', label: 'Silent Era' },
  { maxYear: 1949, src: '/music/era_jazz.mp3', label: 'Jazz Age' },
  { maxYear: 1979, src: '/music/era_midcentury.mp3', label: 'Mid-Century' },
  { maxYear: 9999, src: '/music/era_modern.mp3', label: 'Modern' },
] as const

function getEraMusic(year: number) {
  return (
    ERA_MUSIC.find((era) => year <= era.maxYear) ??
    ERA_MUSIC[ERA_MUSIC.length - 1]
  )
}

function SpeakerOnIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function SpeakerOffIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

/** Map year → CSS class with the right amount of sepia / grain. */
function getEraFilterClass(year: number): string {
  if (year < 1890) return 'photo-filter-1880'
  if (year < 1900) return 'photo-filter-1890'
  if (year < 1910) return 'photo-filter-1900'
  if (year < 1920) return 'photo-filter-1910'
  if (year < 1930) return 'photo-filter-1920'
  if (year < 1940) return 'photo-filter-1930'
  if (year < 1950) return 'photo-filter-1940'
  if (year < 1960) return 'photo-filter-1950'
  if (year < 1970) return 'photo-filter-1960'
  if (year < 1980) return 'photo-filter-1970'
  if (year < 1990) return 'photo-filter-1980'
  if (year < 2000) return 'photo-filter-1990'
  if (year < 2010) return 'photo-filter-2000'
  return 'photo-filter-2010'
}

/** Older photos get heavier grain. */
function getGrainClass(year: number): string {
  return year < 1950 ? 'film-grain film-grain-heavy' : 'film-grain'
}

export function Timeline({ photos }: TimelineProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const sortedPhotos = [...photos].sort((a, b) => a.year - b.year)
  const currentPhoto = sortedPhotos[currentPhotoIndex]

  // ----- Era-appropriate background music --------------------------------
  // Strategy: start MUTED so the browser allows autoplay (Chrome/Safari
  // block unmuted autoplay without a prior user gesture). The audio
  // element loops silently in the background; clicking the toggle is the
  // user gesture that unmutes it. We persist the preference so subsequent
  // location visits remember the user's choice.
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(true)
  const eraTrack = currentPhoto ? getEraMusic(currentPhoto.year) : undefined

  // Restore saved mute preference once on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem('tm:muted') === '0') {
      setMuted(false)
    }
  }, [])

  // When the era track changes, (re)start playback. Muted playback is
  // permitted by all major browsers; unmuted playback only succeeds if a
  // gesture has activated audio for this document.
  useEffect(() => {
    if (!eraTrack) return
    audioRef.current?.play().catch(() => {
      /* autoplay blocked — user can still toggle via the button */
    })
  }, [eraTrack?.src])

  // Persist mute preference + try to (re)play after unmute, since the
  // toggle click counts as a user gesture.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tm:muted', muted ? '1' : '0')
    }
    if (!muted) {
      audioRef.current?.play().catch(() => {})
    }
  }, [muted])

  const goToPrevious = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? sortedPhotos.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentPhotoIndex((prev) =>
      prev === sortedPhotos.length - 1 ? 0 : prev + 1
    )
  }

  if (sortedPhotos.length === 0) {
    return (
      <div className="rounded border border-[#5c4a32] bg-[#faf2dc] px-6 py-12 text-center">
        <p className="body-serif text-lg italic">No historical photos available.</p>
      </div>
    )
  }

  return (
    <section className="space-y-10 sm:space-y-14">
      {/* ============================================
          HORIZONTAL TIMELINE (full width)
          The dots sit on a thin line; year labels below.
          Each segment between two consecutive dots
          renders its own connector line — this guarantees
          the line ALWAYS goes through dot centers.
         ============================================ */}
      <div className="w-full overflow-x-auto pb-2">
        <div
          className="grid items-start min-w-full px-4 sm:px-8 pt-4 pb-2"
          style={{
            gridTemplateColumns: `repeat(${sortedPhotos.length}, minmax(0, 1fr))`,
          }}
        >
          {sortedPhotos.map((photo, index) => {
            const isFirst = index === 0
            const isLast = index === sortedPhotos.length - 1
            return (
              <button
                key={photo.id}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`timeline-node relative flex flex-col items-center cursor-pointer pt-1 ${
                  index === currentPhotoIndex ? 'active' : ''
                }`}
                aria-label={`Travel to year ${photo.year}`}
                aria-current={index === currentPhotoIndex ? 'true' : 'false'}
              >
                {/* Connector to previous node — drawn on the LEFT half */}
                {!isFirst && (
                  <span
                    aria-hidden="true"
                    className="timeline-line absolute"
                    style={{
                      top: 'calc(0.25rem + 6px)',
                      left: '-50%',
                      right: '50%',
                      width: '100%',
                    }}
                  />
                )}
                {/* Connector to next node — drawn on the RIGHT half */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="timeline-line absolute"
                    style={{
                      top: 'calc(0.25rem + 6px)',
                      left: '50%',
                      right: '-50%',
                      width: '100%',
                    }}
                  />
                )}

                <span className="timeline-dot" />
                <span className="timeline-year mt-3">{photo.year}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ============================================
          PHOTO DISPLAY
          Vintage white-bordered print, with sepia
          + grain + vignette layered on top of <img>.
         ============================================ */}
      <div className="mx-auto w-full max-w-2xl px-2 sm:px-0">
        <figure className="photo-frame photo-tilt">
          <div
            className={`relative w-full overflow-hidden film-vignette ${getGrainClass(currentPhoto.year)}`}
            style={{ aspectRatio: '4 / 3' }}
          >
            <img
              key={currentPhoto.id}
              src={currentPhoto.imageUrl}
              alt={currentPhoto.caption}
              className={`absolute inset-0 h-full w-full object-cover ${getEraFilterClass(currentPhoto.year)}`}
              loading="lazy"
            />
          </div>

          {/* Bottom strip — handwritten/typewriter caption space */}
          <figcaption className="absolute left-0 right-0 bottom-0 px-5 py-3 text-center">
            <span className="caption-typewriter text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#8b6f47]">
              ── {currentPhoto.year} ──
            </span>
          </figcaption>
        </figure>
      </div>

      {/* ============================================
          BIG YEAR + CAPTION
         ============================================ */}
      <article className="mx-auto max-w-2xl text-center space-y-4 px-4">
        <div className="flex items-center justify-center gap-4">
          <span className="hidden sm:block h-px flex-1 bg-[#5c4a32]/40" />
          <h3 className="era-year text-5xl sm:text-7xl">{currentPhoto.year}</h3>
          <span className="hidden sm:block h-px flex-1 bg-[#5c4a32]/40" />
        </div>

        <p className="caption-typewriter text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#8b6f47]">
          Frame {currentPhotoIndex + 1} of {sortedPhotos.length}
        </p>

        <p className="body-serif text-base sm:text-lg lg:text-xl leading-relaxed italic max-w-xl mx-auto">
          &ldquo;{currentPhoto.caption}&rdquo;
        </p>

        {/* Subtle attribution — like a tiny stamp at the corner of an old print */}
        <div className="flex justify-end pt-1 max-w-xl mx-auto">
          <a
            href={currentPhoto.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`View source: ${currentPhoto.source}`}
            className="caption-typewriter text-[9px] sm:text-[10px] tracking-[0.18em] text-[#8b6f47]/60 hover:text-[#a0522d] transition-colors decoration-dotted underline-offset-[3px] hover:underline"
          >
            © {currentPhoto.source}
          </a>
        </div>
      </article>

      {/* ============================================
          NAVIGATION
         ============================================ */}
      <div className="mx-auto flex items-center justify-center gap-3 sm:gap-5">
        <button
          onClick={goToPrevious}
          className="vintage-btn"
          aria-label="Previous photo"
        >
          ← Rewind
        </button>
        <span className="caption-typewriter text-[#8b6f47] px-1 select-none">✦</span>
        <button
          onClick={goToNext}
          className="vintage-btn"
          aria-label="Next photo"
        >
          Forward →
        </button>
      </div>

      {/* ============================================
          ERA-APPROPRIATE BACKGROUND MUSIC
          - Hidden <audio> loops the current era's track
          - Floating brass button toggles mute (only UI affordance)
         ============================================ */}
      {eraTrack && (
        <>
          <audio
            ref={audioRef}
            src={eraTrack.src}
            loop
            preload="auto"
            muted={muted}
          />
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="music-toggle"
            aria-label={muted ? 'Unmute background music' : 'Mute background music'}
            aria-pressed={!muted}
            title={`${muted ? 'Unmute' : 'Mute'} — ${eraTrack.label}`}
          >
            {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
          </button>
        </>
      )}
    </section>
  )
}
