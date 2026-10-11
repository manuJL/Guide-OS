import React, { useState } from 'react';
import { PhoneScreen, Language, GalleryPhoto, TutorialStep } from './types';
import { t } from './i18n/strings';
import { contacts, galleryPhotos } from './phoneData';
import {
  HomeAppIcon,
  CameraGlyph, PaperclipIcon, ImageIcon, MapPinIcon, FileIcon, UserIcon,
  SmileIcon, SendIcon, WifiIcon, BluetoothIcon, BrightnessIcon, VolumeIcon,
  SignalIcon, BatteryIcon, ClockIcon,
} from './icons';
import { PhotoThumb } from './photoScenes';

// Avatar color map
const avatarColors: Record<string, string> = {
  alex: '#00a884',
  priya: '#8b5cf6',
  raj: '#f59e0b',
  meera: '#ec4899',
  amit: '#3b82f6',
};

const initials = (name: string): string => name.trim().charAt(0).toUpperCase() || '?';

interface PhoneSimulatorProps {
  screen: PhoneScreen;
  lang: Language;
  currentStep: TutorialStep | null;
  tutorialActive: boolean;
  onElementClick: (elementId: string) => void;
  onGoHome: () => void;
  selectedPhoto: GalleryPhoto | null;
  setSelectedPhoto: (p: GalleryPhoto | null) => void;
  alarmHour: number;
  alarmMinute: number;
  alarmAmPm: 'AM' | 'PM';
  setAlarmHour: (h: number) => void;
  setAlarmMinute: (m: number) => void;
  setAlarmAmPm: (v: 'AM' | 'PM') => void;
  toast?: string | null;
}

export default function PhoneSimulator({
  screen, lang, currentStep, tutorialActive, onElementClick, onGoHome,
  selectedPhoto, setSelectedPhoto, alarmHour, alarmMinute, alarmAmPm,
  setAlarmHour, setAlarmMinute, setAlarmAmPm, toast,
}: PhoneSimulatorProps) {
  const s = t(lang);

  const isTarget = (id: string) => tutorialActive && currentStep?.targetElementId === id;
  // Only dim elements that have an explicit id and are NOT the current target.
  // Un-id'd controls (like the alarm time spinners) stay interactive during tutorials.
  const isDimmed = (id: string) => tutorialActive && !!id
    && currentStep && currentStep.targetElementId !== ''
    && currentStep.targetElementId !== id;

  const cls = (id: string, base: string) => {
    const classes = [base];
    if (isTarget(id)) classes.push('tutorial-highlight');
    if (isDimmed(id)) classes.push('tutorial-dim');
    return classes.join(' ');
  };

  const handleClick = (elementId: string) => {
    onElementClick(elementId);
  };

  return (
    <div className="phone-frame">
      {/* Status Bar */}
      <div className="phone-status-bar">
        <span className="status-time">9:41</span>
        <span className="status-icons">
          <SignalIcon className="status-icon" />
          <WifiIcon className="status-icon" size={14} />
          <BatteryIcon className="status-icon" />
        </span>
      </div>
      <div className="phone-island" />

      {/* Screen Content */}
      <div className="phone-screen">
        {screen === 'home' && (
          <HomeScreen s={s} cls={cls} handleClick={handleClick} />
        )}
        {screen === 'whatsapp-contacts' && (
          <WhatsAppContacts s={s} cls={cls} handleClick={handleClick} />
        )}
        {screen === 'whatsapp-chat' && (
          <WhatsAppChat s={s} cls={cls} handleClick={handleClick} />
        )}
        {screen === 'whatsapp-attachment-menu' && (
          <WhatsAppChat s={s} cls={cls} handleClick={handleClick} showAttachMenu />
        )}
        {screen === 'gallery' && (
          <GalleryScreen s={s} cls={cls} handleClick={handleClick} currentStep={currentStep} tutorialActive={tutorialActive} />
        )}
        {screen === 'photo-preview' && (
          <PhotoPreview s={s} cls={cls} handleClick={handleClick} selectedPhoto={selectedPhoto} />
        )}
        {screen === 'message-sent' && (
          <MessageSentScreen s={s} selectedPhoto={selectedPhoto} />
        )}
        {screen === 'clock-main' && (
          <ClockMain s={s} cls={cls} handleClick={handleClick} />
        )}
        {screen === 'clock-alarm-list' && (
          <ClockAlarmList s={s} cls={cls} handleClick={handleClick} />
        )}
        {screen === 'clock-add-alarm' && (
          <ClockAddAlarm
            s={s} cls={cls} handleClick={handleClick}
            hour={alarmHour} minute={alarmMinute} amPm={alarmAmPm}
            setHour={setAlarmHour} setMinute={setAlarmMinute} setAmPm={setAlarmAmPm}
          />
        )}
        {screen === 'clock-alarm-saved' && (
          <ClockAlarmSaved s={s} hour={alarmHour} minute={alarmMinute} amPm={alarmAmPm} />
        )}
        {screen === 'settings-main' && (
          <SettingsMain s={s} cls={cls} handleClick={handleClick} />
        )}
        {screen === 'settings-wifi' && (
          <SettingsWifi s={s} cls={cls} handleClick={handleClick} />
        )}
      </div>

      {/* Phone toast */}
      {toast && (
        <div className="phone-toast">
          {toast}
        </div>
      )}

      {/* Home Button */}
      <div className="phone-nav-bar">
        <div className="phone-home-indicator" onClick={onGoHome} title={s.phoneHomeButton} />
      </div>
    </div>
  );
}

