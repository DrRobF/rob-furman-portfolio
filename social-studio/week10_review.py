import json, base64, io, html
from PIL import Image
P = json.load(open('/home/claude/social/week10_posts.json'))
O = '/home/claude/social/out/2026-12-07/'
def uri(f, w=420):
    im = Image.open(O + f).convert('RGB'); im.thumbnail((w, w * 2))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=70)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
E = html.escape
NET = {'instagram': 'Instagram', 'tiktok': 'TikTok', 'youtube': 'YouTube Shorts', 'facebook': 'Facebook', 'linkedin': 'LinkedIn'}
def tm(t):
    h, m = map(int, t.split(':')); return f"{(h-1)%12+1}:{m:02d} {'AM' if h<12 else 'PM'}"
cards = []
LI = {l['date']: l for l in P['linkedin']}
for d in P['days']:
    video = d['media'][0].endswith('.mp4')
    if video:
        media = f'<a class="vid" href="{P["base"]}{d["media"][0]}" target="_blank" rel="noopener"><img src="{uri(d["cover"], 360)}" alt="Video cover for {E(d["label"])}"><span>Play video ▶</span></a>'
    elif len(d['media']) > 1:
        media = '<div class="strip">' + ''.join(f'<img src="{uri(m, 360)}" alt="Slide {i+1}">' for i, m in enumerate(d['media'])) + '</div>'
    else:
        media = f'<img class="single" src="{uri(d["media"][0], 420)}" alt="{E(d["label"])}">'
    meta = [f'<span class="chip cta">{E(d["cta"])}</span>']
    if d.get('song'): meta.append(f'<span class="chip">♪ {E(d["song"])}</span>')
    blocks = [f'<div class="post"><div class="when">{tm(d["time"])} · {", ".join(NET[n] for n in d["networks"])}</div><p class="cap">{E(d["text"])}</p>' +
              (f'<div class="fc"><b>First comment</b><p>{E(d["first_comment"])}</p></div>' if d.get('first_comment') else '') + '</div>']
    if d.get('youtube'):
        y = d['youtube']
        blocks.append(f'<div class="post li"><div class="when">{tm(d["time"])} · YouTube Shorts (video version, ♪ {E(d["song"])})</div><a class="vid" href="{P["base"]}{y["media"][0]}" target="_blank" rel="noopener"><img src="{uri(y["cover"], 300)}" alt="YouTube video cover"><span>Play video ▶</span></a><p class="cap">{E(y["text"])}</p></div>')
    if d.get('extra'):
        x = d['extra']
        blocks.insert(0, f'<div class="post"><div class="when">{tm(x["time"])} · {", ".join(NET[n] for n in x["networks"])} (story carousel)</div><div class="strip">' + ''.join(f'<img src="{uri(m, 360)}" alt="Slide {i+1}">' for i, m in enumerate(x['media'])) + f'</div><p class="cap">{E(x["text"])}</p><div class="fc"><b>First comment</b><p>{E(x["first_comment"])}</p></div></div>')
    if d['date'] in LI:
        l = LI[d['date']]
        blocks.append(f'<div class="post li"><div class="when">12:30 PM · LinkedIn ({"poll, " if l.get("poll") else ""}text only)</div><p class="cap">{E(l["text"])}</p>' + (('<div class="fc"><b>Poll: ' + E(l['poll']['question']) + '</b><p>' + ' · '.join(E(o) for o in l['poll']['options']) + '</p></div>') if l.get('poll') else '') +
                      (f'<div class="fc"><b>First comment</b><p>{E(l["first_comment"])}</p></div>' if l.get('first_comment') else '') + '</div>')
    if d.get('note'):
        blocks.append(f'<p class="note">{E(d["note"])}</p>')
    cards.append(f'''<section class="day" id="{d["date"]}"><header><div><div class="dname">{E(d["day"])}</div><h2>{E(d["label"])}</h2></div><div class="chips">{"".join(meta)}</div></header>
<div class="body"><div class="media {'wide' if len(d['media'])>1 else ''}">{media}</div><div class="posts">{"".join(blocks)}</div></div></section>''')


def tb_html():
    rows=''.join(f'<li><span class="when">{E(w.replace("T"," "))}</span><p class="cap">{E(t)}</p></li>' for w,img,t in P['threads_bluesky'])
    return '<section class="day"><header><div><div class="dname">Every day</div><h2>Threads and Bluesky (one story hook a day)</h2></div></header><ul class="plain">'+rows+'</ul></section>'
