import sys
from brand import *
from icons import washer, lesson_card, doors
import icons

OUT = '/home/claude/social/out/2026-10-12'
W, H, FPS = 1080, 1920, 30
SAFE_X, SAFE_W = 80, 860          # keep clear of TikTok/Reels right-side buttons
SCENES = f'{SITE}/urban-scenes'


def brand_bar(im, alpha=1.0):
    hs = headshot(84)
    if alpha < 1:
        a = hs.getchannel('A').point(lambda v: int(v * alpha)); hs.putalpha(a)
    im.paste(hs, (SAFE_X, 210), hs)
    d = ImageDraw.Draw(im)
    c = tuple(int(v * alpha + NAVY[i] * (1 - alpha)) for i, v in enumerate(WHITE))
    d.text((SAFE_X + 104, 222), 'Dr. Rob Furman', font=font('Bold', 34), fill=c)
    d.text((SAFE_X + 104, 262), 'Principal · Author · TEDx Speaker', font=font('Medium', 24), fill=MUTED)


def draw_beat(base, beat, t_in, dur, t):
    """beat: dict(text, size, weight, color, y, hl). Fades/slides in over 0.45s."""
    a = ease((t - t_in) / 0.45)
    if a <= 0:
        return base
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = font(beat.get('weight', 'ExtraBold'), beat.get('size', 84))
    dy = int((1 - a) * 40)
    text_block(d, (SAFE_X, beat['y'] + dy), beat['text'], f, beat.get('color', WHITE), SAFE_W,
               beat.get('lh', 1.14), highlight=beat.get('hl'))
    if a < 1:
        layer.putalpha(layer.getchannel('A').point(lambda v: int(v * a)))
    return Image.alpha_composite(base, layer)


def render(path, scenes, bg_fn):
    """scenes: list of (duration, [beats with 'at' offsets]). bg_fn(t, scene_index, local_t)->RGBA image."""
    v = Video(path)
    total = sum(s[0] for s in scenes)
    t0 = 0
    for si, sc in enumerate(scenes):
        dur, beats = sc[0], sc[1]
        art = sc[2] if len(sc) > 2 else None
        n = int(dur * FPS)
        for k in range(n):
            lt = k / FPS
            im = bg_fn(t0 + lt, si, lt, dur).convert('RGBA')
            if art:
                im = art(im, lt, dur)
            for b in beats:
                im = draw_beat(im, b, b.get('at', 0), dur, lt)
            # fade out last 0.3s of each scene except final
            if si < len(scenes) - 1 and lt > dur - 0.3:
                blk = Image.new('RGBA', (W, H), NAVY + (int(255 * ease((lt - (dur - 0.3)) / 0.3)),))
                im = Image.alpha_composite(im, blk)
            # progress bar
            d = ImageDraw.Draw(im)
            d.rectangle([0, H - 8, int(W * (t0 + lt) / total), H], fill=ACCENT)
            v.frame(im)
        t0 += dur
    return v.close()


# ---------- backgrounds ----------
_navy = None


def navy_bg(t, si, lt, dur, show_brand=True):
    global _navy
    if _navy is None:
        _navy = gradient_bg(W, H).convert('RGBA')
    im = _navy.copy()
    d = ImageDraw.Draw(im)
    # slow drifting accent glow
    x = int(W * (0.5 + 0.35 * math.sin(t * 0.4)))
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([x - 500, 1300, x + 500, 2300], fill=ACCENT + (38,))
    im = Image.alpha_composite(im, glow.filter(ImageFilter.GaussianBlur(120)) if lt == 0 or True else glow)
    if show_brand:
        brand_bar(im)
    return im


_glow_cache = {}


def navy_bg_fast(t, si, lt, dur):
    key = int(t * 6)  # update glow 6x per second
    if key not in _glow_cache:
        _glow_cache.clear()
        _glow_cache[key] = navy_bg(t, si, lt, dur)
    return _glow_cache[key]


def photo_bg(paths, darkness=0.55, pans=None):
    srcs = [Image.open(p).convert('RGB') for p in paths]

    def fn(t, si, lt, dur):
        src = srcs[min(si, len(srcs) - 1)]
        z = 1.0 + 0.08 * (lt / dur)
        pan = (pans[si] if pans and si < len(pans) else (0.5, 0.5))
        im = cover_crop(src, W, H, z, pan)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 12, 22)), darkness).convert('RGBA')
        brand_bar(im)
        return im
    return fn


def end_card_beats(line1, line2, url):
    return [
        dict(text=line1, size=76, y=640, at=0.0),
        dict(text=line2, size=48, weight='Medium', color=MUTED, y=900, at=0.5, lh=1.35),
        dict(text=url, size=60, weight='Bold', color=ACCENT, y=1180, at=1.0),
    ]


which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']

def pop_in(img_fn, x, y, delay=0.0, cache=None):
    def art(im, lt, dur):
        a = ease((lt - delay) / 0.5)
        if a <= 0:
            return im
        g = img_fn(lt)
        if a < 1:
            g = g.copy(); g.putalpha(g.getchannel('A').point(lambda p: int(p * a)))
        im.alpha_composite(g, (int(x), int(y + (1 - a) * 60)))
        return im
    return art


_washers = {}


def spinning_washer(lt):
    key = int(lt * 15) % 30
    if key not in _washers:
        _washers[key] = washer(key / 30 * 2 * math.pi).resize((496, 576))
    return _washers[key]


_lc = lesson_card().resize((570, 675))
_doors = doors().resize((900, 700))


