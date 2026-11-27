'use client';

import { useEffect, useMemo, useState } from 'react';
import s from '../btf.module.css';

const CATEGORIES = [
  { key: 'shaker', label: 'The Shaker Test', hint: 'Flow, crust, ground pepper or dust. Shake onto a dark napkin.' },
  { key: 'table_condition', label: 'Table Condition', hint: 'Sticky laminate, crumbs in the seam, wobble, condiment lids.' },
  { key: 'napkin', label: 'Napkin Quality', hint: 'Does it survive one wipe, or did you need three?' },
  { key: 'greeting', label: 'Greeting Clock', hint: 'Seconds from door to acknowledgment. Time it.' },
  { key: 'order_wait', label: 'Sit-to-Order', hint: 'Sat down to order taken. Start the clock when you sit.' },
  { key: 'food_wait', label: 'Order-to-Food', hint: 'Order taken to food on the table. Allow for how busy they were.' },
  { key: 'water', label: 'Water Refill Latency', hint: 'How low the glass gets before anybody notices.' },
  { key: 'menu', label: 'Menu Integrity', hint: 'Peeling laminate, fingerprints, mystery stickiness.' },
  { key: 'bathroom', label: 'The Bathroom', hint: 'Soap, hook on the door, dryer vs. sad paper towels. Score from memory.' },
  { key: 'check_exit', label: 'The Check Exit', hint: 'Fork down to check in hand, and whether you had to flag anyone.' },
];

const MAX = CATEGORIES.length * 10;

function band(total, count) {
  if (count < CATEGORIES.length) return `${CATEGORIES.length - count} to go`;
  if (total >= 90) return 'Immaculate — rare air';
  if (total >= 70) return 'Solid. They care.';
  if (total >= 50) return 'Mixed bag — usable video';
  if (total >= 30) return 'Rough. Good content.';
  return 'Call the health department';
}

export function Card() {
  const [scores, setScores] = useState({});
  const [restaurant, setRestaurant] = useState('');
  const [city, setCity] = useState('');
  const [visitedOn, setVisitedOn] = useState('');
  const [scoutName, setScoutName] = useState('');

  // Whoever used this phone last stays filled in, so nobody has to remember
  // which card is "theirs".
  useEffect(() => {
    try {
      const saved = localStorage.getItem('btf_scored_by');
      if (saved) setScoutName(saved);
    } catch {
      /* private browsing, no harm */
    }
  }, []);

  function rememberName(value) {
    setScoutName(value);
    try {
      localStorage.setItem('btf_scored_by', value);
    } catch {
      /* ignore */
    }
  }

  const isHost = /rob\s*furman/i.test(scoutName);
  const [notes, setNotes] = useState('');
  const [state, setState] = useState({ kind: 'idle', msg: '' });

  const { total, count } = useMemo(() => {
    const vals = Object.values(scores).filter((v) => typeof v === 'number');
    return { total: vals.reduce((a, b) => a + b, 0), count: vals.length };
  }, [scores]);

  function tap(key, n) {
    setScores((prev) => {
      const next = { ...prev };
      if (next[key] === n) delete next[key];
      else next[key] = n;
      return next;
    });
  }

  function reset() {
    setScores({});
    setRestaurant('');
    setCity('');
    setVisitedOn('');
    setNotes('');
    // scoutName deliberately survives a reset — same person, next restaurant.
    setState({ kind: 'idle', msg: '' });
  }

  async function submit() {
    if (!restaurant.trim()) return setState({ kind: 'err', msg: 'Restaurant name first.' });
    if (!scoutName.trim()) return setState({ kind: 'err', msg: 'Put your name in "Scored by" so the card gets credited.' });
    if (count < CATEGORIES.length) return setState({ kind: 'err', msg: 'All seven categories need a score.' });

    setState({ kind: 'busy', msg: 'Posting to the leaderboard…' });
    try {
      const res = await fetch('/api/btf/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant, city, visited_on: visitedOn, scout_name: scoutName, is_host: isHost, notes, ...scores,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setState({ kind: 'ok', msg: `Posted — ${restaurant.trim()} scored ${total}/${MAX}.` });
        setTimeout(reset, 2200);
      } else {
        setState({ kind: 'err', msg: data.error || 'Could not save.' });
      }
    } catch {
      setState({ kind: 'err', msg: 'Could not reach the server.' });
    }
  }

  return (
    <div>
      <div className={s.fields}>
        <div>
          <label className={s.label} htmlFor="btf-rest">Restaurant</label>
          <input id="btf-rest" className={s.input} value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)} placeholder="Name" />
        </div>
        <div>
          <label className={s.label} htmlFor="btf-city">City</label>
          <input id="btf-city" className={s.input} value={city}
            onChange={(e) => setCity(e.target.value)} placeholder="Vero Beach, FL" />
        </div>
        <div>
          <label className={s.label} htmlFor="btf-date">Visited</label>
          <input id="btf-date" className={s.input} type="date" value={visitedOn}
            onChange={(e) => setVisitedOn(e.target.value)} />
        </div>
        <div>
          <label className={s.label} htmlFor="btf-scout">Scored by</label>
          <input id="btf-scout" className={s.input} value={scoutName}
            onChange={(e) => rememberName(e.target.value)} placeholder="Your name" />
        </div>
      </div>

      {CATEGORIES.map((c, i) => (
        <div className={s.catBlock} key={c.key}>
          <div className={s.catHead}>
            <span className={s.catNum}>{String(i + 1).padStart(2, '0')}</span>
            <span className={s.catTitle}>{c.label}</span>
          </div>
          <p className={s.catBlurb}>{c.hint}</p>
          <div className={s.pips}>
            {Array.from({ length: 10 }, (_, k) => k + 1).map((n) => {
              const picked = scores[c.key];
              const cls = [s.pip, picked === n ? s.pipOn : '', picked != null && n < picked ? s.pipUnder : '']
                .filter(Boolean).join(' ');
              return (
                <button type="button" key={n} className={cls} aria-pressed={picked === n}
                  aria-label={`${c.label}: ${n} of 10`} onClick={() => tap(c.key, n)}>
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <label className={s.label} htmlFor="btf-notes">
          {isHost ? 'Notes for the voiceover' : 'Anything worth mentioning'}
        </label>
        <textarea id="btf-notes" className={s.textarea} value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={isHost
            ? 'The one detail that makes this video.'
            : 'The detail Rob should mention on camera.'} />
      </div>

      <div className={s.totalBar}>
        <div>
          <div className={s.totalLab}>Score</div>
          <div className={s.totalBig}>
            {total}
            <span className={s.scoreOut}>/{MAX}</span>
          </div>
        </div>
        <div className={s.band} style={{ marginLeft: 14 }}>{band(total, count)}</div>
        <div className={s.totalRight}>
          <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={reset}>Clear</button>
          <button type="button" className={s.btn} onClick={submit} disabled={state.kind === 'busy'}>
            {state.kind === 'busy' ? 'Posting…' : 'Post to leaderboard'}
          </button>
        </div>
      </div>
      {state.msg ? <p className={state.kind === 'ok' ? s.ok : s.err}>{state.msg}</p> : null}
    </div>
  );
}
