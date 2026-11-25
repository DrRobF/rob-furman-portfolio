import { checkPasscode, gateToken, GATE_COOKIE } from '../../../../lib/btf';

export async function POST(request) {
  let passcode = '';
  try {
    ({ passcode } = await request.json());
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!checkPasscode(passcode)) {
    return Response.json({ ok: false, error: 'Wrong code.' }, { status: 401 });
  }

  const token = gateToken();
  const res = Response.json({ ok: true });
  res.headers.append(
    'Set-Cookie',
    `${GATE_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${60 * 60 * 24 * 120}`
  );
  return res;
}

export async function DELETE() {
  const res = Response.json({ ok: true });
  res.headers.append('Set-Cookie', `${GATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`);
  return res;
}
