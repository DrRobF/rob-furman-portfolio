"""Week 3 illustrations (same flat style as icons.py)."""
from icons import _canvas, _done, S, SS, INK, SOFT, RED
from brand import font, NAVY, WHITE, ACCENT, GOLD, MUTED
from PIL import Image, ImageDraw
import math

PAPER = (255, 253, 247)
WATER = (150, 196, 255)


def hydrant(w=760, h=640, spray=1.0, seed=0):
    """Fire hydrant gushing water; one gold droplet = the information you need."""
    im, d = _canvas(w, h)
    bx = 150
    d.rounded_rectangle(S(bx + 20, 230, bx + 180, h - 60), radius=16 * SS, fill=RED)
    d.chord(S(bx + 10, 150, bx + 190, 320), 180, 360, fill=RED)
    d.rounded_rectangle(S(bx + 70, 120, bx + 130, 170), radius=10 * SS, fill=(190, 60, 50))
    d.rounded_rectangle(S(bx - 10, 230, bx + 210, 262), radius=12 * SS, fill=(190, 60, 50))
    d.rounded_rectangle(S(bx - 20, h - 80, bx + 220, h - 40), radius=12 * SS, fill=(190, 60, 50))
    d.rounded_rectangle(S(bx + 180, 320, bx + 240, 390), radius=10 * SS, fill=(190, 60, 50))  # nozzle
    d.ellipse(S(bx + 75, 360, bx + 125, 410), fill=(190, 60, 50))
    # spray from nozzle to the right/up
    import random
    rnd = random.Random(seed)
    n = int(70 * spray)
    for i in range(n):
        t = rnd.random()
        x = bx + 250 + t * (w - bx - 260)
        y = 355 - t * 260 * rnd.uniform(0.2, 1.0) + rnd.uniform(-30, 30)
        r = rnd.uniform(5, 13)
        d.ellipse(S(x - r, y - r * 1.3, x + r, y + r * 1.3), fill=WATER)
    if spray > 0.6:
        x, y, r = w - 90, 150, 26
        d.ellipse(S(x - r, y - r * 0.9, x + r, y + r * 1.2), fill=GOLD)
        d.polygon(S(x - r * 0.8, y - r * 0.4, x, y - r * 2.0, x + r * 0.8, y - r * 0.4), fill=GOLD)
    return _done(im, w, h)


def phone(w=520, h=760, ring=0.0):
    """Desk phone handset ringing, with a call bubble."""
    im, d = _canvas(w, h)
    cx = w / 2
    d.rounded_rectangle(S(80, 160, w - 80, h - 40), radius=60 * SS, fill=INK)
    d.rounded_rectangle(S(110, 200, w - 110, 340), radius=18 * SS, fill=(30, 46, 78))
    d.text(S(140, 228), 'Line 2', font=font('Bold', 44 * SS), fill=GOLD)
    d.text(S(140, 284), 'Parent', font=font('Medium', 34 * SS), fill=MUTED)
    for r in range(3):
        for c in range(3):
            x = 140 + c * 90
            y = 380 + r * 90
            d.rounded_rectangle(S(x, y, x + 60, y + 60), radius=12 * SS, fill=(196, 208, 230))
    d.rounded_rectangle(S(140, h - 120, w - 140, h - 70), radius=24 * SS, fill=(86, 160, 96))
    # ring arcs
    k = 0.5 + 0.5 * math.sin(ring * 14)
    for i in range(3):
        a = int(255 * max(0, min(1, k - i * 0.25 + 0.3)))
        col = ACCENT + (a,)
        d.arc(S(cx - 120 - i * 50, 10 - i * 40, cx + 120 + i * 50, 250 + i * 40), 215, 325, fill=col, width=10 * SS)
    return _done(im, w, h)


def cookies(w=760, h=520, missing=True):
    """A plate of cookies and one empty spot (the child who got none)."""
    im, d = _canvas(w, h)
    d.ellipse(S(20, 200, w - 20, h - 20), fill=(232, 236, 246))
    d.ellipse(S(60, 230, w - 60, h - 50), fill=PAPER)
    spots = [(200, 330), (330, 300), (460, 300), (590, 330), (270, 410), (520, 410)]
    for i, (x, y) in enumerate(spots):
        if missing and i == 5:
            d.ellipse(S(x - 60, y - 40, x + 60, y + 40), outline=(190, 196, 210), width=5 * SS)
            continue
        d.ellipse(S(x - 64, y - 44, x + 64, y + 44), fill=(214, 160, 92))
        for (dx, dy) in [(-24, -10), (16, -18), (30, 12), (-8, 16), (-36, 14)]:
            d.ellipse(S(x + dx - 8, y + dy - 6, x + dx + 8, y + dy + 6), fill=(92, 58, 34))
    # birthday candle flag
    d.rectangle(S(w / 2 - 6, 60, w / 2 + 6, 190), fill=GOLD)
    d.polygon(S(w / 2, 20, w / 2 + 18, 52, w / 2, 70, w / 2 - 18, 52), fill=(255, 170, 70))
    return _done(im, w, h)


