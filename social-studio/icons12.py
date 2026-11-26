"""Band-tour illustrations for Rob's "Join band!" carousel (week of 2026-12-07)."""
from icons import _canvas, _done, S, SS, INK, SOFT, RED, note
from brand import font, NAVY, WHITE, ACCENT, GOLD, MUTED
from PIL import Image, ImageDraw
import math

PAPER = (255, 253, 247)
GREEN = (86, 170, 110)
LINE = (170, 182, 206)
DARK = (34, 52, 88)
BRICK = (150, 160, 178)
SNOW = (240, 244, 252)
LAKE = (70, 130, 200)


def trumpet(d, x, y, s=1.0, c=GOLD):
    d.rounded_rectangle(S(x, y, x + 220 * s, y + 22 * s), radius=10 * SS, fill=c)
    d.polygon(S(x + 200 * s, y + 11 * s, x + 290 * s, y - 40 * s, x + 290 * s, y + 62 * s), fill=c)
    for k in range(3):
        d.rounded_rectangle(S(x + (60 + k * 34) * s, y - 40 * s, x + (76 + k * 34) * s, y), radius=4 * SS, fill=c)
    d.rounded_rectangle(S(x + 40 * s, y + 22 * s, x + 170 * s, y + 60 * s), radius=18 * SS, outline=c, width=int(10 * s) * SS)


def tour_case(w=760, h=600):
    """A tour suitcase covered in travel stickers with a trumpet resting on it and notes rising."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(90, 240, 560, 560), radius=30 * SS, fill=DARK)
    d.rounded_rectangle(S(260, 200, 390, 250), radius=18 * SS, outline=SOFT, width=14 * SS)
    stickers = [(130, 280, ACCENT, 'PARIS'), (330, 300, GOLD, 'BERLIN'), (150, 420, RED, 'ALPS'), (360, 440, GREEN, 'LUZERN')]
    for x, y, c, t in stickers:
        d.rounded_rectangle(S(x, y, x + 180, y + 80), radius=20 * SS, fill=c)
        tw = d.textlength(t, font=font('Black', 32 * SS)) / SS
        d.text(S(x + 90 - tw / 2, y + 20), t, font=font('Black', 32 * SS), fill=NAVY if c != RED else PAPER)
    trumpet(d, 420, 170, 1.0)
    note(d, 640, 110, r=20, color=ACCENT, stem=80)
    note(d, 560, 60, r=16, color=WHITE, stem=64)
    return _done(im, w, h)


def eiffel(w=760, h=600):
    """The Eiffel Tower with a row of band players' music stands at its feet and notes floating up."""
    im, d = _canvas(w, h)
    cx = 380
    d.polygon(S(cx - 18, 30, cx + 18, 30, cx + 70, 300, cx - 70, 300), fill=INK)
    d.rectangle(S(cx - 90, 290, cx + 90, 320), fill=INK)
    d.polygon(S(cx - 90, 320, cx + 90, 320, cx + 190, 540, cx + 110, 540, cx, 400, cx - 110, 540, cx - 190, 540), fill=INK)
    d.rectangle(S(cx - 130, 410, cx + 130, 432), fill=INK)
    d.rectangle(S(cx - 4, 10, cx + 4, 40), fill=INK)
    d.rectangle(S(30, 540, 730, 560), fill=SOFT)
    for k in range(6):
        x = 70 + k * 120
        if 250 < x < 510:
            continue
        d.line(S(x, 540, x, 470), fill=GOLD, width=6 * SS)
        d.polygon(S(x - 34, 440, x + 34, 440, x + 26, 480, x - 26, 480), fill=GOLD)
    note(d, 560, 200, r=22, color=ACCENT, stem=90)
    note(d, 180, 160, r=18, color=GOLD, stem=74)
    return _done(im, w, h)


def berlin_wall(w=760, h=600):
    """A long grey wall with a watchtower behind it, and a band's notes rising over the top."""
    im, d = _canvas(w, h)
    d.rectangle(S(560, 120, 620, 360), fill=SOFT)
    d.rectangle(S(530, 90, 650, 150), fill=DARK)
    d.rectangle(S(545, 104, 635, 136), fill=ACCENT)
    d.rectangle(S(20, 300, 740, 540), fill=BRICK)
    d.rounded_rectangle(S(10, 284, 750, 316), radius=16 * SS, fill=(185, 192, 206))
    for k in range(1, 6):
        d.line(S(k * 125, 316, k * 125, 540), fill=(120, 130, 150), width=5 * SS)
    d.rectangle(S(0, 540, 760, 570), fill=SOFT)
    trumpet(d, 80, 220, 0.8)
    note(d, 360, 170, r=22, color=GOLD, stem=90)
    note(d, 450, 110, r=18, color=WHITE, stem=74)
    return _done(im, w, h)


