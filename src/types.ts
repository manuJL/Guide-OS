// Language types
export type Language = 'en' | 'hi' | 'te';

// Phone screen states
export type PhoneScreen = 
  | 'home'
  | 'whatsapp-contacts'
  | 'whatsapp-chat'
  | 'whatsapp-attachment-menu'
  | 'gallery'
  | 'photo-preview'
  | 'message-sent'
  | 'clock-main'
  | 'clock-alarm-list'
  | 'clock-add-alarm'
  | 'clock-alarm-saved'
  | 'settings-main'
  | 'settings-wifi';

// Tutorial types
export type TutorialId = 'send-photo' | 'set-alarm' | 'turn-on-wifi';

export interface TutorialStep {
  id: string;
  screen: PhoneScreen;
  targetElementId: string;
  instruction: Record<Language, string>;
  targetLabel: Record<Language, string>;
  whyThisStep: Record<Language, string>;
}

export interface Tutorial {
  id: TutorialId;
  title: Record<Language, string>;
  steps: TutorialStep[];
}

// Tutorial engine state
export interface TutorialState {
  activeTutorial: Tutorial | null;
  currentStepIndex: number;
  isComplete: boolean;
  wrongTapMessage: string | null;
}

// Chat message types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

// Intent classification
export type IntentType = 'send-photo' | 'set-alarm' | 'turn-on-wifi' | 'unknown' | 'ambiguous';

export interface ClassifiedIntent {
  type: IntentType;
  confidence: number;
  detectedLanguage: Language;
}

// Contact for simulated WhatsApp
export interface Contact {
  id: string;
  name: string;
  avatar: string; // emoji or letter
  lastMessage: string;
  time: string;
  unread: number;
}

// Gallery photo
export interface GalleryPhoto {
  id: string;
  color: string; // gradient colors for simulated photos
  label: string;
  gradient: string;
}

// Voice recognition state
export type VoiceState = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported';
