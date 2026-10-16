from icons import _canvas, _done, S, SS, INK, SOFT, RED, note
from brand import GOLD, ACCENT
from PIL import Image, ImageDraw
import math

def testsheet(w=760, h=560):
    """Bubble-sheet test with a big A and a pencil."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(130, 30, w-130, h-20), radius=16*SS, fill=(250, 248, 240))
    d.text(S(170, 52), "", fill=INK)
    for r in range(5):
        y = 100 + r*62
        d.rounded_rectangle(S(170, y-6, 212, y+6), radius=3*SS, fill=(60, 86, 136))
        for c in range(4):
            x = 262 + c*70
            filled = (c == (r*3) % 4)
            d.ellipse(S(x-20, y-20, x+20, y+20), outline=(60, 86, 136), width=5*SS, fill=(40, 52, 80) if filled else None)
    # grade stamp
    d.ellipse(S(w-290, 330, w-110, 510), outline=RED, width=10*SS)
    d.line(S(w-262, 470, w-200, 350, w-140, 470), fill=RED, width=14*SS, joint="curve")
    d.line(S(w-246, 432, w-156, 432), fill=RED, width=12*SS)
    # pencil

    return _done(im, w, h)

def guitar(w=760, h=560):
    """Acoustic guitar (tilted) with a star and ABC blocks, for the piggyback song."""
    from brand import font, WHITE
    g = Image.new('RGBA', (360, 640), (0, 0, 0, 0)); d = ImageDraw.Draw(g)
    d.rounded_rectangle((162, 0, 198, 330), radius=8, fill=(110, 70, 40))
    d.rounded_rectangle((150, -5, 210, 40), radius=8, fill=INK)
    d.ellipse((80, 250, 280, 450), fill=(190, 120, 60)); d.ellipse((40, 360, 320, 620), fill=(190, 120, 60))
    d.ellipse((135, 395, 225, 485), fill=INK); d.ellipse((147, 407, 213, 473), fill=(30, 36, 56))
    d.rounded_rectangle((130, 540, 230, 558), radius=6, fill=INK)
    for k in range(4):
        d.line((169+k*7, 20, 169+k*7, 545), fill=(235, 235, 225), width=2)
    g = g.rotate(-30, expand=True, resample=Image.BICUBIC)
    im, d = _canvas(w, h)
    im2 = _done(im, w, h)
    im2.alpha_composite(g.resize((int(g.width*0.82), int(g.height*0.82))), (40, -10))
    dd = ImageDraw.Draw(im2)
    pts = []
    for k in range(10):
        r = 52 if k % 2 == 0 else 22
        a = -math.pi/2 + k*math.pi/5
        pts += [560+r*math.cos(a), 250+r*math.sin(a)]
    dd.polygon(pts, fill=GOLD)
    for i, ch in enumerate("ABC"):
        x = 480 + i*80
        dd.rounded_rectangle((x, 430, x+70, 500), radius=10, fill=ACCENT)
        dd.text((x+35, 466), ch, font=font('ExtraBold', 44), fill=WHITE, anchor='mm')
    return im2
