"use client";

import { useEffect, useMemo, useState } from "react";

const EXERCISE_DURATION = 30;
const HISTORY_KEY = "fitnessWorkoutHistory";

const exercises = [
  { name: "Seated Fast March", cue: "Drive knees up quickly, stay tall", icon: "🏃‍♂️", type: "work" },
  { name: "Wall Push-Ups", cue: "Chest to wall, push strong", icon: "🧱", type: "work" },
  { name: "Seated Windmills", cue: "Reach across body, twist gently", icon: "🌪️", type: "work" },
  { name: "Chair Tricep Presses", cue: "Hands on chair, press up slightly", icon: "💪", type: "work" },
  { name: "Break", cue: "Breathe. Relax shoulders. Reset.", icon: "🧘‍♂️", type: "rest" },
  { name: "Seated Torso Twists", cue: "Rotate side to side with control", icon: "🔄", type: "work" },
  {
    name: "Wall Angels",
    cue: "Stand with your back to the wall. Slide arms up and down like a snow angel.",
    icon: "🙆‍♂️",
    type: "work"
  },
  { name: "Chair Sit-to-Stands", cue: "Stand up, sit down with control", icon: "⬆️", type: "work" },
  { name: "Seated Punches", cue: "Fast punches, engage core", icon: "🥊", type: "work" },
  { name: "Break", cue: "Deep breath in... slow out.", icon: "🌬️", type: "rest" },
  { name: "Seated Knee Lifts", cue: "Lift knees toward chest", icon: "🦵", type: "work" },
  { name: "Shoulder Blade Squeezes", cue: "Pull shoulders back tight", icon: "🧍‍♂️", type: "work" },
  { name: "Calf Raises + Arm Raises", cue: "Raise heels + arms together", icon: "⚖️", type: "work" },
  { name: "Deep Breathing Reset", cue: "Slow inhale, slow exhale", icon: "🫁", type: "work" }
];

const workExercises = exercises.filter((exercise) => exercise.type === "work");

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function parseHistory() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveHistory(history) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function markDateComplete(history, dateString) {
  if (history[dateString]) return history;
  return { ...history, [dateString]: true };
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

function calculateStreak(history) {
  const today = new Date();
  let pointer = new Date(today);
  const todayKey = formatLocalDate(today);

  if (!history[todayKey]) {
    pointer.setDate(pointer.getDate() - 1);
  }

  let streak = 0;
  while (history[formatLocalDate(pointer)]) {
    streak += 1;
    pointer.setDate(pointer.getDate() - 1);
  }

  return streak;
}

function playBeep() {
  if (typeof window === "undefined") return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.2);
}

export default function FitnessPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXERCISE_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [history, setHistory] = useState({});

  const currentExercise = exercises[currentIndex];
  const isRestScreen = currentExercise.type === "rest";
  const workExerciseIndex = useMemo(
    () => exercises.slice(0, currentIndex + 1).filter((exercise) => exercise.type === "work").length,
    [currentIndex]
  );

  const progressText = isRestScreen ? "Recovery Break" : `Exercise ${workExerciseIndex} of ${workExercises.length}`;

  useEffect(() => {
    setHistory(parseHistory());
  }, []);

  const markTodayComplete = () => {
    const today = getTodayString();
    setHistory((prev) => {
      const updated = markDateComplete(prev, today);
      saveHistory(updated);
      return updated;
    });
  };

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
              markTodayComplete();
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
        markTodayComplete();
        return index;
      }
      return index + 1;
    });
  };

  const completedToday = Boolean(history[getTodayString()]);
  const completedDates = Object.keys(history).filter((date) => history[date]).sort();
  const lastCompletedDate = completedDates.length ? completedDates[completedDates.length - 1] : "None yet";
  const currentStreak = calculateStreak(history);
  const weekDates = getWeekDates();
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <main style={styles.page}>
      <section style={{ ...styles.card, ...(isRestScreen && !isComplete ? styles.restCard : {}) }}>
        {isComplete ? (
          <>
            <div style={styles.icon}>✅</div>
            <h1 style={styles.title}>Workout Complete</h1>
            <p style={styles.cue}>Great job completing your 7-minute chair workout.</p>
          </>
        ) : (
          <>
            <div style={styles.icon}>{currentExercise.icon}</div>
            <h1 style={styles.title}>{isRestScreen ? "Recovery Break" : currentExercise.name}</h1>
            <p style={styles.cue}>{currentExercise.cue}</p>
            {currentExercise.name === "Wall Angels" && (
              <p style={styles.helperText}>
                Wall Angels: stand with your back against a wall, arms bent like goalposts, then slowly slide your
                arms up and down. Keep it gentle.
              </p>
            )}
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

      <section style={styles.progressCard}>
        <h2 style={styles.progressTitle}>Progress</h2>
        <p style={styles.progressLine}>Completed Today: {completedToday ? "✅ Yes" : "⬜ No"}</p>
        <p style={styles.progressLine}>Last completed: {lastCompletedDate}</p>
        <p style={styles.progressLine}>Current streak: {currentStreak}</p>

        <div style={styles.weekGrid}>
          {weekDates.map((date, index) => {
            const key = formatLocalDate(date);
            const checked = Boolean(history[key]);
            return (
              <p style={styles.weekDay} key={key}>
                {dayLabels[index]} {checked ? "✅" : "⬜"}
              </p>
            );
          })}
        </div>

        <button type="button" style={styles.markButton} onClick={markTodayComplete}>
          Mark Today Complete
        </button>
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
  restCard: {
    background: "#EEF6F4"
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
  helperText: {
    margin: "-0.5rem 0 1rem",
    fontSize: "0.9rem",
    color: "#374151",
    background: "#F3F4F6",
    borderRadius: "0.5rem",
    padding: "0.6rem"
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
  progressCard: {
    marginTop: "1rem",
    width: "100%",
    maxWidth: "30rem",
    background: "#FFFFFF",
    borderRadius: "1rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
    padding: "1rem 1.25rem"
  },
  progressTitle: {
    fontSize: "1.1rem",
    marginBottom: "0.75rem"
  },
  progressLine: {
    margin: "0.3rem 0",
    fontSize: "0.95rem"
  },
  weekGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "0.35rem",
    margin: "0.8rem 0"
  },
  weekDay: {
    margin: 0,
    fontSize: "0.92rem"
  },
  markButton: {
    border: "1px solid #9ca3af",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.7rem",
    background: "#f9fafb",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600
  },
  safety: {
    marginTop: "1rem",
    maxWidth: "30rem",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#4b5563"
  }
};
