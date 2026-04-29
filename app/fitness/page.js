"use client";

import { useEffect, useMemo, useState } from "react";

const EXERCISE_DURATION = 30;

const exercises = [
  { name: "Seated Fast March", cue: "Drive knees up quickly, stay tall", icon: "🏃‍♂️" },
  { name: "Wall Push-Ups", cue: "Chest to wall, push strong", icon: "🧱" },
  { name: "Seated Windmills", cue: "Reach across body, twist gently", icon: "🌪️" },
  { name: "Chair Tricep Presses", cue: "Hands on chair, press up slightly", icon: "💪" },
  { name: "Seated Torso Twists", cue: "Rotate side to side with control", icon: "🔄" },
  { name: "Wall Angels", cue: "Slide arms up/down against wall", icon: "🙆‍♂️" },
  { name: "Chair Sit-to-Stands", cue: "Stand up, sit down with control", icon: "⬆️" },
  { name: "Seated Punches", cue: "Fast punches, engage core", icon: "🥊" },
  { name: "Seated Knee Lifts", cue: "Lift knees toward chest", icon: "🦵" },
  { name: "Shoulder Blade Squeezes", cue: "Pull shoulders back tight", icon: "🧍‍♂️" },
  { name: "Calf Raises + Arm Raises", cue: "Raise heels + arms together", icon: "⚖️" },
  { name: "Deep Breathing Reset", cue: "Slow inhale, slow exhale", icon: "🫁" }
];

function playBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.2);
}

export default function FitnessPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXERCISE_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentExercise = exercises[currentIndex];
  const progressText = useMemo(
    () => `Exercise ${Math.min(currentIndex + 1, exercises.length)} of ${exercises.length}`,
    [currentIndex]
  );

  useEffect(() => {
    if (!isRunning || isComplete) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playBeep();
          setCurrentIndex((index) => {
            if (index >= exercises.length - 1) {
              setIsComplete(true);
              setIsRunning(false);
              return index;
            }
            return index + 1;
          });
          return EXERCISE_DURATION;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, isComplete]);

  const handleStart = () => {
    if (isComplete) {
      return;
    }
    setIsRunning(true);
  };

  const handlePauseResume = () => {
    if (isComplete) {
      return;
    }
    setIsRunning((prev) => !prev);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setTimeLeft(EXERCISE_DURATION);
    setIsComplete(false);
    setIsRunning(false);
  };

  const handleSkip = () => {
    if (isComplete) {
      return;
    }

    playBeep();
    setTimeLeft(EXERCISE_DURATION);
    setCurrentIndex((index) => {
      if (index >= exercises.length - 1) {
        setIsComplete(true);
        setIsRunning(false);
        return index;
      }
      return index + 1;
    });
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        {isComplete ? (
          <>
            <div style={styles.icon}>✅</div>
            <h1 style={styles.title}>Workout Complete</h1>
            <p style={styles.cue}>Great job completing your 6-minute chair workout.</p>
          </>
        ) : (
          <>
            <div style={styles.icon}>{currentExercise.icon}</div>
            <h1 style={styles.title}>{currentExercise.name}</h1>
            <p style={styles.cue}>{currentExercise.cue}</p>
            <div style={styles.timer}>{timeLeft}</div>
            <p style={styles.progress}>{progressText}</p>
          </>
        )}

        <div style={styles.buttonRow}>
          <button type="button" style={styles.button} onClick={handleStart} disabled={isRunning || isComplete}>
            Start
          </button>
          <button type="button" style={styles.button} onClick={handlePauseResume} disabled={isComplete}>
            {isRunning ? "Pause" : "Resume"}
          </button>
          <button type="button" style={styles.button} onClick={handleRestart}>
            Restart
          </button>
          <button type="button" style={styles.button} onClick={handleSkip} disabled={isComplete}>
            Skip
          </button>
        </div>
      </section>

      <p style={styles.safety}>
        Move gently. Stop if anything hurts. This is a light movement break, not medical advice.
      </p>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8F6F2",
    color: "#1A1A1A",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem"
  },
  card: {
    width: "100%",
    maxWidth: "30rem",
    background: "#FFFFFF",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    padding: "2rem 1.5rem",
    textAlign: "center"
  },
  icon: {
    fontSize: "3.5rem",
    marginBottom: "0.75rem"
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "0.5rem"
  },
  cue: {
    margin: "0 0 1.25rem",
    fontSize: "1rem",
    color: "#3A3A3A"
  },
  timer: {
    fontSize: "4.5rem",
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: "0.75rem"
  },
  progress: {
    fontSize: "0.95rem",
    color: "#505050",
    marginBottom: "1.5rem"
  },
  buttonRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "0.75rem"
  },
  button: {
    border: "none",
    borderRadius: "0.65rem",
    padding: "0.75rem",
    fontWeight: 600,
    fontSize: "0.95rem",
    background: "#1f2937",
    color: "#fff",
    cursor: "pointer"
  },
  safety: {
    marginTop: "1rem",
    maxWidth: "30rem",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#4b5563"
  }
};
