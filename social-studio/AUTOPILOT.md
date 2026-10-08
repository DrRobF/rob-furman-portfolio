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

## What each run does
1. Work out the target week: the Monday 9 days after the run (runs fire Saturday morning, so the target week starts
   the Monday after next). Folder name = that Monday's date, e.g. `2026-10-26`.
2. Check Metricool (brand blogId 6914479, timezone America/New_York) with getScheduledPosts for that week.
   If posts already exist there that this playbook created, stop and report (don't duplicate).
3. Pick 7 topics, never repeating one used in a previous week (see `used_topics.md`, append to it):
   - Mon: video → askvic.ai (VIC: lesson planner, parent messages, co-teacher)
   - Tue: 7-slide carousel for teachers/leaders (follows, saves)
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
   - Copy the pattern in `week2_images.py` / `week2_videos.py`. Videos are 1080x1920, ~20s, text beats kept
     inside x 80–940 (clear of TikTok/Reels buttons), name bar at top. Check frames visually before publishing
     (no text overlapping text or his face).
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
9. When Rob says go: updateScheduledPost each draft with draft:false (full info JSON required; ids change after
   each update, uuids stay the same).

## Voice
Warm, plain, principal-to-teacher. Short sentences. One clear call to action per post. Captions: IG/TikTok
end with 5–6 hashtags; LinkedIn 3–4 hashtags. Say "link in bio" on IG/TikTok. No em dashes.
Formal name in bylines: Dr. Rob Furman (never "Ed.D.").

## If something blocks the run
Do as much as possible, then message Rob plainly with what's missing. Never schedule posts live without his "go".
