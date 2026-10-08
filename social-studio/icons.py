"""Flat illustrations drawn in code, in the brand palette. Each returns an RGBA image."""
from PIL import Image, ImageDraw, ImageFilter
import math
from brand import font, NAVY, WHITE, ACCENT, GOLD, MUTED

SS = 3  # supersample for smooth edges
INK = (226, 234, 248)
SOFT = (60, 86, 136)
RED = (226, 88, 72)


def _canvas(w, h):
    im = Image.new('RGBA', (w * SS, h * SS), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def _done(im, w, h):
    return im.resize((w, h), Image.LANCZOS)


def S(*v):
    return [x * SS for x in v]


def note(d, x, y, r=26, color=WHITE, flag=True, stem=110):
    """Eighth note with head center at (x,y), in output px (pre-scaled)."""
    d.ellipse(S(x - r * 1.25, y - r, x + r * 1.25, y + r), fill=color)
    d.rectangle(S(x + r * 1.05, y - stem, x + r * 1.25 + 6, y), fill=color)
    if flag:
        d.polygon(S(x + r * 1.25, y - stem, x + r * 1.25 + 44, y - stem + 46, x + r * 1.25 + 30, y - stem + 64, x + r * 1.25, y - stem + 26), fill=color)


def music_staff(w=1080, h=360, notes=((140, 3), (300, 1), (460, 4), (640, 2), (820, 0)), color=SOFT, note_color=ACCENT):
    im, d = _canvas(w, h)
    gap = 34
    top = (h - gap * 4) // 2
    for i in range(5):
        d.rectangle(S(0, top + i * gap, w, top + i * gap + 4), fill=color)
    # treble-ish clef stand-in: bold G-curve
    for x, pos in notes:
        note(d, x, top + pos * gap + 2, r=22, color=note_color, stem=100)
    return _done(im, w, h)


def baton(w=520, h=520):
    im, d = _canvas(w, h)
    d.line(S(80, 440, 440, 80), fill=INK, width=12 * SS)
    d.ellipse(S(52, 412, 112, 472), fill=GOLD)
    for k in range(3):  # motion arcs
        d.arc(S(240 - k * 70, -40 - k * 70, 600 + k * 70, 320 + k * 70), 110, 160, fill=ACCENT, width=8 * SS)
    return _done(im, w, h)


def washer(angle=0.0, w=620, h=720):
    """Front-loading washer; `angle` rotates the clothes in the drum (radians)."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(20, 20, w - 20, h - 20), radius=48 * SS, fill=INK)
    d.rounded_rectangle(S(20, 20, w - 20, 150), radius=48 * SS, fill=(196, 208, 230))
    d.rectangle(S(20, 110, w - 20, 150), fill=(196, 208, 230))
    for i, c in enumerate([ACCENT, GOLD, RED]):
        d.ellipse(S(60 + i * 60, 62, 96 + i * 60, 98), fill=c)
    d.rounded_rectangle(S(w - 230, 60, w - 60, 100), radius=10 * SS, fill=NAVY)
    cx, cy, R = w / 2, 440, 200
    d.ellipse(S(cx - R, cy - R, cx + R, cy + R), fill=(150, 165, 192))
    d.ellipse(S(cx - R + 26, cy - R + 26, cx + R - 26, cy + R - 26), fill=NAVY)
    # water line
    d.chord(S(cx - R + 26, cy - R + 26, cx + R - 26, cy + R - 26), 15, 165, fill=(46, 84, 160))
    # tumbling clothes: three blobs on a ring
    for k, c in enumerate([ACCENT, GOLD, (240, 240, 245)]):
        a = angle + k * 2.1
        x, y = cx + math.cos(a) * 95, cy + math.sin(a) * 95
        d.rounded_rectangle(S(x - 44, y - 30, x + 44, y + 30), radius=18 * SS, fill=c)
    # glass shine
    d.arc(S(cx - R + 50, cy - R + 50, cx + R - 50, cy + R - 50), 200, 250, fill=(255, 255, 255, 140), width=10 * SS)
    return _done(im, w, h)


def lesson_card(w=760, h=900):
    """A stylized lesson plan, echoing VIC's lesson preview."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(0, 0, w, h), radius=36 * SS, fill=(255, 253, 247))
    d.text(S(48, 46), 'LESSON PLAN', font=font('Bold', 26 * SS), fill=(120, 128, 105))
    d.text(S(48, 96), 'What makes a', font=font('ExtraBold', 52 * SS), fill=(43, 51, 45))
    d.text(S(48, 156), 'habitat a home?', font=font('ExtraBold', 52 * SS), fill=(43, 51, 45))
    rows = ['Standards & objectives', 'Investigate in small groups', 'Differentiation: 3 groups', 'Worksheet + answer key', 'Exit ticket']
    for i, r in enumerate(rows):
        y = 270 + i * 104
        d.rounded_rectangle(S(48, y, w - 48, y + 82), radius=16 * SS, fill=(245, 237, 225))
        d.ellipse(S(70, y + 22, 108, y + 60), fill=(86, 120, 80))
        d.line(S(78, y + 42, 87, y + 51, 101, y + 31), fill=WHITE, width=5 * SS)
        d.text(S(130, y + 22), r, font=font('Bold', 32 * SS), fill=(43, 51, 45))
    return _done(im, w, h)


def report_card(w=700, h=880):
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(0, 0, w, h), radius=24 * SS, fill=(250, 248, 240))
    d.rectangle(S(0, 0, w, 120), fill=(196, 208, 230))
    d.text(S(44, 34), 'REPORT CARD', font=font('Black', 46 * SS), fill=NAVY)
    subj = [('Reading', 'A'), ('Math', 'A'), ('Science', 'A'), ('Social Studies', 'A'), ('Writing', 'A')]
    for i, (s, g) in enumerate(subj):
        y = 170 + i * 120
        d.text(S(44, y), s, font=font('Bold', 40 * SS), fill=(60, 66, 80))
        d.text(S(w - 120, y - 8), g, font=font('Black', 60 * SS), fill=RED)
        d.line(S(44, y + 84, w - 44, y + 84), fill=(214, 214, 205), width=3 * SS)
    # big question mark stamp
    d.ellipse(S(w - 330, h - 330, w - 40, h - 40), outline=ACCENT, width=12 * SS)
    d.text(S(w - 240, h - 330), '?', font=font('Black', 220 * SS), fill=ACCENT)
    return _done(im, w, h)


