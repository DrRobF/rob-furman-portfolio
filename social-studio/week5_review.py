import json, base64, io, html
from PIL import Image
P = json.load(open('/home/claude/social/week5_posts.json'))
O = '/home/claude/social/out/2026-11-02/'
def uri(f, w=420):
    im = Image.open(O + f).convert('RGB'); im.thumbnail((w, w * 2))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=70)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
E = html.escape
NET = {'instagram': 'Instagram', 'tiktok': 'TikTok', 'youtube': 'YouTube Shorts', 'facebook': 'Facebook', 'linkedin': 'LinkedIn'}
def tm(t):
    h, m = map(int, t.split(':')); return f"{(h-1)%12+1}:{m:02d} {'AM' if h<12 else 'PM'}"
cards = []
for d in P['days']:
    s = d['short']; video = d['media'][0].endswith('.mp4')
    if video:
        media = f'<a class="vid" href="{P["base"]}{d["media"][0]}" target="_blank" rel="noopener"><img src="{uri(d["cover"], 360)}" alt="Video cover for {E(d["label"])}"><span>Play video ▶</span></a>'
    elif len(d['media']) > 1:
        media = '<div class="strip">' + ''.join(f'<img src="{uri(m, 360)}" alt="Slide {i+1}">' for i, m in enumerate(d['media'])) + '</div>'
    else:
        media = f'<img class="single" src="{uri(d["media"][0], 420)}" alt="{E(d["label"])}">'
    meta = [f'<span class="chip cta">{E(d["cta"])}</span>']
    if d.get('song'): meta.append(f'<span class="chip">♪ {E(d["song"])}</span>')
    blocks = [f'<div class="post"><div class="when">{tm(s["time"])} · {", ".join(NET[n] for n in s["networks"])}</div><p class="cap">{E(s["text"])}</p>' +
              (f'<div class="fc"><b>First comment</b><p>{E(s["first_comment"])}</p></div>' if s.get('first_comment') else '') + '</div>']
    if d.get('linkedin'):
        l = d['linkedin']
        blocks.append(f'<div class="post li"><div class="when">{tm(l["time"])} · LinkedIn (text only)</div><p class="cap">{E(l["text"])}</p>' +
                      (f'<div class="fc"><b>First comment</b><p>{E(l["first_comment"])}</p></div>' if l.get('first_comment') else '') + '</div>')
    if d.get('note'):
        blocks.append(f'<p class="note">{E(d["note"])}</p>')
    cards.append(f'''<section class="day" id="{d["date"]}"><header><div><div class="dname">{E(d["day"])}</div><h2>{E(d["label"])}</h2></div><div class="chips">{"".join(meta)}</div></header>
<div class="body"><div class="media {'wide' if len(d['media'])>1 else ''}">{media}</div><div class="posts">{"".join(blocks)}</div></div></section>''')

