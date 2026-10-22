# Week of 2026-11-02 videos
import sys
which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']
_src = open('week1_videos.py').read().split('# ---------- MON')[0].replace("which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']", '')
exec(_src)
from PIL import ImageOps
import icons6
OUT = '/home/claude/social/out/2026-11-02'


def pace(text):
    """Rob's reading-pace rule: (words / 2.5) + 1.5 s, never under 3 s."""
    return round(max(3.0, len(text.split()) / 2.5 + 1.5), 1)


def P(t, size=84, y=700, **k):
    return dict(text=t, size=size, y=y, **k)


_build = icons6.build_project().resize((760, 600))
_book = icons6.book_sounds().resize((760, 560))

# ---------- MON: learn it by building it -> VIC lesson planner ----------
if 'mon' in which:
    q = 'Project-based learning experiences allow your students to learn the information as they create something.'
    render(f'{OUT}/mon-build-it.mp4', [
        (4.2, [P('What if they learned it by building it?', 96, 420, hl={'building'})],
         pop_in(lambda lt: _build, 160, 960, 0.6)),
        (pace(q) + 1.0, [P(q, 74, 560, hl={'create'}),
                         P('From my book The Future Ready Challenge', 44, 1120, weight='Medium', color=MUTED, at=1.0)]),
        (pace('The hard part is the planning.'), [P('The hard part is the planning.', 96, 720)]),
        (8.0, [P('VIC’s free lesson planner can rebuild one of your lessons as a project.', 78, 560),
               P('Same standard. Same learning target.', 58, 1000, weight='Bold', color=ACCENT, at=2.0)]),
        (pace('You review it. You change it. It’s still your lesson.') + 0.5,
         [P('You review it. You change it.', 86, 640), P('It’s still your lesson.', 86, 880, at=1.2, hl={'your'})]),
        (5.5, end_card_beats('Turn one lesson into a project this week.', 'Free for teachers. Built by a principal.', 'askvic.ai')),
    ], navy_bg_fast)

# ---------- WED: urban student sim, the teacher who left ----------
if 'wed' in which:
    U = f'{SITE}/urban-scenes'
    bgs = photo_bg([f'{U}/school-entrance.png', f'{U}/school-entrance.png', f'{U}/iss-room.png', f'{U}/iss-room.png',
                    f'{U}/iss-room.png', f'{U}/technology-class.png', f'{U}/technology-class.png'], darkness=0.62,
                   pans=[(0.35, 0.5), (0.4, 0.5), (0.7, 0.5), (0.72, 0.5), (0.74, 0.5), (0.3, 0.5), (0.35, 0.5)])

    def wed_bg(t, si, lt, dur):
        if si >= 6:
            return navy_bg_fast(t, si, lt, dur)
        return bgs(t, si, lt, dur)

    render(f'{OUT}/wed-teacher-left.mp4', [
        (4.6, [P('Adam’s morning has already gone wrong.', 90, 640),
               P('A free simulation of one student’s school day', 46, 1000, weight='Medium', color=MUTED, at=1.0)]),
        (pace('So he goes looking for the one teacher the kids actually trust.'),
         [P('So he goes looking for the one teacher the kids actually trust.', 84, 640, hl={'trust.'})]),
        (pace('The door opens. It’s a different teacher.'), [P('The door opens.', 96, 640), P('It’s a different teacher.', 96, 820, at=1.0)]),
        (8.2, [P('“The previous teacher took a better job away from the city. You need to check your manners.”', 72, 560)]),
        (4.0, [P('All the great teachers leave.', 100, 700, hl={'leave.'})]),
        (8.4, [P('For a kid whose adults keep leaving, losing one trusted teacher can feel like one more abandonment.', 74, 560)]),
        (6.0, end_card_beats('Walk one student’s whole day.', 'A Day in the Life of an Urban Student. Free, in my H.E.L.P. suite for teachers and principals.', 'drrobfurman.com')),
    ], wed_bg)

# ---------- FRI: What would you do? Scenario 11, The Noise During Reading ----------
if 'fri' in which:
    render(f'{OUT}/fri-noise-reading.mp4', [
        (3.4, [P('Principals: what would you do?', 96, 720, hl={'what', 'would', 'you', 'do?'})]),
        (6.0, [P('A teacher’s rule: complete silence during independent reading.', 80, 420)],
         pop_in(lambda lt: _book, 160, 1000, 0.6)),
        (pace('A second grader keeps making sounds while he reads. He doesn’t seem to notice.'),
         [P('A second grader keeps making sounds while he reads.', 80, 560),
          P('He doesn’t seem to notice.', 80, 940, at=1.6, color=ACCENT)]),
        (7.4, [P('It keeps happening, even when he’s corrected.', 80, 520),
               P('Consequences. A raised voice, in front of the class.', 64, 900, weight='Bold', color=MUTED, at=2.0, lh=1.25)]),
        (6.6, [P('No diagnosis yet. His parents come to you.', 80, 520),
               P('The teacher says: “My rules are my rules.”', 80, 860, color=ACCENT, at=2.0)]),
        (6.6, [P('Back the rule?', 110, 560), P('Or step in?', 110, 740, at=0.6),
               P('Comment your call. What I did is in the first comment.', 52, 1000, weight='Bold', color=ACCENT, at=1.3, lh=1.3)]),
        (6.0, end_card_beats('12 real dilemmas. What I actually chose.', 'What Would You Do? 12 School Leadership Scenarios', 'drrobfurman.com/resources')),
    ], navy_bg_fast)

# ---------- SUN: disagreeing without going for the jugular (TEDxUMD photo) ----------
if 'sun' in which:
    _p = ImageOps.exif_transpose(Image.open(f'{SITE}/images/tedx-umd.jpg')).convert('RGB')
    _fade = Image.new('L', (W, 1080), 0)
    for i in range(1080):
        ImageDraw.Draw(_fade).line([(0, i), (W, i)], fill=int(255 * min(1, i / 160)) if i < 700 else int(255 * (1 - (i - 700) / 380)))
    _base = gradient_bg(W, H).convert('RGBA')

    def por(t, si, lt, dur):
        ph = cover_crop(_p, W, 1080, 1.0 + 0.05 * (t / 30), (0.12, 0.3))
        im = _base.copy(); im.paste(ph, (0, 300), _fade)
        brand_bar(im)
        return im
    a = 'The adults in our society seem to have difficulty disagreeing with each other'
    b = 'without attacking one another and going for the jugular.'
    render(f'{OUT}/sun-jugular.mp4', [
        (pace(a), [P(a, 74, 1290)]),
        (pace(b) + 0.6, [P(b, 80, 1290, hl={'jugular.'})]),
        (3.6, [P('From my book', 52, 1290, weight='Medium', color=MUTED),
               P('The Future Ready Challenge', 70, 1370, at=0.5)]),
        (6.0, [P('Where should they practice disagreeing well?', 74, 1290),
               P('Tell me below.', 70, 1640, color=ACCENT, at=1.2)]),
    ], por)
print('ok')
