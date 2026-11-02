# Extras added 2026-11-02 on Rob's request: band-story carousels for TikTok/IG/FB 10 AM slots + WWYD Scenario 11 as a carousel
exec(open('week6_images.py').read().split('# ---- Tue:')[0].replace("OUT = '/home/claude/social/out/2026-11-09'", "OUT = '/home/claude/social/out/2026-11-02x'"))
import icons, icons6
from icons import music_staff

def staff_cover(path, kicker, title, art, art_xy, total=7):
    art_cover(path, kicker, title, art, art_xy, total)
    add_art(path, music_staff(1080, 220), (0, 560))

# ---- Wed Nov 4 10:00: the trombone collision (Rob's own story, LinkedIn Nov 2) ----
T = f'{OUT}/trombone'
staff_cover(f'{T}-1.jpg', 'Band directors', 'Two of my trombone players ran into each other at full speed.',
            icons7.trombone().resize((700, 387)), (190, 150))
tb = icons7.trombone()
tp = [('Band camp', 'We were drilling the fast part of the show.', 'Everybody moves through everybody else, and you’d better know exactly where you’re going. There’s no time to look.'),
      ('Then', 'A boy and a girl crossed paths. Instrument to instrument. Head on.', 'I still don’t know how it happened.'),
      ('She was fine', 'She must have moved a hair faster. She walked away fine.', 'He ate his mouthpiece. Cracked his front teeth.'),
      ('The calls', 'I had to call both sets of parents that afternoon.', 'His parents drove up and took him home. Hers listened to the whole story and told her to get back to work.'),
      ('The ending', 'He couldn’t play for a long time, so he came back as our band manager.', 'And then the two of them started dating.')]
for i, (k, t, b) in enumerate(tp, start=2):
    art_slide(f'{T}-{i}.jpg', i, 7, k, t, b, tb, (330, 182))
end_slide(f'{T}-7.jpg', 7, 7, 'Band directors: what’s the strangest injury you’ve ever had to call a parent about?',
          'Nobody trains you for that phone call. Tell me yours below.', 'Former band kids, tag your director')
add_art(f'{T}-7.jpg', icons7.trombone().resize((440, 243)), (W - 520, 830))

# ---- Thu Nov 5 10:00: the school board and the cruise (Rob's own story, LinkedIn Oct 28: 6,496 impressions) ----
C = f'{OUT}/cruise'
staff_cover(f'{C}-1.jpg', 'Before I was a principal, I was a band director', 'A parent ran for school board to get me fired. I was 26.',
            icons7.cruise_ship().resize((640, 404)), (220, 130))
cs = icons7.cruise_ship()
cp = [('Year 3', 'In my interview I’d mentioned an idea for the band trip: a cruise.', 'Lots of bands were doing it then. Word got out.'),
      ('The dad', 'One booster dad loved it more than anyone.', 'His son was a senior. It was his last chance at a band trip.'),
      ('The no', 'The administration said not this year.', 'Once you take a trip like that, it sets the bar for every class behind you. They weren’t wrong.'),
      ('The ask', 'He wanted me to help him go over their heads to the school board.', 'I said no. You’ll walk into your administrator’s office a thousand times asking for what your kids need.'),
      ('Then', 'So he turned on me, and ran for the board on getting rid of me.', 'What saved me: my band parents, my kids, and the community knew exactly who he was. They defended me.')]
for i, (k, t, b) in enumerate(cp, start=2):
    art_slide(f'{C}-{i}.jpg', i, 7, k, t, b, cs, (300, 189))
end_slide(f'{C}-7.jpg', 7, 7, 'Nobody trains you for the day an adult tries to end your career over a boat.',
          'Young teachers: would you have signed on with him?', 'Tell me below')
add_art(f'{C}-7.jpg', icons7.cruise_ship().resize((420, 265)), (W - 500, 820))

# ---- Fri Nov 6 17:52: WWYD Scenario 11 as a carousel (replaces the video on TikTok/IG/FB) ----
N = f'{OUT}/noise'
art_cover(f'{N}-1.jpg', 'Principals and teachers', 'What would you do? The noise during reading.',
          icons6.book_sounds().resize((680, 501)), (200, 170))
bs = icons6.book_sounds()
npl = [('The rule', 'A teacher’s rule: complete silence during independent reading.', 'A reasonable rule.'),
       ('The student', 'A second grader keeps making sounds while he reads.', 'He doesn’t seem to notice. It keeps happening, even when he’s corrected.'),
       ('The response', 'Consequences. A raised voice, in front of the class.', 'There’s no diagnosis yet.'),
       ('The family', 'His parents raise the concern with the teacher.', 'She tells them: “My rules are my rules.”'),
       ('Your call', 'Back the rule, or step in?', 'Comment your call. What I did is in the first comment.')]
for i, (k, t, b) in enumerate(npl, start=2):
    art_slide(f'{N}-{i}.jpg', i, 7, k, t, b, bs, (300, 221))
end_slide(f'{N}-7.jpg', 7, 7, '12 real dilemmas. What I actually chose.',
          'This is one of the scenarios in my What Would You Do? 12 School Leadership Scenarios deck, built for leadership teams and PD.',
          'Get the deck: link in bio')
add_art(f'{N}-7.jpg', icons6.book_sounds().resize((420, 309)), (W - 500, 800))
print('done')
