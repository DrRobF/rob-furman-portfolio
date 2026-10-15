from icons import _canvas, _done, S, SS, INK, SOFT, RED
from brand import GOLD, ACCENT
from PIL import Image, ImageDraw

def snare(w=760, h=560):
    """Snare drum with a ripped head and a stick poking through."""
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(90, 250, w-90, 470), radius=18*SS, fill=(60, 86, 136))
    for x in range(120, w-100, 60):
        d.line(S(x, 262, x, 458), fill=(86, 116, 170), width=6*SS)
    d.ellipse(S(70, 190, w-70, 320), fill=INK)
    d.ellipse(S(95, 205, w-95, 305), fill=(250, 248, 240))
    # rip down the middle
    pts = [(w/2-8, 205), (w/2+22, 232), (w/2-14, 255), (w/2+20, 280), (w/2-6, 305)]
    d.line(S(*[c for p in pts for c in p]), fill=(40, 52, 80), width=9*SS)
    d.polygon(S(w/2-8, 205, w/2+22, 232, w/2-14, 255, w/2-30, 240), fill=(40, 52, 80))
    # stick through
    d.line(S(w/2+10, 250, w/2+190, 70), fill=GOLD, width=16*SS)
    d.ellipse(S(w/2+176, 54, w/2+206, 84), fill=GOLD)
    d.ellipse(S(w-90, 440, w-60, 470), fill=INK)
    # rim shots lines
    for dx in (-50, 0, 50):
        d.line(S(w/2+210+dx*0.2, 120+abs(dx)*0.3, w/2+250+dx*0.2, 110+abs(dx)*0.3), fill=ACCENT, width=6*SS)
    return _done(im, w, h)
