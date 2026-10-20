import os
src = open('music1_images.py').read().split("T = f'{OUT}/music-drummer'")[0]
exec(src)
for d in ('2026-10-21', '2026-10-22', '2026-10-23'):
    os.makedirs(f'/home/claude/social/out/{d}', exist_ok=True)
P = '/home/claude/social/photos/'

def deck(outdir, name, kicker, title, photo, pan, slides=None, endt='', ends='', endb='', zoom=1.0):
    T = f'/home/claude/social/out/{outdir}/{name}'
    n = len(slides) + 2
    cover_slide(f'{T}-1.jpg', kicker, title, photo=P + photo, total=n, pan=pan, zoom=zoom)
    for i, (k, t, b) in enumerate(slides, start=2):
        slide(f'{T}-{i}.jpg', i, n, t, b, kicker=k, ghost=str(i-1))
    end_slide(f'{T}-{n}.jpg', n, n, endt, ends, endb)

# Wed Oct 21 10:00 - band director, real drum-room photo cover
deck('2026-10-21', 'band-v2', 'Before I was a principal, I was a band director',
     'Why music teachers make great administrators.', 'IMG_1996.jpg', (0.6, 0.4), [
 ('Same job, smaller scale', 'You already manage a staff.', 'Drum tech. Brass tech. Dance instructor. A band director leads a team of specialists and keeps them pulling in the same direction.'),
 ('Same job, smaller scale', 'You already manage a real budget.', 'Uniforms. Instruments. Repairs. Travel for shows. Every dollar has to be planned and defended.'),
 ('Same job, smaller scale', 'You already have a PTA.', 'We call ours band boosters. Volunteer parents, fundraising, and a lot of communication.'),
 ('Same job, smaller scale', 'You already handle parents and students.', 'The same issues a principal faces: expectations, conflict, hard conversations. Just a smaller version.'),
 ('Same job, smaller scale', 'When you’re away, it all falls on you.', 'At a show you handle everything: safety, behavior, logistics, problems. No one else is coming.'),
 ], 'Music teachers: you’re more ready than you think.', 'Band directors: which one is you? Tell me in the comments.', 'Save this • Tag a band director')

# Fri Oct 23 18:00 - piggyback, real photo at the drums
deck('2026-10-23', 'piggy-v3', 'Before I was a principal, I was a musician',
     'I played a kids’ song for one of my students. The room thought I was crazy.', 'IMG_1995.jpg', (0.85, 0.8), [
 ('The setup', 'My mom is an educator who writes piggyback songs.', 'She takes a well-known tune and writes new lyrics over it to teach something. Twinkle Twinkle is also how we sing our ABCs.'),
 ('The gig', 'I was playing a show at a local restaurant.', 'Around 6 PM, a family came in with their kids. One of them was my student.'),
 ('The moment', 'He was so excited to see me.', 'I thought it was kind of cute. So for the next song, I played a piggyback song just for him.'),
 ('The result', 'He loved it. The audience thought I was crazy.', 'I would do it again. One happy kid beats a quiet room.'),
 ], 'Meet kids where they are.', 'Teachers: what is the silliest thing you have done for a student? Tell me below.', 'Save this • Tag a teacher')

# Thu Oct 22 10:00 - What Would You Do scenario 07
deck('2026-10-22', 'wwyd-form', 'Principals: what would you do?',
     'They called our form “stupid.” Now what?', 'Furman_6399.jpg', (0.5, 0.3), [
 ('The request', 'A family asks for 7 school days off around a 3-day holiday.', 'It is a long trip, and every day counts.'),
 ('The rule', 'State rules say a trip that long needs an educational purpose.', 'So we send a form: Where are you going? What will your child learn?'),
 ('The stakes', 'Without approval, the days become unexcused.', 'That can eventually involve the magistrate.'),
 ('The twist', 'The parent sends the form back with a rude message about the “stupid form.”', 'These requests are almost always approved when families answer the questions.'),
 ('The call', 'Insist on a completed form, deny it, or decide being right isn’t worth a fight?', None),
 ], 'Comment your call.', 'What I chose is in the first comment. This is 1 of 12 scenarios in What Would You Do? 12 School Leadership Scenarios.', 'Get all 12: link in bio')

# Wed Oct 21 17:52 - parent email carousel (replaces reel)
deck('2026-10-21', 'parent-email', 'Teachers, I see you',
     '9:40 PM. Still rewriting the first line of a parent email.', 'Furman_9028_(2).jpg', (0.5, 0.3), [
 ('You’re not a bad writer', 'The stakes are just high.', 'One word can make a parent defensive. One vague sentence can turn a small issue into a meeting.'),
 ('So the email waits', 'It sits in drafts until 9:40 PM.', 'After a full day with your students, it is the last thing anyone wants to write.'),
 ('What I built', 'VIC writes the first draft.', 'Describe what happened and the tone you want. VIC drafts a clear, warm message to a parent, a colleague, or your principal.'),
 ('You stay in charge', 'You review and edit everything before it’s sent.', 'VIC is a draft, not a decision.'),
 ], 'Free for teachers.', 'Ask VIC: askvic.ai', 'Link in bio')
print('ok')
