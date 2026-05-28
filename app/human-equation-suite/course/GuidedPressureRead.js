'use client';
import { useState } from 'react';

const getChoiceFeedback = (step, choice) => {
  if (!choice) return null;
  if (choice.coaching) return choice.coaching;
  if (choice.value === step.preferredAnswer || choice.label === step.preferredAnswer) {
    return step.preferredCoaching || 'Strong read. This protects the factor while keeping the next leadership move clear.';
  }
  return step.nonPreferredCoaching || 'That protects something important, but pressure may be narrowing the read. Add one move that preserves dignity, clarity, or reality before you close.';
};

export default function GuidedPressureRead({
  factorId,
  scenarioTitle,
  scenarioContext,
  steps = [],
  selectedAnswers = {},
  onSelectionChange,
  completed = false,
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStepIndex = completed ? Math.max(steps.length - 1, 0) : Math.min(activeStepIndex, Math.max(steps.length - 1, 0));
  const currentStep = steps[currentStepIndex];
  const selectedChoiceIndex = selectedAnswers[currentStepIndex];
  const selectedChoice = currentStep?.choices?.[selectedChoiceIndex];
  const coaching = getChoiceFeedback(currentStep || {}, selectedChoice);
  const canAdvance = selectedChoiceIndex !== undefined;
  const stepCount = steps.length;

  const handleNext = () => {
    if (!canAdvance) return;
    if (currentStepIndex === stepCount - 1) {
      onSelectionChange?.(currentStepIndex, selectedChoiceIndex, { markComplete: true });
      return;
    }
    setActiveStepIndex((index) => Math.min(index + 1, stepCount - 1));
  };

  return (
    <div className="guided-pressure-read" data-factor={factorId}>
      <div className="guided-pressure-read__intro">
        <p className="eyebrow">Let’s read this together.</p>
        <h3>{scenarioTitle}</h3>
        <p>{scenarioContext}</p>
      </div>

      {currentStep ? (
        <article className="guided-pressure-read__step top-space-sm">
          <div className="guided-pressure-read__meta">
            <span>Step {currentStepIndex + 1} of {stepCount}</span>
            <span>{currentStep.stepLabel}</span>
          </div>
          <h3>{currentStep.prompt}</h3>
          <p>First, notice what pressure is doing. Then choose the read we can calibrate from together.</p>
          <div className="button-grid" role="group" aria-label={`${currentStep.stepLabel} choices`}>
            {(currentStep.choices || []).map((choice, index) => (
              <button
                key={choice.label}
                type="button"
                className={`help-answer-chip ${selectedChoiceIndex === index ? 'selected' : ''}`}
                aria-pressed={selectedChoiceIndex === index}
                onClick={() => onSelectionChange?.(currentStepIndex, index)}
              >
                {choice.label}
              </button>
            ))}
          </div>

          {selectedChoice ? (
            <div className="guided-pressure-read__coaching top-space-sm" aria-live="polite">
              <p><strong>Coaching read:</strong> {coaching}</p>
              <p><strong>Micro insight:</strong> {selectedChoice.microInsight || currentStep.microInsight}</p>
              <p><strong>Leadership move underneath it:</strong> {currentStep.leadershipMove}</p>
              <button type="button" className="button primary" onClick={handleNext}>
                {currentStepIndex === stepCount - 1 ? 'Finish guided read' : 'Next coaching step'}
              </button>
            </div>
          ) : null}
        </article>
      ) : null}

      {completed ? (
        <div className="guided-pressure-read__debrief top-space-sm">
          <h3>Mini debrief</h3>
          <p><strong>What we practiced:</strong> {currentStep?.debrief?.practiced || steps[0]?.debrief?.practiced}</p>
          <p><strong>What pressure tried to do:</strong> {currentStep?.debrief?.pressure || steps[0]?.debrief?.pressure}</p>
          <p><strong>What leadership move protected the factor:</strong> {currentStep?.debrief?.protected || steps[0]?.debrief?.protected}</p>
        </div>
      ) : null}
    </div>
  );
}
