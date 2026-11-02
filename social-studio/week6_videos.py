# Week of 2026-11-09 videos
import sys
which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']
_src = open('week1_videos.py').read().split('# ---------- MON')[0].replace("which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']", '')
exec(_src)
from PIL import ImageOps
import icons7
OUT = '/home/claude/social/out/2026-11-09'


def pace(text):
    """Rob's reading-pace rule: (words / 2.5) + 1.5 s, never under 3 s."""
    return round(max(3.0, len(text.split()) / 2.5 + 1.5), 1)


def P(t, size=84, y=700, **k):
    return dict(text=t, size=size, y=y, **k)


_dots = {}


def dots_anim(lt):
    key = min(20, int(lt * 6))
    if key not in _dots:
        _dots[key] = icons7.dots(prog=key / 20).resize((760, 600))
    return _dots[key]


_gauges = {}


def gauge_anim(lt):
    key = min(15, int(lt * 6))
    if key not in _gauges:
        _gauges[key] = icons7.gauge(level=0.15 + 0.7 * key / 15).resize((760, 560))
    return _gauges[key]


_ft = icons7.field_trip().resize((700, 553))
import icons3
_cot = icons3.coteacher().resize((860, 760))
_dash = icons7.dots().resize((760, 600))

# ---------- MON: connect the dots -> VIC co-teacher ----------
if 'mon' in which:
    q = 'Possessing the information and being able to connect the dots are two very different things.'
    render(f'{OUT}/mon-dots.mp4', [
        (3.6, [P('Your students can find any fact in seconds.', 92, 420)],
         pop_in(lambda lt: icons7.dots(prog=0).resize((760, 600)), 160, 980, 0.5)),
        (pace(q), [P(q, 74, 460, hl={'connect', 'dots'}),
                         P('From my book The Future Ready Challenge', 44, 1000, weight='Medium', color=MUTED, at=1.2)]),
        (6.0, [P('So the job isn’t handing them answers.', 84, 420),
               P('It’s teaching them to connect the dots.', 84, 760, at=1.6, color=ACCENT)],
         pop_in(dots_anim, 160, 1080, 1.2)),
        (pace('VIC works as a co-teacher that asks students questions instead of handing out answers.'),
         [P('VIC works as a co-teacher that asks students questions instead of handing out answers.', 78, 420, hl={'questions'})],
         pop_in(lambda lt: _cot, 110, 1000, 0.6)),
        (pace('You see what they worked on. Every decision stays with you.'),
         [P('You see what they worked on.', 86, 420), P('Every decision stays with you.', 86, 640, at=1.4, hl={'you.'})],
         pop_in(lambda lt: _cot, 110, 1000, 0.0)),
        (5.0, end_card_beats('Let them do the thinking.', 'VIC is free for teachers. Built by a principal.', 'askvic.ai')),
    ], navy_bg_fast)

# ---------- WED: H.E.L.P. Leadership Pressure Diagnostic ----------
if 'wed' in which:
    s = 'Leaders sometimes need to sound certain before they feel certain.'
    render(f'{OUT}/wed-certain.mp4', [
        (3.4, [P('School leaders: agree or disagree?', 96, 640, hl={'agree', 'disagree?'})]),
        (pace(s), [P('“' + s + '”', 84, 420, hl={'sound', 'feel'})],
         pop_in(lambda lt: gauge_anim(2), 160, 1060, 0.6)),
        (3.6, [P('Agree?', 120, 560), P('Disagree?', 120, 760, at=0.6, color=ACCENT),
               P('Tell me in the comments.', 56, 1020, weight='Bold', color=MUTED, at=1.2)]),
        (pace('That’s one of the questions in my free Leadership Pressure Diagnostic.'),
         [P('That’s one of the questions in my free Leadership Pressure Diagnostic.', 80, 420)],
         pop_in(gauge_anim, 160, 1040, 0.8)),
        (pace('It maps how you lead when urgency, emotion, ambiguity, and conflict rise.'),
         [P('It maps how you lead when urgency, emotion, ambiguity, and conflict rise.', 80, 420, hl={'urgency,', 'emotion,', 'ambiguity,', 'conflict'})],
         pop_in(lambda lt: gauge_anim(9), 160, 1060, 0.0)),
        (pace('Then you practice in simulations and watch the evidence build.'),
         [P('Then you practice in simulations and watch the evidence build.', 84, 420)],
         pop_in(lambda lt: _dash, 160, 1000, 0.6)),
        (5.0, end_card_beats('Find your baseline.', 'Free, in my H.E.L.P. suite for principals and teachers.', 'drrobfurman.com')),
    ], navy_bg_fast)

# ---------- FRI: What would you do? Scenario 06 (YouTube Short version) ----------
if 'fri' in which:
    art = lambda: pop_in(lambda lt: _ft, 190, 1060, 0.3)
    l2 = 'A parent returns the field-trip form with handwritten changes.'
    l3 = 'Her edits: the school can’t use it to escape responsibility if her child is hurt.'
    l4 = 'You explain: the school is responsible either way.'
    l5 = 'She still refuses to sign a clean copy.'
    render(f'{OUT}/fri-fieldtrip.mp4', [
        (3.2, [P('Principals: what would you do?', 96, 520, hl={'what', 'would', 'you', 'do?'})],
         pop_in(lambda lt: _ft, 190, 1000, 0.5)),
        (pace(l2), [P(l2, 84, 420)], art()),
        (pace(l3), [P(l3, 80, 420)], art()),
        (pace(l4), [P(l4, 84, 420)], art()),
        (pace(l5), [P(l5, 96, 420, hl={'refuses'})], art()),
        (6.0, [P('Keep arguing?', 96, 420), P('Keep the child home?', 96, 580, at=0.7),
               P('Or check the law?', 96, 860, at=1.4, color=ACCENT),
               P('Comment your call. What I chose is in the first comment.', 52, 1120, weight='Bold', color=MUTED, at=2.2, lh=1.3)]),
        (4.8, end_card_beats('12 real dilemmas. What I actually chose.', 'What Would You Do? 12 School Leadership Scenarios', 'drrobfurman.com/resources')),
    ], navy_bg_fast)

# ---------- SUN: help one another (TEDxYouth photo) ----------
if 'sun' in which:
    _p = ImageOps.exif_transpose(Image.open(f'{SITE}/images/tedx-prime.jpg')).convert('RGB')
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
            ph = cover_crop(_p, W, 1000, 1.0 + 0.05 * (t / 25), (0.42, 0.3))
            im = _base.copy(); im.paste(ph, (0, 300), _fade)
            brand_bar(im)
            _phc[k] = im
        return _phc[k]
    a = 'We must teach them how to help one another,'
    b = 'not tear each other down.'
    render(f'{OUT}/sun-help.mp4', [
        (pace(a) + 0.4, [P(a, 80, 1300, hl={'help'})]),
        (pace(b) + 0.8, [P(b, 92, 1320)]),
        (3.8, [P('From my book', 52, 1300, weight='Medium', color=MUTED),
               P('The Future Ready Challenge', 70, 1380, at=0.5)]),
        (pace('Our kids learn how to treat each other by watching how we do it.'),
         [P('Our kids learn how to treat each other by watching how we do it.', 70, 1290)]),
        (6.0, [P('Where do your students practice lifting each other up?', 70, 1290),
               P('Tell me below.', 66, 1600, color=ACCENT, at=1.4)]),
    ], por)
print('ok')