# ---------- MON: WRDR teacher (The Future Ready Challenge) ----------
if 'mon' in which:
    render(f'{OUT}/mon-wrdr.mp4', [
        (3.2, [dict(text='If you can predict what your class will look like two months from now…', size=78, y=700)]),
        (2.6, [dict(text='…you might be a WRDR teacher.', size=92, y=760, hl={'wrdr'})]),
        (4.0, [dict(text='Wash.', size=110, y=420, at=0.0), dict(text='Rinse.', size=110, y=560, at=0.5),
               dict(text='Dry.', size=110, y=700, at=1.0), dict(text='Repeat.', size=110, y=840, at=1.5, hl={'repeat'})],
         pop_in(spinning_washer, 292, 1040, 0.2)),
        (3.0, [dict(text='If the lesson is boring to you, it’s boring to them.', size=84, y=720)]),
        (3.2, [dict(text='Take a risk this week. Try one weird, crazy lesson.', size=84, y=650),
               dict(text='They will never forget it.', size=60, weight='Bold', color=ACCENT, y=1050, at=1.2)]),
        (4.6, [dict(text='Stuck for a fresh idea?', size=76, y=380),
               dict(text='VIC rebuilds an old lesson in a new style, free for teachers.', size=46, weight='Medium', color=MUTED, y=500, at=0.4, lh=1.3),
               dict(text='askvic.ai', size=64, weight='Bold', color=ACCENT, y=1700, at=1.4)],
         pop_in(lambda lt: _lc, 255, 680, 0.6)),
    ], navy_bg_fast)

# ---------- WED: urban student simulation ----------
if 'wed' in which:
    clock_bg = lambda t, si, lt, dur: (lambda im: (brand_bar(im), im)[1])(Image.new('RGBA', (W, H), (6, 8, 14, 255)))
    street = photo_bg([f'{SCENES}/street-corner.png', f'{SCENES}/school-entrance.png', f'{SCENES}/technology-class.png'],
                      0.55, [(0.35, 0.5), (0.3, 0.5), (0.6, 0.5)])

    def wed_bg(t, si, lt, dur):
        if si <= 1:
            return clock_bg(t, si, lt, dur)
        if si == 5:
            return navy_bg_fast(t, si, lt, dur)
        return street(t, si - 2, lt, dur)

    render(f'{OUT}/wed-urban-sim.mp4', [
        (3.0, [dict(text='2:07 AM', size=200, weight='Black', y=700),
               dict(text='The laughing downstairs has been going on for hours.', size=56, weight='Medium', color=MUTED, y=980, at=0.8, lh=1.3)]),
        (3.2, [dict(text='You have to be up at 6:00.', size=84, y=720),
               dict(text='“I’m gonna be dead tomorrow.”', size=64, weight='Bold', color=ACCENT, y=1000, at=1.0)]),
        (3.0, [dict(text='At 7:45, this student walks into your school.', size=84, y=760)]),
        (3.2, [dict(text='What will you see?', size=92, y=700),
               dict(text='A tired kid?\nOr a “defiant” one?', size=72, weight='Bold', color=ACCENT, y=900, at=0.9)]),
        (3.0, [dict(text='Every student carries something you can’t see.', size=84, y=740)]),
        (4.2, end_card_beats('Walk this student’s whole day.', 'A free interactive simulation for teachers and staff PD.', 'drrobfurman.com')),
    ], wed_bg)

# ---------- FRI: What would you do? (principal scenario) ----------
if 'fri' in which:
    render(f'{OUT}/fri-wwyd.mp4', [
        (3.0, [dict(text='Principals: what would you do?', size=96, y=720, hl={'what', 'would', 'you', 'do'})]),
        (7.5, [dict(text='A teacher asks you to move a student with big behavior needs to the other 3rd grade class.', size=68, y=420)],
         pop_in(lambda lt: _doors, 90, 960, 0.5)),
        (5.0, [dict(text='She may be right that it helps her and her other 20 students.', size=76, y=700)]),
        (4.0, [dict(text='But she can’t explain how it helps him.', size=84, y=740, hl={'him'})]),
        (6.0, [dict(text='Approve the move?', size=96, y=640), dict(text='Or say no?', size=96, y=900, at=0.6),
               dict(text='Comment your call. My answer is in the first comment.', size=52, weight='Bold', color=ACCENT, y=1120, at=1.3, lh=1.3)]),
        (6.0, end_card_beats('Practice calls like this before they’re real.', 'A Day in the Life of a Principal: a free leadership simulation.', 'drrobfurman.com')),
    ], navy_bg_fast)

# ---------- SUN: TEDx quote ----------
if 'sun' in which:
    _ted_src = Image.open('/home/claude/social/photos/TED4.jpg').convert('RGB')
    _fade = Image.new('L', (W, 1200), 0)
    for i in range(1200):
        ImageDraw.Draw(_fade).line([(0, i), (W, i)], fill=255 if i < 760 else int(255 * (1 - (i - 760) / 440)))
    _ted_base = gradient_bg(W, H).convert('RGBA')

    def ted(t, si, lt, dur):
        z = 1.0 + 0.06 * (t / 11.4)
        ph = cover_crop(_ted_src, W, 1200, z, (0.5, 0.35))
        im = _ted_base.copy()
        im.paste(ph, (0, 0), _fade)
        brand_bar(im)
        return im
    render(f'{OUT}/sun-fiction.mp4', [
        (3.4, [dict(text='Before it can become fact…', size=96, y=1220)]),
        (3.4, [dict(text='…it must be fiction.', size=104, y=1240, hl={'fiction'})]),
        (4.6, [dict(text='Our kids don’t need to memorize more facts. They need room to imagine what doesn’t exist yet.', size=60, y=1200),
               dict(text='From my book The Future Ready Challenge', size=40, weight='Medium', color=MUTED, y=1600, at=1.4)]),
    ], ted)
print('ok')