page = f'''<title>Week of November 2 Social Plan</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Source+Sans+3:wght@400;600;700&display=swap">
<style>
/* layout: a planner week, one day per band, media left and copy right */
:root{{--bg:#f3f5fa;--panel:#ffffff;--ink:#14213d;--muted:#5a6680;--line:#dde3ee;--accent:#2f6bdc;--gold:#b7791f;--gold-bg:#fbf1dc;
--display:"Fraunces",Georgia,serif;--body:"Source Sans 3",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#0f1b33;--panel:#17253f;--ink:#e8eefb;--muted:#a9b6cf;--line:#2a3b5c;--accent:#6ea0ff;--gold:#f2b84b;--gold-bg:#3a2f17;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#0f1b33;--panel:#17253f;--ink:#e8eefb;--muted:#a9b6cf;--line:#2a3b5c;--accent:#6ea0ff;--gold:#f2b84b;--gold-bg:#3a2f17;color-scheme:dark}}
body{{background:var(--bg);color:var(--ink);font:17px/1.5 var(--body);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 60px}}
.wrap{{max-width:1080px;margin:0 auto;display:flex;flex-direction:column;gap:22px}}
h1{{font:800 clamp(30px,5vw,46px)/1.1 var(--display);margin:0;text-wrap:balance}}
h2{{font:600 22px/1.25 var(--display);margin:2px 0 0;text-wrap:balance}}
.lede{{color:var(--muted);max-width:68ch;margin:6px 0 0}}
.finding{{background:var(--gold-bg);border-left:4px solid var(--gold);padding:16px 18px;border-radius:6px}}
.finding b{{color:var(--gold)}} .finding p{{margin:6px 0 0}}
.go{{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:16px 18px}}
.go ul{{margin:8px 0 0;padding-left:20px}}
.day{{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:18px}}
.day header{{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:12px}}
.dname{{text-transform:uppercase;letter-spacing:.08em;font-size:13px;font-weight:700;color:var(--accent)}}
.chips{{display:flex;gap:6px;flex-wrap:wrap}}
.chip{{font-size:13px;border:1px solid var(--line);border-radius:999px;padding:3px 10px;color:var(--muted)}}
.chip.cta{{border-color:var(--accent);color:var(--accent);font-weight:700}}
.body{{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:20px;margin-top:14px}}
.media.wide{{grid-column:1/-1}}
.media img{{border-radius:8px;display:block}}
.strip{{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}} .strip img{{width:190px;flex:0 0 auto}}
.vid{{position:relative;display:block;max-width:240px}} .vid img{{width:100%}}
.vid span{{position:absolute;left:10px;bottom:10px;background:var(--accent);color:#fff;font-weight:700;font-size:14px;padding:4px 10px;border-radius:999px}}
.single{{width:100%;max-width:300px}}
.posts{{display:flex;flex-direction:column;gap:14px;min-width:0}}
.media.wide + .posts{{grid-column:1/-1}}
.when{{font-weight:700;font-size:14px;color:var(--muted);font-variant-numeric:tabular-nums}}
.cap{{white-space:pre-wrap;margin:6px 0 0;overflow-wrap:anywhere}}
.li{{border-top:1px dashed var(--line);padding-top:12px}}
.fc{{margin-top:8px;background:var(--bg);border-radius:6px;padding:10px 12px;font-size:15px}} .fc p{{margin:4px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}}
.note{{color:var(--muted);font-style:italic;margin:0}}
a{{color:var(--accent)}} a:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
@media (max-width:700px){{.body{{grid-template-columns:minmax(0,1fr)}}}}
</style>
<div class="wrap">
<div><div class="dname">Dr. Rob Furman · Social autopilot</div><h1>Week of November 2</h1>
<p class="lede">Ten drafts are waiting in Metricool for Mon Nov 2 to Sun Nov 8. Nothing goes live until you say go.</p></div>
<div class="finding"><b>What's working right now</b>
<p>The band-director carousel on Oct 21 ("a band director is already a mini principal") reached 2,921 TikTok views, 116 likes and 21 shares. That's the second band-community hit in ten days. Your typical TikTok post gets about 120 views, and animated videos sit around 100 to 180. The lever is the same one as Oct 13: a community that identifies itself, niche hashtags, and a callout question at the end.</p>
<p>This week's Tuesday carousel uses that lever on teachers who love Kahoot (#kahoot #reviewgames #gamebasedlearning). It isn't an origin story, because I couldn't verify a new one. One question from you unlocks next Tuesday: what are five things your dad, the principal, taught you about running a school? Or five things guitar taught you about teaching?</p></div>
<div class="go"><b>The week at a glance</b>
<ul><li>Every call to action is covered: VIC (Mon), speaking (Tue), H.E.L.P. (Wed), the books (Thu, Sat, Sun) and the paid What Would You Do? deck (Fri).</li>
<li>LinkedIn: Mon, Tue and Fri at 10:52 AM, plus your own Thursday 11:00 post. That's four for the week.</li>
<li>Instagram, TikTok and Facebook at 5:52 PM (YouTube Shorts too on video days); Saturday at 10:22 AM.</li>
<li>Reply "go" to schedule all ten, or tell me what to change.</li></ul></div>
{"".join(cards)}
</div>'''
open('/home/claude/social/review/week-of-nov-2.html', 'w').write(page)
print(len(page)//1024, 'KB')
