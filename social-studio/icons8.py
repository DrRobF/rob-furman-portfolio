"""Week of 2026-11-16 illustrations (same flat style as icons.py / icons7.py)."""
from icons import _canvas, _done, S, SS, INK, SOFT, RED
from brand import font, NAVY, WHITE, ACCENT, GOLD, MUTED
from PIL import Image, ImageDraw
import math

PAPER = (255, 253, 247)
GREEN = (86, 170, 110)
WOOD = (150, 100, 60)
WOOD2 = (178, 124, 78)
LINE = (170, 182, 206)


def front_desk(w=760, h=600):
    """School front-office desk: counter, phone, bell, nameplate, a stack of folders, wall clock."""
    im, d = _canvas(w, h)
    # wall clock
    d.ellipse(S(560, 20, 700, 160), fill=PAPER)
    d.ellipse(S(572, 32, 688, 148), outline=SOFT, width=6 * SS)
    d.line(S(630, 90, 630, 50), fill=NAVY, width=8 * SS)
    d.line(S(630, 90, 664, 104), fill=NAVY, width=8 * SS)
    # counter
    d.rounded_rectangle(S(20, 330, w - 20, h - 20), radius=24 * SS, fill=WOOD)
    d.rectangle(S(20, 330, w - 20, 370), fill=WOOD2)
    for x in (200, 400, 600):
        d.line(S(x, 390, x, h - 40), fill=(130, 86, 52), width=6 * SS)
    # nameplate
    d.polygon(S(60, 330, 350, 330, 330, 270, 80, 270), fill=GOLD)
    d.text(S(104, 280), 'FRONT OFFICE', font=font('Black', 26 * SS), fill=NAVY)
    # phone
    d.rounded_rectangle(S(390, 260, 560, 330), radius=14 * SS, fill=INK)
    d.rounded_rectangle(S(380, 205, 570, 250), radius=22 * SS, fill=ACCENT)
    d.rectangle(S(430, 240, 520, 262), fill=ACCENT)
    for i in range(3):
        for j in range(2):
            d.ellipse(S(420 + i * 44, 272 + j * 26, 438 + i * 44, 288 + j * 26), fill=SOFT)
    # bell
    d.pieslice(S(600, 250, 700, 350), 180, 360, fill=GOLD)
    d.rectangle(S(590, 296, 710, 312), fill=INK)
    d.ellipse(S(640, 238, 660, 258), fill=GOLD)
    # folders
    for k, c in enumerate([(240, 196, 80), ACCENT, (226, 120, 100)]):
        d.rounded_rectangle(S(40 + k * 8, 150 + k * 34, 300 + k * 8, 200 + k * 34), radius=8 * SS, fill=c)
    return _done(im, w, h)


