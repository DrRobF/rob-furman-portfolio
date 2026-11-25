'use client';

import { useState } from 'react';
import s from '../btf.module.css';

export function Gate() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/btf/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) window.location.reload();
      else setError((await res.json().catch(() => ({}))).error || 'Wrong code.');
    } catch {
      setError('Something went wrong. Try again.');
    }
    setBusy(false);
  }

  return (
    <form className={s.gate} onSubmit={submit}>
      <label className={s.label} htmlFor="btf-pass">
        Scout code
      </label>
      <input
        id="btf-pass"
        className={s.input}
        type="password"
        autoComplete="off"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        placeholder="Enter the code"
      />
      <button className={s.btn} type="submit" disabled={busy}>
        {busy ? 'Checking…' : 'Open the cards'}
      </button>
      {error ? <p className={s.err}>{error}</p> : null}
    </form>
  );
}