def open_book(w=640, h=420, color=INK, page=(255, 253, 247)):
    im, d = _canvas(w, h)
    d.polygon(S(20, 90, w / 2, 130, w - 20, 90, w - 20, h - 30, w / 2, h - 10, 20, h - 30), fill=color)
    d.polygon(S(44, 60, w / 2 - 6, 104, w / 2 - 6, h - 40, 44, h - 64), fill=page)
    d.polygon(S(w / 2 + 6, 104, w - 44, 60, w - 44, h - 64, w / 2 + 6, h - 40), fill=page)
    for i in range(6):
        y = 140 + i * 34
        d.line(S(80, y, w / 2 - 40, y + 14), fill=(200, 205, 215), width=5 * SS)
        d.line(S(w / 2 + 40, y + 14, w - 80, y), fill=(200, 205, 215), width=5 * SS)
    # sparkle rising from the book
    for (x, y, r) in [(w / 2, 26, 20), (w / 2 - 90, 40, 12), (w / 2 + 96, 34, 14)]:
        d.polygon(S(x, y - r, x + r * .3, y - r * .3, x + r, y, x + r * .3, y + r * .3, x, y + r, x - r * .3, y + r * .3, x - r, y, x - r * .3, y - r * .3), fill=GOLD)
    return _done(im, w, h)


