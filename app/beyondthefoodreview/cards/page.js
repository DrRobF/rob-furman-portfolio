import { cookies } from 'next/headers';
import Link from 'next/link';
import s from '../btf.module.css';
import { pageMeta } from '../../lib/seo';
import { GATE_COOKIE, gateToken } from '../../../lib/btf';
import { Gate } from './Gate';
import { CardSwitch } from './CardSwitch';

export const dynamic = 'force-dynamic';

export const metadata = pageMeta({
  title: 'Scout Cards | Beyond the Food Review',
  description: 'Working scorecards for Beyond the Food Review scouts.',
  path: '/beyondthefoodreview/cards',
  noindex: true,
});

export default function CardsPage() {
  const token = gateToken();
  const authed = Boolean(token) && cookies().get(GATE_COOKIE)?.value === token;

  return (
    <div className={s.wrap}>
      <div className={s.inner}>
        <p className={s.eyebrow}>Beyond the Food Review</p>
        <h1 className={s.h1}>{authed ? 'Score a restaurant' : 'Scouts only'}</h1>

        {authed ? (
          <>
            <p className={s.lede}>
              Seven categories, ten points each. Fill it in at the table, post it when you are done — it lands
              on the public leaderboard straight away.
            </p>
            <div style={{ marginTop: 28 }}>
              <CardSwitch />
            </div>
          </>
        ) : (
          <>
            <p className={s.lede}>
              These are the working cards. If you were sent a code, use it below. Otherwise the{' '}
              <Link href="/beyondthefoodreview" style={{ color: '#f0b429' }}>
                leaderboard is this way
              </Link>
              .
            </p>
            <Gate />
          </>
        )}
      </div>
    </div>
  );
}
