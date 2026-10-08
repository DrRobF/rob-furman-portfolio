import json, html, os, shutil

p = json.load(open('/home/claude/social/week2_posts.json'))
SITE_DIR = '/home/claude/social/review2'
os.makedirs(f'{SITE_DIR}/media', exist_ok=True)
for d in p['days']:
    for m in d['media']:
        shutil.copy(f'/home/claude/social/out/2026-10-19/{m}', f'{SITE_DIR}/media/{m}')

NET = {'instagram': 'Instagram', 'tiktok': 'TikTok', 'youtube': 'YouTube Shorts', 'facebook': 'Facebook', 'linkedin': 'LinkedIn'}


def t12(t):
    h, m = map(int, t.split(':'))
    return f"{(h - 1) % 12 + 1}:{m:02d} {'PM' if h >= 12 else 'AM'}"


def esc(s):
    return html.escape(s).replace('\n', '<br>')


def media_html(d):
    ms = d['media']
    if ms[0].endswith('.mp4'):
        return f'<div class="phone"><video src="media/{ms[0]}" controls playsinline muted loop preload="metadata"></video></div>'
    if len(ms) == 1:
        return f'<div class="single"><img src="media/{ms[0]}" alt="{html.escape(d["label"])} post image"></div>'
    imgs = ''.join(f'<img src="media/{m}" alt="Slide {i + 1}" loading="lazy">' for i, m in enumerate(ms))
    return f'<div class="strip" tabindex="0" aria-label="Carousel slides, scroll sideways">{imgs}</div><p class="hint">{len(ms)} slides, scroll sideways</p>'


def caption_block(title, nets, time, text, cid, first=None, extra=None):
    chips = ''.join(f'<span class="chip">{NET[n]}</span>' for n in nets)
    fc = f'<div class="fc"><span class="lbl">First comment</span><p>{esc(first)}</p></div>' if first else ''
    ex = f'<p class="note">{extra}</p>' if extra else ''
    return f'''<div class="cap">
  <div class="caphead"><div class="chips">{chips}</div><span class="time">{t12(time)}</span></div>
  {f'<p class="vt">{html.escape(title)}</p>' if title else ''}
  <p class="body" id="{cid}">{esc(text)}</p>{fc}{ex}
  <button type="button" class="copy" data-target="{cid}">Copy caption</button>
</div>'''


days = ''
for i, d in enumerate(p['days']):
    s = d['short']
    caps = caption_block(s.get('title') if 'youtube' in s['networks'] else None, s['networks'], s['time'], s['text'],
                         f'c{i}s', s.get('first_comment'),
                         'YouTube uses the bold line as the video title.' if 'youtube' in s['networks'] else None)
    if 'linkedin' in d:
        L = d['linkedin']
        caps += caption_block(None, ['linkedin'], L['time'], L['text'], f'c{i}l', L.get('first_comment'),
                              'Posted as a swipeable document (the slides).' if L.get('pdf_title') else
                              ('Posted with the video.' if d['media'][0].endswith('.mp4') else
                               ('Posted with the image.' if d['media'][0].endswith('.jpg') and len(d['media']) == 1 else None)))
    days += f'''<section class="day" id="d{i}">
  <header class="dayhead"><h2>{d['day']}</h2><p class="topic">{html.escape(d['label'])}{(' · 🎵 ' + html.escape(d['song'])) if d.get('song') else ''}</p><p class="goal">Sends people to: <strong>{html.escape(d['goal'])}</strong></p></header>
  <div class="daygrid"><div class="media">{media_html(d)}</div><div class="caps">{caps}</div></div>
</section>'''

scripts = '' and ''.join(f'''<article class="script"><h3>{html.escape(s['title'])}</h3><p class="use">{html.escape(s['use'])}</p><p class="body" id="s{i}">{esc(s['script'])}</p><button type="button" class="copy" data-target="s{i}">Copy script</button></article>''' for i, s in enumerate(p.get('scripts', [])))

