# Week of 2026-12-07 (10th autopilot week)
from cards import *
import icons11
import os
OUT = '/home/claude/social/out/2026-12-07'
os.makedirs(OUT, exist_ok=True)

# reuse the week 8 carousel helpers (art_cover, art_slide, quote_card2, carousel, add_art)
exec('\n'.join(l for l in open('/home/claude/social/week8_images.py').read().split('# ---- Mon 10:00')[0].splitlines()
               if not l.startswith(('from cards', 'import icons9', 'OUT ='))))

# ---- Mon 10:00: Interview Files #3, word vomit (Professional Interview Secrets) ----
wf = icons11.word_flood()
carousel(f'{OUT}/mon-vomit', ('Interview Files', 'A candidate talked so long, I zoned out in my own interview.',
                              (640, 505), (220, 170), 76), [
    ('The story', 'I asked a question she clearly didn’t know how to answer.',
     'So she just began talking. And talking.'),
    ('What happened', 'When she finally stopped, my colleague had to prompt me to ask the next question.',
     'I had completely zoned out.'),
    ('Why it happens', 'Word vomit often happens when you don’t know the answer.',
     'You start fishing, throwing everything out there in hopes something satisfies the question.'),
    ('Read the room', 'Is your interviewer glazing over or losing focus?',
     'You may be in the middle of a word vomit.'),
    ('The tip', 'Answer it, relate it to an experience, then conclude.',
     'Stories and details are welcome. Just wrap up with a concise answer.'),
], ('Succinct beats long. Every time.',
    'More stories and tips from my years of hiring teachers are in my book Professional Interview Secrets.',
    'The book: link in bio'), wf, (W - 470, 900), (390, 308))

# ---- Tue 17:52: the smartboard hot take (from Rob's hiring experience, Professional Interview Secrets) ----
sb = icons11.smartboard()
carousel(f'{OUT}/tue-smart', ('From the interview table', '40 of my last 60 teacher candidates told me the same thing about technology.',
                              (700, 553), (190, 170), 74), [
    ('What they said', '“We have a smartboard.”',
     'Of my last 60 interviews, I would safely say at least 40 teachers told me that.'),
    ('My honest take', 'A smartboard is nothing but a glorified chalkboard',
     'unless you’re taking advantage of its many interactive features.'),
    ('Same with videos', 'Showing a video doesn’t equal implementing technology.',
     'It’s no different than when teachers showed film strips years ago!'),
    ('What I want to hear', 'The technology that’s been a game changer in your classroom.',
     'The site or app you infused into a lesson to create a unique, innovative experience.'),
    ('The real questions', 'How did it increase your students’ digital age skills?',
     'How are your students being creative with it?'),
], ('Don’t tell me what your school bought. Tell me what your students did with it.',
    'I bring this conversation to schools in my keynotes and staff workshops.',
    'Speaking: link in bio'), sb, (W - 480, 930), (400, 316))

# ---- Thu 17:52: quote card (The Future Ready Challenge) ----
quote_card2(f'{OUT}/thu-entre-quote.jpg', 'Even tomorrow’s middle class will be entrepreneurs.',
            'From The Future Ready Challenge (ISTE)', highlight={'entrepreneurs.'},
            art=icons11.startup_stand().resize((470, 371)), size=80)

# ---- Fri 17:52: What would you do? Scenario 08, The Vendor Table ----
vt = icons11.vendor_table()
carousel(f'{OUT}/fri-vendor', ('Principals and teachers', 'What would you do? The vendor table.', (700, 553), (190, 160)), [
    ('The ask', 'The PTA president asks if her friend can sell merchandise at the school carnival fundraiser.', ''),
    ('The rule', 'Private sales aren’t allowed. The superintendent confirms it.', 'You say no.'),
    ('Carnival day', 'The friend shows up with a table anyway.', ''),
    ('The reason', '“He will not even realize you are here.”',
     'That’s what she says the PTA president told her.'),
    ('Your call', 'The person who should protect the boundary went around it. Now what?',
     'Comment your call. What I chose is in the first comment.'),
], ('12 real dilemmas. What I actually chose.',
    'This is one of the scenarios in my What Would You Do? 12 School Leadership Scenarios deck, built for leadership teams and PD.',
    'Get the deck: link in bio'), vt, (W - 500, 820), (420, 332))

# ---- Sat 10:22: parents, market the book (Technology, Reading & Digital Literacy) ----
gb = icons11.gift_book()
carousel(f'{OUT}/sat-gift', ('For parents', 'The toy ads are loud this month. Who’s marketing the books?', (700, 553), (W - 760, 160)), [
    ('The idea', '“Books are not marketed with the same intensity as entertainment media.”',
     'From my book Technology, Reading & Digital Literacy.'),
    ('Tip 1', 'Be the book’s commercial.', 'Tell your child why you picked this one for them. Hype it like the hottest toy of the year.'),
    ('Tip 2', 'Give it like a gift, not a chore.', 'Wrap it. Unwrapping turns a book into an event.'),
    ('Tip 3', 'Screens count too.',
     '“Soon, all books may be available online or on handheld devices.” An e-book or audiobook is still a book.'),
    ('Tip 4', 'Read the first chapter together.', 'The same day it’s opened, while the excitement is high.'),
], ('Help them catch the desire to read.',
    'That’s one of the most important jobs any adult in a child’s life has. My books for parents and teachers are linked in my bio.',
    'Save this • Share with a parent'), gb, (W - 440, 920), (360, 285))
print('done')
