"""Week of 2026-11-23 illustrations (same flat style as icons.py / icons8.py)."""
from icons import _canvas, _done, S, SS, INK, SOFT, RED
from brand import font, NAVY, WHITE, ACCENT, GOLD, MUTED
from PIL import Image, ImageDraw
import math

PAPER = (255, 253, 247)
GREEN = (86, 170, 110)
WOOD = (150, 100, 60)
LINE = (170, 182, 206)
DARK = (34, 52, 88)


def drums_city(w=760, h=600):
    """A drum kit (bass drum, snare, cymbal) in front of a city skyline."""
    im, d = _canvas(w, h)
    # skyline
    xs = [(20, 230), (110, 140), (190, 260), (300, 180), (380, 120), (470, 220), (560, 160), (650, 250)]
    for i, (x, top) in enumerate(xs):
        d.rectangle(S(x, top, x + 100, 420), fill=DARK)
        for wy in range(top + 24, 400, 44):
            for wx in (x + 18, x + 58):
                if (wx + wy + i) % 3:
                    d.rectangle(S(wx, wy, wx + 22, wy + 22), fill=(242, 184, 75, 200) if (wx * wy) % 7 < 3 else SOFT)
    # bass drum
    d.ellipse(S(220, 250, 540, 570), fill=INK)
    d.ellipse(S(244, 274, 516, 546), fill=ACCENT)
    d.ellipse(S(300, 330, 460, 490), fill=(150, 190, 255))
    d.text(S(306, 386), 'STOMP', font=font('Black', 38 * SS), fill=NAVY)
    # snare on stand
    d.line(S(140, 420, 120, 580), fill=INK, width=8 * SS)
    d.line(S(140, 420, 170, 580), fill=INK, width=8 * SS)
    d.rounded_rectangle(S(40, 340, 230, 420), radius=10 * SS, fill=RED)
    d.ellipse(S(40, 320, 230, 362), fill=PAPER)
    for x in range(60, 220, 30):
        d.line(S(x, 350, x, 410), fill=(255, 220, 200), width=4 * SS)
    # cymbal
    d.line(S(640, 230, 640, 580), fill=INK, width=8 * SS)
    d.ellipse(S(540, 205, 740, 250), fill=GOLD)
    # sticks
    d.line(S(90, 300, 210, 200), fill=PAPER, width=10 * SS)
    d.line(S(150, 300, 250, 190), fill=PAPER, width=10 * SS)
    return _done(im, w, h)


def trophy(w=600, h=600):
    """Award trophy with a music note."""
    im, d = _canvas(w, h)
    d.arc(S(90, 90, 250, 300), 90, 270, fill=GOLD, width=22 * SS)
    d.arc(S(350, 90, 510, 300), 270, 90, fill=GOLD, width=22 * SS)
    d.pieslice(S(150, -40, 450, 380), 0, 180, fill=GOLD)
    d.rectangle(S(150, 60, 450, 170), fill=GOLD)
    d.rectangle(S(270, 360, 330, 450), fill=(214, 156, 50))
    d.rounded_rectangle(S(180, 450, 420, 520), radius=12 * SS, fill=DARK)
    d.rounded_rectangle(S(140, 520, 460, 580), radius=12 * SS, fill=SOFT)
    # note
    d.ellipse(S(250, 230, 300, 270), fill=NAVY)
    d.rectangle(S(292, 130, 302, 255), fill=NAVY)
    d.polygon(S(302, 130, 346, 170, 334, 186, 302, 158), fill=NAVY)
    return _done(im, w, h)


