# Week of 2026-11-30 videos
import sys
which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']
_src = open('week1_videos.py').read().split('# ---------- MON')[0].replace("which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']", '')
exec(_src)
from PIL import ImageOps
import icons10
OUT = '/home/claude/social/out/2026-11-30'


def pace(text):
    """Rob's reading-pace rule: (words / 2.5) + 1.5 s, never under 3 s."""
    return round(max(3.0, len(text.split()) / 2.5 + 1.5), 1)


def P(t, size=84, y=420, **k):
    return dict(text=t, size=size, y=y, **k)


# ---------- MON: the manatee and the textbook -> VIC lesson planner ----------
if 'mon' in which:
    _mb = icons10.manatee_book().resize((760, 600))
    art = lambda d=0.3: pop_in(lambda lt: _mb, 160, 1080, d)
    q1 = 'Rural West Virginia students haven’t seen a manatee.'
    q2 = 'So a textbook just wasn’t going to reach them.'
    l3 = 'What’s in your textbook that your students have never seen?'
    l4 = 'Give VIC your standard and tell it about your students.'
    l5 = 'It drafts the lesson around where they actually are.'
    render(f'{OUT}/mon-manatee.mp4', [
        (pace(q1) + 0.4, [P(q1, 88, 420, hl={'manatee.'})], art(0.6)),
        (pace(q2) + 1.0, [P(q2, 84, 420), P('From my book The Future Ready Challenge', 42, 860, weight='Medium', color=MUTED, at=1.4)], art(0.0)),
        (pace(l3), [P(l3, 86, 420, hl={'never', 'seen?'})], art(0.0)),
        (pace(l4), [P(l4, 84, 420, hl={'standard', 'students.'})], art(0.0)),
        (pace(l5), [P(l5, 84, 420)], art(0.0)),
        (pace('You review it. You change it. It’s still your lesson.'),
         [P('You review it.', 90, 420), P('You change it.', 90, 560, at=0.8),
          P('It’s still your lesson.', 90, 760, at=1.6, color=ACCENT)], art(0.0)),
        (5.0, end_card_beats('Start where your students are.', 'VIC is free for teachers. Built by a principal.', 'askvic.ai')),
    ], navy_bg_fast)

# ---------- WED: H.E.L.P. course, Gray Area Leadership ----------
if 'wed' in which:
    _sc = {}

    def scale(tilt):
        k = round(tilt, 2)
        if k not in _sc:
            _sc[k] = icons10.two_truths(tilt=k).resize((760, 600))
        return _sc[k]

    def rock(a, b, d=0.2):
        def f(lt):
            p = min(1, max(0, (lt - d) / 1.4))
            return scale(round((a + (b - a) * ease(p)) * 20) / 20)
        return pop_in(f, 160, 1120, 0.0)

    q = 'The hardest decisions hold more than one truth at once.'
    s1 = 'A student admits to plagiarism.'
    s2 = 'She has been caring for a sick sibling and missing support windows.'
    opts = ['A. Full academic penalty, right away.', 'B. Hold accountability, and pair it with a recovery plan.',
            'C. Delay until a counselor and teacher conference.', 'D. Have the grade-level team design the response.']
    p1 = 'Pressure collapses complexity into false binaries.'
    l1 = 'From “There is one right answer”'
    l2 = 'to “There are real tradeoffs, and here is why we chose this path.”'
    render(f'{OUT}/wed-gray.mp4', [
        (pace(q) + 0.6, [P(q, 88, 420, hl={'more', 'than', 'one', 'truth'})], rock(0, 0)),
        (pace(s1 + ' ' + s2), [P(s1, 86, 420), P(s2, 66, 680, at=1.2, color=MUTED, weight='Bold')], rock(0, -0.6)),
        (pace(' '.join(opts)) - 1.0, [P(o, 54, 380 + i * 170, at=0.5 + i * 1.0, weight='Bold', lh=1.2) for i, o in enumerate(opts)], rock(-0.6, 0.6)),
        (4.2, [P('What would you pick?', 92, 420), P('Comment A, B, C or D.', 76, 640, at=0.8, color=ACCENT)], rock(0.6, 0)),
        (pace(p1), [P(p1, 86, 420, hl={'false', 'binaries.'})], rock(0, 0.5)),
        (pace(l1 + ' ' + l2) + 0.6, [P(l1, 72, 420), P(l2, 72, 600, at=1.4, color=ACCENT)], rock(0.5, 0)),
        (5.0, end_card_beats('Gray Area Leadership', 'A free module in my H.E.L.P. course for school leaders.', 'drrobfurman.com')),
    ], navy_bg_fast)

# ---------- FRI: What would you do? Scenario 05 (YouTube Short version) ----------
if 'fri' in which:
    _su = icons10.speak_up().resize((700, 553))
    art = lambda: pop_in(lambda lt: _su, 190, 1120, 0.3)
    l2 = 'A parent sends a note.'
    l3 = 'Her daughter has permission to tell another student to “shut up” if he verbally bullies her.'
    l4 = 'It’s the first time the school has heard she may be dealing with ongoing verbal bullying.'
    l5 = 'How do you teach her to stand up for herself without teaching her to become the next bully?'
    render(f'{OUT}/fri-shutup.mp4', [
        (3.2, [P('Principals: what would you do?', 96, 520, hl={'what', 'would', 'you', 'do?'})],
         pop_in(lambda lt: _su, 190, 1060, 0.5)),
        (pace(l2), [P(l2, 92, 420)], art()),
        (pace(l3), [P(l3, 80, 420, hl={'“shut', 'up”'})], art()),
        (pace(l4), [P(l4, 78, 420)], art()),
        (pace(l5), [P(l5, 76, 420)], art()),
        (6.0, [P('What’s your first move?', 96, 420, color=ACCENT),
               P('Comment your call. What I chose is in the first comment.', 54, 760, weight='Bold', color=MUTED, at=1.2, lh=1.3)]),
        (4.8, end_card_beats('12 real dilemmas. What I actually chose.', 'What Would You Do? 12 School Leadership Scenarios', 'drrobfurman.com/resources')),
    ], navy_bg_fast)

# ---------- SUN: creative, innovative collaborators (Furman_6399 portrait) ----------
if 'sun' in which:
    _p = ImageOps.exif_transpose(Image.open('/home/claude/social/photos/Furman_6399.jpg')).convert('RGB')
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
            ph = cover_crop(_p, W, 1000, 1.0 + 0.05 * (t / 30), (0.5, 0.22))
            im = _base.copy(); im.paste(ph, (0, 300), _fade)
            brand_bar(im)
            _phc[k] = im
        return _phc[k]
    a = 'We need to implement educational reform that allows our children to be'
    b = 'the creative, innovative collaborators and communicators we know they are!'
    render(f'{OUT}/sun-reform.mp4', [
        (pace(a) + 0.4, [P(a, 66, 1300, hl={'reform'})]),
        (pace(b) + 1.0, [P(b, 72, 1300, color=ACCENT)]),
        (3.8, [P('From my book', 52, 1300, weight='Medium', color=MUTED),
               P('The Future Ready Challenge', 70, 1380, at=0.5)]),
        (6.0, [P('What does your school do that lets kids show who they really are?', 62, 1280),
               P('Tell me below.', 66, 1620, color=ACCENT, at=1.4)]),
    ], por)
print('ok')
