"""Week of 2026-11-02 illustrations (same flat style as icons.py)."""
from icons import _canvas, _done, S, SS, INK, SOFT, RED, note
from brand import font, NAVY, WHITE, ACCENT, GOLD, MUTED
from PIL import Image, ImageDraw
import math

PAPER = (255, 253, 247)
GREEN = (86, 170, 110)
PURPLE = (150, 110, 220)


def quiz_flip(w=760, h=640):
    """A game-show quiz screen turned around: the student holds the pencil and writes the question."""
    im, d = _canvas(w, h)
    # screen
    d.rounded_rectangle(S(60, 40, w - 60, 330), radius=26 * SS, fill=(30, 46, 78))
    d.rounded_rectangle(S(90, 70, w - 90, 150), radius=14 * SS, fill=PAPER)
    d.text(S(120, 82), '? ? ?', font=font('Black', 52 * SS), fill=NAVY)
    cols = [RED, ACCENT, GOLD, GREEN]
    for i, c in enumerate(cols):
        x = 90 + (i % 2) * ((w - 180) // 2 + 10)
        y = 170 + (i // 2) * 74
        d.rounded_rectangle(S(x, y, x + (w - 180) // 2 - 10, y + 60), radius=12 * SS, fill=c)
    # paper + pencil (student writes the question)
    d.rounded_rectangle(S(120, 380, 470, h - 30), radius=14 * SS, fill=PAPER)
    for k in range(4):
        y = 425 + k * 46
        d.rounded_rectangle(S(150, y, 440 - (k % 2) * 80, y + 12), radius=6 * SS, fill=(170, 182, 206))
    d.text(S(380, 520), '?', font=font('Black', 90 * SS), fill=ACCENT)
    # pencil
    px, py = 470, 560
    d.polygon(S(px, py, px + 26, py - 40, px + 200, py - 160, px + 176, py - 120), fill=GOLD)
    d.polygon(S(px, py, px + 26, py - 40, px - 6, py + 12), fill=(240, 220, 180))
    d.polygon(S(px + 200, py - 160, px + 176, py - 120, px + 210, py - 140, px + 226, py - 176), fill=(240, 150, 150))
    return _done(im, w, h)


def build_project(w=760, h=600):
    """A popsicle-stick bridge on a table with a lightbulb above: learning by making."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(30, h - 110, w - 30, h - 70), radius=12 * SS, fill=SOFT)
    d.rectangle(S(80, h - 70, 110, h - 10), fill=SOFT)
    d.rectangle(S(w - 110, h - 70, w - 80, h - 10), fill=SOFT)
    # bridge deck + truss
    y0 = h - 200
    d.rounded_rectangle(S(90, y0, w - 90, y0 + 22), radius=6 * SS, fill=(222, 180, 120))
    d.rectangle(S(110, y0 + 22, 140, h - 110), fill=(222, 180, 120))
    d.rectangle(S(w - 140, y0 + 22, w - 110, h - 110), fill=(222, 180, 120))
    n = 6
    span = (w - 220) / n
    for i in range(n):
        x1 = 110 + i * span
        x2 = x1 + span
        top = y0 - 110
        d.line(S(x1, y0, x1 + span / 2, top), fill=(240, 200, 140), width=12 * SS)
        d.line(S(x1 + span / 2, top, x2, y0), fill=(240, 200, 140), width=12 * SS)
    d.line(S(110 + span / 2, y0 - 110, w - 110 - span / 2, y0 - 110), fill=(240, 200, 140), width=12 * SS)
    # lightbulb
    cx, cy = w / 2, 120
    for i in range(8):
        a = i * math.pi / 4
        d.line(S(cx + math.cos(a) * 90, cy + math.sin(a) * 90, cx + math.cos(a) * 125, cy + math.sin(a) * 125), fill=GOLD, width=8 * SS)
    d.ellipse(S(cx - 64, cy - 70, cx + 64, cy + 58), fill=GOLD)
    d.rounded_rectangle(S(cx - 32, cy + 46, cx + 32, cy + 90), radius=8 * SS, fill=(196, 208, 230))
    return _done(im, w, h)


def palette(w=620, h=520):
    """Paint palette, brush and a blank canvas: materials, a concept, no process."""
    im, d = _canvas(w, h)
    # canvas on easel
    d.line(S(140, 60, 80, h - 20), fill=(180, 140, 100), width=14 * SS)
    d.line(S(300, 60, 360, h - 20), fill=(180, 140, 100), width=14 * SS)
    d.rounded_rectangle(S(70, 40, 370, 300), radius=8 * SS, fill=PAPER)
    d.rectangle(S(60, 300, 380, 320), fill=(180, 140, 100))
    # palette
    d.ellipse(S(270, 250, w - 20, h - 30), fill=(222, 180, 120))
    d.ellipse(S(330, 380, 380, 430), fill=NAVY)
    for (x, y, c) in [(330, 300, RED), (410, 280, GOLD), (490, 300, ACCENT), (540, 360, GREEN), (500, 430, PURPLE)]:
        d.ellipse(S(x - 26, y - 22, x + 26, y + 22), fill=c)
    # brush
    d.line(S(190, 470, 360, 230), fill=(110, 70, 40), width=14 * SS)
    d.polygon(S(360, 230, 380, 190, 400, 176, 376, 222), fill=ACCENT)
    return _done(im, w, h)


def book_sounds(w=760, h=560):
    """An open book with small sound marks rising off the page."""
    from icons import open_book
    im, d = _canvas(w, h)
    b = open_book().resize((600, 394))
    big = b.resize((600 * SS, 394 * SS), Image.LANCZOS)
    im.alpha_composite(big, (80 * SS, (h - 394 - 10) * SS))
    for i, (x, y) in enumerate([(220, 130), (380, 70), (540, 130)]):
        for r in range(2):
            rr = 34 + r * 30
            d.arc(S(x - rr, y - rr, x + rr, y + rr), 200, 340, fill=GOLD if i == 1 else ACCENT, width=9 * SS)
    return _done(im, w, h)


def talk_bubbles(w=720, h=520):
    """Two speech bubbles facing each other, one with ?, one with !"""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(20, 40, 380, 280), radius=40 * SS, fill=ACCENT)
    d.polygon(S(90, 270, 70, 360, 170, 275), fill=ACCENT)
    d.text(S(160, 70), '?', font=font('Black', 150 * SS), fill=NAVY)
    d.rounded_rectangle(S(w - 380, 200, w - 20, 440), radius=40 * SS, fill=GOLD)
    d.polygon(S(w - 90, 430, w - 70, 510, w - 170, 435), fill=GOLD)
    d.text(S(w - 240, 228), '!', font=font('Black', 150 * SS), fill=NAVY)
    return _done(im, w, h)


if __name__ == '__main__':
    out = '/tmp/claude-0/-home-claude/536e0db8-595f-5f86-be9e-caba673ca091/scratchpad/icons6.png'
    fs = [quiz_flip(), build_project(), palette(), book_sounds(), talk_bubbles()]
    sheet = Image.new('RGB', (sum(f.size[0] for f in fs), 660), NAVY)
    x = 0
    for f in fs:
        sheet.paste(f, (x, 0), f); x += f.size[0]
    sheet.save(out)
