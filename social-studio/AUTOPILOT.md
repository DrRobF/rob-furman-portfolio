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

## Current content approach (approved by Rob; overrides anything below that conflicts) — updated 2026-11-10
Rob approved this in his "Social media analysis and content plan" conversation. Every run follows it:
1. **Facebook: free cross-post only (Rob, 2026-11-10).** Rob first dropped Facebook, then chose to keep it on as a
   zero-effort cross-post in case something breaks out. Add `facebook` to every Instagram/TikTok post
   (carousels/images = POST, videos = REEL with title). Never build anything Facebook-specific.
   **Pinterest, Threads, Bluesky: connected in Metricool 2026-11-10** (pinterestData drrobfurman, threadsData drrobf8106,
   blueskyData drrobfurman.bsky.social). Each week, as separate posts (their limits differ from IG/TikTok):
   - Pinterest: pin every carousel cover and quote card (pinTitle, pinLink to the matching drrobfurman.com page with
     utm_source=pinterest). Needs a boardId or exact board name: list Rob's boards first or ask him.
   - Threads (500 chars, images allowed): Rob's stories, short version with the carousel images; no hashtag walls.
   - Bluesky (300 chars hard limit): one story hook a day plus a question; educators there use #EduSky.
2. **LinkedIn: one post every weekday at 12:30 PM ET** (Mon-Fri, five a week, never two in a day). Before building, check
   which 12:30 slots in the target week are already taken (Rob and other sessions queue LinkedIn posts there) and fill
   only the open ones. LinkedIn posts are text only, in Rob's own voice.
3. **Personal stories over product promo.** Rob's own stories are the posts that win everywhere (band-director carousels
   ~5K TikTok views; 2 AM alarm 61K LinkedIn impressions). Tool promo videos sit at 50-130 views. Lead with a real story
   or real dilemma most days and tie the tool/product to it; never lead with the product. Stories must be Rob's own words:
   ask him for one when the story bank is empty instead of filling the week with quote cards.
4. **Links never go in the post body.** The link goes in the first comment, with utm_source/utm_campaign.
The calls-to-action rule (all five buckets each week) still applies.
5. **Biggest hit so far (2026-11-05):** the cruise/school-board band-director carousel passed 50,000 TikTok views, about
   400x his median. Shape: Rob's real story, a parent who went over his head to the school board, band-community tags.
   Every week should carry at least one carousel built this way when Rob has a story for it.

## Book titles and Amazon links (from Rob, 2026-11-10)
- "Motivating the Reluctant Reader" IS "Technology, Reading & Digital Literacy" (ISTE changed the title). The content_db
  rows marked Motivating the Reluctant Reader come from it. In captions, name the published title so people can find it:
  "my book Technology, Reading & Digital Literacy". Never send parents to a book title they can't buy.
- Amazon: Future Ready Challenge 1564843858; Technology, Reading & Digital Literacy 1564843580; Personalized Reading
  1564846873; Engaging Young Readers B0FR9RN3S3; interview book B0CHPP7W5T "Professional Interview Secrets: The
  Insider's Guide to Acing Your Job Interview" (manuscript title was "So, You Think You Want to Teach?"); urban education
  book B0CHQTKDGZ "From City Streets to The Classroom: A Tale of Urban Education" (Rob shared the manuscript 2026-11-10; keep it
  out of this repo). It is the source of the free urban-student simulation: Adam, seventh grade, one school day, 10
  chapters, each ending with discussion questions. Urban-sim posts now sell the book in the caption and put the free sim in
  the first comment. Rob's own story in its intro (usable, his words): in 2000 he took a job as the music teacher in a
  Pittsburgh city middle school; kids told him "You'll never last"; the drums were his way in; he built a stomp group and a
  dance choir, kids stayed an hour or two after school, they toured local universities and won the Charles Gray Award for
  Specialty Achievement in Arts Education. Do NOT use the book's details about student suicides, murders or pregnancy in
  social posts. All six have Buy on Amazon buttons on /publications since 2026-11-10.