def coteacher(w=860, h=760, step=1.0):
    """Two groups: the teacher with one table, a tablet asking a question to another."""
    im, d = _canvas(w, h)
    # tablet
    d.rounded_rectangle(S(40, 140, 440, 640), radius=36 * SS, fill=INK)
    d.rounded_rectangle(S(66, 180, 414, 600), radius=18 * SS, fill=PAPER)
    d.text(S(92, 200), 'VIC', font=font('Black', 44 * SS), fill=NAVY)
    # question bubble on tablet
    d.rounded_rectangle(S(92, 280, 390, 400), radius=24 * SS, fill=(220, 232, 255))
    d.text(S(112, 300), 'What do you', font=font('Bold', 30 * SS), fill=NAVY)
    d.text(S(112, 342), 'notice first?', font=font('Bold', 30 * SS), fill=NAVY)
    if step > 0.5:
        d.rounded_rectangle(S(150, 430, 390, 520), radius=24 * SS, fill=(210, 214, 224))
        d.text(S(170, 452), 'Hmm...', font=font('Bold', 32 * SS), fill=(80, 90, 110))
    # big question mark
    d.text(S(470, 60), '?', font=font('Black', 260 * SS), fill=GOLD)
    # teacher + small group (simple figures)
    for i, (x, col) in enumerate([(560, ACCENT), (680, (196, 208, 230)), (790, (196, 208, 230))]):
        r = 52 if i == 0 else 38
        top = 380 if i == 0 else 470
        d.ellipse(S(x - r, top, x + r, top + 2 * r), fill=col)
        d.rounded_rectangle(S(x - r * 1.3, top + 2 * r + 10, x + r * 1.3, h - 90), radius=30 * SS, fill=col)
    d.rounded_rectangle(S(480, h - 110, w - 10, h - 70), radius=12 * SS, fill=(122, 92, 66))
    return _done(im, w, h)


def chalkboard(w=620, h=480):
    """Old-school chalkboard with a crossed-out worksheet line."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(10, 10, w - 10, h - 60), radius=14 * SS, fill=(122, 92, 66))
    d.rectangle(S(40, 40, w - 40, h - 90), fill=(40, 74, 62))
    d.text(S(76, 70), 'p. 47, #1-30', font=font('Bold', 52 * SS), fill=(220, 230, 220))
    d.line(S(64, 104, w - 70, 104), fill=RED, width=10 * SS)
    for (x, y, r) in [(180, 250, 34), (330, 220, 26), (460, 270, 40)]:
        d.polygon(S(x, y - r, x + r * .3, y - r * .3, x + r, y, x + r * .3, y + r * .3, x, y + r, x - r * .3, y + r * .3, x - r, y, x - r * .3, y - r * .3), fill=GOLD)
    d.rectangle(S(60, h - 60, w - 60, h - 44), fill=(160, 124, 92))
    return _done(im, w, h)


def tablet_book(w=600, h=520):
    """A tablet showing a book page, with a speech bubble (sharing what you read)."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(40, 80, 400, 500), radius=34 * SS, fill=INK)
    d.rounded_rectangle(S(64, 116, 376, 464), radius=14 * SS, fill=PAPER)
    for i in range(7):
        y = 150 + i * 42
        d.line(S(92, y, 348 - (60 if i == 6 else 0), y), fill=(200, 205, 215), width=6 * SS)
    d.rounded_rectangle(S(330, 10, w - 10, 170), radius=40 * SS, fill=ACCENT)
    d.polygon(S(380, 160, 420, 160, 360, 220), fill=ACCENT)
    for k, x in enumerate([400, 470, 540]):
        d.ellipse(S(x - 16, 74, x + 16, 106), fill=WHITE)
    return _done(im, w, h)


if __name__ == '__main__':
    out = '/tmp/claude-0/-home-claude/123b5c4b-66b2-5fec-97d2-7fff1b3497ae/scratchpad/icons3.png'
    sheet = Image.new('RGBA', (2400, 800), NAVY + (255,))
    x = 0
    for im in [hydrant(), phone(), cookies(), coteacher(), chalkboard(), tablet_book()]:
        im.thumbnail((400, 700)); sheet.alpha_composite(im, (x, 50)); x += 400
    sheet.save(out)
