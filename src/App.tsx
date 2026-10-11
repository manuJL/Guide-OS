import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PhoneScreen, ChatMessage, TutorialState,
  VoiceState, GalleryPhoto,
} from './types';
import { t } from './i18n/strings';
import { classifyIntent, detectLanguage, exampleRequests } from './intentClassifier';
import { tutorials } from './tutorials';
import PhoneSimulator from './PhoneSimulator';
import GuidePanel from './components/GuidePanel';
import { useNarration } from './voice/useNarration';
import { getAllGalleryPhotos } from './phoneData';
import { GuideMark } from './icons';

let msgIdCounter = 0;
function newMsgId() {
  return `msg-${++msgIdCounter}-${Date.now()}`;
}

// Speech recognition language codes
const speechLangCodes: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
};

const LANG_STORAGE_KEY = 'guideos-lang';

function loadSavedLanguage(): 'en' | 'hi' | 'te' {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'en' || stored === 'hi' || stored === 'te') return stored;
  } catch (e) {
    // localStorage unavailable (private mode, blocked) — default to English
  }
  return 'en';
}

export default function App() {
  // ===== State =====
  const [lang, setLang] = useState<'en' | 'hi' | 'te'>(loadSavedLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [phoneScreen, setPhoneScreen] = useState<PhoneScreen>('home');
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    activeTutorial: null,
    currentStepIndex: 0,
    isComplete: false,
    wrongTapMessage: null,
  });
  const [pendingTutorialId, setPendingTutorialId] = useState<string | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [showWhy, setShowWhy] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [phoneToast, setPhoneToast] = useState<string | null>(null);
  const [alarmHour, setAlarmHour] = useState(7);
  const [alarmMinute, setAlarmMinute] = useState(0);
  const [alarmAmPm, setAlarmAmPm] = useState<'AM' | 'PM'>('AM');
  const [showTaskPicker, setShowTaskPicker] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const wrongTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);

  const s = t(lang);

  const narration = useNarration(lang);

  // Persist the chosen language
  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      // ignore storage errors
    }
  }, [lang]);

  // ===== Narration: single effect keyed on tutorial state + speech prefs =====
  // tutorialState, stepIndex, language, autoNarrate, muted and completed all
  // feed one key. Any change cancels the previous utterance and (if narration
  // is enabled and unmuted) speaks the current text. The lastSpokenKeyRef
  // guards against React StrictMode double-invocation in dev.
  const lastSpokenKeyRef = useRef<string | null>(null);
  const completionSpokenRef = useRef(false);

  useEffect(() => {
    const active = tutorialState.activeTutorial;
    const isComplete = tutorialState.isComplete;
    const auto = narration.autoNarrate;
    const mutedState = narration.muted;

    const key = active
      ? (isComplete
        ? `complete:${active.id}:${lang}:${auto ? 'a' : 'x'}:${mutedState ? 'm' : 's'}`
        : `${active.id}:${tutorialState.currentStepIndex}:${lang}:${auto ? 'a' : 'x'}:${mutedState ? 'm' : 's'}`)
      : null;

    // Unchanged state (e.g. StrictMode re-run): do nothing.
    if (!key || lastSpokenKeyRef.current === key) return;

    lastSpokenKeyRef.current = key;
    narration.cancel();

    if (!auto || mutedState) return;

    if (isComplete) {
      if (completionSpokenRef.current) return;
      completionSpokenRef.current = true;
      narration.speak(s.completionMessage);
      return;
    }

    completionSpokenRef.current = false;
    const step = active!.steps[tutorialState.currentStepIndex];
    if (step) narration.speak(step.instruction[lang]);
  }, [
    tutorialState.activeTutorial,
    tutorialState.currentStepIndex,
    tutorialState.isComplete,
    lang,
    narration.autoNarrate,
    narration.muted,
    narration.speak,
    narration.cancel,
    s.completionMessage,
  ]);

  // ===== Init welcome message =====
  useEffect(() => {
    setMessages([{
      id: newMsgId(),
      sender: 'assistant',
      text: t(lang).welcomeMessage,
      timestamp: Date.now(),
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When lang changes, update welcome if it's the only message
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'assistant') {
        return [{ ...prev[0], text: t(lang).welcomeMessage }];
      }
      return prev;
    });
  }, [lang]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Clear wrong tap message after timeout
  useEffect(() => {
    if (tutorialState.wrongTapMessage) {
      if (wrongTapTimerRef.current) clearTimeout(wrongTapTimerRef.current);
      wrongTapTimerRef.current = setTimeout(() => {
        setTutorialState(prev => ({ ...prev, wrongTapMessage: null }));
      }, 3000);
    }
    return () => {
      if (wrongTapTimerRef.current) clearTimeout(wrongTapTimerRef.current);
    };
  }, [tutorialState.wrongTapMessage]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
      if (voiceIdleTimerRef.current) clearTimeout(voiceIdleTimerRef.current);
      if (wrongTapTimerRef.current) clearTimeout(wrongTapTimerRef.current);
    };
  }, []);

  // ===== Helpers =====
  const addAssistantMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, {
      id: newMsgId(),
      sender: 'assistant',
      text,
      timestamp: Date.now(),
    }]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, {
      id: newMsgId(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    }]);
  }, []);

  const showPhoneToast = useCallback((text: string) => {
    setPhoneToast(text);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setPhoneToast(null), 2400);
  }, []);

  // ===== Process a user request (shared by send + chips) =====
  const processRequest = useCallback((text: string) => {
    addUserMessage(text);
    setInputText('');
    setIsThinking(true);

    const detected = detectLanguage(text);
    const currentLang: 'en' | 'hi' | 'te' = detected !== 'en' ? detected : lang;
    if (detected !== 'en') setLang(detected);

    if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
    thinkingTimerRef.current = setTimeout(() => {
      const strings = t(currentLang);
      const intent = classifyIntent(text);

      switch (intent.type) {
        case 'send-photo':
          setShowTaskPicker(false);
          setPendingTutorialId('send-photo');
          addAssistantMessage(
            `📸 ${strings.taskRecognized}\n\n📋 ${tutorials['send-photo'].title[currentLang]}`
          );
          break;
        case 'set-alarm':
          setShowTaskPicker(false);
          setPendingTutorialId('set-alarm');
          addAssistantMessage(
            `⏰ ${strings.taskRecognized}\n\n📋 ${tutorials['set-alarm'].title[currentLang]}`
          );
          break;
        case 'turn-on-wifi':
          setShowTaskPicker(false);
          setPendingTutorialId('turn-on-wifi');
          addAssistantMessage(
            `📡 ${strings.taskRecognized}\n\n📋 ${tutorials['turn-on-wifi'].title[currentLang]}`
          );
          break;
        case 'manual':
          setShowTaskPicker(true);
          addAssistantMessage(
            `📖 ${strings.chooseTask}\n` +
            `• ${strings.sendPhotoChip}\n` +
            `• ${strings.setAlarmChip}\n` +
            `• ${strings.wifiChip}`
          );
          break;
        case 'ambiguous':
          addAssistantMessage(
            `${strings.ambiguousRequest}\n` +
            `• ${strings.sendPhotoChip}\n` +
            `• ${strings.setAlarmChip}\n` +
            `• ${strings.wifiChip}`
          );
          break;
        case 'unknown':
        default:
          addAssistantMessage(
            `${strings.taskNotSupported}\n` +
            `• ${strings.sendPhotoChip}\n` +
            `• ${strings.setAlarmChip}\n` +
            `• ${strings.wifiChip}`
          );
          break;
      }
      setIsThinking(false);
    }, 700);
  }, [lang, addAssistantMessage, addUserMessage]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    processRequest(text);
  }, [inputText, processRequest]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // ===== Task chip click =====
  const handleChipClick = useCallback((taskText: string) => {
    processRequest(taskText);
  }, [processRequest]);

  // ===== Start tutorial =====
  const startTutorial = useCallback((id?: string) => {
    const tutorialId = id ?? pendingTutorialId;
    if (!tutorialId || !tutorials[tutorialId]) return;

    const tutorial = tutorials[tutorialId];
    setTutorialState({
      activeTutorial: tutorial,
      currentStepIndex: 0,
      isComplete: false,
      wrongTapMessage: null,
    });
    setPhoneScreen(tutorial.steps[0].screen);
    setShowWhy(false);
    setSelectedPhoto(null);
    setShowTaskPicker(false);
  }, [pendingTutorialId]);

  // ===== "Give me manual" button =====
  const handleGiveMeManual = useCallback(() => {
    if (pendingTutorialId && tutorials[pendingTutorialId]) {
      startTutorial();
    } else {
      setShowTaskPicker(true);
    }
  }, [pendingTutorialId, startTutorial]);

  // ===== Select a task from the picker =====
  const handleSelectTask = useCallback((id: 'send-photo' | 'set-alarm' | 'turn-on-wifi') => {
    const exampleIdx = { 'send-photo': 0, 'set-alarm': 1, 'turn-on-wifi': 2 }[id];
    addUserMessage(exampleRequests[lang][exampleIdx]);
    setShowTaskPicker(false);
    setPendingTutorialId(id);
    startTutorial(id);
  }, [lang, startTutorial, addUserMessage]);

  // ===== Phone element click handler =====
  const handlePhoneElementClick = useCallback((elementId: string) => {
    const { activeTutorial, currentStepIndex, isComplete } = tutorialState;

    if (isComplete) {
      return;
    }

    if (!activeTutorial) {
      // No tutorial active — allow free navigation
      handleFreeNavigation(elementId);
      return;
    }

    const currentStep = activeTutorial.steps[currentStepIndex];

    // Check if this is the correct target
    const isCorrectTarget = checkCorrectTarget(elementId, currentStep.targetElementId);

    if (isCorrectTarget) {
      // Handle special actions for certain steps
      if (elementId.startsWith('gallery-photo-')) {
        const photo = getAllGalleryPhotos().find(p => p.id === elementId)
          || getAllGalleryPhotos()[0];
        setSelectedPhoto(photo);
      }

      // Advance to next step
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < activeTutorial.steps.length) {
        const nextStep = activeTutorial.steps[nextIndex];
        setTutorialState(prev => ({
          ...prev,
          currentStepIndex: nextIndex,
          wrongTapMessage: null,
          isComplete: nextStep.targetElementId === '',
        }));
        setPhoneScreen(nextStep.screen);
        setShowWhy(false);
      }
    } else {
      // Wrong tap
      setTutorialState(prev => ({
        ...prev,
        wrongTapMessage: s.wrongTapMessage,
      }));
    }
  }, [tutorialState, s.wrongTapMessage]);

  // Check if the clicked element matches the target
  function checkCorrectTarget(clicked: string, target: string): boolean {
    if (target === '') return false;
    if (clicked === target) return true;
    // Allow any gallery photo when target starts with gallery-photo-
    if (target.startsWith('gallery-photo-') && clicked.startsWith('gallery-photo-')) return true;
    return false;
  }

  // Free navigation (no tutorial)
  function handleFreeNavigation(elementId: string) {
    const demoOnly = () => showPhoneToast(s.demoOnlyToast);

    switch (elementId) {
      case 'app-whatsapp':
        setPhoneScreen('whatsapp-contacts');
        break;
      case 'app-clock':
        setPhoneScreen('clock-main');
        break;
      case 'app-settings':
        setPhoneScreen('settings-main');
        break;
      case 'app-photos':
      case 'app-camera':
      case 'app-phone':
      case 'app-messages':
      case 'app-chrome':
      case 'app-maps':
      case 'app-youtube':
      case 'app-gmail':
        demoOnly();
        break;
      case 'contact-alex':
      case 'contact-priya':
      case 'contact-raj':
      case 'contact-meera':
      case 'contact-amit':
        setPhoneScreen('whatsapp-chat');
        break;
      case 'btn-attach':
        setPhoneScreen('whatsapp-attachment-menu');
        break;
      case 'attach-gallery':
        setPhoneScreen('gallery');
        break;
      case 'attach-camera':
      case 'attach-document':
      case 'attach-location':
      case 'attach-contact':
        demoOnly();
        break;
      case 'tab-alarm':
        setPhoneScreen('clock-alarm-list');
        break;
      case 'tab-worldclock':
      case 'tab-timer':
      case 'tab-stopwatch':
        demoOnly();
        break;
      case 'btn-add-alarm':
        setPhoneScreen('clock-add-alarm');
        break;
      case 'btn-save-alarm':
        setPhoneScreen('clock-alarm-saved');
        break;
      case 'btn-cancel-alarm':
        setPhoneScreen('clock-alarm-list');
        break;
      case 'setting-wifi':
        setPhoneScreen('settings-wifi');
        break;
      case 'setting-wifi-toggle':
        setPhoneScreen('settings-wifi');
        break;
      case 'setting-bluetooth':
      case 'setting-display':
      case 'setting-sound':
        demoOnly();
        break;
      case 'wa-tab-status':
      case 'wa-tab-calls':
      case 'wa-emoji-btn':
      case 'wa-camera-btn':
        demoOnly();
        break;
      default:
        if (elementId.startsWith('gallery-photo-')) {
          const photo = getAllGalleryPhotos().find(p => p.id === elementId)
            || getAllGalleryPhotos()[0];
          setSelectedPhoto(photo);
          setPhoneScreen('photo-preview');
        } else if (elementId === 'btn-send-photo') {
          setPhoneScreen('message-sent');
        }
        break;
    }
  }

  // ===== Phone go home =====
  const handleGoHome = useCallback(() => {
    if (!tutorialState.activeTutorial) {
      setPhoneScreen('home');
    }
  }, [tutorialState.activeTutorial]);

  // ===== Tutorial controls =====
  const handleBack = useCallback(() => {
    if (!tutorialState.activeTutorial) return;
    const prevIndex = tutorialState.currentStepIndex - 1;
    if (prevIndex >= 0) {
      const prevStep = tutorialState.activeTutorial.steps[prevIndex];
      setTutorialState(prev => ({
        ...prev,
        currentStepIndex: prevIndex,
        isComplete: false,
        wrongTapMessage: null,
      }));
      setPhoneScreen(prevStep.screen);
      setShowWhy(false);
    }
  }, [tutorialState]);

  const handleRestart = useCallback(() => {
    if (!tutorialState.activeTutorial) return;
    const firstStep = tutorialState.activeTutorial.steps[0];
    setTutorialState(prev => ({
      ...prev,
      currentStepIndex: 0,
      isComplete: false,
      wrongTapMessage: null,
    }));
    setPhoneScreen(firstStep.screen);
    setShowWhy(false);
    setSelectedPhoto(null);
  }, [tutorialState]);

  const handleExitTutorial = useCallback(() => {
    narration.cancel();
    setTutorialState({
      activeTutorial: null,
      currentStepIndex: 0,
      isComplete: false,
      wrongTapMessage: null,
    });
    setPhoneScreen('home');
    setPendingTutorialId(null);
    setShowWhy(false);
    setShowTaskPicker(false);
  }, [narration.cancel]);

  const handleTryAnother = useCallback(() => {
    handleExitTutorial();
    addAssistantMessage(s.welcomeMessage);
  }, [handleExitTutorial, addAssistantMessage, s.welcomeMessage]);

  // ===== Speech: replay current step =====
  const handleReplay = useCallback(() => {
    const active = tutorialState.activeTutorial;
    if (!active) return;
    if (tutorialState.isComplete) {
      narration.speak(s.completionMessage);
    } else {
      const step = active.steps[tutorialState.currentStepIndex];
      if (step) narration.speak(step.instruction[lang]);
    }
  }, [tutorialState, lang, narration.speak, s.completionMessage]);

  // ===== Voice input =====
  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceState('unsupported');
      addAssistantMessage(s.voiceUnsupported);
      if (voiceIdleTimerRef.current) clearTimeout(voiceIdleTimerRef.current);
      voiceIdleTimerRef.current = setTimeout(() => setVoiceState('idle'), 3500);
      return;
    }

    if (listeningRef.current) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      listeningRef.current = false;
      if (voiceIdleTimerRef.current) clearTimeout(voiceIdleTimerRef.current);
      setVoiceState('idle');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = speechLangCodes[lang];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      listeningRef.current = true;
      setVoiceState('listening');
    };

    recognition.onresult = (event: any) => {
      listeningRef.current = false;
      setVoiceState('processing');
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      if (voiceIdleTimerRef.current) clearTimeout(voiceIdleTimerRef.current);
      voiceIdleTimerRef.current = setTimeout(() => setVoiceState('idle'), 600);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      listeningRef.current = false;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        addAssistantMessage(s.voiceError);
      }
      setVoiceState('error');
      if (voiceIdleTimerRef.current) clearTimeout(voiceIdleTimerRef.current);
      voiceIdleTimerRef.current = setTimeout(() => setVoiceState('idle'), 3500);
    };

    recognition.onend = () => {
      listeningRef.current = false;
      recognitionRef.current = null;
      if (voiceIdleTimerRef.current) clearTimeout(voiceIdleTimerRef.current);
      setVoiceState(prev => (prev === 'listening' || prev === 'processing') ? 'idle' : prev);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error('Speech recognition start failed:', e);
      listeningRef.current = false;
      setVoiceState('error');
      addAssistantMessage(s.voiceError);
    }
  }, [voiceState, lang, s, addAssistantMessage]);

  // ===== Derived values =====
  const currentStep = tutorialState.activeTutorial
    ? tutorialState.activeTutorial.steps[tutorialState.currentStepIndex]
    : null;

  const currentExamples = exampleRequests[lang];

  // ===== Render =====
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">
            <GuideMark size={40} />
          </div>
          <div className="logo-text">
            <span className="logo-name">{s.appName}</span>
            <span className="logo-tagline">{s.tagline}</span>
          </div>
        </div>
        <div className="language-selector">
          <label>{s.languageLabel}:</label>
          <div className="lang-buttons">
            {(['en', 'hi', 'te'] as const).map(l => (
              <button
                key={l}
                className={`lang-btn ${lang === l ? 'active' : ''}`}
                onClick={() => setLang(l)}
              >
                {l === 'en' ? s.english : l === 'hi' ? s.hindi : s.telugu}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Panel: Chat + Tutorial */}
        <div className="chat-panel">
          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.length === 0 && !isThinking && (
              <div className="chat-empty">{s.availableTasks}</div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="chat-message assistant">
                <div className="message-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Tasks */}
          {!tutorialState.activeTutorial && (
            <div className="suggested-tasks">
              <span className="suggested-tasks-label">{s.suggestedTasks}</span>
              <div className="task-chips">
                <button className="task-chip" onClick={() => handleChipClick(currentExamples[0])}>
                  📸 {s.sendPhotoChip}
                </button>
                <button className="task-chip" onClick={() => handleChipClick(currentExamples[1])}>
                  ⏰ {s.setAlarmChip}
                </button>
                <button className="task-chip" onClick={() => handleChipClick(currentExamples[2])}>
                  📡 {s.wifiChip}
                </button>
              </div>
            </div>
          )}

          {/* Give Me Manual + Task Picker */}
          {!tutorialState.activeTutorial && (
            <div className="manual-action">
              <button className="btn-manual" onClick={handleGiveMeManual}>
                📖 {s.manualButton}
              </button>
            </div>
          )}

          {showTaskPicker && !tutorialState.activeTutorial && (
            <div className="task-picker">
              <div className="task-picker-title">{s.chooseTask}</div>
              <button
                className="task-picker-option"
                onClick={() => handleSelectTask('send-photo')}
              >
                📸 {s.sendPhotoChip}
              </button>
              <button
                className="task-picker-option"
                onClick={() => handleSelectTask('set-alarm')}
              >
                ⏰ {s.setAlarmChip}
              </button>
              <button
                className="task-picker-option"
                onClick={() => handleSelectTask('turn-on-wifi')}
              >
                📡 {s.wifiChip}
              </button>
            </div>
          )}

          {/* Chat Input */}
          <div className="chat-input-area">
            <input
              className="chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={s.inputPlaceholder}
              disabled={!!tutorialState.activeTutorial}
            />
            <button
              className={`btn-mic ${voiceState === 'listening' ? 'listening' : ''}`}
              onClick={handleVoiceInput}
              disabled={!!tutorialState.activeTutorial}
              title={voiceState === 'listening' ? s.listeningState : 'Voice'}
            >
              {voiceState === 'listening' ? '⏹' : '🎤'}
            </button>
            <button
              className="btn-send"
              onClick={handleSend}
              disabled={!inputText.trim() || !!tutorialState.activeTutorial}
              title={s.sendButton}
            >
              ➤
            </button>
          </div>

          {/* Voice state indicator */}
          {voiceState === 'listening' && (
            <div className="voice-status listening">
              🔴 {s.listeningState}
            </div>
          )}
          {voiceState === 'processing' && (
            <div className="voice-status processing">
              ⏳ {s.processingState}
            </div>
          )}
          {voiceState === 'error' && (
            <div className="voice-status error">
              ⚠️ {s.voiceError}
            </div>
          )}
          {voiceState === 'unsupported' && (
            <div className="voice-status error">
              ⚠️ {s.voiceUnsupported}
            </div>
          )}

          {/* Start Tutorial Button */}
          {pendingTutorialId && !tutorialState.activeTutorial && (
            <div className="start-tutorial-section">
              <button className="btn-start-tutorial" onClick={() => startTutorial()} disabled={isThinking}>
                ▶ {s.startTutorial}
              </button>
            </div>
          )}
        </div>

        {/* Middle Panel: Guided Manual + Narration */}
        {tutorialState.activeTutorial && (
          <div className="manual-panel">
            <GuidePanel
              tutorial={tutorialState.activeTutorial}
              stepIndex={tutorialState.currentStepIndex}
              isComplete={tutorialState.isComplete}
              lang={lang}
              showWhy={showWhy}
              onToggleWhy={() => setShowWhy(!showWhy)}
              speechStatus={narration.status}
              voiceAvailable={narration.voiceAvailable}
              muted={narration.muted}
              autoNarrate={narration.autoNarrate}
              onReplay={handleReplay}
              onPause={narration.pause}
              onResume={narration.resume}
              onToggleMute={narration.toggleMute}
              onToggleAuto={narration.toggleAuto}
              onBack={handleBack}
              onRestart={handleRestart}
              onExit={handleExitTutorial}
              onTryAnother={handleTryAnother}
            />
          </div>
        )}

        {/* Right Panel: Phone */}
        <div className="phone-panel">
          <div className="phone-label">{s.simulatedPhone}</div>

          <PhoneSimulator
            screen={phoneScreen}
            lang={lang}
            currentStep={currentStep}
            tutorialActive={!!tutorialState.activeTutorial}
            onElementClick={handlePhoneElementClick}
            onGoHome={handleGoHome}
            selectedPhoto={selectedPhoto}
            setSelectedPhoto={setSelectedPhoto}
            alarmHour={alarmHour}
            alarmMinute={alarmMinute}
            alarmAmPm={alarmAmPm}
            setAlarmHour={setAlarmHour}
            setAlarmMinute={setAlarmMinute}
            setAlarmAmPm={setAlarmAmPm}
            toast={phoneToast}
          />

          <div className="phone-disclaimer">{s.simulationDisclaimer}</div>
        </div>
      </div>

      {/* Wrong tap toast */}
      {tutorialState.wrongTapMessage && (
        <div className="wrong-tap-toast">
          ⚠️ {tutorialState.wrongTapMessage}
        </div>
      )}
    </div>
  );
}