def two_houses(w=760, h=600):
    """A Tudor half-timbered house (Shakespeare) beside a tall Baroque townhouse (Mozart), a quill and a note."""
    im, d = _canvas(w, h)
    # Tudor house
    d.polygon(S(40, 280, 200, 150, 360, 280), fill=DARK)
    d.rectangle(S(60, 280, 340, 540), fill=PAPER)
    for x in (60, 150, 240, 330):
        d.rectangle(S(x, 280, x + 12, 540), fill=(90, 66, 50))
    d.rectangle(S(60, 400, 340, 412), fill=(90, 66, 50))
    d.line(S(70, 290, 140, 395), fill=(90, 66, 50), width=8 * SS)
    d.line(S(250, 395, 320, 290), fill=(90, 66, 50), width=8 * SS)
    d.rectangle(S(170, 440, 225, 540), fill=(90, 66, 50))
    # Baroque townhouse
    d.rectangle(S(420, 110, 700, 540), fill=GOLD)
    d.polygon(S(410, 110, 560, 50, 710, 110), fill=(220, 160, 50))
    for r in range(4):
        for c in range(3):
            x, y = 450 + c * 85, 150 + r * 90
            d.rounded_rectangle(S(x, y, x + 50, y + 62), radius=8 * SS, fill=PAPER)
    d.rounded_rectangle(S(530, 470, 590, 540), radius=10 * SS, fill=DARK)
    d.rectangle(S(0, 540, 760, 566), fill=SOFT)
    note(d, 200, 90, r=18, color=ACCENT, stem=70)
    return _done(im, w, h)


def lucerne(w=760, h=600):
    """Snowy peaks over a blue lake and a covered wooden bridge with a little tower."""
    im, d = _canvas(w, h)
    d.polygon(S(0, 360, 200, 120, 400, 360), fill=SOFT)
    d.polygon(S(150, 180, 200, 120, 250, 180, 225, 170, 200, 190, 175, 170), fill=SNOW)
    d.polygon(S(280, 360, 520, 60, 760, 360), fill=DARK)
    d.polygon(S(460, 135, 520, 60, 580, 135, 550, 120, 520, 145, 490, 120), fill=SNOW)
    d.rectangle(S(0, 360, 760, 600), fill=LAKE)
    for k in range(4):
        d.line(S(40 + k * 170, 520, 120 + k * 170, 520), fill=(130, 180, 230), width=5 * SS)
    # covered bridge
    d.polygon(S(40, 420, 720, 380, 720, 400, 40, 440), fill=(150, 100, 60))
    d.polygon(S(40, 400, 720, 360, 720, 380, 40, 420), fill=RED)
    for k in range(9):
        x = 60 + k * 80
        y = 440 - k * 4.7
        d.line(S(x, y, x, y + 50), fill=(110, 80, 50), width=5 * SS)
    d.rectangle(S(330, 300, 400, 420), fill=(200, 170, 120))
    d.polygon(S(320, 300, 365, 250, 410, 300), fill=RED)
    return _done(im, w, h)


def alps_pass(w=760, h=600):
    """A switchback mountain road climbing to a snowy pass with a tour bus on it."""
    im, d = _canvas(w, h)
    d.polygon(S(0, 560, 230, 90, 470, 560), fill=SOFT)
    d.polygon(S(290, 560, 540, 40, 760, 560), fill=DARK)
    d.polygon(S(470, 180, 540, 40, 610, 180, 575, 160, 540, 190, 505, 160), fill=SNOW)
    d.polygon(S(170, 210, 230, 90, 290, 210, 260, 195, 230, 220, 200, 195), fill=SNOW)
    pts = [(120, 560), (520, 500), (240, 430), (560, 360), (330, 290), (480, 230)]
    for a, b in zip(pts, pts[1:]):
        d.line(S(*a, *b), fill=GOLD, width=16 * SS)
    # bus
    bx, by = 400, 395
    d.rounded_rectangle(S(bx, by, bx + 140, by + 60), radius=14 * SS, fill=ACCENT)
    for k in range(4):
        d.rectangle(S(bx + 12 + k * 31, by + 10, bx + 36 + k * 31, by + 30), fill=PAPER)
    d.ellipse(S(bx + 18, by + 50, bx + 44, by + 76), fill=INK)
    d.ellipse(S(bx + 96, by + 50, bx + 122, by + 76), fill=INK)
    note(d, 640, 120, r=18, color=GOLD, stem=70)
    return _done(im, w, h)


if __name__ == '__main__':
    import sys
    fns = [tour_case, eiffel, berlin_wall, two_houses, lucerne, alps_pass]
    sheet = Image.new('RGBA', (3 * 780, 2 * 620), (15, 27, 51, 255))
    for i, f in enumerate(fns):
        a = f()
        sheet.alpha_composite(a, ((i % 3) * 780 + (780 - a.size[0]) // 2, (i // 3) * 620 + (620 - a.size[1]) // 2))
    sheet.convert('RGB').resize((1170, 620)).save(sys.argv[1])
    print('ok')
