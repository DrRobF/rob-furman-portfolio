import Link from 'next/link';
import s from './btf.module.css';
import { pageMeta } from '../lib/seo';
import { CATEGORIES, MAX_TOTAL, bandFor, fetchScores, groupByRestaurant } from '../../lib/btf';

export const dynamic = 'force-dynamic';

export const metadata = pageMeta({
  title: 'Beyond the Food Review | Dr. Rob Furman',
  description:
    'A restaurant review series that ignores the food. Seven categories of service and upkeep, scored out of 70, from the salt shaker to the check. See the running leaderboard.',
  path: '/beyondthefoodreview',
});

const SCALE = [
  ['9 – 10', 'Somebody is genuinely paying attention.'],
  ['7 – 8', 'Well run. A small thing slipped.'],
  ['5 – 6', 'Nobody checked today.'],
  ['3 – 4', 'Nobody has checked in a while.'],
  ['1 – 2', 'This is a choice they are making.'],
];

export default async function BeyondTheFoodReviewPage() {
  let groups = [];
  let unavailable = false;
  try {
    groups = groupByRestaurant(await fetchScores());
  } catch {
    unavailable = true;
  }

  return (
    <div className={s.wrap}>
      <div className={s.inner}>
        <p className={s.eyebrow}>Beyond the Food Review</p>
        <h1 className={s.h1}>Nobody reviews the salt shaker.</h1>
        <p className={s.lede}>
          Everybody reviews the food. This series reviews everything else: whether the shaker pours, whether
          the table was wiped, how long you sat before a human said hello.{' '}
          <strong>Ten categories, ten points each, one hundred possible.</strong> No opinions about anybody&apos;s
          cooking — just whether the place is paying attention.
        </p>

        <h2 className={s.h2}>The leaderboard</h2>
        <div className={s.board}>
          <div className={s.rowHead}>
            <span>#</span>
            <span>Restaurant</span>
            <span>Verdict</span>
            <span style={{ textAlign: 'right' }}>Score</span>
          </div>
          {groups.length === 0 ? (
            <p className={s.empty}>
              {unavailable
                ? 'The leaderboard is taking a breather. Check back shortly.'
                : 'First reviews are being scored now. Check back shortly.'}
            </p>
          ) : (
            groups.map((g, i) => (
              <Link className={s.row} key={g.key} href={`/beyondthefoodreview/r/${g.key}`}>
                <span className={s.rank}>{i + 1}</span>
                <span>
                  <span className={s.name}>{g.restaurant}</span>
                  <span className={s.meta}>
                    {[
                      g.city,
                      g.cards.length === 1
                        ? g.cards[0].is_host
                          ? 'Reviewed by Rob'
                          : `Scout: ${g.cards[0].scout_name}`
                        : `${g.cards.length} reviews${g.spread >= 10 ? ` · they disagreed by ${g.spread}` : ''}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </span>
                <span className={s.band}>{bandFor(g.average)}</span>
                <span className={s.score}>
                  {g.average}
                  <span className={s.scoreOut}>/{MAX_TOTAL}</span>
                </span>
              </Link>
            ))
          )}
        </div>

        <h2 className={s.h2}>What gets scored</h2>
        <div className={s.cats}>
          {CATEGORIES.map((c, i) => (
            <div className={s.cat} key={c.key}>
              <span className={s.catNum}>{String(i + 1).padStart(2, '0')}</span>
              <p className={s.catName}>{c.label}</p>
              <p className={s.catBlurb}>{c.blurb}</p>
            </div>
          ))}
        </div>

        <h2 className={s.h2}>How the ten points work</h2>
        <div className={s.scale}>
          {SCALE.map(([n, what]) => (
            <div className={s.scaleRow} key={n}>
              <span className={s.scaleNum}>{n}</span>
              <span className={s.scaleWhat}>{what}</span>
            </div>
          ))}
        </div>
        <p className={s.note}>
          Every category is something you can see from your own seat, which means you can argue with the score
          but not with the evidence. Food is subjective. A crusted shaker is not.
        </p>

        <h2 className={s.h2}>Scoring somewhere yourself?</h2>
        <p className={s.lede}>
          Scouts in other cities keep this board honest. If you have the code, the cards live{' '}
          <Link href="/beyondthefoodreview/cards" style={{ color: '#f0b429' }}>
            here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
