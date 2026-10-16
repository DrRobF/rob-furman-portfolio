import sys
_src = open('week1_videos.py').read().split('# ---------- MON')[0].replace("which = sys.argv[1:] or ['mon', 'wed', 'fri', 'sun']", '')
exec(_src)
import icons4
OUT = '/home/claude/social/out/2026-10-19'

def pace(text):
    return round(max(3.0, len(text.split()) / 2.5 + 1.5), 1)

_e = {}
def elev(lt, a, b, c):
    # states: (open_, alarm, floor)
    key = (lt > a, lt > b, lt > c)
    if key not in _e:
        floor = '2' if key[2] else '1'
        _e[key] = icons4.elevator(open_=1.0 if key[1] else 0.0, alarm=key[0], floor=floor).resize((520, 582))
    return _e[key]

def T(t, **k): return (pace(t), [dict(text=t, size=k.pop('size', 84), y=k.pop('y', 700), **k)])

render(f'{OUT}/mon-2am-alarm.mp4', [
    (3.4, [dict(text='2 AM.', size=190, weight='Black', y=640), dict(text='The school alarm goes off.', size=70, weight='Medium', color=MUTED, y=930, at=0.8)]),
    T('I live closest. So I go.'),
    T('The police meet me there. I know them. It’s a small town.', size=76),
    T('Two alarms. First floor and second floor. Right above each other.', size=74),
    T('They clear the building. Nobody inside. Nothing outside.', size=78),
    (pace('So we check the cameras. The elevator.'), [dict(text='So we check the cameras.', size=80, y=360)],
     pop_in(lambda lt: elev(lt, 99, 99, 99), 280, 700, 0.4)),
    (7.0, [dict(text='Floor 1. The alarm lights up. The door opens.', size=60, y=330),
           dict(text='Nobody gets on. Nobody gets off.', size=56, weight='Bold', color=ACCENT, y=600, at=2.5)],
     pop_in(lambda lt: elev(lt, 0.8, 2.2, 99), 280, 800, 0.2)),
    (7.0, [dict(text='Floor 2. The door opens. Second alarm.', size=60, y=330),
           dict(text='Nobody gets on. Nobody gets off.', size=56, weight='Bold', color=ACCENT, y=600, at=2.5)],
     pop_in(lambda lt: elev(lt, 0.0, 0.2, 0.0), 280, 800, 0.2)),
    T('One officer is watching. He puts his hands up, says “Nope,” and walks out of the building.', size=70),
    (6.5, [dict(text='Stay and investigate?', size=96, y=520), dict(text='Or walk out with him?', size=96, y=700, at=0.8, hl={'walk'}),
           dict(text='Comment your call.', size=62, weight='Bold', color=ACCENT, y=1000, at=2.0)]),
    (5.5, end_card_beats('Practice the calls that come at 2 AM before they’re real.', 'A Day in the Life of a Principal: a free leadership simulation.', 'drrobfurman.com')),
], navy_bg_fast)
