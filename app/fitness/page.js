"use client";

import { useEffect, useMemo, useState } from "react";

const EXERCISE_DURATION = 30;
const BREAK_DURATION = 30;
const DAILY_ROUTINE_KEY = "fitnessDailyRoutineV2";
const HISTORY_KEY = "fitnessWorkoutHistory";
const TARGET_WORK_EXERCISES = 10;

const exerciseBank = [
  { name: "Seated Windmills", cue: "Reach across your body and rotate gently.", icon: "🌪️", target: "core", difficulty: "easy" },
  { name: "Seated Side Reaches", cue: "Reach one arm overhead and bend side to side.", icon: "↔️", target: "mobility", difficulty: "easy" },
  { name: "Seated Overhead Reach", cue: "Interlace fingers and press up tall.", icon: "🙌", target: "shoulders", difficulty: "easy" },
  { name: "Seated Torso Twists", cue: "Turn left and right with a long spine.", icon: "🔄", target: "core", difficulty: "easy" },
  { name: "Seated Marching", cue: "Alternate knees up with quick rhythm.", icon: "🥁", target: "legs", difficulty: "moderate" },
  { name: "Seated Knee Lifts", cue: "Lift knees toward chest with control.", icon: "🦵", target: "core", difficulty: "moderate" },
  { name: "Seated Leg Extensions", cue: "Extend one leg at a time and squeeze quads.", icon: "🦿", target: "legs", difficulty: "easy" },
  { name: "Seated Toe Taps", cue: "Tap toes quickly while keeping heels down.", icon: "👣", target: "legs", difficulty: "easy" },
  { name: "Seated Heel Raises", cue: "Lift heels, then lower with control.", icon: "⬆️", target: "legs", difficulty: "easy" },
  { name: "Seated Arm Circles", cue: "Draw small then bigger circles with both arms.", icon: "⭕", target: "shoulders", difficulty: "easy" },
  { name: "Seated Shoulder Rolls", cue: "Roll shoulders up, back, and down smoothly.", icon: "🌀", target: "shoulders", difficulty: "easy" },
  { name: "Seated Chest Openers", cue: "Open arms wide and squeeze shoulder blades.", icon: "🪽", target: "chest", difficulty: "easy" },
  { name: "Seated Forward Fold", cue: "Hinge forward gently and relax neck.", icon: "🧘", target: "back", difficulty: "easy" },
  { name: "Seated Back Stretch", cue: "Round upper back and reach hands forward.", icon: "🫶", target: "back", difficulty: "easy" },
  { name: "Seated Oblique Crunch", cue: "Lift knee toward elbow, alternating sides.", icon: "⚡", target: "core", difficulty: "moderate" },
  { name: "Seated Punches", cue: "Punch forward quickly and brace your core.", icon: "🥊", target: "arms", difficulty: "moderate" },
  { name: "Seated Desk Push-Ups", cue: "Hands on desk edge, bend and press away.", icon: "🧱", target: "chest", difficulty: "moderate" },
  { name: "Desk Incline Push-Ups", cue: "Straight body line, lower chest to desk.", icon: "📐", target: "chest", difficulty: "challenging" },
  { name: "Standing Chair Squats", cue: "Stand and sit slowly with control.", icon: "🪑", target: "legs", difficulty: "moderate" },
  { name: "Chair-Assisted Calf Raises", cue: "Hold chair for balance, rise onto toes.", icon: "🦶", target: "legs", difficulty: "easy" },
  { name: "Chair-Assisted Hamstring Stretch", cue: "Extend one leg and hinge from hips gently.", icon: "🤸", target: "mobility", difficulty: "easy" },
  { name: "Chair-Assisted Quad Stretch", cue: "Hold chair and gently pull heel toward glute.", icon: "🧍", target: "legs", difficulty: "easy" },
  { name: "Seated Prayer Stretch", cue: "Press palms together and lift elbows slightly.", icon: "🙏", target: "mobility", difficulty: "easy" },
  { name: "Seated Tricep Reach", cue: "Reach one arm overhead and bend at elbow.", icon: "💪", target: "arms", difficulty: "easy" },
  { name: "Seated Chair Angels", cue: "Slide arms up and down like snow angels.", icon: "😇", target: "shoulders", difficulty: "easy" },
  { name: "Seated Scapular Squeezes", cue: "Pinch shoulder blades together, then relax.", icon: "🧍‍♂️", target: "back", difficulty: "easy" },
  { name: "Seated Side Bends", cue: "Slide one hand toward floor, alternating sides.", icon: "🌈", target: "core", difficulty: "easy" },
  { name: "Seated Ankle Circles", cue: "Lift foot and circle ankle both directions.", icon: "🔁", target: "mobility", difficulty: "easy" },
  { name: "Seated Figure-Four Stretch", cue: "Cross ankle over knee and lean forward gently.", icon: "4️⃣", target: "mobility", difficulty: "easy" },
  { name: "Seated Chest Press Motion", cue: "Press arms forward and return with control.", icon: "➡️", target: "chest", difficulty: "easy" }
];

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function seededShuffle(list, seedString) {
  const seeded = [...list];
  let seed = 0;
  for (let i = 0; i < seedString.length; i += 1) {
    seed = (seed * 31 + seedString.charCodeAt(i)) >>> 0;
  }

  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = seeded.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [seeded[i], seeded[j]] = [seeded[j], seeded[i]];
  }

  return seeded;
}

