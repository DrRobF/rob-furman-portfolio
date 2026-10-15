# Dr. Rob Furman: Weekly Social Autopilot Playbook

This is the playbook for the weekly scheduled task that builds next week's social posts for Dr. Rob Furman
(principal at Saint Peter's Academy, author, two-time TEDx speaker, creator of AskVic and the H.E.L.P. suite).
Goal: become the education influencer everyone wants to hear from, and drive educators to his free tools.

## Setup at the start of every run (fresh session)
1. Clone or update the repo DrRobF/rob-furman-portfolio to `/home/claude/rob-furman-portfolio` (branch main).
2. `cp -r /home/claude/rob-furman-portfolio/social-studio /home/claude/social` and work in `/home/claude/social`
   (the scripts use absolute paths under /home/claude/social and /home/claude/rob-furman-portfolio/public).
3. Install anything missing: `apt-get install -y ffmpeg fonts-inter` or `pip install pillow --break-system-packages`.
4. The What Would You Do scenarios live privately in Rob's Google Drive (the full deck is a paid product, keep it out
   of the public repo): Google Doc id `1fYd4JBvAvlwWzIXxTvp8zqJzN3oE3lw7TViIUxlLfHk`
   ("Social Autopilot - What Would You Do scenarios (private)"). Read it with the Google Drive connector and update
   its "Used:" line after picking a scenario.
5. At the end of a run, copy the updated `used_topics.md`, new `weekN_*.py`/`weekN_posts.json`/`weekN_ids.json`
   back into `social-studio/` and commit them to main along with the media, so next week's run sees them.

## Advertise the whole business, every week (added 2026-10-15 on Rob's instruction)
The goal is not just reach, it is reach that sells something. Rob's properties:
- **Free tools (top of funnel):** askvic.ai (lesson planner, parent messages, co-teacher, Lesson Designer at
  askvic.ai/lessonplan); drrobfurman.com/human-equation-suite (leadership-sim, urban-student-sim, parent-call, course, diagnostic).
- **Paid digital products (Gumroad, listed at /resources):** What Would You Do? 12 School Leadership Scenarios;
  Teacher Directed AI Prompts Across Subjects; Principal AI Starter Kit; Difficult Conversations Prep Kit;
  Music + AI Creativity Bundle. Each has a page at drrobfurman.com/resources/<slug>. Link the site page, not Gumroad.
- **Books:** drrobfurman.com/publications (The Future Ready Challenge, Motivating the Reluctant Reader,
  Engaging Young Readers, Reading/Technology/Digital Literacy).
- **Speaking (highest value):** drrobfurman.com/speaking, keynotes and school workshops.
- **Free guides:** drrobfurman.com/resources.

Rules for every week:
1. One clear call to action per post, and across the seven days the week must hit **all five**: a VIC tool, a H.E.L.P. tool,
   a paid product, the books, and speaking. Rotate which day carries which; never let a week be all free tools.
2. When a post's content comes from a paid product, the caption sells the product and the free tool goes in the
   first comment. Friday's What Would You Do? videos come straight out of the paid deck: always name the deck.
3. Audit the whole target week in Metricool before building, not just for autopilot duplicates. If Rob or anyone else
   has queued a block of near-identical captions, keep one of each unique caption per channel group, schedule those,
   and tell Rob which ones to delete (the API cannot delete posts, only update them).
4. Keep LinkedIn for Rob's own thinking: long-form posts, carousels as PDF documents, and polls. Product promo reels
   go to Instagram, TikTok, Facebook and YouTube. Never more than two LinkedIn posts in a day.
5. No two posts on the same network within an hour. Check his existing posts for the week before picking times.

## The Tuesday "Where I Learned It" carousel (added 2026-10-15, built on real results)

On 2026-10-13 the band-director carousel did 2,938 views, 220 likes and 26 shares on TikTok. His median TikTok post
in that period was about 115 views with 0 or 1 like. That is roughly 25x the reach and 10x the like rate of anything
else he has posted. The same carousel got 15 views on Instagram, so this is a TikTok effect, not a format effect.

