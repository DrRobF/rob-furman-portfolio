"""Week of 2026-11-09 illustrations (same flat style as icons.py)."""
from icons import _canvas, _done, S, SS, INK, SOFT, RED
from brand import font, NAVY, WHITE, ACCENT, GOLD, MUTED
from PIL import Image, ImageDraw
import math

PAPER = (255, 253, 247)
GREEN = (86, 170, 110)
BROWN = (150, 100, 60)


def dots(w=760, h=600, prog=1.0):
    """Scattered dots; a gold line connects some of them (prog 0..1 animates the line)."""
    im, d = _canvas(w, h)
    pts = [(110, 470), (230, 200), (380, 380), (520, 140), (650, 330), (560, 520), (300, 540), (160, 300), (440, 260), (680, 120)]
    path = [0, 7, 1, 8, 3, 9, 4, 5]
    segs = len(path) - 1
    done = prog * segs
    for i in range(segs):
        if done <= i:
            break
        f = min(1.0, done - i)
        (x1, y1), (x2, y2) = pts[path[i]], pts[path[i + 1]]
        d.line(S(x1, y1, x1 + (x2 - x1) * f, y1 + (y2 - y1) * f), fill=GOLD, width=10 * SS)
    lit = set(path[:int(done) + 2]) if prog > 0 else set()
    for k, (x, y) in enumerate(pts):
        c = GOLD if k in lit else INK
        d.ellipse(S(x - 26, y - 26, x + 26, y + 26), fill=c)
        d.ellipse(S(x - 12, y - 12, x + 12, y + 12), fill=NAVY)
    return _done(im, w, h)


def gauge(w=760, h=560, level=0.8):
    """A pressure gauge with the needle climbing toward red."""
    im, d = _canvas(w, h)
    cx, cy, r = w / 2, h - 120, 300
    d.pieslice(S(cx - r, cy - r, cx + r, cy + r), 180, 360, fill=INK)
    for a0, a1, c in [(180, 250, GREEN), (250, 310, GOLD), (310, 360, RED)]:
        d.pieslice(S(cx - r + 26, cy - r + 26, cx + r - 26, cy + r - 26), a0, a1, fill=c)
    d.pieslice(S(cx - r + 90, cy - r + 90, cx + r - 90, cy + r - 90), 180, 360, fill=INK)
    for i in range(11):
        a = math.radians(180 + i * 18)
        d.line(S(cx + math.cos(a) * (r - 100), cy + math.sin(a) * (r - 100), cx + math.cos(a) * (r - 130), cy + math.sin(a) * (r - 130)), fill=SOFT, width=6 * SS)
    a = math.radians(180 + 180 * level)
    d.line(S(cx, cy, cx + math.cos(a) * (r - 70), cy + math.sin(a) * (r - 70)), fill=NAVY, width=16 * SS)
    d.ellipse(S(cx - 34, cy - 34, cx + 34, cy + 34), fill=NAVY)
    d.rounded_rectangle(S(cx - 260, cy + 40, cx + 260, cy + 100), radius=20 * SS, fill=SOFT)
    d.text(S(cx - 200, cy + 46), 'UNDER PRESSURE', font=font('Black', 40 * SS), fill=WHITE)
    return _done(im, w, h)


