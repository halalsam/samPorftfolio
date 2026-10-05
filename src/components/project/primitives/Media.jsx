'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PiSpeakerHighLight, PiSpeakerSlashLight } from 'react-icons/pi';
import { isVideo } from '@/lib/content/normalize';

/**
 * Plays only while on screen (saves battery + bandwidth), muted by default.
 * `sound` adds an unmute toggle — the reels have original soundtracks.
 */
export function AutoVideo({ media, className = '', sound = false, priority = false }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        src={media.url}
        poster={media.poster?.url}
        muted={muted}
        loop
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        aria-label={media.alt || undefined}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Bottom-left, inset by a share of the box so it clears a phone
          screen's rounded corner (and the reel's docked phone, bottom-right). */}
      {sound ? (
        <button
          type="button"
          onClick={() => {
            const el = ref.current;
            setMuted((m) => {
              if (el && m) el.play().catch(() => {});
              return !m;
            });
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="absolute bottom-[max(0.75rem,6%)] left-[max(0.75rem,5%)] z-10 flex h-9 items-center gap-2 bg-black/60 px-3 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {muted ? <PiSpeakerSlashLight size={16} /> : <PiSpeakerHighLight size={16} />}
          {muted ? 'Sound off' : 'Sound on'}
        </button>
      ) : null}
    </div>
  );
}

/** Any normalized media inside a box that already has its size/aspect. */
export function MediaFill({ media, sizes = '100vw', priority = false, sound = false, className = '', fit = 'cover' }) {
  if (!media) return null;
  if (isVideo(media)) return <AutoVideo media={media} sound={sound} priority={priority} className={`h-full w-full ${className}`} />;
  const objectFit = fit === 'contain' ? 'object-contain' : 'object-cover object-top';
  if (media.mime === 'image/svg+xml') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={media.url} alt={media.alt} className={`absolute inset-0 h-full w-full ${objectFit} ${className}`} />;
  }
  return <Image src={media.url} alt={media.alt} fill sizes={sizes} priority={priority} className={`${objectFit} ${className}`} />;
}

/** Aspect ratio from media dimensions, with a sensible fallback. */
export const aspectOf = (media, fallback = '16 / 10') => (media?.width && media?.height ? `${media.width} / ${media.height}` : fallback);