def songbook(w=760, h=600):
    """Lyric notebook with a pencil, headphones and a small AI spark beside it (AI as helper)."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(60, 60, 470, 560), radius=18 * SS, fill=PAPER)
    for k in range(8):
        d.line(S(90, 190 + k * 46, 440, 190 + k * 46), fill=LINE, width=3 * SS)
    for k in range(6):
        d.ellipse(S(40, 100 + k * 76, 76, 136 + k * 76), fill=SOFT)
    d.text(S(96, 82), 'MY SONG', font=font('Black', 40 * SS), fill=NAVY)
    lens = [300, 250, 320, 200, 280, 240, 310]
    for k, L in enumerate(lens):
        d.rounded_rectangle(S(96, 166 + k * 46, 96 + L, 180 + k * 46), radius=6 * SS, fill=(120, 140, 180))
    # pencil
    d.polygon(S(380, 520, 650, 250, 690, 290, 420, 560), fill=GOLD)
    d.polygon(S(380, 520, 420, 560, 360, 580), fill=(240, 210, 170))
    d.polygon(S(650, 250, 690, 290, 710, 270, 670, 230), fill=RED)
    # notes
    for x, y in ((560, 150), (640, 90)):
        d.ellipse(S(x - 26, y - 20, x + 26, y + 20), fill=ACCENT)
        d.rectangle(S(x + 18, y - 100, x + 28, y), fill=ACCENT)
    # AI spark (small, off to the side)
    cx, cy, r = 650, 440, 60
    pts = []
    for i in range(8):
        a = math.pi / 4 * i - math.pi / 2
        rr = r if i % 2 == 0 else r * 0.35
        pts += [cx + rr * math.cos(a), cy + rr * math.sin(a)]
    d.polygon(S(*pts), fill=(170, 200, 255))
    d.text(S(622, 506), 'AI', font=font('Black', 36 * SS), fill=INK)
    return _done(im, w, h)


def buzz_clipboard(w=760, h=600):
    """Clipboard with a cheat sheet of buzz words, one crossed out."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(150, 40, 610, 580), radius=24 * SS, fill=WOOD)
    d.rounded_rectangle(S(185, 90, 575, 550), radius=10 * SS, fill=PAPER)
    d.rounded_rectangle(S(290, 20, 470, 90), radius=16 * SS, fill=INK)
    d.text(S(215, 112), 'BUZZ WORDS', font=font('Black', 38 * SS), fill=RED)
    words = ['differentiation', 'authentic learning', 'student-centered', 'project-based']
    for k, wd in enumerate(words):
        y = 190 + k * 80
        d.rectangle(S(215, y + 6, 243, y + 34), outline=SOFT, width=4 * SS)
        d.text(S(262, y), wd, font=font('Bold', 32 * SS), fill=NAVY)
    d.line(S(205, 470, 560, 450), fill=RED, width=8 * SS)
    d.text(S(215, 488), 'just talk to me', font=font('Bold', 28 * SS), fill=GREEN)
    return _done(im, w, h)


def garage(w=760, h=600):
    """House garage with the door shut and a small backpack waiting by the front door."""
    im, d = _canvas(w, h)
    d.polygon(S(40, 220, 380, 40, 720, 220), fill=SOFT)
    d.rectangle(S(80, 220, 680, 570), fill=DARK)
    # garage door
    d.rectangle(S(120, 270, 470, 570), fill=INK)
    for k in range(5):
        d.line(S(120, 270 + k * 60, 470, 270 + k * 60), fill=LINE, width=5 * SS)
    d.rounded_rectangle(S(270, 520, 320, 534), radius=6 * SS, fill=SOFT)
    # front door (works)
    d.rectangle(S(530, 330, 640, 570), fill=ACCENT)
    d.ellipse(S(612, 450, 628, 466), fill=GOLD)
    # backpack
    d.rounded_rectangle(S(560, 470, 640, 570), radius=18 * SS, fill=RED)
    d.rounded_rectangle(S(574, 510, 626, 548), radius=8 * SS, fill=(240, 130, 110))
    d.arc(S(574, 446, 626, 494), 180, 360, fill=RED, width=8 * SS)
    # big question mark over garage
    d.text(S(250, 120), '?', font=font('Black', 140 * SS), fill=GOLD)
    return _done(im, w, h)


def aha_book(w=760, h=600):
    """Open book with a glowing light bulb rising out of it."""
    im, d = _canvas(w, h)
    # glow
    for r, a in ((200, 40), (160, 60), (120, 90)):
        d.ellipse(S(380 - r, 200 - r, 380 + r, 200 + r), fill=(242, 184, 75, a))
    d.ellipse(S(300, 100, 460, 260), fill=GOLD)
    d.rectangle(S(340, 250, 420, 300), fill=(214, 156, 50))
    d.rounded_rectangle(S(345, 300, 415, 330), radius=8 * SS, fill=INK)
    for a in range(-60, 241, 50):
        r1, r2 = 115, 160
        ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
        d.line(S(380 + r1 * ca, 180 - r1 * sa, 380 + r2 * ca, 180 - r2 * sa), fill=GOLD, width=8 * SS)
    # book
    d.polygon(S(380, 400, 60, 350, 60, 560, 380, 590), fill=PAPER)
    d.polygon(S(380, 400, 700, 350, 700, 560, 380, 590), fill=(240, 236, 226))
    d.line(S(380, 400, 380, 590), fill=SOFT, width=6 * SS)
    for k in range(4):
        d.line(S(100, 390 + k * 40, 340, 420 + k * 40), fill=LINE, width=4 * SS)
        d.line(S(420, 420 + k * 40, 660, 390 + k * 40), fill=LINE, width=4 * SS)
    return _done(im, w, h)