def field_trip(w=760, h=600):
    """A school bus and a permission slip covered in handwritten edits."""
    im, d = _canvas(w, h)
    # bus
    bx, by = 250, 260
    d.rounded_rectangle(S(bx, by, w - 20, by + 220), radius=30 * SS, fill=GOLD)
    d.rectangle(S(bx, by + 150, w - 20, by + 170), fill=(40, 40, 40))
    for i in range(4):
        x = bx + 30 + i * 112
        d.rounded_rectangle(S(x, by + 30, x + 88, by + 110), radius=10 * SS, fill=(200, 225, 255))
    for x in (bx + 90, w - 120):
        d.ellipse(S(x - 46, by + 180, x + 46, by + 272), fill=(40, 40, 40))
        d.ellipse(S(x - 18, by + 208, x + 18, by + 244), fill=SOFT)
    # form
    fx, fy = 30, 40
    d.rounded_rectangle(S(fx, fy, fx + 330, fy + 430), radius=12 * SS, fill=PAPER)
    d.text(S(fx + 26, fy + 22), 'FIELD TRIP', font=font('Black', 34 * SS), fill=NAVY)
    for k in range(6):
        y = fy + 96 + k * 48
        d.rounded_rectangle(S(fx + 26, y, fx + 300 - (k % 3) * 40, y + 12), radius=6 * SS, fill=(170, 182, 206))
    # handwritten edits: red strikes and scribbles
    for k in (1, 3, 4):
        y = fy + 102 + k * 48
        d.line(S(fx + 22, y, fx + 290, y - 4), fill=RED, width=6 * SS)
    pts = []
    for i in range(40):
        pts += [fx + 40 + i * 6.5, fy + 300 + 14 * math.sin(i * 0.9)]
    d.line(S(*pts), fill=RED, width=5 * SS)
    d.line(S(fx + 40, fy + 390, fx + 200, fy + 390), fill=(170, 182, 206), width=4 * SS)
    d.text(S(fx + 210, fy + 360), '?', font=font('Black', 50 * SS), fill=RED)
    return _done(im, w, h)


def pizza(w=620, h=560):
    """A pizza with one slice pulled out."""
    im, d = _canvas(w, h)
    cx, cy, r = 280, 300, 230
    d.pieslice(S(cx - r, cy - r, cx + r, cy + r), 330, 270 + 360, fill=(222, 170, 90))
    d.pieslice(S(cx - r + 26, cy - r + 26, cx + r - 26, cy + r - 26), 330, 270 + 360, fill=(240, 196, 80))
    for (x, y) in [(200, 220), (300, 380), (180, 360), (360, 270), (250, 460), (120, 280)]:
        d.ellipse(S(x - 26, y - 26, x + 26, y + 26), fill=RED)
    # pulled slice
    ox, oy = 70, -40
    d.pieslice(S(cx - r + ox, cy - r + oy, cx + r + ox, cy + r + oy), 270, 330, fill=(222, 170, 90))
    d.pieslice(S(cx - r + 26 + ox, cy - r + 26 + oy, cx + r - 26 + ox, cy + r - 26 + oy), 270, 330, fill=(240, 196, 80))
    d.ellipse(S(cx + ox + 60 - 22, cy + oy - 150 - 22, cx + ox + 60 + 22, cy + oy - 150 + 22), fill=RED)
    return _done(im, w, h)


def duck(w=600, h=520):
    """A little yellow duck with a lipstick-kiss mark beside it, and a rising sun."""
    im, d = _canvas(w, h)
    # sun
    d.pieslice(S(330, 60, 590, 320), 180, 360, fill=(255, 205, 110))
    for i in range(7):
        a = math.radians(190 + i * 26)
        d.line(S(460 + math.cos(a) * 150, 190 + math.sin(a) * 150, 460 + math.cos(a) * 190, 190 + math.sin(a) * 190), fill=GOLD, width=8 * SS)
    d.rectangle(S(320, 190, 600, 200), fill=SOFT)
    # water
    d.ellipse(S(40, 420, 520, 500), fill=SOFT)
    # body + head
    d.ellipse(S(80, 280, 420, 460), fill=(255, 214, 70))
    d.ellipse(S(270, 160, 420, 310), fill=(255, 214, 70))
    d.polygon(S(410, 225, 480, 240, 410, 262), fill=(240, 140, 50))
    d.ellipse(S(350, 205, 370, 225), fill=NAVY)
    d.polygon(S(140, 340, 260, 330, 230, 400), fill=(240, 190, 50))
    # kiss
    d.ellipse(S(110, 150, 170, 190), fill=(226, 88, 120))
    d.ellipse(S(160, 150, 220, 190), fill=(226, 88, 120))
    d.ellipse(S(120, 175, 210, 225), fill=(226, 88, 120))
    return _done(im, w, h)


