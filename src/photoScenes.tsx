import React from 'react';
import { GalleryPhoto } from './types';
import { galleryPhotos } from './phoneData';

// ===== Realistic sample photo thumbnails (self-contained SVG scenes) =====

type SceneId = 'sunset' | 'peaks' | 'blossom' | 'forest' | 'meadow' | 'shore';

function SunsetScene() {
  return (
    <>
      <circle cx="62" cy="58" r="18" fill="#ffd166" opacity="0.9" />
      <circle cx="62" cy="58" r="30" fill="url(#sc-sun-glow)" />
      <defs>
        <radialGradient id="sc-sun-glow">
          <stop offset="0" stopColor="#ffe08a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="66" width="100" height="34" fill="#3a2c54" opacity="0.85" />
      <path d="M0 66 h100 M0 74 h100 M0 82 h100" stroke="#ff9f43" strokeWidth="2" opacity="0.5" />
      <path d="M18 30 q3 -5 6 0 M30 24 q3 -5 6 0 M24 20 q3 -5 6 0" stroke="#1b1b3a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    </>
  );
}

function PeaksScene() {
  return (
    <>
      <path d="M0 78 L34 34 L52 54 L66 42 L100 74 L100 100 L0 100 Z" fill="#2c3e6b" opacity="0.9" />
      <path d="M34 34 L42 46 L34 44 L28 48 Z" fill="#dfe9ff" opacity="0.9" />
      <path d="M66 42 L74 54 L66 52 L59 56 Z" fill="#dfe9ff" opacity="0.9" />
      <ellipse cx="28" cy="24" rx="16" ry="7" fill="#ffffff" opacity="0.35" />
      <ellipse cx="74" cy="18" rx="12" ry="5" fill="#ffffff" opacity="0.28" />
      <rect x="0" y="86" width="100" height="14" fill="#e8f1ff" opacity="0.25" />
    </>
  );
}

function BlossomScene() {
  return (
    <>
      <path d="M8 92 C26 82 40 72 52 58 C58 50 62 42 66 32" stroke="#6b3a2a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g fill="#ff7aa9" opacity="0.95">
        <circle cx="60" cy="40" r="9" />
        <circle cx="70" cy="34" r="7" />
        <circle cx="54" cy="28" r="7" />
        <circle cx="50" cy="48" r="7" />
        <circle cx="64" cy="18" r="6" />
        <circle cx="44" cy="58" r="8" />
      </g>
      <g fill="#ffc2d6">
        <circle cx="62" cy="32" r="5" />
        <circle cx="52" cy="24" r="4" />
        <circle cx="58" cy="46" r="4" />
      </g>
      <circle cx="60" cy="40" r="3" fill="#fff1c2" />
    </>
  );
}

function ForestScene() {
  return (
    <>
      <path d="M22 100 L38 46 L54 100 Z" fill="#14593b" />
      <path d="M38 46 L34 52 L44 52 Z" fill="#1b8a55" />
      <path d="M46 100 L62 40 L78 100 Z" fill="#166b45" />
      <path d="M62 40 L58 47 L68 47 Z" fill="#22a45e" />
      <path d="M32 100 L50 34 L68 100 Z" fill="#0f4c32" />
      <path d="M50 34 L45 43 L56 43 Z" fill="#2cbf6e" />
      <rect x="0" y="88" width="100" height="12" fill="#0d4a2d" opacity="0.8" />
      <ellipse cx="80" cy="22" rx="14" ry="6" fill="#ffffff" opacity="0.2" />
    </>
  );
}

function MeadowScene() {
  return (
    <>
      <path d="M30 100 C34 74 38 60 44 44" stroke="#2e7d32" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g transform="rotate(-18 44 44)">
        <ellipse cx="44" cy="44" rx="18" ry="6" fill="#ffd23f" />
        <ellipse cx="44" cy="44" rx="6" ry="18" fill="#ffd23f" />
      </g>
      <circle cx="44" cy="44" r="9" fill="#ffb300" />
      <circle cx="44" cy="44" r="4" fill="#7a4a12" />
      <path d="M34 64 C38 52 42 52 48 58 C46 66 38 68 34 64 Z" fill="#43a047" />
      <path d="M0 92 C24 82 48 78 70 84 C82 87 92 92 100 96 L100 100 L0 100 Z" fill="#2e7d32" opacity="0.75" />
      <rect x="78" y="20" width="5" height="5" rx="2.5" fill="#fff3c4" opacity="0.9" />
    </>
  );
}

function ShoreScene() {
  return (
    <>
      <circle cx="70" cy="36" r="14" fill="#fff7d6" opacity="0.9" />
      <path d="M0 64 C22 58 40 58 58 62 C76 66 90 68 100 66 L100 100 L0 100 Z" fill="#f4dfb8" />
      <path d="M0 70 C26 64 52 62 74 66 C84 68 94 71 100 72 L100 76 C86 74 66 72 48 70 C30 68 14 68 0 72 Z" fill="#bfe3ef" opacity="0.9" />
      <path d="M20 62 C24 56 28 54 32 52 M32 52 C34 58 34 62 32 66" stroke="#4a7b4a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M78 26 q5 -6 10 -2 M84 30 q6 -4 8 2" stroke="#4a7b4a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  );
}

const scenes: Record<string, React.ReactNode> = {
  sunset: <SunsetScene />,
  peaks: <PeaksScene />,
  blossom: <BlossomScene />,
  forest: <ForestScene />,
  meadow: <MeadowScene />,
  shore: <ShoreScene />,
};

export function getScene(photo: GalleryPhoto): React.ReactNode {
  const scene = photo.scene || 'sunset';
  return scenes[scene] || <SunsetScene />;
}

interface PhotoThumbProps {
  photo: GalleryPhoto;
  className?: string;
}

export function PhotoThumb({ photo, className }: PhotoThumbProps) {
  return (
    <div className={`photo-thumb${className ? ` ${className}` : ''}`} style={{ background: photo.gradient }}>
      <svg className="photo-scene" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        {getScene(photo)}
      </svg>
    </div>
  );
}

export const firstPhoto = galleryPhotos[0];