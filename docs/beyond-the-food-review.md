# Beyond the Food Review

A restaurant review series that scores service and upkeep instead of food.
Ten categories, ten points each, one hundred possible.

## Routes

| Route | Who sees it | What it does |
|---|---|---|
| `/beyondthefoodreview` | Public | Leaderboard grouped by restaurant, category explainer, scoring scale |
| `/beyondthefoodreview/r/[key]` | Public | One restaurant: the screenshot card, and where the scouts disagreed |
| `/beyondthefoodreview/cards` | Passcode | Rob's card, the scout card, and the shot list |
| `/api/btf/scores` | Public | Read-only JSON of approved scores |
| `/api/btf/gate` | Public | Checks the passcode, sets an httpOnly cookie |
| `/api/btf/submit` | Cookie required | Validates and inserts one score row |

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables) for
Production, Preview and Development:

| Name | Value |
|---|---|
| `BTF_SUPABASE_URL` | `https://fzmmpazepjkkzotnvptn.supabase.co` |
| `BTF_SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API Keys → `service_role` secret |
| `BTF_PASSCODE` | Whatever code you give your scouts |

The service key is used **only** in server-side code (`lib/btf.js` and the API
routes) and is never sent to the browser. The table has row level security on
with no `anon` or `authenticated` grants, so the key is the only way in.

To change the passcode, change `BTF_PASSCODE` and redeploy. Everyone's cookie
stops working immediately, which is how you remove a scout.

## Database

Table `public.btf_scores` in the `DrRobF's Project` Supabase project.

- `total` is a generated column — the sum of the ten categories, never set by hand.
  The three categories added in November (`napkin`, `order_wait`, `food_wait`) are
  nullable at the database level so older rows did not break; the submit route
  requires all ten, so anything new always scores out of 100.
- `approved` defaults to `true`; flip a row to `false` in the Supabase table
  editor to pull it off the public leaderboard without deleting it.
- `is_host` marks Rob's own reviews so the leaderboard can credit them differently.
  The card sets it automatically when the "Scored by" name looks like Rob's.
- `restaurant_key` is generated from the name plus the city, so capitalisation and
  punctuation do not split one restaurant into two leaderboard rows. It is also the
  URL of the restaurant page.

## Several cards for one restaurant

Every card is stored as its own row and is never merged. The leaderboard ranks a
restaurant by the **average** of its cards, and the restaurant page shows each
card individually with a per-category gap column — so two scouts disagreeing is
visible rather than averaged away. That disagreement is the interesting part.

## Adding or renaming a category

`CATEGORIES` in `lib/btf.js` drives the public explainer and the submit
validation; the same list is repeated in
`app/beyondthefoodreview/cards/Card.js` for the client-side form. Change both,
and add the matching column plus its `1..10` check constraint in Supabase.
