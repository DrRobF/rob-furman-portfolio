# 2026-11-10: launch Pinterest, Threads, Bluesky (Rob: "fill up these new accounts asap")
import json
B = 'https://www.drrobfurman.com/social/'
TZ = 'America/New_York'
S = 'https://www.drrobfurman.com'
def u(path, camp, src): return f"{S}{path}?utm_source={src}&utm_campaign={camp}" if path.startswith('/') else f"{path}?utm_source={src}&utm_campaign={camp}"
# ---- Threads + Bluesky (one post, <=300 chars) ----
tb = [
 ('2026-11-10T11:30', 'images/tedx-umd.jpg', "Hi #EduSky. I'm Rob Furman: 20 years as a principal, a former high school band director, author, and two-time TEDx speaker. I'll share real stories from school leadership and ask what you'd do. First question: what's the best thing a principal ever did for you?"),
 ('2026-11-10T18:30', 'social/2026-11-02/cruise-1.jpg', "A parent ran for school board on the platform of getting me fired. I was 26, a band director. He wanted my help going over the administration's head. I said no. What saved me: my band parents, my kids, and a community that knew who he was. Ever paid a price for saying no?"),
 ('2026-11-11T18:30', 'social/2026-10-12/tue-band-1.jpg', "Before I was a principal, I was a high school band director. Picture 100 teenagers, each holding a noise maker, and your job is to make music. That room taught me more about teaching than any class I ever took. Former band kids: what did your director get right?"),
 ('2026-11-12T18:30', 'social/2026-10-22/wwyd-form-1.jpg', "A family asks for 7 days off. The state requires a form. It comes back with a rude note about the \"stupid form.\" Insist, deny, or let it go? I approved it and moved on. You don't have to win every argument to lead well. Your call?"),
 ('2026-11-13T18:30', 'social/2026-11-02/trombone-1.jpg', "Two of my trombone players ran into each other at full speed at band camp. She walked away fine. He cracked his front teeth on his mouthpiece, so he came back as our band manager. Then the two of them started dating. Band directors: strangest injury call you've made?"),
 ('2026-11-14T18:30', 'social/2026-10-23/piggy-v3-1.jpg', "I played a kids' song for one of my students at a gig. He loved it. The rest of the room thought I was crazy. My mom, an educator, writes piggyback songs: new words over a tune everyone knows. Teachers: what's the silliest thing you've done for a student?"),
 ('2026-11-15T18:30', 'social/2026-11-09/tue-dad-1.jpg', "Before I was a principal, I was a principal's kid. My dad's saying: \"Kiss your ducks in the morning, your day is bound to get better.\" Don't let the rough things hang over you. Get them done. What did a parent teach you about leading before you knew it?"),
 ('2026-11-16T18:30', 'social/2026-10-12/sat-reader-1.jpg', "\"I hate reading.\" After two books on young readers and 20 years as a principal, here's what I've learned: most kids who say it aren't lazy. They're discouraged. Parents and teachers: what finally got your reluctant reader to pick up a book?"),
 ('2026-11-17T18:30', 'social/2026-11-16/tue-secretary-1.jpg', "The best person I ever worked with is someone I didn't get to pick, and didn't want. She took my secretary job on seniority and did not like me. She knew all 750 kids and their parents by name, and became one of my closest friends. Who were you wrong about?"),
 ('2026-11-18T18:30', 'social/2026-11-16/wed-peanut-1.jpg', "A kindergartner with a severe peanut allergy. We asked one classroom to leave the peanut butter at home. One parent took it to the school board. The cost landed at lunch, so we built a peanut-free table he could bring any friend to. The fight was never about lunch. It never is."),
 ('2026-11-19T18:30', 'social/2026-11-16/thu-spray-1.jpg', "Interview question: how do you motivate students? \"I use my happy spray.\" She sprays kids in the face with water when they get it right. Then: \"Let me show you.\" Spray bottle out of her purse. Right in my face. \"Good job, Dr. Furman.\" Wildest interview answer you've heard?"),
 ('2026-11-20T18:30', 'social/2026-11-16/fri-once-1.jpg', "Parents ask for exceptions \"just this once.\" A suspension that would become a vacation day. A missed project for a private family reason you can't share with the teacher. Same rule for everyone, or an exception? When does fair become favoritism?"),
 ('2026-11-21T11:30', 'social/2026-11-16/sat-math-1.jpg', "Great at math. Won't touch a book. I wrote in Motivating the Reluctant Reader that a child's strength in math or science can't make up for weak communication skills. One thing that helps: have them teach the book back to you. Parents: what's worked at your house?"),
 ('2026-11-22T18:30', 'social/2026-11-16/sun-blocks-cover.jpg', "\"Creativity is the ability to use all of the building blocks to create new.\" From my book The Future Ready Challenge. Give them the blocks, then let them build something you didn't plan. What's the best thing a student ever built that you never saw coming?"),
]
# ---- Pinterest pins ----
P_R, P_L, P_C, P_T = 'Reluctant Readers: Tips for Parents', 'School Leadership', 'Classroom Ideas', 'Free Teacher Tools'
pins = [  # (when, image, board, title, description, link)
 ('2026-11-10T11:00', '2026-11-02/cruise-1.jpg', P_L, 'A parent ran for school board to get me fired', "A real story from my band-director years: a booster dad, a band trip, and the day I said no. What it taught me about leading under pressure.", '/speaking'),
 ('2026-11-10T13:00', '2026-10-12/sat-reader-1.jpg', P_R, 'Your child says "I hate reading." Try this.', "Most kids who say they hate reading aren't lazy. They're discouraged. Tips for parents from my books on reluctant readers.", '/publications'),
 ('2026-11-10T15:00', '2026-10-22/wwyd-form-1.jpg', P_L, 'Principals: what would you do? The "stupid" form', "A real school-leadership dilemma from my What Would You Do? deck, with what I actually chose.", '/resources/what-would-you-do'),
 ('2026-11-10T17:00', '2026-10-12/tue-band-1.jpg', P_C, '5 things every teacher can learn from the band room', "Classroom lessons from my years as a high school band director, ready to use tomorrow.", '/speaking'),
 ('2026-11-10T19:00', '2026-10-21/parent-email-1.jpg', P_T, 'Stuck on a parent email at 9:40 PM? A free AI helper for teachers', "VIC drafts a clear, warm parent message from what happened and the tone you want. You review and change everything. Free for teachers.", 'https://askvic.ai/'),
 ('2026-11-10T21:00', '2026-11-02/tue-toohak-1.jpg', P_C, 'TOOHAK: flip Kahoot and let students write the quiz', "The backwards Kahoot from my book The Future Ready Challenge: students write the review questions.", '/publications'),
 ('2026-11-11T09:15', '2026-10-19/sat-reader-1.jpg', P_R, 'Kids know every movie release date. What about books?', "5 ways to make new books as exciting as a movie premiere. From Motivating the Reluctant Reader.", '/publications'),
 ('2026-11-11T20:15', '2026-10-19/tue-feedback-1.jpg', P_L, 'Feedback that helps people grow without tearing them down', "Compliment, suggestion, correction: how I teach peer review to kids and give feedback to adults.", '/publications'),
 ('2026-11-12T09:15', '2026-10-26/sat-screens-1.jpg', P_R, 'Your reluctant reader loves screens? Use that.', "Technology should not replace imagination. It should amplify it. 4 ways to turn screen time into reading time.", '/publications'),
 ('2026-11-12T20:15', '2026-11-02/noise-1.jpg', P_L, 'Principals: what would you do? The noise during reading', "A teacher's silent-reading rule meets a second grader who can't stop making sounds. What I chose.", '/resources/what-would-you-do'),
 ('2026-11-13T09:15', '2026-10-26/tue-hydrant-1.jpg', P_C, 'The internet is a fire hydrant. Teach kids to find the one drop they need', "Information literacy in four steps: identify, locate, evaluate, use. From The Future Ready Challenge.", '/resources'),
 ('2026-11-13T20:15', '2026-10-21/band-v2-1.jpg', P_L, 'Why music teachers make great administrators', "A band director already runs staff, budget, boosters, parents and students. That's a principal's job.", '/speaking'),
 ('2026-11-14T09:15', '2026-11-02/sat-hooked-1.jpg', P_R, 'Your child is hooked on a book? Let them keep going', "Even if it's the same series again. Even if it looks too easy. 4 ways to protect the spark.", '/publications'),
 ('2026-11-14T20:15', '2026-10-20/grades-v2-1.jpg', P_C, "An A doesn't prove mastery", "From my book The Future Ready Challenge: out in the real world, nobody hands you four answer choices.", '/publications'),
 ('2026-11-15T09:15', '2026-11-09/sat-together-1.jpg', P_R, "Your child doesn't want to read alone", "Children want to feel relevant, connected and part of a group. 4 ways to make reading social at home.", '/publications'),
 ('2026-11-15T20:15', '2026-11-09/tue-dad-1.jpg', P_L, '3 things my dad, a principal, taught me about leading', "The power of pizza, kiss your ducks in the morning, and look where you're going, not at your feet.", '/speaking'),
 ('2026-11-16T09:15', '2026-11-09/fri-fieldtrip-1.jpg', P_L, 'Principals: what would you do? The edited field-trip form', "A parent rewrites the permission form and won't sign a clean copy. What I chose.", '/resources/what-would-you-do'),
 ('2026-11-16T20:15', '2026-10-12/thu-grades-quote.jpg', P_C, 'Grades are useless symbols from a less enlightened age', "A quote from my ISTE book The Future Ready Challenge, for teachers rethinking assessment.", '/publications'),
 ('2026-11-17T09:15', '2026-11-02/trombone-1.jpg', P_L, 'Two trombone players collided at full speed', "A band-camp story, a parent phone call, and an ending nobody saw coming.", '/speaking'),
 ('2026-11-17T20:15', '2026-11-16/tue-secretary-1.jpg', P_L, "The best person I ever worked with, and I didn't want her", "A principal's story about the school secretary he got on seniority, and how wrong he was.", '/speaking'),
 ('2026-11-18T09:15', '2026-10-19/thu-book-quote.jpg', P_C, "Just because a lesson is in the book doesn't mean it's best for your students", "From The Future Ready Challenge. The lessons kids remember come from a teacher who knows them.", '/publications'),
 ('2026-11-18T20:15', '2026-11-16/wed-peanut-1.jpg', P_L, 'One parent took peanut butter to the school board', "A kindergartner with a severe peanut allergy, a fight that moved to the cafeteria, and the peanut-free table that fixed it.", '/resources/difficult-conversations-prep-kit'),
 ('2026-11-19T09:15', '2026-10-26/thu-remember-quote.jpg', P_C, 'The lessons you remember were the creative ones', "Nobody remembers page 47, numbers 1 through 30. From The Future Ready Challenge.", '/publications'),
 ('2026-11-19T20:15', '2026-11-16/thu-spray-1.jpg', P_L, 'A teacher candidate sprayed me in the face. In the interview.', "The wildest interview answer I heard in 20 years of hiring: the happy spray.", '/speaking'),
 ('2026-11-20T09:15', '2026-11-02/thu-no-process-quote.jpg', P_C, "To let students be creative, don't give them a process", "A quote from my book The Future Ready Challenge for art and project-based classrooms.", '/publications'),
 ('2026-11-20T20:15', '2026-11-16/fri-once-1.jpg', P_L, 'Principals: what would you do? "Just this once"', "When does an exception honor the purpose of a rule, and when is it favoritism? What I chose.", '/resources/what-would-you-do'),
 ('2026-11-21T09:15', '2026-11-16/sat-math-1.jpg', P_R, "Great at math. Won't touch a book.", "3 ways to help a numbers kid become a reader, from Motivating the Reluctant Reader.", '/publications'),
 ('2026-11-21T20:15', '2026-11-09/thu-habit-quote.jpg', P_C, '28 days to create a pattern, 90 days to create a habit', "Why a new classroom routine falls apart in week five. From The Future Ready Challenge.", '/publications'),
 ('2026-11-22T09:15', '2026-11-16/thu-citizen-quote.jpg', P_C, 'Digital citizenship is as commonplace as physical citizenship', "Who should teach it: home, school, or both? From The Future Ready Challenge.", '/publications'),
 ('2026-11-22T20:15', '2026-10-23/piggy-v3-1.jpg', P_C, "I played a kids' song for a student at my gig", "Piggyback songs: new words over a tune everyone knows. A music-teacher trick from my mom, an educator.", '/speaking'),
]
out = []
for i, (when, img, text) in enumerate(tb):
    assert len(text) <= 300, (i, len(text))
    info = dict(draft=False, autoPublish=True, text=text, firstCommentText='', media=[S + '/' + img], providers=[{'network': 'threads'}, {'network': 'bluesky'}],
                publicationDate={'dateTime': when + ':00', 'timezone': TZ}, shortener=False, descendants=[], smartLinkData={'ids': []},
                threadsData={}, blueskyData={'postLanguages': ['en']})
    out.append(('tb', when, info))
for i, (when, img, board, title, desc, link) in enumerate(pins):
    assert len(title) <= 100, title
    camp = 'pin-' + img.split('/')[1].replace('.jpg', '')
    info = dict(draft=False, autoPublish=True, text=desc, firstCommentText='', media=[B + img], providers=[{'network': 'pinterest'}],
                publicationDate={'dateTime': when + ':00', 'timezone': TZ}, shortener=False, descendants=[], smartLinkData={'ids': []},
                pinterestData={'boardId': board, 'pinTitle': title, 'pinLink': u(link, camp, 'pinterest'), 'pinNewFormat': True})
    out.append(('pin', when, info))
json.dump(out, open('/home/claude/social/launch_new_networks.json', 'w'), ensure_ascii=False, indent=0)
print(len(tb), 'threads/bluesky,', len(pins), 'pins; max tb len', max(len(t[2]) for t in tb))