def weird_lesson(w=760, h=600):
    """A paper rocket lifting off a lesson plan page."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(80, 330, 460, 580), radius=14 * SS, fill=PAPER)
    d.text(S(110, 350), 'LESSON PLAN', font=font('Black', 34 * SS), fill=NAVY)
    for k in range(4):
        d.rounded_rectangle(S(110, 410 + k * 38, 400 - k * 40, 422 + k * 38), radius=6 * SS, fill=LINE)
    # rocket
    rk, rd = _canvas(240, 420)
    rd.polygon(S(120, 0, 200, 120, 200, 320, 40, 320, 40, 120), fill=INK)
    rd.ellipse(S(85, 130, 155, 200), fill=ACCENT)
    rd.polygon(S(40, 240, 0, 340, 40, 320), fill=RED)
    rd.polygon(S(200, 240, 240, 340, 200, 320), fill=RED)
    rd.polygon(S(70, 320, 170, 320, 120, 420), fill=GOLD)
    rk = rk.rotate(-28, expand=True, resample=Image.BICUBIC)
    im.alpha_composite(rk, (360 * SS, 20 * SS))
    for x, y, r in ((380, 330, 26), (340, 380, 18), (420, 300, 14)):
        d.ellipse(S(x - r, y - r, x + r, y + r), fill=(200, 210, 230))
    for x, y in ((620, 80), (700, 220), (300, 120)):
        d.polygon(S(x, y - 16, x + 6, y - 4, x + 18, y, x + 6, y + 4, x, y + 16, x - 6, y + 4, x - 18, y, x - 6, y - 4), fill=GOLD)
    return _done(im, w, h)


def two_places(w=760, h=600):
    """Laptop with a video call: the same person in two windows, here and there."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(100, 60, 660, 440), radius=20 * SS, fill=INK)
    d.rectangle(S(124, 84, 636, 416), fill=DARK)
    for x0, c in ((140, ACCENT), (390, GOLD)):
        d.rounded_rectangle(S(x0, 120, x0 + 230, 380), radius=14 * SS, fill=SOFT)
        d.ellipse(S(x0 + 75, 170, x0 + 155, 250), fill=c)
        d.pieslice(S(x0 + 45, 260, x0 + 185, 400), 180, 360, fill=c)
    d.polygon(S(40, 460, 720, 460, 680, 520, 80, 520), fill=(200, 210, 230))
    d.rectangle(S(300, 470, 460, 482), fill=SOFT)
    # location pins
    for x, c in ((180, ACCENT), (580, GOLD)):
        d.ellipse(S(x - 30, 520, x + 30, 580), fill=c)
        d.polygon(S(x - 26, 560, x + 26, 560, x, 600), fill=c)
        d.ellipse(S(x - 10, 540, x + 10, 560), fill=NAVY)
    return _done(im, w, h)


def phone_heat(w=760, h=600, level=1.0):
    """Ringing desk phone with a heat dial: Moderate, High, Full Blaze."""
    im, d = _canvas(w, h)
    # phone
    d.rounded_rectangle(S(60, 300, 380, 560), radius=26 * SS, fill=INK)
    d.rounded_rectangle(S(40, 220, 400, 300), radius=36 * SS, fill=ACCENT)
    d.rectangle(S(150, 280, 290, 320), fill=ACCENT)
    for i in range(3):
        for j in range(3):
            d.rounded_rectangle(S(110 + i * 80, 350 + j * 62, 170 + i * 80, 392 + j * 62), radius=8 * SS, fill=SOFT)
    for k, r in enumerate((40, 70)):
        d.arc(S(220 - r - 120, 190 - r, 220 + r - 120, 190 + r), 200, 340, fill=GOLD, width=8 * SS)
        d.arc(S(220 - r + 120, 190 - r, 220 + r + 120, 190 + r), 200, 340, fill=GOLD, width=8 * SS)
    # dial
    cx, cy, R = 580, 400, 150
    cols = [GREEN, GOLD, RED]
    for i, c in enumerate(cols):
        d.pieslice(S(cx - R, cy - R, cx + R, cy + R), 180 + i * 60, 240 + i * 60, fill=c)
    d.ellipse(S(cx - 90, cy - 90, cx + 90, cy + 90), fill=NAVY)
    a = math.radians(180 + 180 * max(0, min(1, level)) * 0.92 + 6)
    d.line(S(cx, cy, cx + 130 * math.cos(a), cy + 130 * math.sin(a)), fill=WHITE, width=10 * SS)
    d.ellipse(S(cx - 18, cy - 18, cx + 18, cy + 18), fill=WHITE)
    d.rectangle(S(cx - R, cy, cx + R, cy + 100), fill=(0, 0, 0, 0))
    return _done(im, w, h)


if __name__ == '__main__':
    fns = [drums_city, trophy, songbook, buzz_clipboard, garage, aha_book, weird_lesson, two_places, phone_heat]
    sheet = Image.new('RGBA', (3 * 780, 3 * 620), (15, 27, 51, 255))
    for i, f in enumerate(fns):
        a = f()
        sheet.alpha_composite(a, ((i % 3) * 780 + (780 - a.size[0]) // 2, (i // 3) * 620 + (620 - a.size[1]) // 2))
    sheet.convert('RGB').resize((1170, 930)).save('/tmp/claude-0/-home-claude/86e1731b-6573-585b-b05f-3b5cd87b5778/scratchpad/icons9.jpg')
    print('ok')
