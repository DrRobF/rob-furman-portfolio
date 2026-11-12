# Week of 2026-11-23 (8th autopilot week)
from cards import *
import icons9
OUT = '/home/claude/social/out/2026-11-23'


def add_art(path, art, xy):
    im = Image.open(path).convert('RGBA')
    im.alpha_composite(art, xy)
    save(im, path)


def art_cover(path, kicker, title, art, art_xy, total=7, size=84):
    im = gradient_bg(W, H).convert('RGBA')
    im.alpha_composite(art, art_xy)
    d = ImageDraw.Draw(im)
    d.text((80, 790), kicker.upper(), font=font('Bold', 32), fill=ACCENT)
    text_block(d, (80, 850), title, font('ExtraBold', size), WHITE, W - 160, 1.1)
    d.text((W - 80 - d.textlength('swipe →', font=font('Bold', 30)), 70), 'swipe →', font=font('Bold', 30), fill=WHITE)
    d.text((80, H - 90), 'Dr. Rob Furman', font=font('Bold', 28), fill=WHITE)
    d.text((W - 80 - d.textlength(f'1/{total}', font=font('Medium', 28)), H - 90), f'1/{total}', font=font('Medium', 28), fill=MUTED)
    return save(im, path)


def art_slide(path, n, total, kicker, title, body, art, size=(320, 252)):
    slide(path, n, total, title, body, kicker=kicker)
    top = 110
    im = Image.open(path); d = ImageDraw.Draw(im)
    th = len(wrap(d, title, font('ExtraBold', 84), W - 160)) * int(84 * 1.12)
    bh = (len(wrap(d, body, font('Regular', 48), W - 160)) * int(48 * 1.38) + 44) if body else 0
    ytext = max(150, (H - (th + bh + 60)) // 2 + 40)
    room = ytext - top - 30
    if room < size[1]:
        size = (int(size[0] * room / size[1]), room)
    if size[1] > 60:
        add_art(path, art.resize(size), (W - size[0] - 80, top))


def quote_card2(path, quote, source, highlight=None, art=None, size=72):
    im = gradient_bg(W, H).convert('RGBA')
    im.alpha_composite(art, (W - art.size[0] - 60, 70))
    d = ImageDraw.Draw(im)
    d.text((72, 470), '“', font=font('Black', 200), fill=ACCENT)
    y = text_block(d, (80, 640), quote, font('ExtraBold', size), WHITE, W - 160, 1.14, highlight=highlight)
    d.text((80, y + 30), source, font=font('Medium', 32), fill=MUTED)
    footer(im, H - 170)
    return save(im, path)


def carousel(prefix, cover, slides, end, art, end_art_xy, end_art_size=(400, 316)):
    art_cover(f'{prefix}-1.jpg', cover[0], cover[1], art.resize(cover[2]), cover[3], size=cover[4] if len(cover) > 4 else 84)
    for i, (k, t, b) in enumerate(slides, start=2):
        a = art if not isinstance(b, tuple) else b[1]
        art_slide(f'{prefix}-{i}.jpg', i, 7, k, t, b if not isinstance(b, tuple) else b[0], a)
    end_slide(f'{prefix}-7.jpg', 7, 7, *end)
    add_art(f'{prefix}-7.jpg', art.resize(end_art_size), end_art_xy)


# ---- Mon 10:00: Interview Files #1, the buzz-word list (Professional Interview Secrets) ----
bz = icons9.buzz_clipboard()
carousel(f'{OUT}/mon-buzz', ('Interview Files', 'A candidate brought a list of buzz words to my interview. Then read from it.',
                             (640, 505), (220, 170), 74), [
    ('The story', 'He held a list of buzz words in his hand.',
     'He referred to it every time I asked a question, even when it didn’t make sense.'),
    ('The list', 'Differentiation. Authentic learning. Student-centered. Project-based learning.',
     'None of these are bad words. Forcing them is the problem.'),
    ('What I listen for', 'I don’t want you to sound like a professor.',
     'I want you to talk to me as a fellow educator who has a passion for teaching.'),
    ('The tip', 'Say what you did, not what it’s called.',
     'Sometimes it’s better to say you did a really cool experiment with your students.'),
    ('The formula', 'Give an example from your classroom, describe how it worked, then get out.',
     'That’s a real answer. And it sounds like you.'),
], ('Have a real conversation. That’s the interview.',
    'More stories and tips from my years of hiring teachers are in my book Professional Interview Secrets.',
    'The book: link in bio'), bz, (W - 470, 860), (390, 308))

# ---- Tue 17:52: Where I Learned It, the music teacher they said wouldn't last (From City Streets to The Classroom) ----
dc, tr = icons9.drums_city(), icons9.trophy()
carousel(f'{OUT}/tue-streets', ('Before I was a principal', 'I was the music teacher they said wouldn’t last.',
                                (760, 600), (160, 140), 86), [
    ('2000', 'I took a job as the music teacher in a Pittsburgh city middle school.',
     'Nothing prepared me for this experience.'),
    ('My first few weeks', '“You’ll never last.”',
     'I heard it in the halls. Most teachers didn’t last. The kids had learned that most adults would leave them.'),
    ('My way in', 'The drums.',
     'Kids love rhythm and beat. My playing gave me credibility in their eyes, and in return they were willing to listen to me.'),
    ('What we built', 'A stomp group. A dance choir.',
     'Kids stayed an extra hour or two after school in my band room. Soon they were creating their own dance steps.'),
    ('What happened', 'We toured local universities and won the Charles Gray Award for Specialty Achievement in Arts Education.',
     ('The kids who taunted me in the halls were now performing with pride.', tr)),
], ('It was never about pitch, scale or staccato.',
    'It was about how great it felt to be connected to a group. The whole story is in my book From City Streets to The Classroom.',
    'The book: link in bio'), dc, (W - 480, 880), (400, 316))

# ---- Wed 10:00: Music + AI Creativity Bundle (paid product) ----
sb = icons9.songbook()
carousel(f'{OUT}/wed-songs', ('Music teachers', 'I’m a principal who writes songs. Here’s how I use AI without letting it write for me.',
                              (620, 490), (230, 150), 72), [
    ('1', 'It helps me clean up my rhymes.', 'The song starts with me.'),
    ('2', 'It does syllable passes for singability.', 'Can a person actually sing this line?'),
    ('3', 'Sometimes it offers an opinion on quality.', 'Then I decide what to do with it.'),
    ('For your students', 'So I built a songwriting unit where students stay the authors.',
     'Grades 6–8. Students plan a song, write original lyrics, revise, make musical choices, and explain why those choices matter.'),
    ('AI optional', 'Use a school-approved AI music tool, or no AI at all.',
     'There’s a non-AI path, and any AI use stays teacher controlled.'),
], ('Music + AI Creativity Bundle',
    'Teacher guide, student workbook, a 7-day unit with a 10-day path, song design worksheets, a rubric, an artist statement and an AI prompt builder.',
    'Get the unit: link in bio'), sb, (W - 470, 900), (380, 300))

# ---- Thu 17:52: quote card (The Future Ready Challenge) ----
quote_card2(f'{OUT}/thu-twoplaces-quote.jpg',
            'Technology allows us to be in two places at once.',
            'From The Future Ready Challenge (ISTE)', highlight={'two', 'places'},
            art=icons9.two_places().resize((470, 371)), size=92)

# ---- Fri 17:52: What would you do? Scenario 03, The Garage Door ----
gd = icons9.garage()
carousel(f'{OUT}/fri-garage', ('Principals and teachers', 'What would you do? The garage door.', (700, 553), (190, 160)), [
    ('The call', 'A parent calls. Her kindergartner will miss school today.', 'The reason: the garage door won’t open.'),
    ('The history', 'This family has a long pattern.', 'Late arrivals. Absences. Excuses.'),
    ('The facts', 'The child could ride the bus.', 'The front door works. Garage doors have emergency releases.'),
    ('The tension', 'Grace for a family having a bad morning?',
     'Or stop letting adult excuses become a child’s missed school day?'),
    ('Your call', 'Excused or unexcused?', 'Comment your call. What I chose is in the first comment.'),
], ('12 real dilemmas. What I actually chose.',
    'This is one of the scenarios in my What Would You Do? 12 School Leadership Scenarios deck, built for leadership teams and PD.',
    'Get the deck: link in bio'), gd, (W - 500, 790), (420, 332))

# ---- Sat 10:22: parents, find their aha book over the break (Technology, Reading & Digital Literacy) ----
ab = icons9.aha_book()
carousel(f'{OUT}/sat-aha', ('For parents', 'This break, help your child find their “aha” book.', (700, 553), (W - 760, 160)), [
    ('The idea', '“The right book can become a child’s aha moment.”',
     'From my book Technology, Reading & Digital Literacy.'),
    ('Tip 1', 'Go looking together.', 'A library or bookstore trip over the break. Let them do the picking.'),
    ('Tip 2', 'Start with what they already love.',
     '“Try to be open to what is motivating your child and join them in those journeys.”'),
    ('Tip 3', 'Don’t judge the book they pick.',
     'Graphic novel, joke book, the same series again. If a book captures their attention, let them explore it.'),
    ('Tip 4', 'Talk about it when the family is together.',
     '“The conversation after the book may be as important as the book itself.” Let a grandparent ask what they’re reading.'),
], ('One book can change how they see reading.',
    'The quotes here are from my book Technology, Reading & Digital Literacy (ISTE). My books for parents and teachers are linked in my bio.',
    'Save this • Share with a parent'), ab, (W - 420, 930), (340, 269))
print('done')
