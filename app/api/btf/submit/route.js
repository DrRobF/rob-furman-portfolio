import { cookies } from 'next/headers';
import { CATEGORIES, GATE_COOKIE, gateToken, insertScore } from '../../../../lib/btf';

export async function POST(request) {
  const token = gateToken();
  if (!token || cookies().get(GATE_COOKIE)?.value !== token) {
    return Response.json({ ok: false, error: 'Not signed in.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Bad request.' }, { status: 400 });
  }

  const restaurant = String(body.restaurant || '').trim().slice(0, 120);
  if (!restaurant) return Response.json({ ok: false, error: 'Restaurant name is required.' }, { status: 400 });

  const row = {
    restaurant,
    city: String(body.city || '').trim().slice(0, 80) || null,
    visited_on: /^\d{4}-\d{2}-\d{2}$/.test(body.visited_on || '') ? body.visited_on : null,
    scout_name: String(body.scout_name || '').trim().slice(0, 80) || 'Anonymous scout',
    is_host: body.is_host === true,
    notes: String(body.notes || '').trim().slice(0, 1200) || null,
  };

  for (const { key, label } of CATEGORIES) {
    const n = Number(body[key]);
    if (!Number.isInteger(n) || n < 1 || n > 10) {
      return Response.json({ ok: false, error: `${label} needs a score from 1 to 10.` }, { status: 400 });
    }
    row[key] = n;
  }

  try {
    const created = await insertScore(row);
    return Response.json({ ok: true, row: created });
  } catch (err) {
    console.error('[btf] submit failed', err);
    return Response.json({ ok: false, error: 'Could not save. Try again.' }, { status: 500 });
  }
}
