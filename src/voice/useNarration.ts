import { useCallback, useEffect, useRef, useState } from 'react';
import { Language } from '../types';

export const SPEECH_LANG_CODE: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
};

const VOICE_PREFS: Record<Language, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US', 'en-AU', 'en-CA', 'en'],
  hi: ['hi-IN', 'hi'],
  te: ['te-IN', 'te'],
};

function normalizeLang(lang: string): string {
  return lang.toLowerCase().replace('_', '-');
}

function pickVoice(lang: Language, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  const prefs = VOICE_PREFS[lang];
  for (const code of prefs) {
    const found = voices.find(v => normalizeLang(v.lang) === code);
    if (found) return found;
  }
  for (const code of prefs) {
    const base = code.split('-')[0];
    const found = voices.find(v => normalizeLang(v.lang).startsWith(`${base}-`));
    if (found) return found;
  }
  return null;
}

function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export type NarrationStatus = 'idle' | 'speaking' | 'paused' | 'unsupported';

export interface Narration {
  supported: boolean;
  voiceAvailable: boolean;
  status: NarrationStatus;
  muted: boolean;
  autoNarrate: boolean;
  speak: (text: string) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  toggleAuto: () => void;
  setAuto: (auto: boolean) => void;
}

export function useNarration(lang: Language): Narration {
  const supported = isSpeechSupported();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [status, setStatus] = useState<NarrationStatus>(supported ? 'idle' : 'unsupported');
  const [muted, setMutedState] = useState(false);
  const [autoNarrate, setAutoState] = useState(true);

  const mutedRef = useRef(muted);
  const autoRef = useRef(autoNarrate);
  const langRef = useRef(lang);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pendingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    autoRef.current = autoNarrate;
  }, [autoNarrate]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener('voiceschanged', load);
    return () => {
      synth.cancel();
      synth.removeEventListener('voiceschanged', load);
    };
  }, [supported]);

  const cancel = useCallback(() => {
    if (pendingTimerRef.current !== null) {
      window.clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
    if (!supported) {
      setStatus('unsupported');
      return;
    }
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setStatus('idle');
  }, [supported]);

  const speak = useCallback((text: string) => {
    if (!supported) {
      setStatus('unsupported');
      return;
    }
    if (mutedRef.current) {
      cancel();
      return;
    }

    const synth = window.speechSynthesis;
    if (pendingTimerRef.current !== null) {
      window.clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG_CODE[langRef.current];
    const voice = pickVoice(langRef.current, synth.getVoices());
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => {
      utteranceRef.current = null;
      setStatus('idle');
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setStatus('idle');
    };
    utterance.onpause = () => setStatus('paused');
    utterance.onresume = () => setStatus('speaking');

    const doSpeak = () => {
      pendingTimerRef.current = null;
      utteranceRef.current = utterance;
      synth.speak(utterance);
    };

    if (synth.speaking || synth.pending) {
      pendingTimerRef.current = window.setTimeout(doSpeak, 50);
    } else {
      doSpeak();
    }
  }, [supported, cancel]);

  const pause = useCallback(() => {
    if (!supported) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStatus('speaking');
    }
  }, [supported]);

  const setMuted = useCallback((muted: boolean) => {
    if (mutedRef.current === muted) return;
    mutedRef.current = muted;
    setMutedState(muted);
    if (muted && supported) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setStatus('idle');
    }
  }, [supported]);

  const toggleMute = useCallback(() => {
    setMuted(!mutedRef.current);
  }, [setMuted]);

  const setAuto = useCallback((auto: boolean) => {
    autoRef.current = auto;
    setAutoState(auto);
  }, []);

  const toggleAuto = useCallback(() => {
    setAuto(!autoRef.current);
  }, [setAuto]);

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  const hasLoadedVoices = voices.length > 0;
  const voiceAvailable = supported && (!hasLoadedVoices || pickVoice(lang, voices) !== null);

  return {
    supported,
    voiceAvailable,
    status: supported ? (muted ? 'idle' : status) : 'unsupported',
    muted,
    autoNarrate,
    speak,
    cancel,
    pause,
    resume,
    toggleMute,
    setMuted,
    toggleAuto,
    setAuto,
  };
}