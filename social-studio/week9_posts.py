# Week of 2026-11-30 captions and post plan (built 2026-11-19). Every post is created in Metricool as a DRAFT.
import json
MON = '2026-11-30'
B = f'https://www.drrobfurman.com/social/{MON}/'
S = 'https://www.drrobfurman.com'
TZ = 'America/New_York'
U = lambda url, day, src='social': f"{url}{'&' if '?' in url else '?'}utm_source={src}&utm_campaign=wk{MON}-{day}"
PUB, SIM, SPEAK = S + '/publications', S + '/human-equation-suite/leadership-sim', S + '/speaking'
WWYD, GRAY, URB = S + '/resources/what-would-you-do', S + '/human-equation-suite/course/gray-area-leadership', S + '/human-equation-suite/urban-student-sim'

days = [
 dict(day='Mon Nov 30', date='2026-11-30', time='10:00', cta='Books (Professional Interview Secrets)', label='Interview Files #2: the late candidate (carousel)',
      title='He Showed Up 15 Minutes Late to My Interview',
      kind='carousel', media=[f'mon-late-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="A teacher candidate showed up 15 minutes late to my interview. What he said next surprised me. ⏰\n\nHe knew being late had killed his chance at the job. So he walked in and asked me for something else.\n\nSwipe for what he said, and the one rule that keeps you from ever being him.\n\nTeachers on the job hunt: what's your worst interview-day surprise? \U0001F447\n\nMore stories from my years of hiring teachers are in my book Professional Interview Secrets. Link in bio.\n\n#teacherinterview #newteacher #studentteacher #teachersoftiktok #teachertok #teachersofinstagram",
      first_comment="Professional Interview Secrets and my other books: " + U(PUB, 'mon')),
 dict(day='Mon Nov 30', date='2026-11-30', time='17:52', cta='VIC tool', label='Video: the manatee and the textbook (VIC lesson planner)', song='Saints in the Sunlight',
      kind='video', media=['mon-manatee-m.mp4'], cover='mon-manatee-cover.jpg', networks=['instagram', 'tiktok', 'youtube', 'facebook'],
      title="What's in Your Textbook Your Students Have Never Seen?",
      text="Rural West Virginia students haven't seen a manatee. So a textbook just wasn't going to reach them. \U0001F30A\n\nThat's from my book The Future Ready Challenge.\n\nTeachers: what's in your textbook that your students have never seen? \U0001F447\n\nGive VIC your standard and tell it about your students. It drafts the lesson around where they actually are. You review it, you change it, and it's still your lesson.\n\nFree for teachers: askvic.ai (link in bio)\n\n#teachersoftiktok #teachertok #lessonplanning #ruralteacher #teachersofinstagram #edtech",
      first_comment="Try VIC's free lesson planner: " + U('https://askvic.ai/', 'mon')),
 dict(day='Tue Dec 1', date='2026-12-01', time='17:52', cta='Speaking', label='Where I Learned It: the interview my dad set up (carousel)',
      title='I Got Grilled in a Job Interview. My Dad Set It Up.',
      kind='carousel', media=[f'tue-grilled-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="Before I was a principal, I was the job candidate getting grilled. My dad set it up. \U0001F62C\n\nI was interviewing for a music job, fairly confident, when the interviewer pulled out my college transcripts and went straight for my worst grade.\n\nSwipe for the question he asked, and what I found out afterward. \U0001F449\n\nTeachers' kids: did your parent ever set you up like this? Principals: have you ever grilled a candidate as a favor? \U0001F447\n\nI share stories like this in my keynotes and school workshops. Link in bio.\n\n#teacherskid #musicteacher #teacherinterview #principallife #teachersoftiktok #teachertok",
      first_comment="Keynotes and school workshops: " + U(SPEAK, 'tue') + "\n\nMore stories from both sides of the interview table are in Professional Interview Secrets: " + U(PUB, 'tue')),
 dict(day='Wed Dec 2', date='2026-12-02', time='17:52', cta='H.E.L.P. tool', label='Video: Gray Area Leadership, the plagiarism dilemma (H.E.L.P. course)', song='Every Version of You',
      kind='video', media=['wed-gray-m.mp4'], cover='wed-gray-cover.jpg', networks=['instagram', 'tiktok', 'youtube', 'facebook'],
      title='The Hardest Decisions Hold More Than One Truth',
      text="School leaders: A, B, C or D? ⚖️\n\nA student admits to plagiarism. She has been caring for a sick sibling and missing support windows.\n\nA. Full academic penalty, right away.\nB. Hold accountability, and pair it with a recovery plan.\nC. Delay until a counselor and teacher conference.\nD. Have the grade-level team design the response.\n\nComment your letter. \U0001F447\n\nThis is one of the dilemmas in Gray Area Leadership, a free module in my H.E.L.P. course for school leaders. The hardest decisions hold more than one truth at once. Link in bio.\n\n#principallife #schoolleadership #assistantprincipal #academicintegrity #teachersofinstagram #teachertok",
      first_comment="Gray Area Leadership, free in my H.E.L.P. course: " + U(GRAY, 'wed')),
 dict(day='Thu Dec 3', date='2026-12-03', time='17:52', cta='Books', label='Quote card: we shouldn\'t rely solely on school-based PD (debate)',
      title='Should Teachers Rely on School PD?',
      kind='image', media=['thu-pd-quote.jpg'], networks=['instagram', 'tiktok', 'facebook'],
      text="\"Just as students shouldn't rely solely on teachers, we shouldn't rely solely on school-based PD.\" \U0001F4A1\n\nI wrote that in The Future Ready Challenge.\n\nTeachers: where do you actually learn the most? Your school's PD days, or other teachers outside your building? Tell me below \U0001F447\n\nThe Future Ready Challenge and my other books: link in bio.\n\n#teacherPD #professionaldevelopment #teachersofinstagram #teachertok #teachersoftiktok #futureready",
      first_comment="My books for teachers and leaders: " + U(PUB, 'thu')),
 dict(day='Fri Dec 4', date='2026-12-04', time='17:52', cta='Paid product (WWYD deck)', label='What would you do? Scenario 05, Permission to say "shut up" (carousel; video on YouTube)', song='Low Light',
      title='Principals: What Would You Do? Permission to Say "Shut Up"', kind='carousel', media=[f'fri-shutup-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="Principals and teachers: what would you do? \U0001F914\n\nA parent sends a note. Her daughter has permission to tell another student to \"shut up\" if he verbally bullies her.\n\nIt's the first time the school has heard that she may be dealing with ongoing verbal bullying.\n\nHow do you teach her to stand up for herself without teaching her to become the next bully? Comment your first move. What I chose is in the first comment.\n\nThis is one of 12 real scenarios in my What Would You Do? 12 School Leadership Scenarios deck, where you make the call before you see how I handled it. Link in bio.\n\n#principallife #schoolleadership #assistantprincipal #whatwouldyoudo #antibullying #teachertok",
      first_comment="What I chose: I contacted the parent immediately and opened a full bullying investigation, including student interviews. Then we talked with her: it's okay to stand up for yourself, as long as you don't become a bully, and it's important to tell an adult so we can act quickly. I praised her for telling her parent.\n\nI also told her about my own father, a principal, whose old-school advice was to punch back or shout back. I don't agree with fighting, but his larger lesson stayed with me: defending yourself properly is never wrong.\n\nTeach children to be strong enough to speak and wise enough to seek help.\n\nPractice decisions like this free: " + U(SIM, 'fri'),
      youtube=dict(media=['fri-shutup-m.mp4'], cover='fri-shutup-cover.jpg', title='Principals: What Would You Do? Permission to Say "Shut Up"',
                   text="A parent's note gives her daughter permission to tell another student to \"shut up\" if he bullies her. It's the first the school has heard of it. What's your first move? Comment your call.\n\nThis is one of 12 real scenarios in What Would You Do? 12 School Leadership Scenarios: " + U(WWYD, 'fri', 'youtube') + "\n\n#principal #schoolleadership #whatwouldyoudo")),
 dict(day='Sat Dec 5', date='2026-12-05', time='10:22', cta='Books', label='Parents: stop quizzing, ask for their review (carousel)',
      title='Stop Quizzing Your Child About the Book',
      kind='carousel', media=[f'sat-critic-{i}.jpg' for i in range(1, 8)], networks=['instagram', 'tiktok', 'facebook'],
      text="Stop quizzing your child about the book. Ask for their review. ⭐\U0001F4DA\n\nIn my book Technology, Reading & Digital Literacy I wrote: \"If they can evaluate their reading, they have reached the highest form of reading.\"\n\nSwipe for 4 ways to turn your reader into a critic. Save this, and share it with a parent who needs it. ❤️\n\nMy books for parents and teachers: link in bio.\n\n#parentingtips #reluctantreaders #raisingreaders #readingwithkids #literacy #momsofinstagram",
      first_comment="Technology, Reading & Digital Literacy and my other books: " + U(PUB, 'sat')),
 dict(day='Sun Dec 6', date='2026-12-06', time='17:52', cta='Speaking', label='Video quote: creative, innovative collaborators (Furman_6399 portrait)', song='Better Than I Was',
      kind='video', media=['sun-reform-m.mp4'], cover='sun-reform-cover.jpg', networks=['instagram', 'tiktok', 'youtube', 'facebook'],
      title='The Creative, Innovative Kids We Know They Are',
      text="\"We need to implement educational reform that allows our children to be the creative, innovative collaborators and communicators we know they are!\"\n\nFrom my book The Future Ready Challenge.\n\nWhat does your school do that lets kids show who they really are? \U0001F447\n\nI bring this message to schools and conferences as a keynote. Speaking: link in bio.\n\n#futureready #teachersofinstagram #teachertok #schoolleadership #creativity #education",
      first_comment="Keynotes and school workshops: " + U(SPEAK, 'sun')),
]

linkedin = [
 dict(day='Mon Nov 30', date='2026-11-30', cta='Books (Professional Interview Secrets)',
      text="I once had a teacher candidate show up 15 minutes late for an interview.\n\nHe knew it had killed his chance of landing the job. So he walked in and said:\n\n\"Well, I know I'm not going to get the job, but I'd love to hear your interview questions for practice.\"\n\nI thought that was a great way to turn a negative into a positive.\n\nBut let's be clear about the lesson. Arrive late for an interview and you've already soured the interviewer. Plan on arriving at least 30 minutes early. It gives you a cushion for any travel problems, and it looks great in the eyes of the interviewer. And if the interviewer is running ahead of schedule, you might get in early.\n\nPrincipals: what's the best recovery you've ever seen from a candidate who started off on the wrong foot?\n\n#TeacherInterview #Education #Hiring #K12",
      first_comment="More stories and tips like this are in my book Professional Interview Secrets: " + U(PUB, 'mon-li', 'linkedin')),
 dict(day='Tue Dec 1', date='2026-12-01', cta='Speaking',
      text="The toughest interview I ever had was a setup.\n\nI was interviewing for a music job and was fairly confident going in. Then the interviewer pulled out my college transcripts and began challenging me on a poor grade I had received in one of my classes.\n\n\"How could you possibly consider teaching children if you couldn't earn a higher grade in your music course?\"\n\nHe grilled me for several minutes. I stammered my way through an answer.\n\nOnly afterward did he tell me that my dad, a fellow educator and his friend, had told him to give me a hard time. The job was already earmarked for somebody else.\n\nIt gave me great practice for dealing with hard questions in interviews.\n\nTo every candidate heading into interview season: practice the hard questions out loud, with colleagues or friends, before the real one.\n\nTeachers' kids: did your parent ever set you up like this?\n\n#Education #TeacherInterview #SchoolLeadership #Teaching",
      first_comment="I share stories like this in my keynotes and school workshops: " + U(SPEAK, 'tue-li', 'linkedin')),
 dict(day='Wed Dec 2', date='2026-12-02', cta='H.E.L.P. tool', poll=dict(
          question="A student admits to plagiarism while caring for a sick sibling. What's your first move?",
          options=['Full penalty, right away', 'Accountability + recovery plan', 'Wait for counselor meeting', 'Grade-level team decides']),
      text="The hardest decisions hold more than one truth at once.\n\nA student admits to plagiarism. She has been caring for a sick sibling and missing support windows.\n\nUnder pressure, a decision like this collapses into a false binary: consistency or compassion. Pick a side.\n\nThe leadership move is to hold both truths long enough to make a decision that is principled, humane, and defensible. Then explain the tradeoffs: \"There are real tradeoffs, and here is why we chose this path.\"\n\nSchool leaders: what's your first move?\n\n#SchoolLeadership #Principals #AcademicIntegrity #K12",
      first_comment="This dilemma comes from Gray Area Leadership, a free module in my H.E.L.P. course for school leaders: " + U(GRAY, 'wed-li', 'linkedin')),
 dict(day='Thu Dec 3', date='2026-12-03', cta='Books (From City Streets to The Classroom)',
      text="In my book From City Streets to The Classroom, I follow one seventh grader, Adam, through a single school day.\n\nBy second period, his day has already gone wrong at home and in class.\n\nAnd here's the startling fact: we are in the second period of the day, and not one adult has bothered to ask Adam what is wrong.\n\nEvery adult he passed had a chance to break the chain of events. None of them did.\n\nA principal, or any supportive adult, could have talked to him about his concerns. An advisor program would give every child a trusted adult in the building they can go to at any time.\n\nA child should know that there is always someone he can count on.\n\nPrincipals and teachers: who is that person for the kids in your building?\n\n#UrbanEducation #SchoolLeadership #StudentsFirst #Education",
      first_comment="From City Streets to The Classroom: " + U(PUB, 'thu-li', 'linkedin') + "\n\nWalk Adam's whole school day in my free simulation: " + U(URB, 'thu-li', 'linkedin')),
 dict(day='Fri Dec 4', date='2026-12-04', cta='Paid product (WWYD deck)',
      text="A parent once sent a note saying her daughter had permission to tell another student to \"shut up\" if he verbally bullied her.\n\nIt was the first time we had heard that she might be dealing with ongoing verbal bullying.\n\nI contacted the parent immediately and opened a full bullying investigation, including student interviews.\n\nThen we talked with her. It's okay to stand up for yourself, as long as you don't become a bully. And it's important to tell an adult so we can act quickly. I praised her for telling her parent.\n\nI also told her about my own father, a principal, whose old-school advice was to punch back or shout back. I don't agree with fighting. But his larger lesson stayed with me: defending yourself properly is never wrong.\n\nTeach children to be strong enough to speak and wise enough to seek help.\n\nPrincipals: how do you teach self-advocacy without teaching the next bully?\n\n#SchoolLeadership #Principals #Bullying #K12",
      first_comment="This is one of the 12 scenarios in my What Would You Do? deck for leadership teams and PD: " + U(WWYD, 'fri-li', 'linkedin')),
]

tb = [  # Threads + Bluesky, <= 300 chars, one a day
 ('2026-11-30T18:30', 'mon-late-1.jpg', "A candidate showed up 15 minutes late to my interview. He knew it killed his chance, so he said: \"I'd love to hear your interview questions for practice.\" Great recovery. Better rule: arrive 30 minutes early. Worst interview-day surprise you've had? #EduSky"),
 ('2026-12-01T18:30', 'tue-grilled-1.jpg', "Interviewing for a music job, the interviewer pulled out my college transcript and grilled me on my worst grade. Afterward he told me my dad, a fellow educator, asked him to give me a hard time. Great practice. Teachers' kids: ever been set up like that? #EduSky"),
 ('2026-12-02T18:30', 'wed-gray-cover.jpg', "A student admits to plagiarism. She's been caring for a sick sibling and missing support windows. Full penalty now, accountability plus a recovery plan, wait for a counselor meeting, or let the team decide? The hardest decisions hold more than one truth. #EduSky"),
 ('2026-12-03T18:30', 'thu-pd-quote.jpg', "\"Just as students shouldn't rely solely on teachers, we shouldn't rely solely on school-based PD.\" From my book The Future Ready Challenge. Teachers: where do you learn the most, PD days or other teachers outside your building? #EduSky"),
 ('2026-12-04T18:30', 'fri-shutup-1.jpg', "A parent's note: her daughter has permission to tell another student to \"shut up\" if he bullies her. It's the first the school has heard of it. How do you teach her to stand up for herself without becoming the next bully? Your first move? #EduSky"),
 ('2026-12-05T11:30', 'sat-critic-1.jpg', "Parents: stop quizzing your child about the book. Ask for their review. Was it good? Would they give it to a friend? Why? \"If they can evaluate their reading, they have reached the highest form of reading.\" #EduSky"),
 ('2026-12-06T18:30', 'sun-reform-cover.jpg', "\"We need to implement educational reform that allows our children to be the creative, innovative collaborators and communicators we know they are!\" From The Future Ready Challenge. What does your school do that lets kids show who they are? #EduSky"),
]
P_R, P_L, P_C, P_T = 'Reluctant Readers: Tips for Parents', 'School Leadership', 'Classroom Ideas', 'Free Teacher Tools'
pins = [  # (when, image, board, title, description, link)
 ('2026-11-30T09:15', 'mon-late-1.jpg', P_L, 'Teacher interview tip: arrive 30 minutes early', "A real story from my years of hiring teachers: the candidate who showed up 15 minutes late, and how he recovered. From Professional Interview Secrets.", PUB),
 ('2026-12-01T09:15', 'tue-grilled-1.jpg', P_L, 'The job interview my dad set up', "Grilled on my college transcript in a music job interview, then I found out who asked for it. Great practice for hard questions.", SPEAK),
 ('2026-12-02T09:15', 'wed-gray-cover.jpg', P_T, 'Gray area leadership: a free dilemma for school leaders', "A student admits to plagiarism while caring for a sick sibling. Four responses, real tradeoffs. Free in the H.E.L.P. course.", GRAY),
 ('2026-12-03T09:15', 'thu-pd-quote.jpg', P_C, "Don't rely solely on school-based PD", "A quote from my book The Future Ready Challenge. Where do teachers really learn the most?", PUB),
 ('2026-12-04T09:15', 'fri-shutup-1.jpg', P_L, 'Principals: what would you do? Permission to say "shut up"', "A parent's note gives her daughter permission to say \"shut up\" to a bully. A real scenario from my leadership deck.", WWYD),
 ('2026-12-05T09:15', 'sat-critic-1.jpg', P_R, 'Stop quizzing your child about the book. Ask for a review.', "4 ways to turn your reader into a critic. From Technology, Reading & Digital Literacy.", PUB),
 ('2026-12-06T09:15', 'mon-manatee-cover.jpg', P_T, 'Plan lessons around what your students have actually seen', "Free VIC lesson planner: give it your standard and your students, and it drafts the lesson around where they are.", 'https://askvic.ai/'),
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
json.dump(dict(base=B, days=days, linkedin=linkedin, threads_bluesky=tb, pins=pins), open('/home/claude/social/week9_posts.json', 'w'), indent=1, ensure_ascii=False)
json.dump(posts, open('/home/claude/social/week9_metricool.json', 'w'), indent=0, ensure_ascii=False)
print(len(posts), 'posts; max tb', max(len(t[2]) for t in tb))
for p in posts: print(p[0][:90])
