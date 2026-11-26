# Week of 2026-12-07 videos
import sys
which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']
_src = open('week1_videos.py').read().split('# ---------- MON')[0].replace("which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']", '')
exec(_src)
from PIL import ImageOps
import icons11
OUT = '/home/claude/social/out/2026-12-07'


def pace(text):
    """Rob's reading-pace rule: (words / 2.5) + 1.5 s, never under 3 s."""
    return round(max(3.0, len(text.split()) / 2.5 + 1.5), 1)


def P(t, size=84, y=420, **k):
    return dict(text=t, size=size, y=y, **k)


# ---------- MON: teach them the way they need to learn -> VIC lesson planner ----------
if 'mon' in which:
    _tw = icons11.two_ways().resize((760, 600))
    art = lambda d=0.3: pop_in(lambda lt: _tw, 160, 1080, d)
    q1 = 'Don’t teach your students the way you were taught.'
    q2 = 'Teach them the way they need to learn!'
    l3 = 'So how do the kids in front of you need to learn?'
    l4 = 'Give VIC your standard and tell it about your students.'
    l5 = 'It drafts a lesson built for them, not for the way you were taught.'
    render(f'{OUT}/mon-taught.mp4', [
        (pace(q1) + 0.4, [P(q1, 88, 420, hl={'were', 'taught.'})], art(0.6)),
        (pace(q2) + 1.0, [P(q2, 88, 420, color=ACCENT), P('From my book The Future Ready Challenge', 42, 860, weight='Medium', color=MUTED, at=1.4)], art(0.0)),
        (pace(l3), [P(l3, 86, 420, hl={'need', 'to', 'learn?'})], art(0.0)),
        (pace(l4), [P(l4, 84, 420, hl={'standard', 'students.'})], art(0.0)),
        (pace(l5), [P(l5, 80, 420)], art(0.0)),
        (pace('You review it. You change it. It’s still your lesson.'),
         [P('You review it.', 90, 420), P('You change it.', 90, 560, at=0.8),
          P('It’s still your lesson.', 90, 760, at=1.6, color=ACCENT)], art(0.0)),
        (5.0, end_card_beats('Teach the way they learn.', 'VIC is free for teachers. Built by a principal.', 'askvic.ai')),
    ], navy_bg_fast)

# ---------- WED: H.E.L.P. course, Regulation Under Pressure ----------
if 'wed' in which:
    _hp = icons11.hallway_phones().resize((760, 600))
    art = lambda d=0.0: pop_in(lambda lt: _hp, 160, 1120, d)
    q = 'Pressure changes your pace before it changes your words.'
    s1 = 'A student starts yelling in the hallway.'
    s2 = 'Phones come out. Staff are watching.'
    opts = ['A. Issue a firm public command immediately.', 'B. Lower your voice, reduce crowd stimulus, then set a boundary.',
            'C. Pull the student aside before naming the boundary.', 'D. Hand off to security and step back.']
    p1 = 'Separate authority from volume.'
    p2 = 'A quieter voice can become the strongest authority signal in a loud space.'
    render(f'{OUT}/wed-hallway.mp4', [
        (pace(q) + 0.6, [P(q, 88, 420, hl={'pace'})], art(0.4)),
        (pace(s1 + ' ' + s2) + 0.4, [P(s1, 86, 420), P(s2, 70, 800, at=1.4, color=MUTED, weight='Bold')], art()),
        (pace(' '.join(opts)) - 1.0, [P(o, 50, 330 + i * 200, at=0.5 + i * 1.0, weight='Bold', lh=1.2) for i, o in enumerate(opts)], pop_in(lambda lt: _hp.resize((600, 474)), 240, 1250, 0.0)),
        (4.2, [P('What would you pick?', 92, 420), P('Comment A, B, C or D.', 76, 640, at=0.8, color=ACCENT)], art()),
        (pace(p1 + ' ' + p2) + 0.4, [P(p1, 86, 420, hl={'authority', 'volume.'}), P(p2, 64, 700, at=1.4, color=ACCENT, weight='Bold')], art()),
        (5.0, end_card_beats('Regulation Under Pressure', 'A free module in my H.E.L.P. course for school leaders.', 'drrobfurman.com')),
    ], navy_bg_fast)

# ---------- FRI: What would you do? Scenario 08 (YouTube Short version) ----------
if 'fri' in which:
    _vt = icons11.vendor_table().resize((700, 553))
    art = lambda: pop_in(lambda lt: _vt, 190, 1120, 0.3)
    l2 = 'The PTA president asks if her friend can sell merchandise at the school carnival.'
    l3 = 'Private sales aren’t allowed. The superintendent confirms. You say no.'
    l4 = 'Carnival day: the friend shows up with a table anyway.'
    l5 = 'She says the PTA president told her, “He will not even realize you are here.”'
    render(f'{OUT}/fri-vendor.mp4', [
        (3.2, [P('Principals: what would you do?', 96, 520, hl={'what', 'would', 'you', 'do?'})],
         pop_in(lambda lt: _vt, 190, 1060, 0.5)),
        (pace(l2), [P(l2, 80, 420)], art()),
        (pace(l3), [P(l3, 80, 420)], art()),
        (pace(l4), [P(l4, 84, 420, hl={'anyway.'})], art()),
        (pace(l5), [P(l5, 76, 420)], art()),
        (6.0, [P('What’s your move?', 96, 420, color=ACCENT),
               P('Comment your call. What I chose is in the pinned comment.', 54, 760, weight='Bold', color=MUTED, at=1.2, lh=1.3)]),
        (4.8, end_card_beats('12 real dilemmas. What I actually chose.', 'What Would You Do? 12 School Leadership Scenarios', 'drrobfurman.com/resources')),
    ], navy_bg_fast)

# ---------- SUN: they can take responsibility for their learning (TED4 stage photo) ----------
if 'sun' in which:
    _p = ImageOps.exif_transpose(Image.open('/home/claude/social/photos/TED4.jpg')).convert('RGB')
    _fade = Image.new('L', (W, 1000), 0)
    fd = ImageDraw.Draw(_fade)
    for i in range(1000):
        fd.line([(0, i), (W, i)], fill=int(255 * min(1, i / 140)) if i < 640 else int(255 * (1 - (i - 640) / 360)))
    _base = gradient_bg(W, H).convert('RGBA')
    _phc = {}

    def por(t, si, lt, dur):
        k = int(t * 10)
        if k not in _phc:
            _phc.clear()
            ph = cover_crop(_p, W, 1000, 1.0 + 0.05 * (t / 30), PAN)
            im = _base.copy(); im.paste(ph, (0, 300), _fade)
            brand_bar(im)
            _phc[k] = im
        return _phc[k]
    PAN = (0.5, 0.3)
    a = 'I trust the process and communicate to my students'
    b = 'that I believe they can take responsibility for their learning.'
    render(f'{OUT}/sun-trust.mp4', [
        (pace(a) + 0.4, [P(a, 66, 1300, hl={'trust'})]),
        (pace(b) + 1.0, [P(b, 72, 1300, color=ACCENT)]),
        (3.8, [P('From my book', 52, 1300, weight='Medium', color=MUTED),
               P('The Future Ready Challenge', 70, 1380, at=0.5)]),
        (6.0, [P('What’s one thing you handed over to your students that they surprised you with?', 60, 1280),
               P('Tell me below.', 66, 1640, color=ACCENT, at=1.4)]),
    ], por)
print('ok')
