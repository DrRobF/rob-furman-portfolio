// Server-only helpers for Beyond the Food Review.
// The Supabase service key never reaches the browser: every read and write
// goes through an API route in app/api/btf.

import crypto from 'crypto';

const SUPABASE_URL = process.env.BTF_SUPABASE_URL || 'https://fzmmpazepjkkzotnvptn.supabase.co';
const SERVICE_KEY = process.env.BTF_SUPABASE_SERVICE_KEY;

export const CATEGORIES = [
  { key: 'shaker', label: 'The Shaker Test', blurb: 'Flow, crust around the holes, whether the pepper is ground or dust.' },
  { key: 'table_condition', label: 'Table Condition', blurb: 'Sticky laminate, crumbs in the seam, wobble, condiment lids.' },
  { key: 'napkin', label: 'Napkin Quality', blurb: 'Thickness, whether it survives one wipe, and how many you had to take.' },
  { key: 'greeting', label: 'Greeting Clock', blurb: 'Seconds from the front door to being acknowledged by a human.' },
  { key: 'order_wait', label: 'Sit-to-Order', blurb: 'How long you sat with a menu before anyone came to take the order.' },
  { key: 'food_wait', label: 'Order-to-Food', blurb: 'Order taken to food on the table, judged against how busy they were.' },
  { key: 'water', label: 'Water Refill Latency', blurb: 'How low the glass gets before anybody notices.' },
  { key: 'menu', label: 'Menu Integrity', blurb: 'Peeling laminate, fingerprints, mystery stickiness.' },
  { key: 'bathroom', label: 'The Bathroom', blurb: 'Soap dispenser, hook on the door, dryer versus sad paper towels.' },
  { key: 'check_exit', label: 'The Check Exit', blurb: 'Fork down to check in hand, and whether anyone had to be flagged.' },
];

export const MAX_TOTAL = CATEGORIES.length * 10;

export function bandFor(total) {
  if (total >= 90) return 'Immaculate';
  if (total >= 70) return 'They care';
  if (total >= 50) return 'Mixed bag';
  if (total >= 30) return 'Rough';
  return 'Call somebody';
}

function assertConfigured() {
  if (!SERVICE_KEY) throw new Error('BTF_SUPABASE_SERVICE_KEY is not set');
}

async function rest(path, init = {}) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res;
}

const COLS = ['id', 'restaurant', 'restaurant_key', 'city', 'visited_on', 'scout_name', 'is_host',
  'total', 'notes', 'created_at', ...CATEGORIES.map((c) => c.key)].join(',');

export async function fetchScores() {
  const res = await rest(`btf_scores?select=${COLS}&approved=is.true&order=total.desc,created_at.desc`);
  return res.json();
}

export async function fetchRestaurant(key) {
  const safe = encodeURIComponent(String(key || '').slice(0, 160));
  const res = await rest(`btf_scores?select=${COLS}&approved=is.true&restaurant_key=eq.${safe}&order=created_at.asc`);
  return res.json();
}

// One entry per restaurant. Every card is kept — the average is only how the
// board is ranked, so two scouts disagreeing stays visible instead of being
// flattened into a single number.
export function groupByRestaurant(rows) {
  const byKey = new Map();
  for (const row of rows) {
    const key = row.restaurant_key || row.restaurant;
    if (!byKey.has(key)) byKey.set(key, { key, restaurant: row.restaurant, city: row.city, cards: [] });
    byKey.get(key).cards.push(row);
  }
  return [...byKey.values()]
    .map((g) => {
      const totals = g.cards.map((c) => c.total);
      const average = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
      return { ...g, average, spread: Math.max(...totals) - Math.min(...totals) };
    })
    .sort((a, b) => b.average - a.average || a.restaurant.localeCompare(b.restaurant));
}

export async function insertScore(row) {
  const res = await rest('btf_scores', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(row),
  });
  const [created] = await res.json();
  return created;
}

// --- the scout gate -------------------------------------------------------
// One shared passcode. The cookie holds a hash of it, is httpOnly, and is
// checked on the server, so page source never contains the code itself.

export const GATE_COOKIE = 'btf_scout';

export function gateToken() {
  const code = process.env.BTF_PASSCODE;
  if (!code) return null;
  return crypto.createHash('sha256').update(`btf:${code}`).digest('hex').slice(0, 32);
}

export function checkPasscode(submitted) {
  const code = process.env.BTF_PASSCODE;
  if (!code || typeof submitted !== 'string') return false;
  const a = Buffer.from(submitted.trim());
  const b = Buffer.from(code);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
