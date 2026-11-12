# Week of 2026-11-23 captions and post plan (built 2026-11-12). Every post is created in Metricool as a DRAFT.
import json
MON = '2026-11-23'
B = f'https://www.drrobfurman.com/social/{MON}/'
S = 'https://www.drrobfurman.com'
TZ = 'America/New_York'
U = lambda url, day, src='social': f"{url}{'&' if '?' in url else '?'}utm_source={src}&utm_campaign=wk{MON}-{day}"
PUB, SIM, URB = S + '/publications', S + '/human-equation-suite/leadership-sim', S + '/human-equation-suite/urban-student-sim'
WWYD, BUNDLE, CALL, SPEAK = S + '/resources/what-would-you-do', S + '/resources/music-ai-creativity-bundle', S + '/human-equation-suite/parent-call', S + '/speaking'

days = [
 dict(day='Mon Nov 23', date='2026-11-23', time='10:00', cta='Books (Professional Interview Secrets)', label='Interview Files #1: the buzz-word list (carousel)',
      kind='carousel', media=[f'mon-buzz-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="A teacher candidate brought a list of buzz words to my interview. Then read from it. \U0001F4CB\n\nEvery time I asked a question, he looked down at the list, even when the word didn't fit.\n\nSwipe for what I'm actually listening for, and a one-line formula for a real answer.\n\nTeachers on the job hunt: what's the hardest interview question you've gotten? \U0001F447\n\nMore stories from my years of hiring teachers are in my book Professional Interview Secrets. Link in bio.\n\n#teacherinterview #newteacher #studentteacher #teachersoftiktok #teachertok #teachersofinstagram",
      first_comment="Professional Interview Secrets and my other books: " + U(PUB, 'mon')),
 dict(day='Mon Nov 23', date='2026-11-23', time='17:52', cta='VIC tool', label='Video: "crazy, weird lesson" (VIC lesson planner)', song='One Beat I Decide',
      kind='video', media=['mon-weird-m.mp4'], cover='mon-weird-cover.jpg', networks=['instagram', 'tiktok', 'youtube', 'facebook'],
      title="What's the Weirdest Lesson You Ever Taught?",
      text="What's the weirdest lesson you ever taught? \U0001F680\n\nIn The Future Ready Challenge I wrote: \"Don't be afraid to take a risk! If it sounds like a crazy, weird lesson, it probably is, and that's okay.\"\n\nStuck on what the weird version would even look like? Give VIC your standard and ask for the version your students won't see coming. You review it, you change it, and it's still your lesson.\n\nFree for teachers: askvic.ai (link in bio)\n\n#teachersoftiktok #teachertok #lessonplanning #teachersofinstagram #edtech #futureready",
      first_comment="Try VIC's free lesson planner: " + U('https://askvic.ai/', 'mon')),
 dict(day='Tue Nov 24', date='2026-11-24', time='17:52', cta='Books (From City Streets to The Classroom)', label="Where I Learned It: the music teacher they said wouldn't last (carousel)",
      kind='carousel', media=[f'tue-streets-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="Before I was a principal, I was the music teacher they said wouldn't last. \U0001F941\n\n2000. A Pittsburgh city middle school. My first few weeks, I kept hearing it: \"You'll never last.\" Most teachers didn't.\n\nMy way in was the drums. Swipe for what we built. \U0001F449\n\nMusic teachers: what was your way in with the kids who expected you to leave? Former band kids: tag the teacher who stayed. \U0001F447\n\nThe whole story is in my book From City Streets to The Classroom. Link in bio.\n\n#musiceducation #urbaneducation #musicteacher #teachersoftiktok #teachertok #teachersofinstagram",
      first_comment="From City Streets to The Classroom: " + U(PUB, 'tue') + "\n\nWalk one urban student's school day in my free simulation, built from the book: " + U(URB, 'tue')),
 dict(day='Wed Nov 25', date='2026-11-25', time='10:00', cta='Paid product (Music + AI Creativity Bundle)', label='Music + AI: how I use AI in songwriting (carousel)',
      title="I'm a principal who writes songs. Here's how I use AI", kind='carousel', media=[f'wed-songs-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="I'm a principal who writes songs. Here's how I use AI without letting it write for me. \U0001F3B5\n\nIt cleans up my rhymes. It does syllable passes so the lines actually sing. Sometimes it offers an opinion on quality. The song is still mine.\n\nSo I built a grades 6-8 songwriting unit where students stay the authors, and AI is optional. Swipe for how it works.\n\nMusic teachers: is AI welcome in your songwriting units? \U0001F447\n\nThe Music + AI Creativity Bundle: link in bio.\n\n#musicteacher #musiceducation #middleschoolmusic #songwriting #teachersoftiktok #teachertok",
      first_comment="The Music + AI Creativity Bundle (grades 6-8 songwriting unit): " + U(BUNDLE, 'wed')),
 dict(day='Wed Nov 25', date='2026-11-25', time='17:52', cta='H.E.L.P. tool', label='Video: three parent-call temperatures (H.E.L.P. Parent Call Rehearsal)', song='Already Won',
      kind='video', media=['wed-heat-m.mp4'], cover='wed-heat-cover.jpg', networks=['instagram', 'tiktok', 'youtube', 'facebook'],
      title='Moderate, High, or Full Blaze? Practice the Parent Call',
      text="Not every parent call starts at the same temperature. \U0001F4DE\n\nModerate: frustrated, still collaborative.\nHigh: defensive and distrustful.\nFull Blaze: accusatory, intense urgency.\n\nWhich one do you need to practice? Tell me below. \U0001F447\n\nParent Call Rehearsal lets you practice with a realistic AI parent at the level you pick, then coaches you on tone, trust, and next steps. The AI parent can speak English, Spanish, Haitian Creole or Portuguese. Free in my H.E.L.P. suite. Link in bio.\n\n#principallife #schoolleadership #assistantprincipal #parentcommunication #teachersofinstagram #teachertok",
      first_comment="Practice a parent call free: " + U(CALL, 'wed')),
 dict(day='Thu Nov 26', date='2026-11-26', time='17:52', cta='Books', label='Quote card: two places at once (Thanksgiving debate)',
      kind='image', media=['thu-twoplaces-quote.jpg'], networks=['instagram', 'tiktok', 'facebook'],
      text="Technology allows us to be in two places at once. \U0001F4BB\n\nI wrote that in The Future Ready Challenge. Today a lot of us will be in two places at once: at the table, and on our phones.\n\nSo, the Thanksgiving debate: phones at the table, yes or no? Tell me below \U0001F447\n\nThe Future Ready Challenge and my other books: link in bio.\n\n#thanksgiving #digitalcitizenship #parentsofinstagram #teachersofinstagram #teachertok #futureready",
      first_comment="My books for teachers and parents: " + U(PUB, 'thu')),
 dict(day='Fri Nov 27', date='2026-11-27', time='17:52', cta='Paid product (WWYD deck)', label='What would you do? Scenario 03, The Garage Door (carousel; video on YouTube)', song='Better In The Quiet',
      title='Principals: What Would You Do? The Garage Door', kind='carousel', media=[f'fri-garage-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="Principals and teachers: what would you do? \U0001F914\n\nA parent calls. Her kindergartner will miss school today because the garage door won't open.\n\nThis family has a long pattern of late arrivals, absences and excuses. The child could ride the bus. The front door works. Garage doors have emergency releases.\n\nExcused or unexcused? Comment your call. What I chose is in the first comment.\n\nThis is one of 12 real scenarios in my What Would You Do? 12 School Leadership Scenarios deck, where you make the call before you see how I handled it. Link in bio.\n\n#principallife #schoolleadership #assistantprincipal #whatwouldyoudo #teachersofinstagram #teachertok",
      first_comment="What I chose: I marked it unexcused. It was the fifth unexcused absence. The issue wasn't the garage door. It was a family that repeatedly treated school as optional. At the magistrate hearing, the parents told the same story, and the magistrate gave them the same message we had: make an effort. A child learns how important school is by watching adults make it a priority.\n\nHold the adult accountable without making the child carry the blame.\n\nPractice decisions like this free: " + U(SIM, 'fri'),
      youtube=dict(media=['fri-garage-m.mp4'], cover='fri-garage-cover.jpg', title='Principals: What Would You Do? The Garage Door',
                   text="A kindergartner will miss school because the garage door won't open. A long pattern of absences. The bus runs. The front door works. Excused or unexcused? Comment your call.\n\nThis is one of 12 real scenarios in What Would You Do? 12 School Leadership Scenarios: " + U(WWYD, 'fri', 'youtube') + "\n\n#principal #schoolleadership #whatwouldyoudo")),
 dict(day='Sat Nov 28', date='2026-11-28', time='10:22', cta='Books', label='Parents: find their "aha" book over the break (carousel)',
      kind='carousel', media=[f'sat-aha-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="This break, help your child find their \"aha\" book. \U0001F4A1\U0001F4DA\n\nIn my book Technology, Reading & Digital Literacy I wrote: \"The right book can become a child's aha moment.\"\n\nSwipe for 4 ways to go looking for it together over the holiday. Save this, and share it with a parent who needs it. ❤️\n\nMy books for parents and teachers: link in bio.\n\n#parentingtips #reluctantreaders #raisingreaders #readingwithkids #literacy #momsofinstagram",
      first_comment="Technology, Reading & Digital Literacy and my other books: " + U(PUB, 'sat')),
 dict(day='Sun Nov 29', date='2026-11-29', time='17:52', cta='Speaking', label='Video quote: student-centered, every decision (Furman_9028 portrait)', song='One More Year of Light',
      kind='video', media=['sun-center-m.mp4'], cover='sun-center-cover.jpg', networks=['instagram', 'tiktok', 'youtube', 'facebook'],
      title='The Student at the Center of Every Decision',
      text="\"Student-centered learning means putting the student at the center of every decision we make.\"\n\nFrom my book The Future Ready Challenge. Not most decisions. Every one.\n\nWhat's one decision at your school that should start with the student? \U0001F447\n\nI bring this message to schools and conferences as a keynote. Speaking: link in bio.\n\n#studentcentered #teachersofinstagram #teachertok #futureready #schoolleadership #education",
      first_comment="Keynotes and school workshops: " + U(SPEAK, 'sun')),
]

linkedin = [
 dict(day='Mon Nov 23', date='2026-11-23', cta='Books (Professional Interview Secrets)',
      text="I once interviewed a teacher candidate who held a list of buzz words in his hand.\n\nEvery time I asked a question, he looked down at the list. Even when the word didn't make sense.\n\nDifferentiation. Authentic learning. Student-centered. Project-based learning.\n\nNone of those are bad words. Forcing them is the problem.\n\nWhen I interview, I don't want textbook answers. I want a genuine conversation with a fellow educator. I want to hear that you can talk with adults, and that you'll be able to talk easily with kids.\n\nSo here's my tip: say what you did, not what it's called. Sometimes it's better to tell me you did a really cool experiment with your students than to tell me you implemented a project-based learning experience.\n\nGive an example from your classroom, describe how it worked, then get out.\n\nPrincipals: what's the strangest thing you've seen a candidate bring into an interview?\n\n#TeacherInterview #Education #Hiring #K12",
      first_comment="More stories and tips like this are in my book Professional Interview Secrets: " + U(PUB, 'mon-li', 'linkedin')),
 dict(day='Tue Nov 24', date='2026-11-24', cta='Books (From City Streets to The Classroom)',
      text="In 2000, I took a job as the music teacher in a City of Pittsburgh middle school. Nothing prepared me for that experience.\n\nMy first few weeks were full of the same comment: \"You'll never last.\"\n\nAnd let's be honest, most teachers didn't. I lost count of the ones who walked in and walked out in just a few days. The kids had learned at a young age that most adults would leave them, so they kept us at arm's length.\n\nMy way in was the drums. Kids love rhythm and beat, and my playing gave me credibility in their eyes. In return, they were willing to listen.\n\nAfter school, kids spent an extra hour or two in my band room. We built a stomp group and a dance choir. Soon they were creating their own steps. We toured local universities and won the Charles Gray Award for Specialty Achievement in Arts Education.\n\nIt was never about pitch, scale or staccato. It was about how great it felt to be connected to a group.\n\nThe same kids who taunted me in the halls were the ones performing with pride.\n\nTeachers: what was your way in with the kids who expected you to leave?\n\n#UrbanEducation #MusicEducation #Teaching #Education",
      first_comment="The whole story is in my book From City Streets to The Classroom: " + U(PUB, 'tue-li', 'linkedin') + "\n\nAnd you can walk one urban student's school day in my free simulation: " + U(URB, 'tue-li', 'linkedin')),
 dict(day='Wed Nov 25', date='2026-11-25', cta='Paid product (Music + AI Creativity Bundle)',
      text="I'm a principal who writes songs. And yes, I use AI when I write.\n\nHere's how:\nIt helps me clean up my rhymes.\nIt does syllable passes, so the lines are actually singable.\nSometimes it offers an opinion on quality.\n\nWhat it doesn't do is write the song for me.\n\nThat's the line I wanted students to learn, too. So I built a grades 6-8 songwriting unit where students stay the authors. They plan a song, write original lyrics, revise, make musical choices, and explain why those choices matter. Teachers can run it with a school-approved AI music tool or with no AI at all.\n\nMusic teachers: where do you draw the line on AI in student songwriting?\n\n#MusicEducation #AIinEducation #MusicTeacher #Creativity",
      first_comment="The Music + AI Creativity Bundle: " + U(BUNDLE, 'wed-li', 'linkedin')),
 dict(day='Thu Nov 26', date='2026-11-26', cta='Books (From City Streets to The Classroom)',
      text="In my years as a music teacher in a Pittsburgh city middle school, I worked for a principal who knew that achieving some success was better than none.\n\nHe was the first to recognize that we had to take care of these kids' basic needs.\n\nHe made sure the building was secure. He moved some kids around to keep them away from others. He moved our sixth graders, our youngest students, to another building. And he started after-school programs so kids had a place to go instead of going home, or worse, to the streets.\n\nHe made sure those kids felt safe, connected and protected while they were in our care.\n\nWho's the leader who made your school a place kids could feel safe? Today's a good day to tag them.\n\n#SchoolLeadership #Principals #UrbanEducation #Education",
      first_comment="I wrote about him in my book From City Streets to The Classroom: " + U(PUB, 'thu-li', 'linkedin')),
 dict(day='Fri Nov 27', date='2026-11-27', cta='Paid product (WWYD deck)',
      text="A parent called to say her kindergartner would miss school. The garage door wouldn't open.\n\nThis family had a long pattern of late arrivals, absences and excuses. The child could ride the bus. The front door worked. Garage doors have emergency releases.\n\nI marked it unexcused. It was the fifth unexcused absence.\n\nThe issue was never the garage door. It was a family that repeatedly treated school as optional. At the magistrate hearing, the parents told the same story, and the magistrate gave them the same message we had: make an effort.\n\nA child learns how important school is by watching the adults make it a priority.\n\nHold the adult accountable without making the child carry the blame.\n\nPrincipals: on attendance, where do you draw the line between grace and accountability?\n\n#SchoolLeadership #Principals #Attendance #K12",
      first_comment="This is one of the 12 scenarios in my What Would You Do? deck for leadership teams and PD: " + U(WWYD, 'fri-li', 'linkedin')),
]

tb = [  # Threads + Bluesky, <= 300 chars, one a day
 ('2026-11-23T18:30', 'mon-buzz-1.jpg', "A teacher candidate once brought a list of buzz words to my interview and read from it every time I asked a question. Differentiation. Authentic learning. Student-centered. My tip: say what you did, not what it's called. Hardest interview question you've gotten? #EduSky"),
 ('2026-11-24T18:30', 'tue-streets-1.jpg', "2000. My first weeks as the music teacher in a Pittsburgh city middle school, kids told me \"You'll never last.\" My way in was the drums. We built a stomp group and a dance choir and won an arts education award. Teachers: what was your way in? #EduSky"),
 ('2026-11-25T18:30', 'wed-songs-1.jpg', "I'm a principal who writes songs, and I use AI. It cleans up my rhymes, does syllable passes for singability, and sometimes offers an opinion on quality. It doesn't write the song. Music teachers: where's your line on AI in student songwriting? #EduSky"),
 ('2026-11-26T18:30', 'thu-twoplaces-quote.jpg', "\"Technology allows us to be in two places at once.\" I wrote that in The Future Ready Challenge. Today a lot of us will be at the table and on our phones at the same time. Thanksgiving debate: phones at the table, yes or no? #EduSky"),
 ('2026-11-27T18:30', 'fri-garage-1.jpg', "A parent calls: her kindergartner will miss school because the garage door won't open. A long pattern of absences. The bus runs. The front door works. Excused or unexcused? Your call. #EduSky"),
 ('2026-11-28T11:30', 'sat-aha-1.jpg', "This break, help your child find their \"aha\" book. Go to the library together, start with what they already love, and don't judge the book they pick. Parents: what was the book that made reading click at your house? #EduSky"),
 ('2026-11-29T18:30', 'sun-center-cover.jpg', "\"Student-centered learning means putting the student at the center of every decision we make.\" Not most decisions. Every one. From my book The Future Ready Challenge. What's one decision at your school that should start with the student? #EduSky"),
]
P_R, P_L, P_C, P_T = 'Reluctant Readers: Tips for Parents', 'School Leadership', 'Classroom Ideas', 'Free Teacher Tools'
pins = [  # (when, image, board, title, description, link)
 ('2026-11-23T09:15', 'mon-buzz-1.jpg', P_L, 'Teacher interview tip: drop the buzz-word list', "A real interview story from my years of hiring teachers, and the one-line formula for a real answer. From Professional Interview Secrets.", PUB),
 ('2026-11-24T09:15', 'tue-streets-1.jpg', P_L, "The music teacher they said wouldn't last", "My first job in a Pittsburgh city middle school: \"You'll never last,\" the drums, a stomp group, and an arts education award.", PUB),
 ('2026-11-25T09:15', 'wed-songs-1.jpg', P_C, 'How a principal uses AI to write songs, without letting it write', "Rhymes, syllable passes, a second opinion. Plus a grades 6-8 songwriting unit where students stay the authors.", BUNDLE),
 ('2026-11-25T20:15', 'music-ai-cover.jpg', P_C, 'Music + AI Creativity Bundle: a grades 6-8 songwriting unit', "Students plan a song, write original lyrics, revise, and explain their choices. AI optional, with a non-AI path.", BUNDLE),
 ('2026-11-26T09:15', 'thu-twoplaces-quote.jpg', P_C, 'Technology allows us to be in two places at once', "A quote from my book The Future Ready Challenge. Phones at the holiday table: yes or no?", PUB),
 ('2026-11-27T09:15', 'fri-garage-1.jpg', P_L, 'Principals: what would you do? The garage door', "A kindergartner misses school because the garage door won't open. Excused or unexcused? A real scenario from my deck.", WWYD),
 ('2026-11-28T09:15', 'sat-aha-1.jpg', P_R, 'Help your child find their "aha" book this break', "4 ways to find the book that makes reading click. From Technology, Reading & Digital Literacy.", PUB),
 ('2026-11-29T09:15', 'wed-heat-cover.jpg', P_T, 'Practice a hard parent call before it is real', "Free Parent Call Rehearsal: a realistic AI parent at Moderate, High or Full Blaze, then coaching on tone and trust.", CALL),
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
    ttl = d.get('title') or d['text'].split('\n')[0].split('. ')[0].strip(' "')[:90]
    info['tiktokData'] = {'autoAddMusic': not vid, 'privacyOption': 'PUBLIC_TO_EVERYONE', 'title': ttl}
    info['facebookData'] = {'type': 'REEL', 'title': d['title']} if vid else {'type': 'POST'}
    if 'youtube' in d['networks']:
        info['youtubeData'] = {'title': d['title'], 'type': 'short', 'privacy': 'public', 'madeForKids': False, 'category': 'EDUCATION'}
    if vid:
        info['videoThumbnailUrl'] = B + d['cover']
    posts.append((f"{d['day']} {d['time']} {d['label']}", dt, info))
    if 'youtube' in d and isinstance(d['youtube'], dict):
        y = d['youtube']
        yi = base(dt, y['text'], [B + m for m in y['media']], ['youtube'])
        yi['youtubeData'] = {'title': y['title'], 'type': 'short', 'privacy': 'public', 'madeForKids': False, 'category': 'EDUCATION'}
        yi['videoThumbnailUrl'] = B + y['cover']
        posts.append((f"{d['day']} {d['time']} WWYD video (YouTube only)", dt, yi))
for l in linkedin:
    dt = f"{l['date']}T12:30"
    li = base(dt, l['text'], [], ['linkedin'], l['first_comment'])
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
json.dump(dict(base=B, days=days, linkedin=linkedin, threads_bluesky=tb, pins=pins), open('/home/claude/social/week8_posts.json', 'w'), indent=1, ensure_ascii=False)
json.dump(posts, open('/home/claude/social/week8_metricool.json', 'w'), indent=0, ensure_ascii=False)
print(len(posts), 'posts; max tb', max(len(t[2]) for t in tb))
for p in posts: print(p[0][:90])
