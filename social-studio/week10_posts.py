# Week of 2026-12-07 captions and post plan (built 2026-11-19). Every post is created in Metricool as a DRAFT.
import json
MON = '2026-12-07'
B = f'https://www.drrobfurman.com/social/{MON}/'
S = 'https://www.drrobfurman.com'
TZ = 'America/New_York'
U = lambda url, day, src='social': f"{url}{'&' if '?' in url else '?'}utm_source={src}&utm_campaign=wk{MON}-{day}"
PUB, SIM, SPEAK = S + '/publications', S + '/human-equation-suite/leadership-sim', S + '/speaking'
WWYD, REG, URB, DCK = S + '/resources/what-would-you-do', S + '/human-equation-suite/course/regulation-under-pressure', S + '/human-equation-suite/urban-student-sim', S + '/resources/difficult-conversations-prep-kit'

days = [
 dict(day='Mon Dec 7', date='2026-12-07', time='10:00', cta='Books (Professional Interview Secrets)', label='Interview Files #3: word vomit (carousel)',
      title='A Candidate Talked So Long I Zoned Out',
      kind='carousel', media=[f'mon-vomit-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="A teacher candidate talked so long, I zoned out. In my own interview. \U0001F635\n\nI asked her a question she clearly didn't know how to answer. So she just started talking. And talking.\n\nWhen she finally stopped, my colleague had to prompt me to ask the next question.\n\nSwipe for why it happens, and the 3-step answer that keeps you from ever doing it. \U0001F449\n\nPrincipals and hiring committees: what's the longest answer you've ever sat through? \U0001F447\n\nMore stories from my years of hiring teachers are in my book Professional Interview Secrets. Link in bio.\n\n#teacherinterview #newteacher #teacherjobs #teachersoftiktok #teachertok #principallife",
      first_comment="Professional Interview Secrets and my other books: " + U(PUB, 'mon')),
 dict(day='Mon Dec 7', date='2026-12-07', time='17:52', cta='VIC tool', label="Video: teach them the way they need to learn (VIC lesson planner)", song='One Beat I Decide',
      kind='video', media=['mon-taught-m.mp4'], cover='mon-taught-cover.jpg', networks=['instagram', 'tiktok', 'youtube', 'facebook'],
      title="Don't Teach the Way You Were Taught",
      text="\"Don't teach your students the way you were taught; teach them the way they need to learn!\" \U0001F4A1\n\nThat's from my book The Future Ready Challenge.\n\nTeachers: what's one thing from your own school days you swore you'd never do to your students? \U0001F447\n\nGive VIC your standard and tell it about your students. It drafts a lesson built for them. You review it, you change it, and it's still your lesson.\n\nFree for teachers: askvic.ai (link in bio)\n\n#teachersoftiktok #teachertok #lessonplanning #teachersofinstagram #edtech #futureready",
      first_comment="Try VIC's free lesson planner: " + U('https://askvic.ai/', 'mon')),
 dict(day='Tue Dec 8', date='2026-12-08', time='17:52', cta='Speaking', label='Hot take from the interview table: the smartboard (carousel)',
      title='A Smartboard Is a Glorified Chalkboard',
      kind='carousel', media=[f'tue-smart-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="40 of my last 60 teacher candidates told me the same thing about technology: \"We have a smartboard.\" \U0001F5A5️\n\nHere's my honest take. A smartboard is nothing but a glorified chalkboard unless you're using its interactive features.\n\nSwipe for what I actually want to hear about technology. \U0001F449\n\nTeachers, be honest: what does your smartboard do most days? Tech coaches, tell me what you see. \U0001F447\n\nI bring this conversation to schools in my keynotes and staff workshops. Link in bio.\n\n#smartboard #edtech #edtechcoach #teachersoftiktok #teachertok #teachersofinstagram",
      first_comment="Keynotes and school workshops: " + U(SPEAK, 'tue') + "\n\nMore from my years on the hiring side of the table is in Professional Interview Secrets: " + U(PUB, 'tue')),
 dict(day='Wed Dec 9', date='2026-12-09', time='17:52', cta='H.E.L.P. tool', label='Video: Regulation Under Pressure, the hallway with phones out (H.E.L.P. course)', song="You're Safe Now",
      kind='video', media=['wed-hallway-m.mp4'], cover='wed-hallway-cover.jpg', networks=['instagram', 'tiktok', 'youtube', 'facebook'],
      title='A Student Is Yelling. Phones Are Out. What Do You Do?',
      text="School leaders: A, B, C or D? \U0001F4F1\n\nA student starts yelling in the hallway. Phones come out. Staff are watching.\n\nA. Issue a firm public command immediately.\nB. Lower your voice, reduce crowd stimulus, then set a boundary.\nC. Pull the student aside before naming the boundary.\nD. Hand off to security and step back.\n\nComment your letter. \U0001F447\n\nThis is from Regulation Under Pressure, a free module in my H.E.L.P. course for school leaders. Pressure changes your pace before it changes your words. Link in bio.\n\n#principallife #schoolleadership #assistantprincipal #deescalation #teachersofinstagram #teachertok",
      first_comment="Regulation Under Pressure, free in my H.E.L.P. course: " + U(REG, 'wed')),
 dict(day='Thu Dec 10', date='2026-12-10', time='17:52', cta='Books', label="Quote card: even tomorrow's middle class will be entrepreneurs (debate)",
      title='Should Schools Teach Entrepreneurship?',
      kind='image', media=['thu-entre-quote.jpg'], networks=['instagram', 'tiktok', 'facebook'],
      text="\"Even tomorrow's middle class will be entrepreneurs.\" \U0001F4A1\n\nI wrote that in The Future Ready Challenge. We need students who can answer the question: what does the world need next?\n\nSo should every student learn entrepreneurship in school, or is that a job for later? Agree or disagree? Tell me below \U0001F447\n\nThe Future Ready Challenge and my other books: link in bio.\n\n#entrepreneurship #futureready #teachersofinstagram #teachertok #teachersoftiktok #education",
      first_comment="My books for teachers and leaders: " + U(PUB, 'thu')),
 dict(day='Fri Dec 11', date='2026-12-11', time='17:52', cta='Paid product (WWYD deck)', label='What would you do? Scenario 08, The Vendor Table (carousel; video on YouTube)', song='Fire in the Rearview',
      title='Principals: What Would You Do? The Vendor Table', kind='carousel', media=[f'fri-vendor-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="Principals and teachers: what would you do? \U0001F914\n\nThe PTA president asks if her friend can sell merchandise at the school carnival fundraiser. Private sales aren't allowed. The superintendent confirms it. You say no.\n\nCarnival day: the friend shows up with a table anyway. She says the PTA president told her, \"He will not even realize you are here.\"\n\nThe person who should protect the boundary went around it. What's your move? Comment your call. What I chose is in the first comment.\n\nThis is one of 12 real scenarios in my What Would You Do? 12 School Leadership Scenarios deck, where you make the call before you see how I handled it. Link in bio.\n\n#principallife #schoolleadership #pta #whatwouldyoudo #assistantprincipal #teachertok",
      first_comment="What I chose: I asked the vendor to leave. At the next PTA meeting I told the president plainly that going behind my back had damaged my confidence in our partnership. The larger PTA board learned what happened and asked her to step down. That was the group's decision, not mine.\n\nTrust is built when people know the rules apply even to those with influence.\n\nPractice decisions like this free: " + U(SIM, 'fri') + "\n\nThat PTA meeting was a hard conversation. My Difficult Conversations Prep Kit: " + U(DCK, 'fri'),
      youtube=dict(media=['fri-vendor-m.mp4'], cover='fri-vendor-cover.jpg', title='Principals: What Would You Do? The Vendor Table',
                   text="The PTA president's friend was told no. She showed up at the school carnival with a vendor table anyway, because the PTA president said \"he will not even realize you are here.\" What's your move? Comment your call.\n\nThis is one of 12 real scenarios in What Would You Do? 12 School Leadership Scenarios: " + U(WWYD, 'fri', 'youtube') + "\n\n#principal #schoolleadership #whatwouldyoudo")),
 dict(day='Sat Dec 12', date='2026-12-12', time='10:22', cta='Books', label="Parents: who's marketing the books? (holiday carousel)",
      title="The Toy Ads Are Loud. Who's Marketing the Books?",
      kind='carousel', media=[f'sat-gift-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="The toy ads are loud this month. Who's marketing the books? \U0001F381\U0001F4DA\n\nIn my book Technology, Reading & Digital Literacy I wrote: \"Books are not marketed with the same intensity as entertainment media.\"\n\nSo this season, you be the marketer. Swipe for 4 ways to make a book feel like the best gift of the season. Save this, and share it with a parent who needs it. ❤️\n\nMy books for parents and teachers: link in bio.\n\n#parentingtips #reluctantreaders #raisingreaders #booksasgifts #literacy #momsofinstagram",
      first_comment="Technology, Reading & Digital Literacy and my other books: " + U(PUB, 'sat')),
 dict(day='Sun Dec 13', date='2026-12-13', time='17:52', cta='Speaking', label='Video quote: they can take responsibility for their learning (TED4 stage photo)', song='One More Year of Light',
      kind='video', media=['sun-trust-m.mp4'], cover='sun-trust-cover.jpg', networks=['instagram', 'tiktok', 'youtube', 'facebook'],
      title='They Can Take Responsibility for Their Learning',
      text="\"I trust the process and communicate to my students that I believe they can take responsibility for their learning.\"\n\nFrom my book The Future Ready Challenge.\n\nWhat's one thing you handed over to your students that they surprised you with? \U0001F447\n\nI bring this message to schools and conferences as a keynote. Speaking: link in bio.\n\n#futureready #teachersofinstagram #teachertok #studentagency #schoolleadership #tedx",
      first_comment="Keynotes and school workshops: " + U(SPEAK, 'sun')),
]

linkedin = [
 dict(day='Mon Dec 7', date='2026-12-07', cta='Books (Professional Interview Secrets)',
      text="I once had a teacher candidate who, when I asked a question she clearly didn't know how to answer, just began talking. And talking.\n\nIt was so bad that when she finally stopped, my colleague had to prompt me to ask the next question. I had completely zoned out.\n\nWord vomit usually happens when you don't know the answer. You start fishing, throwing everything out there in hopes that something satisfies the question.\n\nStories and details belong in a good interview. The problem is going off topic and never wrapping up.\n\nThe safe formula: answer the question, relate it to an experience from your classroom, and conclude. And read the room. If your interviewer is glazing over, you may be in the middle of a word vomit.\n\nPrincipals: what's the longest answer you've ever sat through?\n\n#TeacherInterview #Education #Hiring #K12",
      first_comment="More stories and tips like this are in my book Professional Interview Secrets: " + U(PUB, 'mon-li', 'linkedin')),
 dict(day='Tue Dec 8', date='2026-12-08', cta='Speaking',
      text="Of the last 60 teacher interviews I conducted, I would safely say at least 40 candidates told me they had a smartboard.\n\nLet's be clear. A smartboard is nothing but a glorified chalkboard unless you're taking advantage of its many interactive features.\n\nSame with apps and websites. Showing your students a video doesn't equal implementing technology in your classroom. It's no different than when teachers showed film strips years ago.\n\nWhat I want to hear instead: the technology that's been a game changer in your classroom. The site or app you infused into a lesson to create a unique, innovative experience for your students.\n\nAnd be ready for the real questions. How did it increase your students' digital age skills? How are your students being creative with it?\n\nIf you don't have that experience yet, it's time to go get some.\n\nSchool leaders: what do you listen for when a candidate talks about technology?\n\n#EdTech #TeacherInterview #SchoolLeadership #Education",
      first_comment="I bring this conversation to schools in my keynotes and staff workshops: " + U(SPEAK, 'tue-li', 'linkedin')),
 dict(day='Wed Dec 9', date='2026-12-09', cta='H.E.L.P. tool', poll=dict(
          question="A student is yelling in the hallway. Phones are out and staff are watching. What's your first move?",
          options=['Firm public command now', 'Lower voice, clear the crowd', 'Pull the student aside first', 'Hand off to security']),
      text="Pressure changes your pace before it changes your words.\n\nA student starts yelling in the hallway. Phones come out. Staff are watching.\n\nIn that moment, pressure tempts a leader to match the volume to prove control.\n\nBut authority and volume are two different things. A quieter voice can become the strongest authority signal in a loud space.\n\nSchool leaders: what's your first move?\n\n#SchoolLeadership #Principals #Deescalation #K12",
      first_comment="This scenario comes from Regulation Under Pressure, a free module in my H.E.L.P. course for school leaders: " + U(REG, 'wed-li', 'linkedin')),
 dict(day='Thu Dec 10', date='2026-12-10', cta='Books (From City Streets to The Classroom)',
      text="There's a stereotype about teaching jobs in city schools: \"I couldn't get a job in a good school, so this is my second choice.\"\n\nIn my book From City Streets to The Classroom, I wrote that educators and administrators must not let that notion infiltrate their minds. If we view these jobs as temporary until something better comes along, we perpetuate the stereotype.\n\nThe kids notice. When I started as the music teacher in a Pittsburgh city middle school, students told me, \"You'll never last.\" They had watched too many adults leave.\n\nThe kids in city schools need great teachers more than anyone. We should expect nothing but the highest quality teachers, because our kids need it.\n\nPrincipals: how do you keep great teachers in the buildings that need them most?\n\n#UrbanEducation #SchoolLeadership #TeacherRetention #Education",
      first_comment="From City Streets to The Classroom: " + U(PUB, 'thu-li', 'linkedin') + "\n\nWalk one student's whole school day in my free simulation: " + U(URB, 'thu-li', 'linkedin')),
 dict(day='Fri Dec 11', date='2026-12-11', cta='Paid product (WWYD deck)',
      text="The PTA president asked if her friend could sell merchandise at our school carnival fundraiser.\n\nPrivate sales weren't allowed. The superintendent confirmed it. I said no.\n\nOn carnival day, the friend showed up with a table anyway. She told us the PTA president had said, \"He will not even realize you are here.\"\n\nI asked the vendor to leave.\n\nAt the next PTA meeting, I told the president plainly that going behind my back had damaged my confidence in our partnership. The larger PTA board learned what happened and asked her to step down. That was the group's decision, not mine.\n\nTrust is built when people know the rules apply even to those with influence.\n\nPrincipals: what do you do when the person who should protect a boundary is the one who goes around it?\n\n#SchoolLeadership #Principals #PTA #K12",
      first_comment="This is one of the 12 scenarios in my What Would You Do? deck for leadership teams and PD: " + U(WWYD, 'fri-li', 'linkedin')),
]

tb = [  # Threads + Bluesky, <= 300 chars, one a day
 ('2026-12-07T18:30', 'mon-vomit-1.jpg', "I asked a teacher candidate a question she couldn't answer. She talked until I zoned out, and my colleague had to prompt me to ask the next one. The fix: answer it, relate it to an experience, then conclude. Longest interview answer you've sat through? #EduSky"),
 ('2026-12-08T18:30', 'tue-smart-1.jpg', "Of my last 60 teacher interviews, at least 40 candidates told me they had a smartboard. A smartboard is a glorified chalkboard unless you use its interactive features. Tell me what your students did with it. What does yours do most days? #EduSky"),
 ('2026-12-09T18:30', 'wed-hallway-cover.jpg', "A student is yelling in the hallway. Phones are out. Staff are watching. Firm public command, lower your voice and clear the crowd, pull the student aside, or hand off to security? Pressure changes your pace before it changes your words. #EduSky"),
 ('2026-12-10T18:30', 'thu-entre-quote.jpg', "\"Even tomorrow's middle class will be entrepreneurs.\" From my book The Future Ready Challenge. Should every student learn entrepreneurship in school, or is that a job for later? #EduSky"),
 ('2026-12-11T18:30', 'fri-vendor-1.jpg', "The PTA president's friend was told no vendor table at the school carnival. She showed up with one anyway: \"He will not even realize you are here.\" Principals: what's your move when the person who should protect a rule goes around it? #EduSky"),
 ('2026-12-12T11:30', 'sat-gift-1.jpg', "Parents: the toy ads are loud this month. Who's marketing the books? \"Books are not marketed with the same intensity as entertainment media.\" Be the book's commercial: tell your child why you picked it, wrap it, read chapter one together. #EduSky"),
 ('2026-12-13T18:30', 'sun-trust-cover.jpg', "\"I trust the process and communicate to my students that I believe they can take responsibility for their learning.\" From The Future Ready Challenge. What did you hand over to students that surprised you? #EduSky"),
]
P_R, P_L, P_C, P_T = 'Reluctant Readers: Tips for Parents', 'School Leadership', 'Classroom Ideas', 'Free Teacher Tools'
pins = [  # (when, image, board, title, description, link)
 ('2026-12-07T09:15', 'mon-vomit-1.jpg', P_L, 'Teacher interview tip: avoid word vomit', "A real story from my years of hiring teachers, and the 3-step answer formula: answer it, relate it to an experience, conclude. From Professional Interview Secrets.", PUB),
 ('2026-12-08T09:15', 'tue-smart-1.jpg', P_C, 'A smartboard is a glorified chalkboard (unless...)', "What 40 of my last 60 teacher candidates said about technology, and what principals actually want to hear.", SPEAK),
 ('2026-12-09T09:15', 'wed-hallway-cover.jpg', P_T, 'Hallway escalation: a free de-escalation scenario for school leaders', "A student is yelling, phones are out. Four responses, real tradeoffs. Free in the H.E.L.P. course: Regulation Under Pressure.", REG),
 ('2026-12-10T09:15', 'thu-entre-quote.jpg', P_C, "Even tomorrow's middle class will be entrepreneurs", "A quote from my book The Future Ready Challenge. Should schools teach entrepreneurship?", PUB),
 ('2026-12-11T09:15', 'fri-vendor-1.jpg', P_L, 'Principals: what would you do? The vendor table', "The PTA president's friend sets up a vendor table after being told no. A real scenario from my leadership deck.", WWYD),
 ('2026-12-12T09:15', 'sat-gift-1.jpg', P_R, 'Holiday reading tip: be the book\'s commercial', "4 ways to make a book feel like the best gift of the season. From Technology, Reading & Digital Literacy.", PUB),
 ('2026-12-13T09:15', 'mon-taught-cover.jpg', P_T, "Don't teach the way you were taught", "Free VIC lesson planner: give it your standard and your students, and it drafts a lesson built for them.", 'https://askvic.ai/'),
]


def base(dt, text, media, providers, first=''):
    return dict(draft=True, autoPublish=True, text=text, firstCommentText=first, media=media, providers=[{'network': n} for n in providers],
                publicationDate={'dateTime': dt + ':00', 'timezone': TZ}, shortener=False, descendants=[], smartLinkData={'ids': []})


posts = []
for d in days:
    dt = f"{d['date']}T{d['time']}"
    info = base(dt, d['text'], [B + m for m in d['media']], d['networks'], d['first_comment'])
    vid = d['kind'] == 'video'
    info['instagramData'] = {'type': 'REEL' if vid else 'POST'}
    info['tiktokData'] = {'autoAddMusic': not vid, 'privacyOption': 'PUBLIC_TO_EVERYONE', 'title': d['title'][:90]}
    info['facebookData'] = {'type': 'REEL', 'title': d['title']} if vid else {'type': 'POST'}
    if 'youtube' in d['networks']:
        info['youtubeData'] = {'title': d['title'], 'type': 'short', 'privacy': 'public', 'madeForKids': False, 'category': 'EDUCATION'}
    if vid:
        info['videoThumbnailUrl'] = B + d['cover']
    posts.append((f"{d['day']} {d['time']} {d['label']}", dt, info))
    if isinstance(d.get('youtube'), dict):
        y = d['youtube']
        yi = base(dt, y['text'], [B + m for m in y['media']], ['youtube'])
        yi['youtubeData'] = {'title': y['title'], 'type': 'short', 'privacy': 'public', 'madeForKids': False, 'category': 'EDUCATION'}
        yi['videoThumbnailUrl'] = B + y['cover']
        posts.append((f"{d['day']} {d['time']} WWYD video (YouTube only)", dt, yi))
for l in linkedin:
    dt = f"{l['date']}T12:30"
    li = base(dt, l['text'], [], ['linkedin'], l['first_comment'])
    if 'poll' in l:
        assert len(l['poll']['question']) <= 140 and all(len(o) <= 30 for o in l['poll']['options'])
        li['linkedinData'] = {'type': 'poll', 'previewIncluded': False, 'poll': {'question': l['poll']['question'],
                              'options': [{'text': o} for o in l['poll']['options']], 'settings': {'duration': 'THREE_DAYS'}}}
    else:
        li['linkedinData'] = {'type': 'post', 'previewIncluded': False}
    posts.append((f"{l['day']} 12:30 LinkedIn", dt, li))
for when, img, text in tb:
    assert len(text) <= 300, (when, len(text))
    i = base(when, text, [B + img], ['threads', 'bluesky'])
    i['threadsData'] = {}; i['blueskyData'] = {'postLanguages': ['en']}
    posts.append((f"{when} Threads+Bluesky", when, i))
for when, img, board, title, desc, link in pins:
    assert len(title) <= 100
    i = base(when, desc, [B + img], ['pinterest'])
    i['pinterestData'] = {'boardId': board, 'pinTitle': title, 'pinLink': U(link, 'pin-' + img[:-4], 'pinterest'), 'pinNewFormat': True}
    posts.append((f"{when} Pinterest: {title}", when, i))
for p in posts:
    assert '—' not in p[2]['text'] and '—' not in p[2].get('firstCommentText', ''), p[0]
json.dump(dict(base=B, days=days, linkedin=linkedin, threads_bluesky=tb, pins=pins), open('/home/claude/social/week10_posts.json', 'w'), indent=1, ensure_ascii=False)
json.dump(posts, open('/home/claude/social/week10_metricool.json', 'w'), indent=0, ensure_ascii=False)
print(len(posts), 'posts; max tb', max(len(t[2]) for t in tb))
for p in posts: print(p[0][:90])