// ===== Home Screen =====
function HomeScreen({ s, cls, handleClick }: { s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void }) {
  const apps = [
    { id: 'app-whatsapp', label: s.appWhatsApp, colorClass: 'whatsapp' },
    { id: 'app-photos', label: s.appPhotos, colorClass: 'photos' },
    { id: 'app-camera', label: s.appCamera, colorClass: 'camera' },
    { id: 'app-phone', label: s.appPhone, colorClass: 'phone' },
    { id: 'app-messages', label: s.appMessages, colorClass: 'messages' },
    { id: 'app-settings', label: s.appSettings, colorClass: 'settings' },
    { id: 'app-clock', label: s.appClock, colorClass: 'clock' },
  ];

  return (
    <div className="home-screen">
      <div className="home-clock">
        <div className="home-clock-time">9:41</div>
        <div className="home-clock-date">Sunday, Oct 11</div>
      </div>
      <div className="app-grid">
        {apps.map((app) => (
          <div
            key={app.id}
            id={app.id}
            className={cls(app.id, 'app-icon-wrapper')}
            onClick={() => handleClick(app.id)}
          >
            <div className={`app-icon ${app.colorClass}`}>
              <HomeAppIcon id={app.id as any} />
            </div>
            <span className="app-icon-label">{app.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== WhatsApp Status bar icons renderer =====
function WhatsAppContacts({ s, cls, handleClick }: { s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void }) {
  return (
    <div className="wa-screen">
      <div className="wa-header">
        <div className="wa-header-title">{s.whatsappTitle}</div>
      </div>
      <div className="wa-tabs">
        <button className="wa-tab active">{s.whatsappChats}</button>
        <button className={cls('wa-tab-status', 'wa-tab')} onClick={() => handleClick('wa-tab-status')}>{s.whatsappStatus}</button>
        <button className={cls('wa-tab-calls', 'wa-tab')} onClick={() => handleClick('wa-tab-calls')}>{s.whatsappCalls}</button>
      </div>
      <div className="wa-contacts">
        {contacts.map((contact) => {
          const contactId = `contact-${contact.id}`;
          return (
            <div
              key={contactId}
              id={contactId}
              className={cls(contactId, 'wa-contact-item')}
              onClick={() => handleClick(contactId)}
            >
              <div className="wa-contact-avatar" style={{ background: avatarColors[contact.id] || '#666', color: '#fff' }}>
                {initials(contact.name)}
              </div>
              <div className="wa-contact-info">
                <div className="wa-contact-name">{contact.name}</div>
                <div className="wa-contact-last">{contact.lastMessage}</div>
              </div>
              <div className="wa-contact-meta">
                <span className="wa-contact-time">{contact.time}</span>
                {contact.unread > 0 && (
                  <span className="wa-contact-unread">{contact.unread}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== WhatsApp Chat =====
function WhatsAppChat({ s, cls, handleClick, showAttachMenu = false }: {
  s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void; showAttachMenu?: boolean;
}) {
  return (
    <div className="wa-screen" style={{ position: 'relative' }}>
      <div className="wa-chat-header">
        <div className="wa-chat-avatar" style={{ background: '#00a884', color: '#fff', fontWeight: 600 }}>
          A
        </div>
        <div className="wa-chat-name">Alex</div>
        <div className="wa-chat-header-icons">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aebac1" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#aebac1">
            <circle cx="12" cy="5" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="12" cy="19" r="1.8" />
          </svg>
        </div>
      </div>
      <div className="wa-chat-body">
        <div className="wa-chat-bubble received">
          <div>Hey! How are you? 😊</div>
          <div className="bubble-time">10:28 AM</div>
        </div>
        <div className="wa-chat-bubble sent">
          <div>I'm good! Let me send you that photo.</div>
          <div className="bubble-time">10:30 AM ✓✓</div>
        </div>
      </div>
      <div className="wa-chat-input-bar">
        <button className="wa-emoji-btn" id="wa-emoji-btn" onClick={() => handleClick('wa-emoji-btn')}>
          <SmileIcon size={22} />
        </button>
        <input className="wa-msg-input" placeholder={s.typeMessage} readOnly />
        <button
          id="btn-attach"
          className={cls('btn-attach', 'wa-attach-btn')}
          onClick={() => handleClick('btn-attach')}
          title="Attach"
        >
          <PaperclipIcon size={22} />
        </button>
        <button className="wa-camera-btn" id="wa-camera-btn" onClick={() => handleClick('wa-camera-btn')}>
          <CameraGlyph size={22} />
        </button>
      </div>

      {showAttachMenu && (
        <div className="wa-attachment-menu">
          <button
            id="attach-gallery"
            className={cls('attach-gallery', 'wa-attach-option')}
            onClick={() => handleClick('attach-gallery')}
          >
            <div className="wa-attach-icon gallery"><ImageIcon size={24} /></div>
            <span className="wa-attach-label">{s.galleryOption}</span>
          </button>
          <button className={cls('attach-camera', 'wa-attach-option')} onClick={() => handleClick('attach-camera')}>
            <div className="wa-attach-icon camera"><CameraGlyph size={24} /></div>
            <span className="wa-attach-label">{s.cameraOption}</span>
          </button>
          <button className={cls('attach-document', 'wa-attach-option')} onClick={() => handleClick('attach-document')}>
            <div className="wa-attach-icon document"><FileIcon size={24} /></div>
            <span className="wa-attach-label">{s.documentOption}</span>
          </button>
          <button className={cls('attach-location', 'wa-attach-option')} onClick={() => handleClick('attach-location')}>
            <div className="wa-attach-icon location"><MapPinIcon size={24} /></div>
            <span className="wa-attach-label">{s.locationOption}</span>
          </button>
          <button className={cls('attach-contact', 'wa-attach-option')} onClick={() => handleClick('attach-contact')}>
            <div className="wa-attach-icon contact"><UserIcon size={24} /></div>
            <span className="wa-attach-label">{s.contactOption}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ===== Gallery Screen =====
function GalleryScreen({ s, cls, handleClick, currentStep, tutorialActive }: {
  s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void;
  currentStep: TutorialStep | null; tutorialActive: boolean;
}) {
  return (
    <div className="gallery-screen">
      <div className="gallery-header">
        <div className="gallery-title">{s.selectPhoto}</div>
      </div>
      <div className="gallery-grid">
        {galleryPhotos.map((photo) => {
          // In tutorial mode, any gallery photo click should work for step sp-5
          const isAnyGalleryTarget = tutorialActive && currentStep?.targetElementId.startsWith('gallery-photo-');
          const photoIsHighlighted = isAnyGalleryTarget && photo.id === 'gallery-photo-1';
          const photoCls = photoIsHighlighted
            ? 'gallery-item tutorial-highlight'
            : (isAnyGalleryTarget && photo.id !== 'gallery-photo-1' ? 'gallery-item' : cls(photo.id, 'gallery-item'));

          return (
            <div
              key={photo.id}
              id={photo.id}
              className={photoCls}
              onClick={() => handleClick(photo.id)}
            >
              <PhotoThumb photo={photo} className="gallery-photo" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== Photo Preview =====
function PhotoPreview({ s, cls, handleClick, selectedPhoto }: {
  s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void; selectedPhoto: GalleryPhoto | null;
}) {
  const photo = selectedPhoto || galleryPhotos[0];
  return (
    <div className="photo-preview-screen">
      <div className="photo-preview-header">
        <div className="wa-chat-avatar" style={{ background: '#00a884', color: '#fff', fontWeight: 600 }}>A</div>
        <div className="gallery-title">Alex</div>
      </div>
      <div className="photo-preview-body">
        <PhotoThumb photo={photo} className="photo-preview-img" />
      </div>
      <div className="photo-preview-footer">
        <input className="photo-caption-input" placeholder={s.typeMessage} readOnly />
        <button
          id="btn-send-photo"
          className={cls('btn-send-photo', 'btn-send-photo')}
          onClick={() => handleClick('btn-send-photo')}
          title={s.sendPhoto}
        >
          <SendIcon size={20} />
        </button>
      </div>
    </div>
  );
}

// ===== Message Sent Screen =====
function MessageSentScreen({ s, selectedPhoto }: { s: any; selectedPhoto: GalleryPhoto | null }) {
  const photo = selectedPhoto || galleryPhotos[0];
  return (
    <div className="message-sent-screen">
      <div className="wa-chat-header">
        <div className="wa-chat-avatar" style={{ background: '#00a884', color: '#fff', fontWeight: 600 }}>A</div>
        <div className="wa-chat-name">Alex</div>
      </div>
      <div className="wa-chat-body">
        <div className="wa-chat-bubble received">
          <div>Hey! How are you? 😊</div>
          <div className="bubble-time">10:28 AM</div>
        </div>
        <div className="wa-chat-bubble sent">
          <div>I'm good! Let me send you that photo.</div>
          <div className="bubble-time">10:30 AM ✓✓</div>
        </div>
        <div className="wa-chat-photo-bubble">
          <PhotoThumb photo={photo} className="wa-chat-photo-img" />
          <div className="wa-chat-photo-meta">
            <span>10:31 AM</span>
            <span>✓✓</span>
          </div>
        </div>
      </div>
      <div className="wa-photo-sent-note">{s.photoSent}</div>
    </div>
  );
}

// ===== Clock Main =====
function ClockMain({ s, cls, handleClick }: { s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void }) {
  return (
    <div className="clock-screen">
      <div className="clock-header">
        <div className="clock-header-title">{s.clockTitle}</div>
      </div>
      <div className="clock-tabs">
        <button
          id="tab-alarm"
          className={cls('tab-alarm', 'clock-tab')}
          onClick={() => handleClick('tab-alarm')}
        >
          {s.alarmTab}
        </button>
        <button className={cls('tab-worldclock', 'clock-tab')} onClick={() => handleClick('tab-worldclock')}>
          {s.worldClockTab}
        </button>
        <button className={cls('tab-timer', 'clock-tab')} onClick={() => handleClick('tab-timer')}>
          {s.timerTab}
        </button>
        <button className={cls('tab-stopwatch', 'clock-tab')} onClick={() => handleClick('tab-stopwatch')}>
          {s.stopwatchTab}
        </button>
      </div>
      <div className="clock-body clock-body-center">
        <div className="clock-analog-ring">
          <div className="clock-analog-hand hour-hand" />
          <div className="clock-analog-hand minute-hand" />
          <div className="clock-analog-center" />
        </div>
        <div className="clock-digital-time">9:41</div>
        <div className="clock-digital-date">Sunday, Oct 11</div>
      </div>
    </div>
  );
}

// ===== Clock Alarm List =====
function ClockAlarmList({ s, cls, handleClick }: { s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void }) {
  return (
    <div className="clock-screen">
      <div className="clock-header">
        <div className="clock-header-title">{s.clockTitle}</div>
      </div>
      <div className="clock-tabs">
        <button className="clock-tab active">{s.alarmTab}</button>
        <button className={cls('tab-worldclock', 'clock-tab')} onClick={() => handleClick('tab-worldclock')}>{s.worldClockTab}</button>
        <button className={cls('tab-timer', 'clock-tab')} onClick={() => handleClick('tab-timer')}>{s.timerTab}</button>
        <button className={cls('tab-stopwatch', 'clock-tab')} onClick={() => handleClick('tab-stopwatch')}>{s.stopwatchTab}</button>
      </div>
      <div className="clock-body">
        <div className="alarm-list">
          <div className="alarm-item">
            <div>
              <div className="alarm-time-display">6:30 AM</div>
              <div className="alarm-label">Weekdays</div>
            </div>
            <button className="alarm-toggle on" aria-label="Alarm on" />
          </div>
          <div className="alarm-item">
            <div>
              <div className="alarm-time-display">8:00 AM</div>
              <div className="alarm-label">Weekends</div>
            </div>
            <button className="alarm-toggle" aria-label="Alarm off" />
          </div>
        </div>
        <button
          id="btn-add-alarm"
          className={cls('btn-add-alarm', 'btn-add-alarm')}
          onClick={() => handleClick('btn-add-alarm')}
        >
          <span className="btn-add-alarm-plus">+</span> {s.addAlarm}
        </button>
      </div>
    </div>
  );
}

// ===== Clock Add Alarm =====
function ClockAddAlarm({ s, cls, handleClick, hour, minute, amPm, setHour, setMinute, setAmPm }: {
  s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void;
  hour: number; minute: number; amPm: 'AM' | 'PM';
  setHour: (h: number) => void; setMinute: (m: number) => void; setAmPm: (v: 'AM' | 'PM') => void;
}) {
  const incHour = () => setHour(hour >= 12 ? 1 : hour + 1);
  const decHour = () => setHour(hour <= 1 ? 12 : hour - 1);
  const incMin = () => setMinute(minute >= 59 ? 0 : minute + 1);
  const decMin = () => setMinute(minute <= 0 ? 59 : minute - 1);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="clock-screen">
      <div className="clock-header">
        <div className="clock-header-title">{s.alarmTime}</div>
      </div>
      <div className="clock-body">
        <div className="add-alarm-screen">
          <div className="time-picker">
            <div className="time-spinner">
              <button className="time-spinner-btn" onClick={incHour}>▲</button>
              <div className="time-display">{pad(hour)}</div>
              <button className="time-spinner-btn" onClick={decHour}>▼</button>
              <div className="time-spinner-label">{s.setHour}</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-spinner">
              <button className="time-spinner-btn" onClick={incMin}>▲</button>
              <div className="time-display">{pad(minute)}</div>
              <button className="time-spinner-btn" onClick={decMin}>▼</button>
              <div className="time-spinner-label">{s.setMinute}</div>
            </div>
            <div className="am-pm-toggle">
              <button
                className={`am-pm-btn ${amPm === 'AM' ? 'active' : ''}`}
                onClick={() => setAmPm('AM')}
              >
                {s.amLabel}
              </button>
              <button
                className={`am-pm-btn ${amPm === 'PM' ? 'active' : ''}`}
                onClick={() => setAmPm('PM')}
              >
                {s.pmLabel}
              </button>
            </div>
          </div>
          <div className="alarm-actions">
            <button className="btn-cancel-alarm" onClick={() => handleClick('btn-cancel-alarm')}>
              {s.cancelAlarm}
            </button>
            <button
              id="btn-save-alarm"
              className={cls('btn-save-alarm', 'btn-save-alarm')}
              onClick={() => handleClick('btn-save-alarm')}
            >
              {s.saveAlarm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Clock Alarm Saved =====
function ClockAlarmSaved({ s, hour, minute, amPm }: { s: any; hour: number; minute: number; amPm: 'AM' | 'PM' }) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    <div className="clock-screen">
      <div className="clock-header">
        <div className="clock-header-title">{s.clockTitle}</div>
      </div>
      <div className="clock-body">
        <div className="alarm-saved-screen">
          <div className="alarm-saved-icon"><ClockIcon size={46} /></div>
          <div className="alarm-saved-text">{s.alarmSaved}</div>
          <div className="alarm-saved-time">{pad(hour)}:{pad(minute)} {amPm}</div>
        </div>
      </div>
    </div>
  );
}

// ===== Settings Main =====
function SettingsMain({ s, cls, handleClick }: { s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void }) {
  const items = [
    { id: 'setting-wifi', glyph: <WifiIcon size={21} />, label: s.wifiSetting, sub: s.wifiOff, colorClass: 'wifi' },
    { id: 'setting-bluetooth', glyph: <BluetoothIcon size={21} />, label: s.bluetoothSetting, sub: s.wifiOff, colorClass: 'bluetooth' },
    { id: 'setting-display', glyph: <BrightnessIcon size={21} />, label: s.displaySetting, sub: '', colorClass: 'display' },
    { id: 'setting-sound', glyph: <VolumeIcon size={21} />, label: s.soundSetting, sub: '', colorClass: 'sound' },
  ];

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <div className="settings-header-title">{s.settingsTitle}</div>
      </div>
      <div className="settings-list">
        {items.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className={cls(item.id, 'settings-item')}
            onClick={() => handleClick(item.id)}
          >
            <div className={`settings-icon ${item.colorClass}`}>{item.glyph}</div>
            <div className="settings-item-text">
              <div className="settings-item-title">{item.label}</div>
              {item.sub && <div className="settings-item-subtitle">{item.sub}</div>}
            </div>
            <div className="settings-item-chevron">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Settings WiFi =====
function SettingsWifi({ s, cls, handleClick }: { s: any; cls: (id: string, base: string) => string; handleClick: (id: string) => void }) {
  const [on, setOn] = useState(false);
  return (
    <div className="settings-screen">
      <div className="settings-header">
        <div className="settings-header-title">{s.wifiSetting}</div>
      </div>
      <div className="settings-list">
        <div
          id="setting-wifi-toggle"
          className={cls('setting-wifi-toggle', 'settings-item')}
          onClick={() => {
            setOn(true);
            handleClick('setting-wifi-toggle');
          }}
        >
          <div className="settings-icon wifi"><WifiIcon size={21} /></div>
          <div className="settings-item-text">
            <div className="settings-item-title">{s.wifiSetting}</div>
            <div className="settings-item-subtitle">{on ? s.wifiOn : s.wifiOff}</div>
          </div>
          <div className={`wifi-switch ${on ? 'on' : ''}`}>
            <div className="wifi-switch-knob" />
          </div>
        </div>
        {on && (
          <div className="wifi-success">
            <div className="wifi-success-icon"><WifiIcon size={48} /></div>
            <div className="wifi-success-text">{s.wifiTurnedOn}</div>
          </div>
        )}
      </div>
    </div>
  );
}