function parseJSONStorage(key, fallback = {}) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveJSONStorage(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function buildTimeline(workExercises) {
  const midpoint = Math.floor(workExercises.length / 2);
  const first = workExercises.slice(0, midpoint);
  const second = workExercises.slice(midpoint);

  return [
    ...first.map((exercise) => ({ ...exercise, type: "work", duration: EXERCISE_DURATION })),
    { name: "Break", cue: "Breathe, relax shoulders, sip water.", icon: "🧘", target: "recovery", type: "rest", duration: BREAK_DURATION },
    ...second.map((exercise) => ({ ...exercise, type: "work", duration: EXERCISE_DURATION })),
    { name: "Break", cue: "Final reset before finish.", icon: "🌬️", target: "recovery", type: "rest", duration: BREAK_DURATION }
  ];
}

function getDailyRoutine(forceNew = false) {
  const today = getTodayString();
  const stored = parseJSONStorage(DAILY_ROUTINE_KEY, null);
  if (!forceNew && stored?.date === today && Array.isArray(stored.routine) && stored.routine.length) {
    return stored.routine;
  }

  const seed = forceNew ? `${today}-${Date.now()}` : today;
  const shuffled = seededShuffle(exerciseBank, seed).slice(0, TARGET_WORK_EXERCISES);
  const routine = buildTimeline(shuffled);
  saveJSONStorage(DAILY_ROUTINE_KEY, { date: today, routine });
  return routine;
}

function formatLocalDate(date) { const y = date.getFullYear(); const m = `${date.getMonth() + 1}`.padStart(2, "0"); const d = `${date.getDate()}`.padStart(2, "0"); return `${y}-${m}-${d}`; }
function getWeekDates() { const t = new Date(); const dow = t.getDay(); const offset = dow === 0 ? -6 : 1 - dow; const m = new Date(t); m.setDate(t.getDate() + offset); return Array.from({ length: 7 }, (_, i) => { const d = new Date(m); d.setDate(m.getDate() + i); return d; }); }
function calculateStreak(history) { const today = new Date(); let p = new Date(today); if (!history[formatLocalDate(today)]) p.setDate(p.getDate() - 1); let s = 0; while (history[formatLocalDate(p)]) { s += 1; p.setDate(p.getDate() - 1); } return s; }

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
  const [timeline, setTimeline] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXERCISE_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [history, setHistory] = useState({});

  useEffect(() => {
    const daily = getDailyRoutine(false);
    setTimeline(daily);
    setTimeLeft(daily[0]?.duration ?? EXERCISE_DURATION);
    setHistory(parseJSONStorage(HISTORY_KEY, {}));
  }, []);

  const currentExercise = timeline[currentIndex];
  const nextExercise = timeline[currentIndex + 1];
  const workCount = timeline.filter((item) => item.type === "work").length;
  const workExerciseIndex = useMemo(() => timeline.slice(0, currentIndex + 1).filter((item) => item.type === "work").length, [timeline, currentIndex]);
  const isRestScreen = currentExercise?.type === "rest";

  const markTodayComplete = () => {
    const today = getTodayString();
    setHistory((prev) => {
      if (prev[today]) return prev;
      const updated = { ...prev, [today]: true };
      saveJSONStorage(HISTORY_KEY, updated);
      return updated;
    });
  };

  useEffect(() => {
    if (!isRunning || isComplete || !currentExercise) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playBeep();
          setCurrentIndex((index) => {
            if (index >= timeline.length - 1) {
              setIsComplete(true);
              setIsRunning(false);
              markTodayComplete();
              return index;
            }
            const nextDuration = timeline[index + 1]?.duration ?? EXERCISE_DURATION;
            setTimeLeft(nextDuration);
            return index + 1;
          });
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isRunning, isComplete, timeline, currentExercise]);

  const handleRestart = () => { setCurrentIndex(0); setTimeLeft(timeline[0]?.duration ?? EXERCISE_DURATION); setIsComplete(false); setIsRunning(false); };
  const handleSkip = () => {
    if (isComplete || !timeline.length) return;
    playBeep();
    setCurrentIndex((index) => {
      if (index >= timeline.length - 1) { setIsComplete(true); setIsRunning(false); markTodayComplete(); return index; }
      const next = index + 1;
      setTimeLeft(timeline[next]?.duration ?? EXERCISE_DURATION);
      return next;
    });
  };
  const handleGenerateNewRoutine = () => {
    const reshuffled = getDailyRoutine(true);
    setTimeline(reshuffled);
    setCurrentIndex(0);
    setTimeLeft(reshuffled[0]?.duration ?? EXERCISE_DURATION);
    setIsComplete(false);
    setIsRunning(false);
  };

  const completedToday = Boolean(history[getTodayString()]);
  const completedDates = Object.keys(history).filter((d) => history[d]).sort();
  const lastCompletedDate = completedDates.length ? completedDates[completedDates.length - 1] : "None yet";
  const currentStreak = calculateStreak(history);

  if (!currentExercise) return <main style={styles.page}><p>Loading routine...</p></main>;

  return <main style={styles.page}><section style={{ ...styles.card, ...(isRestScreen && !isComplete ? styles.restCard : {}) }}>
    {isComplete ? <><div style={styles.icon}>✅</div><h1 style={styles.title}>Workout Complete</h1><p style={styles.cue}>Great job completing your chair workout today.</p></> : <>
      <div style={styles.icon}>{currentExercise.icon}</div>
      <h1 style={styles.title}>{isRestScreen ? "Recovery Break" : currentExercise.name}</h1>
      <p style={styles.cue}>{currentExercise.cue}</p>
      <p style={styles.meta}>Target: {currentExercise.target} {currentExercise.difficulty ? `• Difficulty: ${currentExercise.difficulty}` : ""}</p>
      <div style={styles.timer}>{timeLeft}</div>
      <p style={styles.progress}>{isRestScreen ? "Recovery Break" : `Exercise ${workExerciseIndex} of ${workCount}`}</p>
      {nextExercise && <p style={styles.next}>Next: {nextExercise.type === "rest" ? "Break" : nextExercise.name}</p>}
    </>}
    <div style={styles.buttonRow}>
      <button type="button" style={styles.button} onClick={() => setIsRunning(true)} disabled={isRunning || isComplete}>Start</button>
      <button type="button" style={styles.button} onClick={() => setIsRunning((p) => !p)} disabled={isComplete}>{isRunning ? "Pause" : "Resume"}</button>
      <button type="button" style={styles.button} onClick={handleRestart}>Restart</button>
      <button type="button" style={styles.button} onClick={handleSkip} disabled={isComplete}>Skip</button>
      <button type="button" style={styles.generateButton} onClick={handleGenerateNewRoutine}>Generate New Routine</button>
    </div>
  </section>
  <section style={styles.progressCard}><h2 style={styles.progressTitle}>Progress</h2><p style={styles.progressLine}>Completed Today: {completedToday ? "✅ Yes" : "⬜ No"}</p><p style={styles.progressLine}>Last completed: {lastCompletedDate}</p><p style={styles.progressLine}>Current streak: {currentStreak}</p>
  <div style={styles.weekGrid}>{getWeekDates().map((date, index) => { const key = formatLocalDate(date); const checked = Boolean(history[key]); return <p style={styles.weekDay} key={key}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index]} {checked ? "✅" : "⬜"}</p>; })}</div>
  <button type="button" style={styles.markButton} onClick={markTodayComplete}>I did it today</button></section>
  </main>;
}

