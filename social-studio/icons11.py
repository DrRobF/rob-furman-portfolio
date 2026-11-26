"""Week of 2026-12-07 illustrations (same flat style as icons.py / icons10.py)."""
from icons import _canvas, _done, S, SS, INK, SOFT, RED
from brand import font, NAVY, WHITE, ACCENT, GOLD, MUTED
from PIL import Image, ImageDraw
import math

PAPER = (255, 253, 247)
GREEN = (86, 170, 110)
LINE = (170, 182, 206)
DARK = (34, 52, 88)
CHALK = (46, 84, 66)


def word_flood(w=760, h=600):
    """A candidate's giant overflowing speech bubble; the interviewer across the table has zoned out (Zzz)."""
    im, d = _canvas(w, h)
    # table
    d.rounded_rectangle(S(20, 500, 740, 540), radius=10 * SS, fill=SOFT)
    # interviewer (right), head tilted, zzz
    d.ellipse(S(560, 300, 680, 420), fill=INK)
    d.pieslice(S(520, 400, 720, 600), 180, 360, fill=ACCENT)
    d.line(S(590, 360, 615, 360), fill=NAVY, width=5 * SS)
    d.line(S(630, 360, 655, 360), fill=NAVY, width=5 * SS)
    for k, (x, y, s) in enumerate(((640, 250, 40), (680, 200, 52), (710, 140, 64))):
        d.text(S(x, y - s), 'z', font=font('Black', s * SS), fill=GOLD)
    # candidate (left)
    d.ellipse(S(70, 330, 180, 440), fill=INK)
    d.pieslice(S(35, 420, 215, 600), 180, 360, fill=GOLD)
    # overflowing bubble with run-on lines
    d.rounded_rectangle(S(40, 20, 540, 290), radius=50 * SS, fill=PAPER)
    d.polygon(S(130, 280, 120, 340, 190, 285), fill=PAPER)
    for k in range(5):
        y = 60 + k * 44
        d.rounded_rectangle(S(80, y, 500 - (k % 2) * 40, y + 18), radius=8 * SS, fill=LINE)
    d.text(S(380, 236), '...and...', font=font('Black', 34 * SS), fill=RED)
    return _done(im, w, h)


def smartboard(w=760, h=600):
    """An interactive whiteboard on a stand showing only chalk scribbles: a glorified chalkboard."""
    im, d = _canvas(w, h)
    d.rectangle(S(370, 470, 390, 560), fill=SOFT)
    d.rounded_rectangle(S(250, 550, 510, 575), radius=10 * SS, fill=SOFT)
    d.rounded_rectangle(S(40, 60, 720, 480), radius=22 * SS, fill=INK)
    d.rounded_rectangle(S(64, 84, 696, 456), radius=10 * SS, fill=CHALK)
    # chalk writing
    d.text(S(110, 120), '2 + 2 = 4', font=font('Black', 64 * SS), fill=(230, 238, 230))
    d.line(S(110, 230, 470, 230), fill=(210, 222, 210), width=6 * SS)
    d.line(S(110, 290, 400, 290), fill=(210, 222, 210), width=6 * SS)
    # idle app icons, greyed out
    for k in range(3):
        d.rounded_rectangle(S(560, 120 + k * 100, 650, 200 + k * 100), radius=16 * SS, fill=(80, 112, 96))
    # chalk tray + chalk
    d.rectangle(S(64, 456, 696, 476), fill=SOFT)
    d.rounded_rectangle(S(150, 446, 230, 462), radius=6 * SS, fill=PAPER)
    d.rounded_rectangle(S(260, 448, 320, 462), radius=6 * SS, fill=GOLD)
    # price tag
    d.rounded_rectangle(S(470, 10, 720, 80), radius=18 * SS, fill=GOLD)
    d.text(S(494, 22), '$$$$', font=font('Black', 44 * SS), fill=NAVY)
    return _done(im, w, h)