def plow(w=760, h=560, straight=True):
    """Garden rows running to a far point on the horizon; one line straight, one crooked."""
    im, d = _canvas(w, h)
    d.rectangle(S(0, 0, w, 150), fill=(0, 0, 0, 0))
    d.polygon(S(0, h, w, h, w, 160, 0, 160), fill=(110, 80, 52))
    vx, vy = w * 0.62, 150
    for i in range(-3, 8):
        x0 = w / 2 + i * 150
        d.line(S(x0, h, vx, vy), fill=(150, 110, 72), width=10 * SS)
    # crooked row on the left
    pts = []
    for k in range(30):
        t = k / 29
        y = h - t * (h - 170)
        x = 60 + t * (vx - 260) + 30 * math.sin(t * 14)
        pts += [x, y]
    d.line(S(*pts), fill=RED, width=9 * SS)
    # straight row toward the flag
    d.line(S(w * 0.5, h, vx, vy + 20), fill=GOLD, width=12 * SS)
    # flag at the far end
    d.rectangle(S(vx - 4, vy - 110, vx + 4, vy + 10), fill=INK)
    d.polygon(S(vx + 4, vy - 110, vx + 80, vy - 85, vx + 4, vy - 60), fill=GOLD)
    d.line(S(0, vy + 10, w, vy + 10), fill=SOFT, width=6 * SS)
    return _done(im, w, h)


def calendar(w=640, h=560, marked=28):
    """A month grid with days crossed off and a gold circle far ahead."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(30, 40, w - 30, h - 20), radius=24 * SS, fill=PAPER)
    d.rounded_rectangle(S(30, 40, w - 30, 130), radius=24 * SS, fill=ACCENT)
    d.rectangle(S(30, 100, w - 30, 130), fill=ACCENT)
    for x in (150, w - 150):
        d.rounded_rectangle(S(x - 12, 14, x + 12, 80), radius=10 * SS, fill=INK)
    cols, rows = 7, 5
    cw, ch = (w - 100) / cols, (h - 190) / rows
    for k in range(cols * rows):
        c, r = k % cols, k // cols
        x, y = 50 + c * cw, 150 + r * ch
        d.rounded_rectangle(S(x + 4, y + 4, x + cw - 4, y + ch - 4), radius=8 * SS, fill=(232, 236, 246))
        if k < marked:
            d.line(S(x + 16, y + 14, x + cw - 16, y + ch - 14), fill=RED, width=6 * SS)
            d.line(S(x + cw - 16, y + 14, x + 16, y + ch - 14), fill=RED, width=6 * SS)
    x, y = 50 + 6 * cw, 150 + 4 * ch
    d.ellipse(S(x - 4, y - 4, x + cw + 4, y + ch + 4), outline=GOLD, width=8 * SS)
    return _done(im, w, h)


def two_readers(w=760, h=560):
    """Two simple figures side by side, each holding an open book, a heart between them."""
    im, d = _canvas(w, h)
    for cx, col, hh in [(230, ACCENT, 0), (530, GOLD, 40)]:
        top = 90 + hh
        d.ellipse(S(cx - 70, top, cx + 70, top + 140), fill=INK)
        d.rounded_rectangle(S(cx - 120, top + 160, cx + 120, h - 20), radius=60 * SS, fill=col)
        # book
        by = top + 230
        d.polygon(S(cx - 130, by, cx, by + 30, cx, by + 150, cx - 130, by + 120), fill=PAPER)
        d.polygon(S(cx + 130, by, cx, by + 30, cx, by + 150, cx + 130, by + 120), fill=(236, 232, 222))
        d.line(S(cx, by + 30, cx, by + 150), fill=SOFT, width=5 * SS)
    # heart
    hx, hy = 380, 80
    d.ellipse(S(hx - 50, hy - 30, hx + 4, hy + 24), fill=RED)
    d.ellipse(S(hx - 4, hy - 30, hx + 50, hy + 24), fill=RED)
    d.polygon(S(hx - 48, hy + 6, hx + 48, hy + 6, hx, hy + 66), fill=RED)
    return _done(im, w, h)


if __name__ == '__main__':
    import sys
    out = sys.argv[1]
    fs = [dots(), gauge(), field_trip(), pizza(), duck(), plow(), calendar(), two_readers()]
    sheet = Image.new('RGB', (sum(f.size[0] for f in fs[:4]), 1240), (15, 27, 51))
    x = 0
    for i, f in enumerate(fs):
        if i == 4:
            x = 0
        sheet.paste(f, (x, 0 if i < 4 else 620), f); x += f.size[0]
    sheet.thumbnail((2400, 2400))
    sheet.save(out)
