import sys
which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']
_src = open('week1_videos.py').read().split('# ---------- MON')[0].replace("which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']", '')
exec(_src)
from PIL import ImageOps
OUT = '/home/claude/social/out/2026-10-19'
_fac = icons.factory().resize((620, 420))
_bars = icons.bars().resize((460, 460))
_bell = icons.bell().resize((400, 436))
_msgs = {}


def typing_msg(lt):
    k = min(20, int(lt * 6))
    if k not in _msgs:
        _msgs[k] = icons.message_card(typed=k / 20).resize((760, 640))
    return _msgs[k]


# ---------- MON: factory, prison, church ----------
if 'mon' in which:
    _horse = ImageOps.exif_transpose(Image.open('/home/claude/social/photos/DSC_1291.jpg')).convert('RGB')
    horse_bg = photo_bg(['/home/claude/social/photos/DSC_1291.jpg'], 0.45, [(0.42, 0.5)])

    def mon_bg(t, si, lt, dur):
        if si == 5:
            return horse_bg(t, 0, lt, dur)
        return navy_bg_fast(t, si, lt, dur)

    render(f'{OUT}/mon-factory.mp4', [
        (3.0, [dict(text='Our schools were built on three old models.', size=88, y=720)]),
        (2.8, [dict(text='The factory.', size=110, y=480, hl={'factory'}), dict(text='Built for uniformity.', size=60, weight='Bold', color=MUTED, y=640, at=0.5)],
         pop_in(lambda lt: _fac, 230, 900, 0.2)),
        (2.8, [dict(text='The prison.', size=110, y=480, hl={'prison'}), dict(text='Built for compliance.', size=60, weight='Bold', color=MUTED, y=640, at=0.5)],
         pop_in(lambda lt: _bars, 310, 880, 0.2)),
        (2.8, [dict(text='The church.', size=110, y=480, hl={'church'}), dict(text='Built for discipline.', size=60, weight='Bold', color=MUTED, y=640, at=0.5)],
         pop_in(lambda lt: _bell, 340, 880, 0.2)),
        (3.4, [dict(text='It’s time to stop teaching kids to stand in line…', size=84, y=640)]),
        (3.6, [dict(text='…and start teaching them to stand out.', size=92, y=1100, hl={'stand', 'out.'})]),
        (4.6, [dict(text='Start with one lesson.', size=80, y=560),
               dict(text='VIC rebuilds it as a project, an inquiry, or a debate. Free for teachers.', size=50, weight='Medium', color=MUTED, y=800, at=0.4, lh=1.3),
               dict(text='askvic.ai', size=72, weight='Bold', color=ACCENT, y=1120, at=1.2)]),
    ], mon_bg)

# ---------- WED: VIC parent messages ----------
if 'wed' in which:
    render(f'{OUT}/wed-parent-note.mp4', [
        (2.8, [dict(text='9:40 PM', size=190, weight='Black', y=700),
               dict(text='Still at the kitchen table.', size=60, weight='Medium', color=MUTED, y=960, at=0.7)]),
        (3.4, [dict(text='You owe a parent an email about a hard day.', size=84, y=700)]),
        (3.0, [dict(text='You’ve rewritten the first line six times.', size=84, y=720)]),
        (5.0, [dict(text='Tell VIC what happened and the tone you want.', size=68, y=380),
               dict(text='It drafts a clear, warm message.', size=56, weight='Bold', color=ACCENT, y=1520, at=2.2)],
         pop_in(typing_msg, 160, 700, 0.3)),
        (3.0, [dict(text='You review and edit before anything is sent.', size=84, y=720),
               dict(text='You’re still the teacher.', size=60, weight='Bold', color=ACCENT, y=1020, at=1.0)]),
        (4.0, end_card_beats('Get your evening back.', 'Free for teachers. Lesson plans, parent messages, and more.', 'askvic.ai')),
    ], navy_bg_fast)

# ---------- FRI: What would you do? The Sick Note ----------
if 'fri' in which:
    render(f'{OUT}/fri-sick-note.mp4', [
        (2.4, [dict(text='Principals: what would you do?', size=96, y=720, hl={'what', 'would', 'you', 'do'})]),
        (4.0, [dict(text='A mom sends a note: her daughter is sick.', size=80, y=640),
               dict(text='She isn’t. She was so scared of a doctor visit and a shot, Mom let her stay home.', size=56, weight='Medium', color=MUTED, y=900, at=1.0, lh=1.3)]),
        (3.6, [dict(text='Later, Mom calls back and tells you the truth.', size=84, y=720)]),
        (3.6, [dict(text='“I should have told the truth. I just don’t want her to get an unexcused mark because of me.”', size=66, weight='Bold', color=ACCENT, y=640, lh=1.25)]),
        (3.4, [dict(text='Excused?', size=110, y=620), dict(text='Or unexcused?', size=110, y=800, at=0.6),
               dict(text='Comment your call. What I did is in the first comment.', size=52, weight='Bold', color=ACCENT, y=1060, at=1.3, lh=1.3)]),
        (4.0, end_card_beats('Practice calls like this before they’re real.', 'A Day in the Life of a Principal: a free leadership simulation.', 'drrobfurman.com')),
    ], navy_bg_fast)

# ---------- SUN: followers are obsolete ----------
if 'sun' in which:
    _p = ImageOps.exif_transpose(Image.open('/home/claude/social/photos/Furman_9028_(2).jpg')).convert('RGB')
    _fade = Image.new('L', (W, 1200), 0)
    for i in range(1200):
        ImageDraw.Draw(_fade).line([(0, i), (W, i)], fill=int(255 * min(1, i / 160)) if i < 760 else int(255 * (1 - (i - 760) / 440)))
    _base = gradient_bg(W, H).convert('RGBA')

    def por(t, si, lt, dur):
        ph = cover_crop(_p, W, 1080, 1.0 + 0.05 * (t / 12), (0.5, 0.0))
        im = _base.copy(); im.paste(ph, (0, 300), _fade.resize((W, 1080)))
        brand_bar(im)
        return im
    render(f'{OUT}/sun-followers.mp4', [
        (3.4, [dict(text='In the 21st century…', size=96, y=1300)]),
        (3.6, [dict(text='…the word “follower” becomes obsolete.', size=90, y=1280, hl={'follower', '“follower”'})]),
        (5.0, [dict(text='Every person on a team will have to step up and lead at some point. Let’s raise kids who are ready.', size=58, y=1290, lh=1.25),
               dict(text='From my book The Future Ready Challenge', size=40, weight='Medium', color=MUTED, y=1700, at=1.4)]),
    ], por)
print('ok')