const styles = { page: { minHeight: "100vh", background: "#F8F6F2", color: "#1A1A1A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem" }, card: { width: "100%", maxWidth: "32rem", background: "#FFFFFF", borderRadius: "1rem", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", padding: "2rem 1.5rem", textAlign: "center" }, restCard: { background: "#EEF6F4" }, icon: { fontSize: "3.5rem", marginBottom: "0.75rem" }, title: { fontSize: "1.8rem", marginBottom: "0.5rem" }, cue: { margin: "0 0 0.6rem", fontSize: "1rem", color: "#3A3A3A" }, meta: { margin: "0 0 1rem", fontSize: "0.9rem", color: "#4b5563" }, timer: { fontSize: "4.8rem", fontWeight: 700, lineHeight: 1, marginBottom: "0.75rem" }, progress: { fontSize: "0.95rem", color: "#505050", marginBottom: "0.45rem" }, next: { fontSize: "0.9rem", marginBottom: "1rem", color: "#1f2937" }, buttonRow: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem" }, button: { border: "none", borderRadius: "0.65rem", padding: "0.75rem", fontWeight: 600, fontSize: "0.95rem", background: "#1f2937", color: "#fff", cursor: "pointer" }, generateButton: { gridColumn: "1 / -1", border: "none", borderRadius: "0.65rem", padding: "0.75rem", fontWeight: 700, fontSize: "0.95rem", background: "#2563eb", color: "#fff", cursor: "pointer" }, progressCard: { marginTop: "1rem", width: "100%", maxWidth: "32rem", background: "#FFFFFF", borderRadius: "1rem", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)", padding: "1rem 1.25rem" }, progressTitle: { fontSize: "1.1rem", marginBottom: "0.75rem" }, progressLine: { margin: "0.3rem 0", fontSize: "0.95rem" }, weekGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.35rem", margin: "0.8rem 0" }, weekDay: { margin: 0, fontSize: "0.92rem" }, markButton: { border: "1px solid #9ca3af", borderRadius: "0.5rem", padding: "0.5rem 0.7rem", background: "#f9fafb", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 } };