def doors(w=900, h=700, left='3A', right='3B'):
    im, d = _canvas(w, h)
    for i, lab in enumerate([left, right]):
        x = 60 + i * 440
        d.rounded_rectangle(S(x, 80, x + 340, h - 40), radius=10 * SS, fill=(196, 208, 230))
        d.rectangle(S(x + 30, 110, x + 310, h - 40), fill=(122, 92, 66))
        d.rectangle(S(x + 70, 150, x + 190, 330), fill=(180, 210, 240))
        d.ellipse(S(x + 260, 380, x + 290, 410), fill=GOLD)
        d.rounded_rectangle(S(x + 200, 20, x + 320, 92), radius=12 * SS, fill=WHITE)
        d.text(S(x + 222, 26), lab, font=font('Black', 52 * SS), fill=NAVY)
    # arrow from left to right
    d.line(S(330, 470, 560, 470), fill=GOLD, width=14 * SS)
    d.polygon(S(560, 440, 610, 470, 560, 500), fill=GOLD)
    d.text(S(386, 500), '?', font=font('Black', 110 * SS), fill=GOLD)
    return _done(im, w, h)


def factory(w=620, h=420, color=INK):
    im, d = _canvas(w, h)
    d.rectangle(S(20, 200, w - 20, h - 20), fill=color)
    for i in range(3):  # saw-tooth roof
        x = 20 + i * 150
        d.polygon(S(x, 200, x + 150, 110, x + 150, 200), fill=color)
    d.rectangle(S(w - 150, 40, w - 100, 200), fill=color)
    for k, (cx, cy, r) in enumerate([(w - 118, 20, 22), (w - 80, -6, 28)]):
        d.ellipse(S(cx - r, cy - r + 20, cx + r, cy + r + 20), fill=(150, 165, 192))
    for i in range(5):
        x = 60 + i * 100
        d.rectangle(S(x, 260, x + 56, 320), fill=NAVY)
    return _done(im, w, h)


def bars(w=520, h=520, color=INK):
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(20, 20, w - 20, h - 20), radius=20 * SS, outline=color, width=14 * SS)
    for i in range(5):
        x = 70 + i * 95
        d.rectangle(S(x, 20, x + 16, h - 20), fill=color)
    d.rectangle(S(20, h / 2 - 8, w - 20, h / 2 + 8), fill=color)
    return _done(im, w, h)


def bell(w=440, h=480, color=GOLD):
    im, d = _canvas(w, h)
    cx = w / 2
    d.rectangle(S(cx - 10, 10, cx + 10, 60), fill=color)
    d.chord(S(cx - 150, 40, cx + 150, 400), 180, 360, fill=color)
    d.polygon(S(cx - 150, 220, cx + 150, 220, cx + 190, 390, cx - 190, 390), fill=color)
    d.rounded_rectangle(S(cx - 200, 380, cx + 200, 410), radius=12 * SS, fill=color)
    d.ellipse(S(cx - 34, 410, cx + 34, 470), fill=color)
    for k in range(2):
        d.arc(S(cx - 250 - k * 40, 120 - k * 40, cx + 250 + k * 40, 520 + k * 40), 200, 235, fill=ACCENT, width=8 * SS)
        d.arc(S(cx - 250 - k * 40, 120 - k * 40, cx + 250 + k * 40, 520 + k * 40), 305, 340, fill=ACCENT, width=8 * SS)
    return _done(im, w, h)


def message_card(w=760, h=640, typed=1.0):
    """A parent-message draft; `typed` (0..1) reveals the body lines."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(0, 0, w, h), radius=32 * SS, fill=(255, 253, 247))
    d.text(S(44, 36), 'To: Parent / Guardian', font=font('Bold', 28 * SS), fill=(110, 118, 135))
    d.text(S(44, 82), 'Subject: Today in class', font=font('Bold', 28 * SS), fill=(110, 118, 135))
    d.line(S(44, 136, w - 44, 136), fill=(225, 222, 212), width=3 * SS)
    lines = [0.92, 0.85, 0.95, 0.6, 0.9, 0.8, 0.45]
    shown = typed * len(lines)
    for i, frac in enumerate(lines):
        if i >= shown:
            break
        part = min(1.0, shown - i)
        y = 176 + i * 54
        d.rounded_rectangle(S(44, y, 44 + (w - 88) * frac * part, y + 22), radius=11 * SS, fill=(210, 214, 224))
    d.rounded_rectangle(S(w - 250, h - 96, w - 44, h - 40), radius=28 * SS, fill=(86, 120, 80))
    d.text(S(w - 222, h - 86), 'Review', font=font('Bold', 30 * SS), fill=WHITE)
    return _done(im, w, h)
