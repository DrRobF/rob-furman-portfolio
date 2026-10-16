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


def elevator(w=760, h=860, open_=0.0, alarm=False, floor='1'):
    """Elevator in a dark hallway. open_ 0..1 door gap; alarm=True shows a red flashing light."""
    from brand import font, WHITE, MUTED
    im, d = _canvas(w, h)
    d.rounded_rectangle(S(60, 120, w-60, h-40), radius=18*SS, fill=(34, 52, 88))
    d.rounded_rectangle(S(100, 170, w-100, h-40), radius=8*SS, fill=(12, 20, 38))
    # interior light when open
    gap = int((w-200) * 0.5 * open_)
    cx = w/2
    if open_ > 0:
        d.rectangle(S(cx-gap, 170, cx+gap, h-40), fill=(246, 240, 214))
    # doors
    half = (w-200)/2
    d.rectangle(S(100, 170, 100+half-gap, h-40), fill=(150, 168, 200))
    d.rectangle(S(cx+gap, 170, w-100, h-40), fill=(150, 168, 200))
    d.line(S(cx-gap, 170, cx-gap, h-40), fill=(70, 88, 126), width=5*SS)
    d.line(S(cx+gap, 170, cx+gap, h-40), fill=(70, 88, 126), width=5*SS)
    # floor display
    d.rounded_rectangle(S(cx-70, 50, cx+70, 110), radius=10*SS, fill=(8, 12, 24))
    d.text(S(cx-18, 56), floor, font=font('Black', 46*SS), fill=GOLD)
    # alarm light
    col = (255, 70, 60) if alarm else (96, 52, 52)
    d.ellipse(S(w-150, 20, w-90, 80), fill=col)
    if alarm:
        for r in (46, 70):
            d.arc(S(w-120-r, 50-r, w-120+r, 50+r), 200, 340, fill=(255, 110, 100), width=6*SS)
    return _done(im, w, h)
