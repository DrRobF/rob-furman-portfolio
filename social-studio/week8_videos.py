# Week of 2026-11-23 videos
import sys
which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']
_src = open('week1_videos.py').read().split('# ---------- MON')[0].replace("which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']", '')
exec(_src)
from PIL import ImageOps
import icons9
OUT = '/home/claude/social/out/2026-11-23'


def pace(text):
    """Rob's reading-pace rule: (words / 2.5) + 1.5 s, never under 3 s."""
    return round(max(3.0, len(text.split()) / 2.5 + 1.5), 1)


def P(t, size=84, y=700, **k):
    return dict(text=t, size=size, y=y, **k)


# ---------- MON: crazy, weird lesson -> VIC lesson planner ----------
if 'mon' in which:
    _wl = icons9.weird_lesson().resize((760, 600))
    art = lambda d=0.4: pop_in(lambda lt: _wl, 160, 1060, d)
    q1 = 'Don’t be afraid to take a risk!'
    q2 = 'If it sounds like a crazy, weird lesson, it probably is, and that’s okay.'
    l4 = 'Stuck on what the weird version would even look like?'
    l5 = 'Give VIC your standard. Ask for the version your students won’t see coming.'
    render(f'{OUT}/mon-weird.mp4', [
        (3.4, [P('What’s the weirdest lesson you ever taught?', 90, 420, hl={'weirdest'})], art(0.6)),
        (pace(q1 + ' ' + q2), [P(q1, 84, 420, hl={'risk!'}), P(q2, 64, 640, at=1.0),
                               P('From my book The Future Ready Challenge', 42, 940, weight='Medium', color=MUTED, at=2.0)],
         art(0.0)),
        (pace(l4), [P(l4, 86, 420)], art(0.3)),
        (pace(l5), [P(l5, 80, 420, hl={'standard.', 'coming.'})], art(0.0)),
        (pace('You review it. You change it. It’s still your lesson.'),
         [P('You review it.', 90, 420), P('You change it.', 90, 560, at=0.8),
          P('It’s still your lesson.', 90, 760, at=1.6, color=ACCENT)], art(0.4)),
        (5.0, end_card_beats('Take the risk. Keep the control.', 'VIC is free for teachers. Built by a principal.', 'askvic.ai')),
    ], navy_bg_fast)

# ---------- WED: H.E.L.P. Parent Call Rehearsal, three heat levels ----------
if 'wed' in which:
    _ph = {}

    def heat(level):
        k = round(level, 2)
        if k not in _ph:
            _ph[k] = icons9.phone_heat(level=k).resize((760, 600))
        return _ph[k]

    def dial(a, b, d=0.3):
        def f(lt):
            p = min(1, max(0, (lt - d) / 1.2))
            return heat(round((a + (b - a) * p) * 20) / 20)
        return pop_in(f, 160, 1100, 0.0)

    lv = [('Moderate', 'Frustrated, still collaborative.', 0.17),
          ('High', 'Defensive and distrustful.', 0.5),
          ('Full Blaze', 'Accusatory. Intense urgency.', 0.92)]
    scenes = [(3.6, [P('Not every parent call starts at the same temperature.', 86, 420, hl={'temperature.'})], dial(0.17, 0.17))]
    prev = 0.17
    for name, desc, l in lv:
        scenes.append((pace(name + ' ' + desc) + 0.4, [P(name, 110, 420, color=ACCENT), P(desc, 74, 600, at=0.6)], dial(prev, l)))
        prev = l
    a = 'Which one do you need to practice? Tell me below.'
    b = 'Parent Call Rehearsal lets you practice with a realistic AI parent at the level you pick.'
    c = 'Then it coaches you on tone, trust, and next steps.'
    e = 'The AI parent can speak English, Spanish, Haitian Creole or Portuguese.'
    scenes += [
        (pace(a), [P('Which one do you need to practice?', 88, 420), P('Tell me below.', 70, 760, color=ACCENT, at=1.0)], dial(0.92, 0.92)),
        (pace(b), [P(b, 76, 420, hl={'practice', 'level'})], dial(0.92, 0.5)),
        (pace(c), [P(c, 84, 420, hl={'tone,', 'trust,', 'next', 'steps.'})], dial(0.5, 0.17)),
        (pace(e), [P(e, 78, 420)], dial(0.17, 0.17)),
        (5.0, end_card_beats('Practice the hard call before it’s real.', 'Free, in my H.E.L.P. suite for principals and teachers.', 'drrobfurman.com')),
    ]
    render(f'{OUT}/wed-heat.mp4', scenes, navy_bg_fast)

# ---------- FRI: What would you do? Scenario 03 (YouTube Short version) ----------
if 'fri' in which:
    _gd = icons9.garage().resize((700, 553))
    art = lambda: pop_in(lambda lt: _gd, 190, 1100, 0.3)
    l2 = 'A parent calls. Her kindergartner will miss school today.'
    l3 = 'The reason: the garage door won’t open.'
    l4 = 'This family has a long pattern of late arrivals, absences and excuses.'
    l5 = 'The child could ride the bus. The front door works. Garage doors have emergency releases.'
    render(f'{OUT}/fri-garage.mp4', [
        (3.2, [P('Principals: what would you do?', 96, 520, hl={'what', 'would', 'you', 'do?'})],
         pop_in(lambda lt: _gd, 190, 1040, 0.5)),
        (pace(l2), [P(l2, 86, 420)], art()),
        (pace(l3), [P(l3, 92, 420, hl={'garage', 'door'})], art()),
        (pace(l4), [P(l4, 80, 420)], art()),
        (pace(l5), [P(l5, 76, 420)], art()),
        (6.5, [P('Grace?', 96, 420), P('Or hold the line?', 96, 600, at=0.8, color=ACCENT),
               P('Excused or unexcused? Comment your call. What I chose is in the first comment.', 52, 900, weight='Bold', color=MUTED, at=1.8, lh=1.3)]),
        (4.8, end_card_beats('12 real dilemmas. What I actually chose.', 'What Would You Do? 12 School Leadership Scenarios', 'drrobfurman.com/resources')),
    ], navy_bg_fast)

# ---------- SUN: student-centered (Furman_9028 portrait) ----------
if 'sun' in which:
    _p = ImageOps.exif_transpose(Image.open('/home/claude/social/photos/Furman_9028_(2).jpg')).convert('RGB')
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
            ph = cover_crop(_p, W, 1000, 1.0 + 0.05 * (t / 28), (0.5, 0.22))
            im = _base.copy(); im.paste(ph, (0, 300), _fade)
            brand_bar(im)
            _phc[k] = im
        return _phc[k]
    a = 'Student-centered learning means putting the student at the center'
    b = 'of every decision we make.'
    c = 'Not most decisions. Every one.'
    render(f'{OUT}/sun-center.mp4', [
        (pace(a) + 0.4, [P(a, 74, 1300, hl={'student-centered'})]),
        (pace(b) + 1.0, [P(b, 96, 1340, color=ACCENT)]),
        (3.8, [P('From my book', 52, 1300, weight='Medium', color=MUTED),
               P('The Future Ready Challenge', 70, 1380, at=0.5)]),
        (pace(c), [P(c, 66, 1290)]),
        (6.0, [P('What’s one decision at your school that should start with the student?', 62, 1280),
               P('Tell me below.', 66, 1620, color=ACCENT, at=1.4)]),
    ], por)
print('ok')