def pin_html():
    rows=''.join(f'<li><img src="{uri(img,160)}" alt="Pin image"><div><span class="when">{E(w.replace("T"," "))} · {E(b)}</span><p class="cap"><b>{E(t)}</b><br>{E(dsc)}</p></div></li>' for w,img,b,t,dsc,l in P['pins'])
    return '<section class="day"><header><div><div class="dname">Every day</div><h2>Pinterest pins (one at 9:15 AM daily)</h2></div></header><ul class="plain pins">'+rows+'</ul></section>'
page = f'''<title>Week of December 7 Social Plan</title>
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
ul.plain{{list-style:none;padding:0;margin:14px 0 0;display:flex;flex-direction:column;gap:12px}} .pins li{{display:flex;gap:12px;align-items:flex-start}} .pins img{{width:80px;border-radius:6px;flex:0 0 auto}} .pins li div{{min-width:0}}
.note{{color:var(--muted);font-style:italic;margin:0}}
a{{color:var(--accent)}} a:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
@media (max-width:700px){{.body{{grid-template-columns:minmax(0,1fr)}}}}
</style>
<div class="wrap">
<div><div class="dname">Dr. Rob Furman · Social autopilot</div><h1>Week of December 7</h1>
<p class="lede">28 drafts are waiting in Metricool for Mon Dec 7 to Sun Dec 13. Nothing goes live until you say go.</p></div>
<div class="finding"><b>What's working</b>
<p>Last 30 days on TikTok (Metricool's counts): the cruise/school-board carousel keeps climbing (11,611). Behind it: the "happy spray" interview carousel (1,862), TOOHAK (1,690), the trombone collision (1,634), the peanut-free table (1,346) and the field-trip What Would You Do? carousel (1,049). A typical post sits around 150 to 200, and animated videos stay at 85 to 230.</p>
<p>The lever this month is your hiring stories. "Happy spray" beat its neighbours about 10 to 1. So Monday is Interview Files #3 (the candidate who talked until you zoned out), and Tuesday is a hot take from the same book: 40 of your last 60 candidates bragged about having a smartboard.</p>
<p><b>Sales:</b> no Gumroad sales in November. Product pages had 106 views in the last 30 days, mostly direct. The last sales were the two on Oct 31 ($31).</p></div>
<div class="go"><b>The week at a glance</b>
<ul><li>All five calls to action are covered: VIC (Mon video), the books (Mon Interview Files, Thu quote, Sat parents, Thu LinkedIn), speaking (Tue and Sun), H.E.L.P. (Wed Regulation Under Pressure module, plus a LinkedIn poll) and the paid What Would You Do? deck (Fri, Scenario 08, with the Difficult Conversations Prep Kit in the first comment).</li>
<li>Instagram, TikTok and Facebook at 5:52 PM (YouTube Shorts too on video days); Monday's Interview Files at 10:00 AM; Saturday at 10:22 AM.</li>
<li>LinkedIn has a text post every weekday at 12:30 PM: the word-vomit candidate, the smartboard take, a hallway de-escalation poll, the "second choice" stereotype from From City Streets to The Classroom, and the vendor table.</li>
<li>Threads and Bluesky get one story hook a day. Pinterest gets one pin a day across your boards.</li>
<li>Videos run 22 to 45 seconds. That's longer than usual, because I kept your reading-pace rule for every screen.</li>
<li>Sunday uses your TEDx stage photo (TED4, second use). Everything else uses illustrations. New photos would help a lot.</li>
<li><b>I need two things from you.</b> (1) Tuesday is normally a "Where I Learned It" origin story, and that bank is empty, so this week runs the smartboard take instead. A story or two from your guitar and songwriting life, or from the TEDx stage, would fix that. (2) The Vendor Table is the last What Would You Do? scenario in the social order. For Fridays after this, should I re-run the best performers (Stupid Form, Birthday Cookies, Noise During Reading), or do you have new scenarios?</li>
<li>The Drive connector can read your private What Would You Do? doc but can't edit it, so its "Used:" line is out of date. Used so far: 12, 01, 04, 07, 11, 06, 10, 03, 05 and now 08.</li>
<li>Reply "go" to schedule all 28, or tell me what to change.</li></ul></div>
{"".join(cards)}{tb_html()}{pin_html()}
</div>'''
open('/home/claude/social/review/week-of-dec-7.html', 'w').write(page)
print(len(page)//1024, 'KB')