def hallway_phones(w=760, h=600):
    """A hallway with lockers; phones held up recording; one calm adult hand lowered (turn the volume down)."""
    im, d = _canvas(w, h)
    for k in range(7):
        x = 20 + k * 104
        d.rounded_rectangle(S(x, 40, x + 94, 360), radius=8 * SS, fill=SOFT if k % 2 else DARK)
        for j in range(3):
            d.line(S(x + 24, 70 + j * 16, x + 70, 70 + j * 16), fill=LINE, width=3 * SS)
        d.ellipse(S(x + 70, 200, x + 82, 212), fill=LINE)
    d.rectangle(S(0, 360, 760, 380), fill=(60, 80, 120))

    def phone(x, y, a):
        p = Image.new('RGBA', (110 * SS, 190 * SS), (0, 0, 0, 0))
        pd = ImageDraw.Draw(p)
        pd.rounded_rectangle(S(0, 0, 110, 190), radius=18 * SS, fill=INK)
        pd.rounded_rectangle(S(10, 14, 100, 176), radius=8 * SS, fill=NAVY)
        pd.ellipse(S(40, 70, 70, 100), fill=RED)
        p = p.rotate(a, expand=True, resample=Image.BICUBIC)
        im.alpha_composite(p, (x * SS, y * SS))
    phone(40, 250, 12)
    phone(200, 200, -6)
    phone(560, 230, -12)
    # calm hand, palm down
    d.rounded_rectangle(S(320, 420, 520, 500), radius=40 * SS, fill=GOLD)
    for k in range(4):
        d.rounded_rectangle(S(500, 420 + k * 20, 600, 438 + k * 20), radius=9 * SS, fill=GOLD)
    d.rectangle(S(200, 440, 330, 490), fill=ACCENT)
    for k in range(3):
        d.line(S(560, 520 + k * 22, 640 + k * 30, 520 + k * 22), fill=LINE, width=5 * SS)
    return _done(im, w, h)


def startup_stand(w=760, h=600):
    """A kid-sized market stand with an awning, a lightbulb sign and a cash jar: the young entrepreneur."""
    im, d = _canvas(w, h)
    # awning
    for k in range(6):
        c = ACCENT if k % 2 == 0 else PAPER
        d.polygon(S(80 + k * 100, 150, 180 + k * 100, 150, 180 + k * 100, 230, 80 + k * 100, 230), fill=c)
        d.pieslice(S(80 + k * 100, 190, 180 + k * 100, 270), 0, 180, fill=c)
    d.rectangle(S(90, 230, 110, 560), fill=SOFT)
    d.rectangle(S(650, 230, 670, 560), fill=SOFT)
    # counter
    d.rounded_rectangle(S(60, 400, 700, 560), radius=14 * SS, fill=GOLD)
    d.rectangle(S(60, 400, 700, 430), fill=(220, 160, 50))
    # sign with lightbulb
    d.rounded_rectangle(S(230, 20, 530, 130), radius=24 * SS, fill=DARK)
    d.ellipse(S(260, 38, 330, 108), fill=GOLD)
    d.rectangle(S(282, 100, 308, 120), fill=LINE)
    d.text(S(345, 46), 'MY', font=font('Black', 34 * SS), fill=WHITE)
    d.text(S(345, 80), 'IDEA', font=font('Black', 34 * SS), fill=ACCENT)
    # products & cash jar
    for k in range(3):
        d.rounded_rectangle(S(150 + k * 110, 320, 240 + k * 110, 400), radius=12 * SS, fill=(GREEN, ACCENT, RED)[k])
    d.rounded_rectangle(S(520, 290, 620, 400), radius=16 * SS, fill=(210, 230, 245))
    d.rectangle(S(535, 340, 605, 380), fill=GREEN)
    d.text(S(553, 336), '$', font=font('Black', 40 * SS), fill=PAPER)
    return _done(im, w, h)


def vendor_table(w=760, h=600):
    """A carnival booth with a pennant string, and a folding vendor table with a red NO sign beside it."""
    im, d = _canvas(w, h)
    # pennants
    d.line(S(0, 40, 760, 90), fill=LINE, width=3 * SS)
    for k in range(8):
        x = 20 + k * 95
        y = 40 + 50 * x / 760
        d.polygon(S(x, y, x + 60, y + 4, x + 30, y + 70), fill=(ACCENT, GOLD, RED, GREEN)[k % 4])
    # tent
    d.polygon(S(60, 260, 230, 140, 400, 260), fill=RED)
    d.polygon(S(140, 260, 230, 140, 320, 260), fill=PAPER)
    d.rectangle(S(80, 260, 380, 520), fill=(240, 236, 226))
    d.rectangle(S(80, 260, 380, 290), fill=RED)
    d.text(S(140, 320), 'PTA', font=font('Black', 64 * SS), fill=NAVY)
    d.text(S(110, 400), 'CARNIVAL', font=font('Black', 38 * SS), fill=SOFT)
    # vendor table
    d.rounded_rectangle(S(430, 380, 740, 420), radius=8 * SS, fill=GOLD)
    d.line(S(460, 420, 440, 540), fill=SOFT, width=8 * SS)
    d.line(S(710, 420, 730, 540), fill=SOFT, width=8 * SS)
    for k in range(4):
        d.rounded_rectangle(S(450 + k * 70, 330, 505 + k * 70, 380), radius=8 * SS, fill=(ACCENT, GREEN, PAPER, ACCENT)[k])
    # NO sign
    cx, cy = 590, 220
    d.ellipse(S(cx - 90, cy - 90, cx + 90, cy + 90), fill=RED)
    d.ellipse(S(cx - 70, cy - 70, cx + 70, cy + 70), fill=PAPER)
    d.line(S(cx - 50, cy + 50, cx + 50, cy - 50), fill=RED, width=20 * SS)
    d.text(S(cx - 40, cy - 30), '$', font=font('Black', 60 * SS), fill=NAVY)
    return _done(im, w, h)


