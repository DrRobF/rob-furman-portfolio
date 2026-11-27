import Link from 'next/link';
import { notFound } from 'next/navigation';
import s from '../../btf.module.css';
import { pageMeta } from '../../../lib/seo';
import { CATEGORIES, MAX_TOTAL, bandFor, fetchRestaurant } from '../../../../lib/btf';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  let cards = [];
  try {
    cards = await fetchRestaurant(params.key);
  } catch {
    /* fall through to a generic title */
  }
  const name = cards[0]?.restaurant || 'Review';
  return pageMeta({
    title: `${name} | Beyond the Food Review`,
    description: `The full service scorecard for ${name} — ten categories, scored out of ${MAX_TOTAL}.`,
    path: `/beyondthefoodreview/r/${params.key}`,
  });
}

function fmtDate(d) {
  if (!d) return null;
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

const avg = (nums) => Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
const who = (card) => (card.is_host ? 'Rob' : card.scout_name);

// Cards from the same day are one visit. A later return is a new visit, which is
// what makes this page a dashboard rather than a single review.
function groupIntoVisits(cards) {
  const byDate = new Map();
  for (const card of cards) {
    const key = card.visited_on || card.created_at.slice(0, 10);
    if (!byDate.has(key)) byDate.set(key, { date: key, cards: [] });
    byDate.get(key).cards.push(card);
  }
  return [...byDate.values()]
    .map((v) => ({ ...v, score: avg(v.cards.map((c) => c.total)) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function VisitComparison({ cards }) {
  return (
    <div className={s.splitTable}>
      <div className={s.splitHead}>
        <span>Category</span>
        {cards.map((c) => <span key={c.id}>{who(c)}</span>)}
        <span>Gap</span>
      </div>
      {CATEGORIES.map((cat) => {
        const vals = cards.map((c) => c[cat.key] || 0);
        const gap = Math.max(...vals) - Math.min(...vals);
        return (
          <div className={s.splitRow} key={cat.key}>
            <span className={s.splitCat}>{cat.label}</span>
            {vals.map((v, i) => <span key={i} className={s.splitVal}>{v}</span>)}
            <span className={gap >= 3 ? s.splitGapBig : s.splitGap}>{gap || '—'}</span>
          </div>
        );
      })}
      <div className={s.splitRow}>
        <span className={s.splitCat}><strong>Total</strong></span>
        {cards.map((c) => <span key={c.id} className={s.splitVal}><strong>{c.total}</strong></span>)}
        <span className={s.splitGap}>
          {Math.max(...cards.map((c) => c.total)) - Math.min(...cards.map((c) => c.total))}
        </span>
      </div>
    </div>
  );
}

export default async function RestaurantPage({ params }) {
  let cards = [];
  try {
    cards = await fetchRestaurant(params.key);
  } catch {
    cards = [];
  }
  if (cards.length === 0) notFound();

  const { restaurant: name, city } = cards[0];
  const visits = groupIntoVisits(cards);
  const standing = avg(visits.map((v) => v.score));
  const latest = visits[0];

  return (
    <div className={s.wrap}>
      <div className={s.inner}>
        <Link href="/beyondthefoodreview" className={s.backLink}>← Leaderboard</Link>

        {/* Framed so one phone screenshot of this block is a usable video graphic. */}
        <div className={s.shot}>
          <p className={s.shotSeries}>Beyond the Food Review</p>
          <h1 className={s.shotName}>{name}</h1>
          <p className={s.shotWhere}>{[city, fmtDate(latest.date)].filter(Boolean).join(' · ')}</p>

          <div className={s.shotScore}>
            <span className={s.shotBig}>{standing}</span>
            <span className={s.shotOut}>/ {MAX_TOTAL}</span>
            <span className={s.shotBand}>{bandFor(standing)}</span>
          </div>

          <div className={s.shotGrid}>
            {CATEGORIES.map((c) => {
              const n = avg(cards.map((card) => card[c.key] || 0));
              return (
                <div className={s.shotLine} key={c.key}>
                  <span className={s.shotCat}>{c.label}</span>
                  <span className={s.shotBar} aria-hidden="true">
                    {Array.from({ length: 10 }, (_, k) => (
                      <i key={k} className={k < n ? s.shotPipOn : s.shotPip} />
                    ))}
                  </span>
                  <span className={s.shotNum}>{n}</span>
                </div>
              );
            })}
          </div>

          <p className={s.shotFoot}>
            {cards.length === 1
              ? `Scored by ${who(cards[0])}`
              : `${cards.length} cards across ${visits.length} visit${visits.length === 1 ? '' : 's'} · ${
                  cards.map((c) => `${who(c)} ${c.total}`).join(' · ')}`}
          </p>
          <p className={s.shotUrl}>drrobfurman.com/beyondthefoodreview</p>
        </div>

        {visits.length > 1 ? (
          <>
            <h2 className={s.h2}>Over time</h2>
            <div className={s.trend}>
              {[...visits].reverse().map((v) => (
                <div className={s.trendCol} key={v.date}>
                  <span className={s.trendNum}>{v.score}</span>
                  <span className={s.trendBarWrap}>
                    <span className={s.trendBar} style={{ height: `${v.score}%` }} />
                  </span>
                  <span className={s.trendDate}>{fmtDate(v.date)?.replace(/, \d{4}$/, '')}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <h2 className={s.h2}>{visits.length > 1 ? 'Every visit' : 'The cards'}</h2>
        {visits.map((v) => (
          <div className={s.visit} key={v.date}>
            <div className={s.visitHead}>
              <span className={s.visitDate}>{fmtDate(v.date)}</span>
              <span className={s.visitScore}>
                {v.score}<span className={s.scoreOut}>/{MAX_TOTAL}</span>
              </span>
            </div>
            <p className={s.visitWho}>
              {v.cards.map((c) => `${who(c)} ${c.total}`).join('  ·  ')}
            </p>
            {v.cards.length > 1 ? <VisitComparison cards={v.cards} /> : null}
            {v.cards.filter((c) => c.notes).map((c) => (
              <p className={s.note} key={c.id}>
                <strong>{who(c)}:</strong> {c.notes}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
