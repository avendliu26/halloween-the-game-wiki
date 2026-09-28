"use client";

import { useState } from "react";
import { officialVideos, type OfficialVideoKey } from "@/config/media";

export function OfficialVideo({ video }: Readonly<{ video: OfficialVideoKey }>) {
  const [playing, setPlaying] = useState(false);
  const media = officialVideos[video];
  const watchUrl = `https://www.youtube.com/watch?v=${media.id}`;

  return <div className="official-video">
    <div className="official-video__frame">
      {playing ? <iframe
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        src={`https://www.youtube.com/embed/${media.id}`}
        title={media.title}
      /> : <button
        aria-label={`Play ${media.title}`}
        className="official-video__play"
        onClick={() => setPlaying(true)}
        type="button"
      >
        {/* A local poster is rendered before any YouTube request. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={media.posterAlt} loading="lazy" src={media.poster} />
        <span aria-hidden="true" className="official-video__play-icon">▶</span>
      </button>}
    </div>
    <a href={watchUrl} rel="noopener noreferrer" target="_blank">{media.title} · Watch on YouTube ↗</a>
  </div>;
}