def gift_book(w=760, h=600):
    """A book wrapped as a present with a big bow, next to a small TV ad shouting at it."""
    im, d = _canvas(w, h)
    # TV with ad
    d.rounded_rectangle(S(430, 60, 730, 270), radius=20 * SS, fill=INK)
    d.rounded_rectangle(S(450, 80, 710, 250), radius=8 * SS, fill=RED)
    d.text(S(475, 110), 'NEW!', font=font('Black', 56 * SS), fill=GOLD)
    d.text(S(475, 180), 'BUY NOW', font=font('Black', 38 * SS), fill=PAPER)
    d.line(S(530, 270, 500, 310), fill=INK, width=6 * SS)
    d.line(S(630, 270, 660, 310), fill=INK, width=6 * SS)
    # book as gift
    d.polygon(S(70, 260, 400, 220, 420, 560, 90, 590), fill=ACCENT)
    d.polygon(S(90, 590, 420, 560, 420, 580, 92, 606), fill=PAPER)
    d.polygon(S(220, 243, 270, 237, 290, 567, 240, 572), fill=GOLD)
    d.polygon(S(80, 400, 410, 370, 412, 410, 82, 440), fill=GOLD)
    # bow
    d.ellipse(S(160, 160, 260, 250), fill=GOLD)
    d.ellipse(S(250, 150, 350, 240), fill=GOLD)
    d.ellipse(S(230, 200, 280, 250), fill=(220, 160, 50))
    # sparkle
    for x, y, r in ((470, 360, 22), (560, 430, 14), (640, 360, 18)):
        d.polygon(S(x, y - r, x + r * 0.3, y - r * 0.3, x + r, y, x + r * 0.3, y + r * 0.3, x, y + r,
                    x - r * 0.3, y + r * 0.3, x - r, y, x - r * 0.3, y - r * 0.3), fill=GOLD)
    return _done(im, w, h)


def two_ways(w=760, h=600):
    """Left: identical rows of desks facing a board (how we were taught). Right: kids' paths branching to different goals."""
    im, d = _canvas(w, h)
    # left panel, rows
    d.rounded_rectangle(S(20, 60, 360, 560), radius=24 * SS, fill=DARK)
    d.rectangle(S(60, 90, 320, 150), fill=CHALK)
    for r in range(3):
        for c in range(3):
            x, y = 70 + c * 85, 210 + r * 110
            d.rounded_rectangle(S(x, y, x + 60, y + 36), radius=6 * SS, fill=SOFT)
            d.ellipse(S(x + 14, y - 40, x + 46, y - 8), fill=LINE)
    # right panel, branching paths
    d.rounded_rectangle(S(400, 60, 740, 560), radius=24 * SS, fill=DARK)
    sx, sy = 570, 520
    ends = [(450, 140, ACCENT), (570, 110, GOLD), (690, 150, GREEN), (470, 300, RED), (680, 310, ACCENT)]
    for x, y, c in ends:
        d.line(S(sx, sy, (sx + x) / 2 + (30 if x > sx else -30), (sy + y) / 2, ), fill=LINE, width=8 * SS)
        d.line(S((sx + x) / 2 + (30 if x > sx else -30), (sy + y) / 2, x, y), fill=LINE, width=8 * SS)
        d.ellipse(S(x - 30, y - 30, x + 30, y + 30), fill=c)
    d.ellipse(S(sx - 26, sy - 26, sx + 26, sy + 26), fill=PAPER)
    return _done(im, w, h)


if __name__ == '__main__':
    import sys
    fns = [word_flood, smartboard, hallway_phones, startup_stand, vendor_table, gift_book, two_ways]
    sheet = Image.new('RGBA', (3 * 780, 3 * 620), (15, 27, 51, 255))
    for i, f in enumerate(fns):
        a = f()
        sheet.alpha_composite(a, ((i % 3) * 780 + (780 - a.size[0]) // 2, (i // 3) * 620 + (620 - a.size[1]) // 2))
    sheet.convert('RGB').resize((1170, 930)).save(sys.argv[1])
    print('ok')