- Interview book = CTA for the weekly "Interview Files" series (Rob's interview stories + one tip). The manuscript is a
  paid product: never commit it to this public repo. Rob was asked to put the PDF in his Drive "Claude" folder.

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
   go to Instagram, TikTok, YouTube and Facebook (Facebook as a free cross-post). One LinkedIn post per weekday at 12:30 PM.
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
- Gigging musician: drummer snare-rip story (USED, extra post Sun 2026-11-01, drummer-snare carousel; Rob’s five lessons: project-based band, celebrate wins, shared language, love the work, never grade practice as performance). Other angles still open: songwriting, guitar → #songwriter #musicianlife #gigging
- His father was also a principal (he references this himself in WWYD Scenario 05) → #principalsofinstagram #schoolleaders
- Two-time TEDx speaker → #tedx #publicspeaking #speaker
- Guitar player and teacher (see the guitar pages on drrobfurman.com) → #guitarist #guitarlessons #guitarteacher
- Twenty years in administration as a principal → #principallife #elementaryschool

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
   LinkedIn text posts in any open Mon–Fri 12:30 PM slot. IG/TikTok/Facebook (and YouTube Shorts on video days) at 5:52 PM.
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
   (on video it returns 400); YouTube = type short, madeForKids false, category EDUCATION; Facebook video = REEL with title; LinkedIn carousel = publishImagesAsPDF true + documentTitle. Don't set Instagram audioConfiguration.
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
Experience, confirmed by Rob 2026-10-15: **20 years total in administration as a principal.** Say "20 years as a
principal" or "20 years in school administration". Do not write "16 years"; that figure in an older post is wrong.

## If something blocks the run
Do as much as possible, then message Rob plainly with what's missing. Never schedule posts live without his "go".

## Operating mandate and network strategy (2026-10-16, from Rob)
Rob gave full authority to act as his SEO and social media manager: delete or replace whatever is not working, add or fix
whatever is needed. Goals: followers, become the top education influencer in the country, and sell everything from
Ask VIC to the Gumroad products. Content is made by asking Rob a question, then building from his real answers only.
Tell Rob when graphics or video are needed from him (he is setting up a talking-head studio; wants a better background).

Numbers behind the strategy (Sep 10 - Oct 16 2026):
- Winners everywhere are story, emotion or opinion posts. Product announcements get about 85-120 TikTok views and 0 likes.
- TikTok: 131 followers and rising. Best: band carousel 3.6K, "2:07 AM" student-day video 873, AI hot take 856. Peak times weekdays 10 AM and 6 PM (Wed/Thu best); weekends about half.
- LinkedIn: 10.3K followers but scheduled posts reach 15-50. Rob's own text post reached 1,251. Text-only, own voice, link in first comment; one post per weekday at 12:30 (superseded the old 4-a-week cap on 2026-11-10); carousels at most 1 a week.
- YouTube Shorts: leadership-under-pressure dilemmas did best (1,065 and 234 views).
- Instagram: 87 followers, flat; 5-150 views. Mirror TikTok winners only. Facebook: reach 0-3; kept as a free auto cross-post only.
- X (@drfurman, via Buffer, Buffer org My Organization): 16.6K followers, 14.8K following, reach 100-300 per post (about 1%). Best: Rob's own real-moment post (1,204). Link posts and video promos are weakest. Buffer free plan: 3 channels (X, LinkedIn, YouTube), 10 queued posts, 280 char limit. Queue X one week at a time, 1-2 text-only posts a day at 8-10 AM ET, no link in the post, #edchat. Do not post LinkedIn or YouTube through Buffer (Metricool owns those).
- Metricool brand 6914479 has no X. X is posted through Buffer (create_post with customScheduled).
- Every week: fill all open TikTok weekday 10 AM and 6 PM slots with story/opinion posts; tie a tool to a story, never lead with the product.

## Gumroad is connected (2026-11-02)
- Use the Gumroad connector (list_sales, get_analytics with breakdown=referrer) every run and put sales at the top of the review page.
- First tracked sales: Sat 2026-10-31 9:16 AM ET, one buyer from a school-leadership organization bought What Would You Do? ($19)
  and the Difficult Conversations Prep Kit ($12) together. It came before that day's posts went out, so the likely source is Fri 10-30
  "Birthday Cookies" WWYD (LinkedIn 12:30 PM: 1,261 impressions / 875 reach; TikTok 1,033 views). WWYD posts sell the deck; keep them weekly.
- Mention the Difficult Conversations Prep Kit beside the WWYD deck now and then (same buyer bought both).
- Put utm_source/utm_campaign on every link Claude posts so sources show up.

## Rob story bank (his own words, unused)
- Piggyback songs: his mom (an educator) writes songs over famous melodies (Twinkle Twinkle = ABCs). Playing a gig ~6 PM at a local dinner place, a current student came in with family; Rob played a piggyback song for him. Student loved it, rest of audience thought he was crazy. USE for Wed music post (TikTok + LinkedIn).
- His dad the principal (Rob's own words, 2026-10-22), USED Tue 2026-11-10 (all three lessons) "Where I Learned It" carousel:
  1. "The power of pizza": his dad bribed Rob's friends with lunch to help at his school. Rob didn't know it was a management tactic. For the price of lunch he got a lot of work out of them.
  2. "Kiss your ducks in the morning, your day is bound to get better": don't let the rough or ugly things hang; get them done and behind you. Wording confirmed by Rob. He may have said "ugly ducks" but isn't sure, so quote it without "ugly".
  3. Plowing the garden (his dad was a farmer's kid): if you watch your feet the plow line is super crooked; look way out to where you're aiming and the line is straight. About goals: look ahead, not straight down.
  Only three lessons so far; use a 3-lesson carousel or ask Rob for two more. Tribe: principals' kids / teachers' kids (#principalskid #teacherskid #schoolleaders).
- Still to ask: guitar/songwriting story; parent-quote question.

## Analytics snapshot 2026-10-20 (Oct 12-20)
- TikTok views: band-director carousel 4,140 (341 likes, 33 shares); urban-student sim video 889; what-would-you-do video 829; grades carousel 711; reluctant-readers carousel 469; drum carousel 406. Promo/story VIDEOS mostly 98-127 (factory 98, elevator 119, WRDR 127, fiction 124). Carousels beat animated videos ~10x.
- LinkedIn: scheduled posts with video/doc get 27-57 impressions; the personal-news text post got 1,523 impressions (22 reactions). Text-only personal posts win.
- X (Buffer): 7 posts, 2,496 impressions (~350/post), 0 link clicks. Best: pointed ask with @tags (1,226).
- IG: band carousel 239 views / 172 reach / 3 follows; everything else under ~110 views.
- YouTube Shorts: 4-191 views (urban student 191).
- No clicks measurable anywhere. No Gumroad connector, so sales are invisible from here.
- Products (Gumroad, drrobfurman.gumroad.com): Teacher Directed AI Prompts $12, What Would You Do? 12 Scenarios $19, Principal AI Starter Kit $29, Difficult Conversations Prep Kit $12, Music + AI Creativity Bundle $19.
- Rob's new assets in Drive folder "Claude" (Oct 18-19): real drum-room photos (IMG_1995/1996), beach sunrise photos (IMG_1984/1985), ~14 MOV clips (IMG_1970-1999, not yet reviewed), AI school scene images.