def rule_exception(w=760, h=600):
    """A rule book with a sticky note on top that reads 'just this once?'."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(60, 90, 520, 560), radius=20 * SS, fill=SOFT)
    d.rounded_rectangle(S(80, 80, 540, 548), radius=20 * SS, fill=ACCENT)
    d.rectangle(S(80, 80, 120, 548), fill=(80, 128, 220))
    d.text(S(160, 130), 'SCHOOL', font=font('Black', 52 * SS), fill=NAVY)
    d.text(S(160, 196), 'POLICY', font=font('Black', 52 * SS), fill=NAVY)
    for k in range(4):
        d.rounded_rectangle(S(160, 300 + k * 48, 480 - (k % 2) * 60, 316 + k * 48), radius=8 * SS, fill=(170, 200, 250))
    # sticky note, slightly rotated
    note, nd = _canvas(300, 280)
    nd.rectangle(S(0, 0, 300, 280), fill=(255, 214, 90))
    nd.polygon(S(240, 280, 300, 220, 300, 280), fill=(225, 180, 60))
    nd.text(S(26, 40), 'just', font=font('Black', 54 * SS), fill=NAVY)
    nd.text(S(26, 104), 'this', font=font('Black', 54 * SS), fill=NAVY)
    nd.text(S(26, 168), 'once?', font=font('Black', 54 * SS), fill=RED)
    note = note.rotate(-8, expand=True, resample=Image.BICUBIC)
    im.alpha_composite(note, (440 * SS, 140 * SS))
    return _done(im, w, h)


def two_worlds(w=760, h=600):
    """A globe (the physical world) beside a phone showing the same globe (the digital one)."""
    im, d = _canvas(w, h)

    def globe(cx, cy, r, land=GREEN, sea=ACCENT):
        d.ellipse(S(cx - r, cy - r, cx + r, cy + r), fill=sea)
        d.ellipse(S(cx - r * 0.7, cy - r * 0.6, cx - r * 0.05, cy + r * 0.05), fill=land)
        d.ellipse(S(cx + r * 0.1, cy - r * 0.1, cx + r * 0.65, cy + r * 0.6), fill=land)
        d.ellipse(S(cx - r * 0.35, cy + r * 0.35, cx + r * 0.05, cy + r * 0.75), fill=land)
        d.arc(S(cx - r, cy - r, cx + r, cy + r), 0, 360, fill=INK, width=8 * SS)
        d.arc(S(cx - r * 0.45, cy - r, cx + r * 0.45, cy + r), 0, 360, fill=INK, width=4 * SS)
        d.line(S(cx - r, cy, cx + r, cy), fill=INK, width=4 * SS)
    globe(230, 320, 200)
    # phone
    d.rounded_rectangle(S(470, 90, 720, 560), radius=36 * SS, fill=INK)
    d.rounded_rectangle(S(490, 140, 700, 500), radius=12 * SS, fill=NAVY)
    d.rounded_rectangle(S(560, 108, 630, 120), radius=6 * SS, fill=SOFT)
    d.ellipse(S(578, 512, 612, 546), fill=SOFT)
    globe(595, 260, 80, land=GOLD, sea=(80, 128, 220))
    for k in range(3):
        d.rounded_rectangle(S(512, 370 + k * 36, 680 - k * 30, 386 + k * 36), radius=8 * SS, fill=SOFT)
    # link arcs between them
    d.arc(S(330, 120, 520, 300), 200, 330, fill=GOLD, width=8 * SS)
    return _done(im, w, h)


def calc_book(w=760, h=600):
    """A calculator with an A+ beside a closed book that has a question mark on it."""
    im, d = _canvas(w, h)
    # calculator
    d.rounded_rectangle(S(40, 60, 330, 540), radius=30 * SS, fill=INK)
    d.rounded_rectangle(S(70, 90, 300, 190), radius=12 * SS, fill=(200, 225, 255))
    d.text(S(170, 98), 'A+', font=font('Black', 70 * SS), fill=GREEN)
    for r in range(4):
        for c in range(3):
            col = GOLD if (r == 3 and c == 2) else SOFT
            d.rounded_rectangle(S(76 + c * 76, 220 + r * 76, 136 + c * 76, 280 + r * 76), radius=12 * SS, fill=col)
    # book, slightly tilted
    bk, bd = _canvas(330, 430)
    bd.rounded_rectangle(S(0, 0, 330, 430), radius=18 * SS, fill=(226, 120, 100))
    bd.rectangle(S(0, 0, 40, 430), fill=(190, 90, 76))
    bd.rounded_rectangle(S(300, 20, 330, 410), radius=6 * SS, fill=PAPER)
    bd.text(S(120, 110), '?', font=font('Black', 200 * SS), fill=PAPER)
    bk = bk.rotate(6, expand=True, resample=Image.BICUBIC)
    im.alpha_composite(bk, (380 * SS, 90 * SS))
    return _done(im, w, h)


def scholar(w=760, h=600):
    """A lightbulb wearing a graduation cap, with sparks: a student leading their own learning."""
    im, d = _canvas(w, h)
    cx = w / 2
    # sparks
    for i in range(9):
        a = math.radians(200 + i * 17.5)
        d.line(S(cx + math.cos(a) * 230, 330 + math.sin(a) * 230, cx + math.cos(a) * 290, 330 + math.sin(a) * 290), fill=GOLD, width=10 * SS)
    # bulb
    d.ellipse(S(cx - 170, 160, cx + 170, 500), fill=(255, 220, 110))
    d.rectangle(S(cx - 80, 440, cx + 80, 520), fill=(255, 220, 110))
    for k in range(3):
        d.rounded_rectangle(S(cx - 90, 500 + k * 28, cx + 90, 524 + k * 28), radius=10 * SS, fill=INK if k % 2 == 0 else SOFT)
    d.line(S(cx - 40, 440, cx - 20, 340, cx, 400, cx + 20, 340, cx + 40, 440), fill=(230, 160, 50), width=8 * SS)
    # graduation cap
    d.polygon(S(cx - 220, 170, cx, 90, cx + 220, 170, cx, 250), fill=NAVY)
    d.polygon(S(cx - 220, 170, cx, 90, cx + 220, 170, cx, 250), outline=INK, width=4 * SS)
    d.rectangle(S(cx - 110, 190, cx + 110, 240), fill=NAVY)
    d.line(S(cx, 170, cx + 170, 200, cx + 170, 300), fill=GOLD, width=8 * SS)
    d.ellipse(S(cx + 155, 290, cx + 185, 330), fill=GOLD)
    return _done(im, w, h)


def policy_scale(w=760, h=600, tilt=0.0):
    """A balance scale: a policy page on one side, a heart (the child) on the other. tilt -1..1."""
    im, d = _canvas(w, h)
    cx, top = w / 2, 120
    d.rectangle(S(cx - 10, top, cx + 10, h - 80), fill=INK)
    d.rounded_rectangle(S(cx - 140, h - 90, cx + 140, h - 50), radius=14 * SS, fill=INK)
    a = math.radians(10 * tilt)
    L = 250
    lx, ly = cx - math.cos(a) * L, top + 20 - math.sin(a) * L
    rx, ry = cx + math.cos(a) * L, top + 20 + math.sin(a) * L
    d.line(S(lx, ly, rx, ry), fill=INK, width=14 * SS)
    d.ellipse(S(cx - 26, top - 6, cx + 26, top + 46), fill=GOLD)
    for x, y in ((lx, ly), (rx, ry)):
        d.line(S(x, y, x - 80, y + 170), fill=MUTED, width=4 * SS)
        d.line(S(x, y, x + 80, y + 170), fill=MUTED, width=4 * SS)
        d.pieslice(S(x - 110, y + 110, x + 110, y + 230), 0, 180, fill=SOFT)
    # policy page on the left pan
    d.rounded_rectangle(S(lx - 60, ly + 30, lx + 60, ly + 170), radius=8 * SS, fill=PAPER)
    d.text(S(lx - 48, ly + 40), 'POLICY', font=font('Black', 26 * SS), fill=NAVY)
    for k in range(4):
        d.rounded_rectangle(S(lx - 46, ly + 86 + k * 20, lx + 46 - (k % 2) * 20, ly + 94 + k * 20), radius=4 * SS, fill=LINE)
    # heart on the right pan
    hx, hy = rx, ry + 110
    d.ellipse(S(hx - 62, hy - 70, hx + 4, hy - 4), fill=RED)
    d.ellipse(S(hx - 4, hy - 70, hx + 62, hy - 4), fill=RED)
    d.polygon(S(hx - 60, hy - 30, hx + 60, hy - 30, hx, hy + 44), fill=RED)
    return _done(im, w, h)


if __name__ == '__main__':
    from brand import gradient_bg
    tiles = [front_desk(), rule_exception(), two_worlds(), calc_book(), scholar(), policy_scale()]
    sheet = gradient_bg(760 * 3, 600 * 2).convert('RGBA')
    for i, t in enumerate(tiles):
        sheet.alpha_composite(t, ((i % 3) * 760, (i // 3) * 600))
    sheet.convert('RGB').save('/tmp/claude-0/-home-claude/0f27d819-f4e8-5771-aaec-421817c11ec9/scratchpad/icons8.jpg', quality=85)
