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
    /* fall through to the generic title */
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

export default async function RestaurantPage({ params }) {
  let cards = [];
  try {
    cards = await fetchRestaurant(params.key);
  } catch {
    cards = [];
  }
  if (cards.length === 0) notFound();

  const name = cards[0].restaurant;
  const city = cards[0].city;
  const average = Math.round(cards.reduce((a, c) => a + c.total, 0) / cards.length);

  return (
    <div className={s.wrap}>
      <div className={s.inner}>
        <Link href="/beyondthefoodreview" className={s.backLink}>
          ← Leaderboard
        </Link>

        {/* Everything inside .shot is framed to be screenshotted in one go. */}
        <div className={s.shot}>
          <p className={s.shotSeries}>Beyond the Food Review</p>
          <h1 className={s.shotName}>{name}</h1>
          <p className={s.shotWhere}>
            {[city, fmtDate(cards[0].visited_on)].filter(Boolean).join(' · ')}
          </p>

          <div className={s.shotScore}>
            <span className={s.shotBig}>{average}</span>
            <span className={s.shotOut}>/ {MAX_TOTAL}</span>
            <span className={s.shotBand}>{bandFor(average)}</span>
          </div>

          <div className={s.shotGrid}>
            {CATEGORIES.map((c) => (
              <div className={s.shotLine} key={c.key}>
                <span className={s.shotCat}>{c.label}</span>
                <span className={s.shotBar} aria-hidden="true">
                  {Array.from({ length: 10 }, (_, k) => (
                    <i key={k} className={k < Math.round(
                      cards.reduce((a, card) => a + (card[c.key] || 0), 0) / cards.length
                    ) ? s.shotPipOn : s.shotPip} />
                  ))}
                </span>
                <span className={s.shotNum}>
                  {Math.round(cards.reduce((a, card) => a + (card[c.key] || 0), 0) / cards.length)}
                </span>
              </div>
            ))}
          </div>

          <p className={s.shotFoot}>
            {cards.length === 1
              ? `Scored by ${cards[0].is_host ? 'Dr. Rob Furman' : cards[0].scout_name}`
              : `Average of ${cards.length} cards · ${cards.map((c) => `${c.is_host ? 'Rob' : c.scout_name} ${c.total}`).join(' · ')}`}
          </p>
          <p className={s.shotUrl}>drrobfurman.com/beyondthefoodreview</p>
        </div>

        {cards.length > 1 ? (
          <>
            <h2 className={s.h2}>Where they split</h2>
            <div className={s.splitTable}>
              <div className={s.splitHead}>
                <span>Category</span>
                {cards.map((c) => (
                  <span key={c.id}>{c.is_host ? 'Rob' : c.scout_name}</span>
                ))}
                <span>Gap</span>
              </div>
              {CATEGORIES.map((cat) => {
                const vals = cards.map((c) => c[cat.key] || 0);
                const gap = Math.max(...vals) - Math.min(...vals);
                return (
                  <div className={s.splitRow} key={cat.key}>
                    <span className={s.splitCat}>{cat.label}</span>
                    {vals.map((v, i) => (
                      <span key={i} className={s.splitVal}>{v}</span>
                    ))}
                    <span className={gap >= 3 ? s.splitGapBig : s.splitGap}>{gap || '—'}</span>
                  </div>
                );
              })}
              <div className={s.splitRow}>
                <span className={s.splitCat}><strong>Total</strong></span>
                {cards.map((c) => (
                  <span key={c.id} className={s.splitVal}><strong>{c.total}</strong></span>
                ))}
                <span className={s.splitGap}>
                  {Math.max(...cards.map((c) => c.total)) - Math.min(...cards.map((c) => c.total))}
                </span>
              </div>
            </div>
          </>
        ) : null}

        {cards.some((c) => c.notes) ? (
          <>
            <h2 className={s.h2}>Notes</h2>
            {cards.filter((c) => c.notes).map((c) => (
              <p className={s.note} key={c.id}>
                <strong>{c.is_host ? 'Rob' : c.scout_name}:</strong> {c.notes}
              </p>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}
