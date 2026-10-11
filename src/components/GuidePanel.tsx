import React, { KeyboardEvent, useEffect, useRef } from 'react';
import { Language, Tutorial } from '../types';
import { t } from '../i18n/strings';
import { NarrationStatus } from '../voice/useNarration';

interface GuidePanelProps {
  tutorial: Tutorial;
  stepIndex: number;
  isComplete: boolean;
  lang: Language;
  showWhy: boolean;
  onToggleWhy: () => void;
  speechStatus: NarrationStatus;
  voiceAvailable: boolean;
  muted: boolean;
  autoNarrate: boolean;
  onReplay: () => void;
  onPause: () => void;
  onResume: () => void;
  onToggleMute: () => void;
  onToggleAuto: () => void;
  onBack: () => void;
  onRestart: () => void;
  onExit: () => void;
  onTryAnother: () => void;
}

export default function GuidePanel({
  tutorial,
  stepIndex,
  isComplete,
  lang,
  showWhy,
  onToggleWhy,
  speechStatus,
  voiceAvailable,
  muted,
  autoNarrate,
  onReplay,
  onPause,
  onResume,
  onToggleMute,
  onToggleAuto,
  onBack,
  onRestart,
  onExit,
  onTryAnother,
}: GuidePanelProps): React.ReactElement | null {
  const s = t(lang);
  const panelRef = useRef<HTMLDivElement>(null);
  const totalSteps = tutorial.steps.length;
  const currentStep = tutorial.steps[stepIndex];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    panel.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'nearest' });
  }, [stepIndex, isComplete]);

  const handleWhyKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleWhy();
    }
  };

  const speechStatusLabel = () => {
    if (!voiceAvailable) {
      return <div className="speech-status unavailable">🔇 {s.speechUnavailable}</div>;
    }
    if (muted) {
      return <div className="speech-status idle">🔇 {s.mutedNow}</div>;
    }
    switch (speechStatus) {
      case 'speaking':
        return <div className="speech-status speaking">🔊 {s.speakingNow}</div>;
      case 'paused':
        return <div className="speech-status paused">⏸ {s.pausedNow}</div>;
      case 'unsupported':
        return <div className="speech-status unavailable">🔇 {s.speechUnavailable}</div>;
      default:
        return <div className="speech-status idle">🔈 {s.soundOn}</div>;
    }
  };

  const controls = (
    <>
      <div className="speech-status-wrap">{speechStatusLabel()}</div>
      <div className="speech-controls">
        <button type="button" onClick={onReplay} title={s.replayButton}>
          🔁 {s.replayButton}
        </button>
        {speechStatus === 'paused' ? (
          <button type="button" onClick={onResume} title={s.resumeButton}>
            ▶ {s.resumeButton}
          </button>
        ) : (
          <button
            type="button"
            onClick={onPause}
            disabled={speechStatus !== 'speaking'}
            title={s.pauseButton}
          >
            ⏸ {s.pauseButton}
          </button>
        )}
        <button type="button" onClick={onToggleMute} title={muted ? s.unmuteButton : s.muteButton}>
          {muted ? `🔇 ${s.unmuteButton}` : `🔊 ${s.muteButton}`}
        </button>
        <button
          type="button"
          onClick={onToggleAuto}
          className={autoNarrate ? 'active' : ''}
          title={autoNarrate ? s.autoNarrateOn : s.autoNarrateOff}
        >
          {autoNarrate ? s.autoNarrateOn : s.autoNarrateOff}
        </button>
      </div>
    </>
  );

  const stepLabel = isComplete
    ? s.completedLabel
    : s.stepOf.replace('{current}', String(stepIndex + 1)).replace('{total}', String(totalSteps));

  if (isComplete) {
    return (
      <div ref={panelRef} className="manual-card manual-complete">
        <div className="manual-header">
          <span className="manual-title">{tutorial.title[lang]}</span>
          <span className="manual-step-pill">{stepLabel}</span>
        </div>
        <div className="completion-icon">🎉</div>
        <div className="completion-title">{s.completionTitle}</div>
        <div className="completion-message">{s.completionMessage}</div>
        {currentStep?.instruction && (
          <div className="tutorial-instruction">{currentStep.instruction[lang]}</div>
        )}
        {controls}
        <div className="manual-nav-controls">
          <button type="button" onClick={onRestart}>
            ↺ {s.restartTutorial}
          </button>
          <button type="button" onClick={onTryAnother}>
            {s.tryAnotherTask}
          </button>
          <button type="button" className="btn-exit" onClick={onExit}>
            ✕ {s.exitTutorial}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="manual-card">
      <div className="manual-header">
        <span className="manual-title">{tutorial.title[lang]}</span>
        <span className="manual-step-pill">{stepLabel}</span>
      </div>
      <div className="progress-bar" aria-label={`${stepIndex + 1} ${s.stepOf}/${totalSteps}`}>
        <div
          className="progress-bar-fill"
          style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <div className="tutorial-instruction">{currentStep.instruction[lang]}</div>
      <div className="manual-target">
        <span className="manual-target-label">👉 {s.tapTargetLabel}</span>
        <span className="manual-target-name">{currentStep.targetLabel[lang]}</span>
      </div>
      <div
        className="tutorial-why"
        onClick={onToggleWhy}
        role="button"
        tabIndex={0}
        onKeyDown={handleWhyKeyDown}
        aria-expanded={showWhy}
      >
        <span className="tutorial-why-caret">{showWhy ? '▾' : '▸'}</span>
        <span>{s.whyThisStep}</span>
      </div>
      {showWhy && <div className="tutorial-why-content">{currentStep.whyThisStep[lang]}</div>}
      {controls}
      <div className="manual-nav-controls">
        <button type="button" onClick={onBack} disabled={stepIndex === 0}>
          ← {s.backButton}
        </button>
        <button type="button" onClick={onRestart}>
          ↺ {s.restartTutorial}
        </button>
        <button type="button" className="btn-exit" onClick={onExit}>
          ✕ {s.exitTutorial}
        </button>
      </div>
    </div>
  );
}