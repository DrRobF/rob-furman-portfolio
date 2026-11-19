"""Week of 2026-11-30 illustrations (same flat style as icons.py / icons9.py)."""
from icons import _canvas, _done, S, SS, INK, SOFT, RED
from brand import font, NAVY, WHITE, ACCENT, GOLD, MUTED
from PIL import Image, ImageDraw
import math

PAPER = (255, 253, 247)
GREEN = (86, 170, 110)
LINE = (170, 182, 206)
DARK = (34, 52, 88)


def late_clock(w=760, h=600):
    """Wall clock reading a quarter past, beside a closed office door marked INTERVIEWS."""
    im, d = _canvas(w, h)
    # door
    d.rectangle(S(400, 90, 680, 580), fill=DARK)
    d.rectangle(S(425, 115, 655, 580), fill=ACCENT)
    d.rounded_rectangle(S(450, 160, 630, 220), radius=8 * SS, fill=PAPER)
    d.text(S(462, 176), 'INTERVIEWS', font=font('Black', 25 * SS), fill=NAVY)
    d.ellipse(S(612, 360, 636, 384), fill=GOLD)
    # clock
    cx, cy, r = 210, 250, 170
    d.ellipse(S(cx - r - 14, cy - r - 14, cx + r + 14, cy + r + 14), fill=INK)
    d.ellipse(S(cx - r, cy - r, cx + r, cy + r), fill=PAPER)
    for k in range(12):
        a = math.radians(k * 30)
        d.line(S(cx + (r - 26) * math.sin(a), cy - (r - 26) * math.cos(a), cx + (r - 6) * math.sin(a), cy - (r - 6) * math.cos(a)),
               fill=SOFT, width=6 * SS)
    # the 15 minutes he was late
    d.pieslice(S(cx - r + 20, cy - r + 20, cx + r - 20, cy + r - 20), -90, 0, fill=(250, 200, 190))
    d.line(S(cx, cy, cx + 0, cy - 120), fill=NAVY, width=10 * SS)   # minute hand at 12 -> start
    d.line(S(cx, cy, cx + 135, cy), fill=RED, width=10 * SS)        # minute hand now at :15
    d.line(S(cx, cy, cx + 60, cy - 70), fill=NAVY, width=14 * SS)   # hour hand
    d.ellipse(S(cx - 14, cy - 14, cx + 14, cy + 14), fill=NAVY)
    d.text(S(110, 460), '+15 min', font=font('Black', 52 * SS), fill=GOLD)
    return _done(im, w, h)


def transcript(w=760, h=600):
    """A college transcript with one bad grade circled in red and a magnifying glass over it."""
    im, d = _canvas(w, h)
    d.polygon(S(120, 70, 560, 40, 600, 560, 160, 590), fill=PAPER)
    d.text(S(170, 80), 'TRANSCRIPT', font=font('Black', 40 * SS), fill=NAVY)
    rows = ['A', 'A', 'B+', 'D', 'A', 'B']
    for k, g in enumerate(rows):
        y = 170 + k * 62
        d.rounded_rectangle(S(175 + k * 2, y, 430 + k * 2, y + 16), radius=6 * SS, fill=LINE)
        d.text(S(470 + k * 3, y - 18), g, font=font('Black', 40 * SS), fill=RED if g == 'D' else SOFT)
    # red circle on the D
    d.ellipse(S(440, 334, 540, 410), outline=RED, width=7 * SS)
    # magnifier
    d.ellipse(S(420, 290, 600, 460), outline=INK, width=20 * SS)
    d.line(S(575, 445, 680, 560), fill=GOLD, width=34 * SS)
    return _done(im, w, h)


def two_truths(w=760, h=600, tilt=0.0):
    """Balance scale holding two different weights that both glow: competing truths."""
    im, d = _canvas(w, h)
    cx, top = 380, 130
    d.polygon(S(cx - 24, top, cx + 24, top, cx + 44, 540, cx - 44, 540), fill=INK)
    d.rounded_rectangle(S(cx - 160, 530, cx + 160, 580), radius=14 * SS, fill=SOFT)
    a = math.radians(tilt * 12)
    L, R = 280, 280
    lx, ly = cx - L * math.cos(a), top + 10 - L * math.sin(a)
    rx, ry = cx + R * math.cos(a), top + 10 + R * math.sin(a)
    d.line(S(lx, ly, rx, ry), fill=INK, width=14 * SS)
    d.ellipse(S(cx - 26, top - 16, cx + 26, top + 36), fill=GOLD)
    for x, y, c, label in ((lx, ly, ACCENT, 'FAIR'), (rx, ry, GOLD, 'HUMAN')):
        d.line(S(x, y, x - 70, y + 170), fill=LINE, width=4 * SS)
        d.line(S(x, y, x + 70, y + 170), fill=LINE, width=4 * SS)
        d.pieslice(S(x - 110, y + 110, x + 110, y + 250), 0, 180, fill=c)
        tw = d.textlength(label, font=font('Black', 34 * SS)) / SS
        d.text(S(x - tw / 2, y + 192), label, font=font('Black', 34 * SS), fill=NAVY)
    return _done(im, w, h)


