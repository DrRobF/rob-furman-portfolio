import { fetchScores } from '../../../../lib/btf';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await fetchScores();
    return Response.json({ rows });
  } catch (err) {
    console.error('[btf] scores read failed', err);
    return Response.json({ rows: [], error: 'unavailable' }, { status: 200 });
  }
}
