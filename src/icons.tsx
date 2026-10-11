import React from 'react';
import {
  SiWhatsapp, SiGooglephotos, SiGooglechrome, SiGooglemaps, SiYoutube, SiGmail,
} from 'react-icons/si';
import {
  MdPhotoCamera, MdCall, MdSms, MdAccessTime, MdSettings, MdSend, MdMic,
  MdAttachFile, MdImage, MdLocationOn, MdInsertDriveFile, MdPerson,
  MdSentimentSatisfiedAlt, MdSignalCellularAlt, MdWifi, MdBluetooth,
  MdBrightness6, MdVolumeUp, MdBatteryFull, MdCheck,
} from 'react-icons/md';

// ===== Generic UI glyphs (react-icons/md, outline-weight style) =====
export interface GlyphProps {
  size?: number;
  className?: string;
}

export function CameraIcon(p: GlyphProps) { return <MdPhotoCamera {...p} />; }
export function PhoneIcon(p: GlyphProps) { return <MdCall {...p} />; }
export function MessagesIcon(p: GlyphProps) { return <MdSms {...p} />; }
export function SettingsIcon(p: GlyphProps) { return <MdSettings {...p} />; }
export function ClockIcon(p: GlyphProps) { return <MdAccessTime {...p} />; }
export function SendIcon(p: GlyphProps) { return <MdSend {...p} />; }
export function MicIcon(p: GlyphProps) { return <MdMic {...p} />; }
export function PaperclipIcon(p: GlyphProps) { return <MdAttachFile {...p} />; }
export function ImageIcon(p: GlyphProps) { return <MdImage {...p} />; }
export function MapPinIcon(p: GlyphProps) { return <MdLocationOn {...p} />; }
export function FileIcon(p: GlyphProps) { return <MdInsertDriveFile {...p} />; }
export function UserIcon(p: GlyphProps) { return <MdPerson {...p} />; }
export function SmileIcon(p: GlyphProps) { return <MdSentimentSatisfiedAlt {...p} />; }
export function CameraGlyph(p: GlyphProps) { return <MdPhotoCamera {...p} />; }
export function WifiIcon(p: GlyphProps) { return <MdWifi {...p} />; }
export function BluetoothIcon(p: GlyphProps) { return <MdBluetooth {...p} />; }
export function BrightnessIcon(p: GlyphProps) { return <MdBrightness6 {...p} />; }
export function VolumeIcon(p: GlyphProps) { return <MdVolumeUp {...p} />; }
export function SignalIcon(p: GlyphProps) { return <MdSignalCellularAlt {...p} />; }
export function BatteryIcon(p: GlyphProps) { return <MdBatteryFull {...p} />; }
export function CheckIcon(p: GlyphProps) { return <MdCheck {...p} />; }

// ===== Product logo (app brand mark) =====
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

// ===== Home screen app icon (brand mark or generic glyph on a tile) =====
export type HomeAppId =
  | 'app-whatsapp'
  | 'app-photos'
  | 'app-camera'
  | 'app-phone'
  | 'app-messages'
  | 'app-settings'
  | 'app-clock'
  | 'app-chrome'
  | 'app-maps'
  | 'app-youtube'
  | 'app-gmail';

export function HomeAppIcon({ id, size = 30 }: { id: HomeAppId; size?: number }) {
  switch (id) {
    case 'app-whatsapp':
      return <SiWhatsapp size={size} />;
    case 'app-photos':
      return <SiGooglephotos size={size} />;
    case 'app-chrome':
      return <SiGooglechrome size={size} />;
    case 'app-maps':
      return <SiGooglemaps size={size} />;
    case 'app-youtube':
      return <SiYoutube size={size} />;
    case 'app-gmail':
      return <SiGmail size={size} />;
    case 'app-camera':
      return <CameraIcon size={size} />;
    case 'app-phone':
      return <PhoneIcon size={size} />;
    case 'app-messages':
      return <MessagesIcon size={size} />;
    case 'app-settings':
      return <SettingsIcon size={size} />;
    case 'app-clock':
      return <ClockIcon size={size} />;
  }
}