def speak_up(w=760, h=600):
    """A student's speech bubble standing up to a jagged one, with a trusted adult's bubble behind her."""
    im, d = _canvas(w, h)
    # jagged bully bubble
    pts = []
    for k in range(18):
        a = math.radians(k * 20)
        r = 140 if k % 2 else 105
        pts += [560 + r * math.cos(a), 170 + r * 0.8 * math.sin(a)]
    d.polygon(S(*pts), fill=RED)
    d.text(S(500, 140), '#@!', font=font('Black', 60 * SS), fill=PAPER)
    # her bubble
    d.rounded_rectangle(S(60, 250, 430, 420), radius=60 * SS, fill=ACCENT)
    d.polygon(S(130, 410, 110, 490, 200, 415), fill=ACCENT)
    d.text(S(100, 296), 'Stop. That', font=font('Black', 44 * SS), fill=NAVY)
    d.text(S(100, 348), 'isn’t okay.', font=font('Black', 44 * SS), fill=NAVY)
    # adult bubble
    d.rounded_rectangle(S(380, 400, 720, 540), radius=50 * SS, fill=GOLD)
    d.polygon(S(640, 530, 690, 590, 600, 535), fill=GOLD)
    d.text(S(470, 432), 'Now what?', font=font('Black', 44 * SS), fill=NAVY)
    return _done(im, w, h)


def critic_book(w=760, h=600):
    """A kid-sized review card: open book, star rating, thumbs-up speech bubble."""
    im, d = _canvas(w, h)
    d.polygon(S(380, 330, 70, 280, 70, 540, 380, 580), fill=PAPER)
    d.polygon(S(380, 330, 690, 280, 690, 540, 380, 580), fill=(240, 236, 226))
    d.line(S(380, 330, 380, 580), fill=SOFT, width=6 * SS)
    for k in range(4):
        d.line(S(110, 330 + k * 44, 340, 360 + k * 44), fill=LINE, width=4 * SS)
        d.line(S(420, 360 + k * 44, 650, 330 + k * 44), fill=LINE, width=4 * SS)

    def star(x, y, r, c):
        p = []
        for k in range(10):
            a = math.radians(-90 + k * 36)
            rr = r if k % 2 == 0 else r * 0.45
            p += [x + rr * math.cos(a), y + rr * math.sin(a)]
        d.polygon(S(*p), fill=c)
    for k in range(5):
        star(170 + k * 105, 200, 44, GOLD if k < 4 else SOFT)
    d.rounded_rectangle(S(250, 20, 560, 120), radius=40 * SS, fill=ACCENT)
    d.polygon(S(360, 110, 340, 160, 410, 116), fill=ACCENT)
    d.text(S(282, 44), 'MY REVIEW', font=font('Black', 44 * SS), fill=NAVY)
    return _done(im, w, h)


def pd_network(w=760, h=600):
    """One teacher in the middle, connected to teachers everywhere (PD beyond the building)."""
    im, d = _canvas(w, h)
    cx, cy = 380, 320
    nodes = [(120, 120), (640, 110), (90, 420), (670, 430), (380, 70), (250, 540), (520, 550)]
    for x, y in nodes:
        d.line(S(cx, cy, x, y), fill=LINE, width=5 * SS)
    # school building in center
    d.polygon(S(cx - 120, cy - 30, cx, cy - 120, cx + 120, cy - 30), fill=GOLD)
    d.rectangle(S(cx - 100, cy - 30, cx + 100, cy + 110), fill=INK)
    d.rectangle(S(cx - 26, cy + 40, cx + 26, cy + 110), fill=SOFT)
    for x in (cx - 80, cx + 40):
        d.rectangle(S(x, cy, x + 40, cy + 34), fill=ACCENT)
    for i, (x, y) in enumerate(nodes):
        c = (ACCENT, GOLD, GREEN)[i % 3]
        d.ellipse(S(x - 52, y - 52, x + 52, y + 52), fill=DARK)
        d.ellipse(S(x - 18, y - 36, x + 18, y), fill=c)
        d.pieslice(S(x - 34, y + 2, x + 34, y + 62), 180, 360, fill=c)
    return _done(im, w, h)


