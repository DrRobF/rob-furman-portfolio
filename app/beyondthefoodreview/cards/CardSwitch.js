'use client';

import { useState } from 'react';
import s from '../btf.module.css';
import { Card } from './Card';

const SHOTS = [
  ['Outside — video, before you walk in', [
    ['Approach', '5s of you walking up. Sign in frame.'],
    ['The door push', 'POV through the door. Greeting timer starts now.'],
  ]],
  ['Inside — eight photos and two clocks', [
    ['Shaker held to the light', 'Window light behind it. Take three, keep one.'],
    ['Table surface', 'Phone flat, shoot across it. Raking light finds the crumbs.'],
    ['The napkin', 'Hold one up to the light. Thin ones go see-through — that is the shot.'],
    ['Start two clocks', 'Note the time you sat, when the order was taken, and when food landed. Phone timer or just the clock.'],
    ['The pour test', 'Shake onto a dark napkin. Photo of what lands.'],
    ['Menu corner', 'Peeling laminate or the sticky patch.'],
    ['Water glass', 'Same angle twice — early, then after you have waited.'],
    ['Condiment caddy', 'Lids, crust, the glued-shut ketchup.'],
    ['Bathroom door', 'From the hallway. Door and signage only — never inside.'],
  ]],
  ['At home — the verdict', [
    ['Cold open', 'Name the place, drop one teaser detail. 5s.'],
    ['Run the seven', 'Card in hand, category by category, in order.'],
    ['The total', 'Say the number out loud, then the leaderboard move.'],
  ]],
];

export function CardSwitch() {
  const [tab, setTab] = useState('host');

  return (
    <>
      <div className={s.tabs}>
        <button type="button" className={`${s.tab} ${tab === 'host' ? s.tabOn : ''}`} onClick={() => setTab('host')}>
          My card
        </button>
        <button type="button" className={`${s.tab} ${tab === 'scout' ? s.tabOn : ''}`} onClick={() => setTab('scout')}>
          Scout card
        </button>
        <button type="button" className={`${s.tab} ${tab === 'shots' ? s.tabOn : ''}`} onClick={() => setTab('shots')}>
          Shot list
        </button>
      </div>

      {tab === 'host' ? <Card isHost key="host" /> : null}
      {tab === 'scout' ? <Card isHost={false} key="scout" /> : null}

      {tab === 'shots' ? (
        <div>
          {SHOTS.map(([group, items]) => (
            <div key={group} style={{ marginBottom: 22 }}>
              <p className={s.eyebrow} style={{ marginBottom: 8 }}>{group}</p>
              <div className={s.scale}>
                {items.map(([title, detail]) => (
                  <div className={s.scaleRow} key={title} style={{ display: 'block' }}>
                    <div style={{ fontWeight: 600 }}>{title}</div>
                    <div className={s.scaleWhat} style={{ fontSize: 14 }}>{detail}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className={s.note}>
            Inside, stills only — a photo of your own table is invisible, video narration is what brings a
            manager over. Keep other diners and staff out of frame. Never film inside a bathroom. And never a
            hot mic on your server: Florida needs everyone&apos;s consent to record a conversation, so all
            narration happens afterward.
          </p>
        </div>
      ) : null}
    </>
  );
}