What made it work, in order of importance:
1. **Niche identity hashtags, not education-generic ones.** #bandkid #banddirector #musiceducation reached a community
   that self-identifies and shares. #teachersoftiktok alone reliably returns 80-200 views.
2. **A personal origin story.** "Before I was a principal, I was a high school band director." Rob's past life, not advice.
3. **One vivid concrete image** in the first two lines ("100 teenagers, each holding a noise maker").
4. **A tribe callout at the end** ("Former band kids: which one did your director nail?"). It drove 26 shares,
   the only post of his with meaningful shares. Shares are what moved it on TikTok.
5. **Carousel, so people swipe.** Dwell time on a TikTok photo post.

So Tuesday's carousel is now a standing format: a real piece of Rob's life, then 5 things it taught him about
teaching or leading, then a callout to that community. Recipe:
- Slide 1: "Before I was a principal, I was a ___" (or the equivalent real detail), with a photo or illustration.
- Slides 2-6: five lessons, each a specific practice a teacher can use tomorrow.
- Slide 7: the usual close plus the week's call to action.
- Caption: the origin line, the vivid image, "swipe for 5", then the tribe question.
- Hashtags: **3 niche community tags first, then 3 education tags.** Never six generic education tags.

Topic bank (all real, verify before using, never invent a biography):
- High school band director (USED 2026-10-13, do not repeat)
- Gigging musician and songwriter who still performs; releases music as "Rob Furman" → #songwriter #musicianlife #gigging
- His father was also a principal (he references this himself in WWYD Scenario 05) → #principalsofinstagram #schoolleaders
- Two-time TEDx speaker → #tedx #publicspeaking #speaker
- Guitar player and teacher (see the guitar pages on drrobfurman.com) → #guitarist #guitarlessons #guitarteacher
- Sixteen years as an elementary principal → #principallife #elementaryschool
Note: his own posts say both "16 years" and "20 years" as an elementary principal. Use 16, which is what his own
recent LinkedIn post says, until Rob confirms which is right.

## Read the numbers before building (added 2026-10-15)
Every run, before picking topics, pull the last 30 days of TikTok post analytics
(getAnalyticsDataByMetrics, metrics TKPO02, TKPO05, TKPO07, TKPO08, TKPO10, TKPO22) and the Instagram equivalent
(IGPO01, IGPO03, IGPO07, IGPO28, IGPO13, IGPO27). Find the top post. If something beat the median by 3x or more,
work out why and build one post that week using the same lever. Put the finding at the top of the review page so
Rob sees what is working. Known as of 2026-10-15: Instagram is returning roughly 10-40 views per post regardless of
content, so judge what works by TikTok until Instagram distribution improves.

## What each run does
1. Work out the target week: the Monday 11 days after the run (runs fire Thursday morning, so Rob has the
   weekend to review). Folder name = that Monday's date, e.g. `2026-10-26`.