def real_world(w=760, h=600):
    """A bubble-sheet test crossed out next to a student project: a birdhouse with a ruler and blueprint."""
    im, d = _canvas(w, h)
    # bubble test, tilted back
    d.rounded_rectangle(S(40, 60, 320, 420), radius=12 * SS, fill=(230, 234, 242))
    for r in range(6):
        for c in range(4):
            fill = SOFT if (r + c) % 4 == 0 else None
            d.ellipse(S(70 + c * 60, 100 + r * 50, 100 + c * 60, 130 + r * 50), outline=SOFT, width=3 * SS, fill=fill)
    d.line(S(30, 430, 330, 50), fill=RED, width=12 * SS)
    # blueprint
    d.rounded_rectangle(S(300, 300, 720, 580), radius=12 * SS, fill=(60, 110, 190))
    for k in range(6):
        d.line(S(300, 330 + k * 44, 720, 330 + k * 44), fill=(110, 150, 220), width=2 * SS)
    # birdhouse
    d.polygon(S(420, 230, 540, 120, 660, 230), fill=RED)
    d.rectangle(S(440, 230, 640, 470), fill=GOLD)
    d.ellipse(S(505, 280, 575, 350), fill=NAVY)
    d.rectangle(S(530, 380, 550, 420), fill=INK)
    # ruler
    d.rectangle(S(330, 500, 700, 545), fill=PAPER)
    for k in range(0, 360, 20):
        d.line(S(340 + k, 500, 340 + k, 515 if k % 40 else 525), fill=SOFT, width=3 * SS)
    return _done(im, w, h)


def manatee_book(w=760, h=600):
    """A closed textbook beside a friendly manatee swimming out of a tablet screen."""
    im, d = _canvas(w, h)
    # textbook
    d.rounded_rectangle(S(40, 300, 280, 580), radius=10 * SS, fill=SOFT)
    d.rectangle(S(60, 300, 80, 580), fill=DARK)
    d.text(S(100, 340), 'TEXT', font=font('Black', 44 * SS), fill=INK)
    d.text(S(100, 392), 'BOOK', font=font('Black', 44 * SS), fill=INK)
    # tablet
    d.rounded_rectangle(S(300, 120, 730, 560), radius=30 * SS, fill=INK)
    d.rounded_rectangle(S(325, 145, 705, 535), radius=14 * SS, fill=(40, 110, 170))
    for k in range(4):
        d.arc(S(330 + k * 90, 170, 430 + k * 90, 230), 200, 340, fill=(120, 180, 230), width=4 * SS)
    # manatee
    body = (120, 132, 150)
    d.ellipse(S(360, 300, 640, 460), fill=body)
    d.ellipse(S(590, 320, 700, 420), fill=body)
    d.ellipse(S(640, 355, 700, 405), fill=(150, 160, 176))
    d.ellipse(S(332, 335, 405, 430), fill=body)
    d.ellipse(S(470, 420, 540, 470), fill=(100, 112, 130))
    d.ellipse(S(630, 345, 646, 361), fill=NAVY)
    for x, y, r in ((660, 270, 14), (690, 230, 10), (640, 220, 8)):
        d.ellipse(S(x - r, y - r, x + r, y + r), outline=(200, 230, 255), width=3 * SS)
    return _done(im, w, h)


if __name__ == '__main__':
    fns = [late_clock, transcript, two_truths, speak_up, critic_book, pd_network, real_world, manatee_book]
    sheet = Image.new('RGBA', (3 * 780, 3 * 620), (15, 27, 51, 255))
    for i, f in enumerate(fns):
        a = f()
        sheet.alpha_composite(a, ((i % 3) * 780 + (780 - a.size[0]) // 2, (i // 3) * 620 + (620 - a.size[1]) // 2))
    sheet.convert('RGB').resize((1170, 930)).save('/tmp/claude-0/-home-claude/d06a3447-12cb-5629-87cd-2c78924d7e31/scratchpad/icons10.jpg')
    print('ok')