page = f'''<title>Week Two Social Plan</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=Source+Sans+3:wght@400;600&display=swap">
<style>
/* Layout: a week laid out as a run sheet; each day pairs the asset (phone frame or slide strip) with its captions per network. */
:root {{
  --bg:#f3f5f9; --surface:#ffffff; --fg:#14223d; --muted:#55627b; --line:#d8dfeb; --accent:#2457c5; --chip:#e7edf9;
  --display:'Archivo', 'Helvetica Neue', Arial, sans-serif; --body:'Source Sans 3', 'Segoe UI', Arial, sans-serif;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#0d1629; --surface:#14213b; --fg:#e8eef9; --muted:#9aa8c2; --line:#26365a; --accent:#7aa6ff; --chip:#1d2d4f; color-scheme:dark }} }}
:root[data-theme="dark"] {{ --bg:#0d1629; --surface:#14213b; --fg:#e8eef9; --muted:#9aa8c2; --line:#26365a; --accent:#7aa6ff; --chip:#1d2d4f; color-scheme:dark }}
body {{ background:var(--bg); color:var(--fg); font-family:var(--body); font-size:17px; line-height:1.55; }}
.wrap {{ max-width:1120px; margin:0 auto; padding-inline:clamp(16px,4vw,40px); padding-block:40px 80px; }}
h1,h2,h3 {{ font-family:var(--display); text-wrap:balance; margin:0; }}
h1 {{ font-size:clamp(30px,5vw,48px); font-weight:800; letter-spacing:-.02em; }}
.lede {{ color:var(--muted); max-width:62ch; margin:12px 0 0; }}
.facts {{ display:flex; flex-wrap:wrap; gap:10px 28px; margin:24px 0 0; padding:0; list-style:none; font-size:15px; color:var(--muted); }}
.facts strong {{ color:var(--fg); }}
nav.week {{ display:flex; flex-wrap:wrap; gap:8px; margin:28px 0 8px; }}
nav.week a {{ font-family:var(--display); font-weight:700; font-size:14px; text-decoration:none; color:var(--fg); border:1px solid var(--line); background:var(--surface); padding:6px 12px; border-radius:6px; }}
nav.week a:hover, nav.week a:focus-visible {{ border-color:var(--accent); color:var(--accent); outline:none; }}
.day {{ border-top:1px solid var(--line); padding-block:36px; }}
.dayhead {{ display:flex; flex-wrap:wrap; align-items:baseline; gap:6px 18px; margin-bottom:20px; }}
.dayhead h2 {{ font-size:26px; font-weight:800; }}
.topic {{ margin:0; font-family:var(--display); font-weight:500; color:var(--muted); font-size:18px; }}
.goal {{ margin:0 0 0 auto; font-size:14px; color:var(--muted); }}
.daygrid {{ display:grid; grid-template-columns:minmax(0,300px) minmax(0,1fr); gap:28px; align-items:start; }}
@media (max-width:760px) {{ .daygrid {{ grid-template-columns:minmax(0,1fr); }} .goal {{ margin-left:0; }} }}
.media, .caps {{ min-width:0; }}
.phone {{ width:100%; max-width:280px; aspect-ratio:9/16; border-radius:22px; overflow:hidden; background:#000; border:6px solid var(--fg); }}
.phone video {{ width:100%; height:100%; object-fit:cover; display:block; }}
.single img {{ width:100%; max-width:300px; border-radius:8px; display:block; border:1px solid var(--line); }}
.strip {{ display:flex; gap:8px; overflow-x:auto; scroll-snap-type:x mandatory; padding-bottom:6px; }}
.strip img {{ width:240px; max-width:80vw; flex:none; border-radius:6px; scroll-snap-align:start; border:1px solid var(--line); }}
.strip:focus-visible {{ outline:2px solid var(--accent); outline-offset:3px; }}
.hint {{ font-size:13px; color:var(--muted); margin:6px 0 0; }}
.caps {{ display:grid; gap:16px; }}
.cap {{ background:var(--surface); border:1px solid var(--line); border-radius:10px; padding:18px 20px; }}
.caphead {{ display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; }}
.chips {{ display:flex; flex-wrap:wrap; gap:6px; }}
.chip {{ background:var(--chip); color:var(--fg); font-size:12px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; padding:3px 8px; border-radius:4px; }}
.time {{ font-family:var(--display); font-weight:700; font-size:14px; color:var(--accent); font-variant-numeric:tabular-nums; }}
.vt {{ font-weight:600; margin:12px 0 0; }}
.body {{ margin:12px 0 0; max-width:68ch; overflow-wrap:anywhere; }}
.fc {{ margin-top:14px; border-left:3px solid var(--accent); padding-left:12px; }}
.fc p {{ margin:4px 0 0; font-size:15px; color:var(--muted); }}
.lbl {{ font-size:12px; text-transform:uppercase; letter-spacing:.06em; font-weight:600; color:var(--accent); }}
.note {{ font-size:13px; color:var(--muted); margin:10px 0 0; }}
.copy {{ margin-top:14px; font:600 14px var(--body); color:var(--accent); background:transparent; border:1px solid var(--line); border-radius:6px; padding:6px 12px; cursor:pointer; }}
.copy:hover, .copy:focus-visible {{ border-color:var(--accent); outline:none; }}
.scripts {{ border-top:1px solid var(--line); padding-top:36px; }}
.scripts > h2 {{ font-size:26px; font-weight:800; }}
.scripts > p {{ color:var(--muted); max-width:62ch; }}
.sgrid {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr)); gap:16px; margin-top:16px; }}
.script {{ background:var(--surface); border:1px solid var(--line); border-radius:10px; padding:20px; min-width:0; }}
.script h3 {{ font-size:19px; }}
.use {{ font-size:14px; color:var(--muted); margin:6px 0 0; }}
.next {{ border-top:1px solid var(--line); padding-top:36px; margin-top:36px; }}
.next h2 {{ font-size:26px; font-weight:800; }}
.next ol {{ max-width:68ch; padding-left:22px; }}
.next li {{ margin:8px 0; }}
@media (prefers-reduced-motion: reduce) {{ * {{ scroll-behavior:auto; }} }}
</style>
<div class="wrap">
  <h1>Week of October 19</h1>
  <p class="lede">Week two, built from The Future Ready Challenge, Motivating the Reluctant Reader, your What Would You Do? scenarios, and your tools. Every video has one of your songs. These are saved as drafts in Metricool and won't post until you say go.</p>
  <ul class="facts">
    <li><strong>7</strong> days</li><li><strong>4</strong> videos, <strong>2</strong> carousels, <strong>1</strong> quote card</li>
    <li>Videos and photos at about <strong>6 PM</strong></li><li>LinkedIn at about <strong>11 AM</strong> on weekdays</li>
  </ul>
  <nav class="week" aria-label="Jump to a day">{''.join(f'<a href="#d{i}">{d["day"][:3]}</a>' for i, d in enumerate(p["days"]))}</nav>
  {days}
    <section class="next"><h2>To approve</h2><ol>
    <li><strong>Reply "go"</strong> and I'll switch all of these from drafts to scheduled. Or tell me what to change: a caption, a song, a photo, a whole day.</li>
    <li><strong>Turn the sound on</strong> when you watch. Each video uses part of one of your songs (named next to the day).</li>
    <li><strong>Friday's answer</strong> comes from your What Would You Do? deck, Scenario 1. Check that you're comfortable sharing it.</li>
  </ol></section>
</div>
<script>
document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', () => {{
  const el = document.getElementById(b.dataset.target);
  const text = el.innerText;
  const done = () => {{ const o = b.textContent; b.textContent = 'Copied'; setTimeout(() => b.textContent = o, 1500); }};
  if (navigator.clipboard && navigator.clipboard.writeText) {{
    navigator.clipboard.writeText(text).then(done).catch(() => select(el));
  }} else select(el);
}}));
function select(el) {{ const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }}
</script>'''
open(f'{SITE_DIR}/index.html', 'w').write(page)
print('built', len(page))