2. Check Metricool (brand blogId 6914479, timezone America/New_York) with getScheduledPosts for that week.
   If posts already exist there that this playbook created, stop and report (don't duplicate).
3. Pick 7 topics, never repeating one used in a previous week (see `used_topics.md`, append to it):
   - Mon: video → askvic.ai (VIC: lesson planner, parent messages, co-teacher)
   - Tue: 7-slide "Where I Learned It" origin-story carousel (see that section; the proven format)
   - Wed: video → a free tool (alternate VIC parent messages / urban student sim / H.E.L.P. parent-call rehearsal)
   - Thu: quote card from his books (debate)
   - Fri: video "Principals: What would you do?" from the private WWYD Google Doc (next scenario in its order; answer in first comment)
     → leadership sim https://www.drrobfurman.com/human-equation-suite/leadership-sim
   - Sat 10:22 AM: 7-slide parent carousel (reluctant readers, reading at home)
   - Sun: video quote from his books with one of his photos
   LinkedIn text posts Mon–Fri at 10:52 AM. IG/TikTok/FB (and YouTube Shorts on video days) at 5:52 PM.
4. Content sources (only use real material; never invent experiences, stats, or quotes):
   - `src/content_db.csv` rows from "Future Ready Challenge" and the first ~40 "Motivating the Reluctant Reader" rows
     (rows after ~#208 in the file are AI paraphrases; avoid quoting them as his words).
   - The private WWYD Google Doc (his What Would You Do? leadership deck, real scenarios with what he chose).
   - His tools: askvic.ai; drrobfurman.com/human-equation-suite (urban-student-sim, leadership-sim, parent-call, course).
   - Books: The Future Ready Challenge (ISTE bestseller), Motivating the Reluctant Reader, Engaging Young Readers,
     Reading, Technology, and Digital Literacy (ISTE).
5. Build media with the toolkit (Python PIL + ffmpeg, Inter fonts at /usr/share/fonts/opentype/inter/;
   install `fonts-inter` via apt or pip if missing):
   - `brand.py`, `icons.py` = brand system (navy #0f1b33, accent #6ea0ff, gold #f2b84b). Every graphic needs
     an illustration or one of his photos, never text only (Rob's explicit feedback).
   - Copy the pattern in `week2_images.py` / `week2_videos.py`. Videos are 1080x1920, 20–35s. Pace for reading: each scene stays up about (words ÷ 2.5) + 1.5 seconds, never less than 3s (Rob said Friday's video moved too fast to read), text beats kept
     inside x 80–940 (clear of TikTok/Reels buttons), name bar at top. Check frames visually before publishing
     (no text overlapping text or his face).
   - Mix music with `bash add_music.sh video.mp4 music.mp3 out.mp4`. Clips in music/ are ~26s; for longer videos loop with `-stream_loop -1` on the music input or use two clips.
   - Music: every video gets one of Rob's own songs from `music/` (two ~25s clips per song, `<Song>_1.mp3` / `_2.mp3`; artist "Rob Furman"). Songs: Saints in the Sunlight, One More Year of Light, Better Than I Was, This Is My Name, You're Safe Now, Already Won, One Beat I Decide, Better In The Quiet (pretty), Low Light (latin), Every Version of You (beautiful), Fire in the Rearview (country).
     Pick a mood match, don't reuse a song used the previous week. Mix:
     `ffmpeg -i v.mp4 -i music/X.mp3 -map 0:v -map 1:a -c:v copy -af "afade=t=in:d=0.6,afade=t=out:st=<dur-1.5>:d=1.5,volume=0.9" -c:a aac -b:a 160k -shortest v-m.mp4`
   - Photos in `photos/`. Don't use photos that show other identifiable adults or children as the focus.
6. Host media: copy finished files into the portfolio repo `public/social/<monday-date>/`, commit to main
   (repo DrRobF/rob-furman-portfolio), wait for the Vercel deploy, confirm URLs return 200
   (https://www.drrobfurman.com/social/<date>/<file>). The shell proxy may 403 on curl; use the GitHub
   commit status (Vercel context) to confirm the deploy instead.
7. Create every post in Metricool with `draft: true` (never schedule live without Rob's approval).
   Rules learned: Instagram video = type REEL; carousels = POST; TikTok `autoAddMusic: true` only on image posts
   (on video it returns 400); YouTube = type short, madeForKids false, category EDUCATION; Facebook video = REEL
   with title; LinkedIn carousel = publishImagesAsPDF true + documentTitle. Don't set Instagram audioConfiguration.
8. Build a review page (pattern: `build_review2.py`) and publish it as an artifact titled
   "Week of <Month D> Social Plan". Then message Rob: a short summary and that he can reply "go" to schedule.
9. Before handing the week over, check CTA coverage against the five buckets above and fix any gaps in the captions
   rather than by adding more posts. Volume is not the problem; coverage is.
10. When Rob says go: updateScheduledPost each draft with draft:false (full info JSON required; ids change after
   each update, uuids stay the same).

## Voice
Warm, plain, principal-to-teacher. Short sentences. One clear call to action per post. Captions: IG/TikTok
end with 5–6 hashtags; LinkedIn 3–4 hashtags. Say "link in bio" on IG/TikTok. No em dashes.
Formal name in bylines: Dr. Rob Furman (never "Ed.D.").

## If something blocks the run
Do as much as possible, then message Rob plainly with what's missing. Never schedule posts live without his "go".
