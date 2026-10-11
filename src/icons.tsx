import React from 'react';
import { siWhatsapp, siGooglephotos } from 'simple-icons';

// ===== Brand marks (simple-icons, 24x24 path data) =====
interface BrandProps {
  path: string;
  color: string;
  size?: number;
  className?: string;
}

export function BrandMark({ path, color, size = 26, className }: BrandProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} fill={color} />
    </svg>
  );
}

// ===== Generic UI glyphs (24x24, stroke style) =====
interface GlyphProps {
  size?: number;
  className?: string;
}

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor' as const,
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function G({ path, size = 24, className }: GlyphProps & { path: React.ReactNode }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...stroke}
    >
      {path}
    </svg>
  );
}

export function CameraIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <rect x="2" y="7" width="20" height="14" rx="3" />
      <circle cx="12" cy="14" r="4" />
      <path d="M8.5 7 9.7 5h4.6l1.2 2" />
    </>} />
  );
}

export function PhoneIcon(p: GlyphProps) {
  return (
    <G {...p} path={
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.05 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.82a16 16 0 0 0 6.18 6.18l1.35-1.24a2 2 0 0 1 2.11-.45c.85.31 1.74.52 2.64.64A2 2 0 0 1 22 16.92z" />
    } />
  );
}

export function MessagesIcon(p: GlyphProps) {
  return (
    <G {...p} path={
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3a8.5 8.5 0 0 1 8.5 8.5z" />
    } />
  );
}

export function SettingsIcon(p: GlyphProps) {
  return (
    <G {...p} path={
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    } />
  );
}

export function ClockIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.2 2" />
    </>} />
  );
}

export function SendIcon(p: GlyphProps) {
  return (
    <G {...p} path={
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
    } />
  );
}

export function MicIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <path d="M12 18v3" />
    </>} />
  );
}

export function PaperclipIcon(p: GlyphProps) {
  return (
    <G {...p} path={
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    } />
  );
}

export function ImageIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </>} />
  );
}

export function MapPinIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>} />
  );
}

export function FileIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </>} />
  );
}

export function UserIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>} />
  );
}

export function SmileIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01M15 9h.01" />
    </>} />
  );
}

export function CameraGlyph(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>} />
  );
}

export function WifiIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <circle cx="12" cy="20" r="0.6" fill="currentColor" stroke="none" />
    </>} />
  );
}

export function BluetoothIcon(p: GlyphProps) {
  return (
    <G {...p} path={
      <path d="M7 7l10 10-5 5V2l5 5-10 10" />
    } />
  );
}

export function BrightnessIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>} />
  );
}

export function VolumeIcon(p: GlyphProps) {
  return (
    <G {...p} path={<>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </>} />
  );
}

export function SignalIcon({ size = 13, className }: GlyphProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="7" y="11" width="3.4" height="7" rx="1" fill="currentColor" />
      <rect x="12" y="7" width="3.4" height="11" rx="1" fill="currentColor" />
      <rect x="17" y="3" width="3.4" height="15" rx="1" fill="currentColor" />
    </svg>
  );
}

export function BatteryIcon({ size = 20, className }: GlyphProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="1.5" y="7" width="16" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="9" width="9" height="6" rx="1" fill="currentColor" stroke="none" />
      <path d="M19.5 10v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function GuideMark({ size = 40, className }: GlyphProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#gm-gradient)" />
      <defs>
        <linearGradient id="gm-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b9dff" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path d="M15 33 23 15l3 11 7 7z" fill="#ffffff" opacity="0.95" />
      <circle cx="24" cy="24" r="15" fill="none" stroke="#ffffff" strokeWidth="2.4" opacity="0.55" />
    </svg>
  );
}

// ===== Home screen app icon (brand or generic glyph on a tile) =====
export type HomeAppId =
  | 'app-whatsapp'
  | 'app-photos'
  | 'app-camera'
  | 'app-phone'
  | 'app-messages'
  | 'app-settings'
  | 'app-clock';

export function HomeAppIcon({ id }: { id: HomeAppId }) {
  switch (id) {
    case 'app-whatsapp':
      return <BrandMark path={siWhatsapp.path} color="#ffffff" size={30} />;
    case 'app-photos':
      return <BrandMark path={siGooglephotos.path} color="#4285F4" size={30} />;
    case 'app-camera':
      return <CameraIcon size={30} />;
    case 'app-phone':
      return <PhoneIcon size={30} />;
    case 'app-messages':
      return <MessagesIcon size={30} />;
    case 'app-settings':
      return <SettingsIcon size={30} />;
    case 'app-clock':
      return <ClockIcon size={30} />;
  }
}