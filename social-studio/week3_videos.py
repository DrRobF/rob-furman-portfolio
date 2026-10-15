import sys
which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']
_src = open('week1_videos.py').read().split('# ---------- MON')[0].replace("which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']", '')
exec(_src)
from PIL import ImageOps
import icons3
OUT = '/home/claude/social/out/2026-10-26'


def pace(text):
    """Rob's reading-pace rule: (words / 2.5) + 1.5 s, never under 3 s."""
    return round(max(3.0, len(text.split()) / 2.5 + 1.5), 1)


_cot = {k: icons3.coteacher(step=k).resize((774, 684)) for k in (0.0, 1.0)}
_phones = {}


def ringing(lt):
    k = int(lt * 10) % 10
    if k not in _phones:
        _phones[k] = icons3.phone(ring=k / 10).resize((416, 608))
    return _phones[k]


_cookies = icons3.cookies().resize((760, 520))

# ---------- MON: teach them the way they need to learn -> VIC co-teacher ----------
if 'mon' in which:
    render(f'{OUT}/mon-coteacher.mp4', [
        (pace('Don’t teach your students the way you were taught.'), [dict(text='Don’t teach your students the way you were taught.', size=90, y=700)]),
        (5.5,
         [dict(text='Teach them the way they need to learn.', size=96, y=660, hl={'need', 'learn.'}),
          dict(text='From my book The Future Ready Challenge', size=44, weight='Medium', color=MUTED, y=1080, at=1.0)]),
        (pace('But you can’t sit with every group at once.'), [dict(text='But you can’t sit with every group at once.', size=90, y=720)]),
        (9.0, [dict(text='VIC can be a co-teacher for one group while you teach another.', size=66, y=400),
               dict(text='It asks students questions instead of handing out answers.', size=52, weight='Bold', color=ACCENT, y=1560, at=2.6, lh=1.3)],
         pop_in(lambda lt: _cot[1.0 if lt > 4.0 else 0.0], 153, 790, 0.4)),
        (pace('You see what they worked on. Every decision stays with you.'),
         [dict(text='You see what they worked on.', size=86, y=640),
          dict(text='Every decision stays with you.', size=86, y=880, at=1.2, hl={'you.'})]),
        (5.5, end_card_beats('A co-teacher for your small groups.', 'Free for teachers. Built by a principal.', 'askvic.ai')),
    ], navy_bg_fast)

# ---------- WED: H.E.L.P. Parent Call Rehearsal ----------
if 'wed' in which:
    def wed_bg(t, si, lt, dur):
        return navy_bg_fast(t, si, lt, dur)

    render(f'{OUT}/wed-parent-call.mp4', [
        (4.5, [dict(text='4:15 PM', size=190, weight='Black', y=700),
               dict(text='Line 2. A parent. She is upset.', size=62, weight='Medium', color=MUTED, y=960, at=0.8)]),
        (6.6, [dict(text='Her son was in a fight at lunch. She thinks he is being blamed unfairly.', size=80, y=640)]),
        (4.2, [dict(text='What’s your first sentence?', size=92, y=420, hl={'first'})],
         pop_in(ringing, 332, 820, 0.3)),
        (pace('Hard calls go better when they aren’t your first try.'),
         [dict(text='Hard calls go better when they aren’t your first try.', size=88, y=700)]),
        (7.6, [dict(text='Rehearse the call with a realistic AI parent.', size=80, y=560),
               dict(text='Then get coaching on tone, trust, and next steps.', size=62, weight='Bold', color=ACCENT, y=900, at=1.6, lh=1.25)]),
        (6.0, end_card_beats('Practice the call before it’s real.', 'Parent Call Rehearsal, part of the free H.E.L.P. suite for principals and teachers.', 'drrobfurman.com')),
    ], wed_bg)

# ---------- FRI: What would you do? The Birthday Cookies ----------
if 'fri' in which:
    render(f'{OUT}/fri-birthday-cookies.mp4', [
        (3.2, [dict(text='Principals: what would you do?', size=96, y=720, hl={'what', 'would', 'you', 'do'})]),
        (7.6, [dict(text='A mom calls. Her daughter was the only child in class who didn’t get a birthday cookie.', size=70, y=420)],
         pop_in(lambda lt: _cookies, 160, 1000, 0.6)),
        (7.2, [dict(text='The teacher let the birthday girl hand out homemade cookies to whoever she wanted.', size=74, y=600),
               dict(text='Homemade food breaks the school’s allergy policy.', size=56, weight='Bold', color=MUTED, y=1080, at=2.0, lh=1.3)]),
        (5.6, [dict(text='One girl got none.', size=96, y=640),
               dict(text='The teacher had eaten two herself.', size=80, weight='ExtraBold', color=ACCENT, y=820, at=1.4)]),
        (6.5, [dict(text='A quiet talk?', size=110, y=600), dict(text='Or a write-up?', size=110, y=780, at=0.6),
               dict(text='Comment your call. What I did is in the first comment.', size=52, weight='Bold', color=ACCENT, y=1040, at=1.3, lh=1.3)]),
        (5.5, end_card_beats('Practice calls like this before they’re real.', 'A Day in the Life of a Principal: a free leadership simulation.', 'drrobfurman.com')),
    ], navy_bg_fast)

# ---------- SUN: first graders in ten years (Furman_6399 portrait) ----------
if 'sun' in which:
    _p = ImageOps.exif_transpose(Image.open('/home/claude/social/photos/Furman_6399.jpg')).convert('RGB')
    _fade = Image.new('L', (W, 1080), 0)
    for i in range(1080):
        ImageDraw.Draw(_fade).line([(0, i), (W, i)], fill=int(255 * min(1, i / 160)) if i < 700 else int(255 * (1 - (i - 700) / 380)))
    _base = gradient_bg(W, H).convert('RGBA')

    def por(t, si, lt, dur):
        ph = cover_crop(_p, W, 1080, 1.0 + 0.05 * (t / 22), (0.5, 0.05))
        im = _base.copy(); im.paste(ph, (0, 300), _fade)
        brand_bar(im)
        return im
    render(f'{OUT}/sun-first-graders.mp4', [
        (pace('Our first graders will only be in eleventh grade in ten years.'),
         [dict(text='Our first graders will only be in eleventh grade in ten years.', size=80, y=1290)]),
        (pace('Not even ready to enter the workforce.') + 0.5,
         [dict(text='Not even ready to enter the workforce.', size=90, y=1300, hl={'workforce.'})]),
        (pace('We need students who can take the current technology and say, “But what if?”'),
         [dict(text='We need students who can take the current technology and say, “But what if?”', size=70, y=1280, hl={'what', 'if', 'but'})]),
        (6.4, [dict(text='From my book The Future Ready Challenge', size=44, weight='Medium', color=MUTED, y=1290),
               dict(text='What will they need most? Tell me below.', size=72, y=1400, at=0.8)]),
    ], por)
print('ok')
