# Week of 2026-11-16 videos
import sys
which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']
_src = open('week1_videos.py').read().split('# ---------- MON')[0].replace("which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']", '')
exec(_src)
from PIL import ImageOps
import icons8
OUT = '/home/claude/social/out/2026-11-16'


def pace(text):
    """Rob's reading-pace rule: (words / 2.5) + 1.5 s, never under 3 s."""
    return round(max(3.0, len(text.split()) / 2.5 + 1.5), 1)


def P(t, size=84, y=700, **k):
    return dict(text=t, size=size, y=y, **k)


_sch = icons8.scholar().resize((760, 600))
_sch_s = icons8.scholar().resize((560, 442))
_scales = {}


def scale_anim(lt, start=0.0, end=0.0):
    key = min(15, int(lt * 6))
    if key not in _scales:
        _scales[key] = icons8.policy_scale(tilt=start + (end - start) * key / 15).resize((760, 600))
    return _scales[key]


_tilt_static = icons8.policy_scale(tilt=0.0).resize((760, 600))
_tilt_heavy = icons8.policy_scale(tilt=-1.0).resize((760, 600))
_rx = icons8.rule_exception().resize((700, 553))

# ---------- MON: student scholars -> VIC lesson planner ----------
if 'mon' in which:
    q = 'Student scholars are allowed to dictate their instruction based on their needs, their interests, and their passions.'
    l3 = 'Your students already told you what they care about.'
    l4 = 'Give VIC your standard and your class. It drafts the lesson around them.'
    l5 = 'You review it. You change it. It’s still your lesson.'
    render(f'{OUT}/mon-scholar.mp4', [
        (3.6, [P('Who decides how your students learn?', 92, 420)],
         pop_in(lambda lt: _sch, 160, 1000, 0.5)),
        (pace(q), [P(q, 72, 420, hl={'needs,', 'interests,', 'passions.'}),
                   P('From my book The Future Ready Challenge', 44, 1060, weight='Medium', color=MUTED, at=1.2)],
         pop_in(lambda lt: _sch_s, 260, 1220, 1.0)),
        (pace(l3), [P(l3, 88, 420)], pop_in(lambda lt: _sch, 160, 1020, 0.6)),
        (pace(l4), [P(l4, 80, 420, hl={'standard', 'class.'})], pop_in(lambda lt: _sch, 160, 1020, 0.0)),
        (pace(l5), [P('You review it.', 90, 420), P('You change it.', 90, 560, at=0.8),
                    P('It’s still your lesson.', 90, 760, at=1.6, color=ACCENT)],
         pop_in(lambda lt: _sch, 160, 1020, 0.4)),
        (5.0, end_card_beats('Plan for the kids in front of you.', 'VIC is free for teachers. Built by a principal.', 'askvic.ai')),
    ], navy_bg_fast)

# ---------- WED: H.E.L.P. 8 Factors course, Trust Construction ----------
if 'wed' in which:
    l1 = 'A parent says: “You keep talking policy instead of my child.”'
    q = 'People trust what they can predict under pressure.'
    s1 = 'From “Because I said so”'
    s2 = 'to “Here is what guided this decision, and here is what remains open.”'
    render(f'{OUT}/wed-trust.mp4', [
        (3.2, [P('School leaders: what do you say next?', 92, 520, hl={'next?'})]),
        (pace(l1), [P(l1, 84, 420, hl={'policy', 'child.”'})],
         pop_in(lambda lt: scale_anim(lt, 0.0, -1.0), 160, 1040, 0.6)),
        (7.0, [P('Restate the policy?', 70, 420),
               P('Name their concern, then connect the policy to their child?', 70, 560, at=0.8, color=ACCENT),
               P('Schedule a follow-up?', 70, 820, at=1.6),
               P('Hand it to the family liaison?', 70, 960, at=2.2),
               P('Tell me your pick below.', 52, 1180, weight='Bold', color=MUTED, at=3.0)]),
        (pace(q) + 0.5, [P('“' + q + '”', 86, 420, hl={'predict'})],
         pop_in(lambda lt: _tilt_static, 160, 1040, 0.6)),
        (pace(s1 + ' ' + s2), [P(s1, 72, 420, color=MUTED), P(s2, 76, 600, at=1.0, hl={'guided', 'open.”'})],
         pop_in(lambda lt: _tilt_static, 160, 1080, 1.4)),
        (pace('Trust Construction is one of the 8 Factors in my free H.E.L.P. course for school leaders.'),
         [P('Trust Construction is one of the 8 Factors in my free H.E.L.P. course for school leaders.', 78, 420)],
         pop_in(lambda lt: _tilt_static, 160, 1060, 0.4)),
        (5.0, end_card_beats('Be predictable when it’s hard.', 'Free, in my H.E.L.P. suite for principals and teachers.', 'drrobfurman.com')),
    ], navy_bg_fast)

# ---------- FRI: What would you do? Scenario 10 (YouTube Short version) ----------
if 'fri' in which:
    art = lambda: pop_in(lambda lt: _rx, 190, 1080, 0.3)
    l2 = 'Parents ask for exceptions “just this once.” Usually the answer is no.'
    l3 = 'A student gets out-of-school suspension. He’ll be home with an older sibling while the parent works.'
    l4 = 'The family says plainly: it will be a vacation day.'
    l5 = 'Another student misses a major project for a private family reason. You can’t share it with the teacher.'
    render(f'{OUT}/fri-once.mp4', [
        (3.2, [P('Principals: what would you do?', 96, 520, hl={'what', 'would', 'you', 'do?'})],
         pop_in(lambda lt: _rx, 190, 1000, 0.5)),
        (pace(l2), [P(l2, 84, 420, hl={'once.”'})], art()),
        (pace(l3), [P(l3, 76, 420)], art()),
        (pace(l4), [P(l4, 90, 420, hl={'vacation'})], art()),
        (pace(l5), [P(l5, 76, 420)], art()),
        (6.5, [P('Same rule for everyone?', 90, 420), P('Or an exception?', 90, 680, at=0.8, color=ACCENT),
               P('When is it fair, and when is it favoritism? Comment your call. What I chose is in the first comment.', 50, 980, weight='Bold', color=MUTED, at=1.8, lh=1.3)]),
        (4.8, end_card_beats('12 real dilemmas. What I actually chose.', 'What Would You Do? 12 School Leadership Scenarios', 'drrobfurman.com/resources')),
    ], navy_bg_fast)

# ---------- SUN: creativity and building blocks (TEDx photo) ----------
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
            ph = cover_crop(_p, W, 1000, 1.0 + 0.05 * (t / 28), (0.6, 0.3))
            im = _base.copy(); im.paste(ph, (0, 300), _fade)
            brand_bar(im)
            _phc[k] = im
        return _phc[k]
    a = 'Creativity is the ability to use all of the building blocks'
    b = 'to create new.'
    c = 'So give them the blocks. Then let them build something you didn’t plan.'
    render(f'{OUT}/sun-blocks.mp4', [
        (pace(a) + 0.4, [P(a, 76, 1300, hl={'creativity'})]),
        (pace(b) + 1.0, [P(b, 104, 1340, color=ACCENT)]),
        (3.8, [P('From my book', 52, 1300, weight='Medium', color=MUTED),
               P('The Future Ready Challenge', 70, 1380, at=0.5)]),
        (pace(c), [P(c, 70, 1290)]),
        (6.0, [P('What’s the best thing a student ever built that you never saw coming?', 64, 1280),
               P('Tell me below.', 66, 1620, color=ACCENT, at=1.4)]),
    ], por)
print('ok')
