# Week of 2026-11-30 (9th autopilot week)
from cards import *
import icons10
OUT = '/home/claude/social/out/2026-11-30'

# reuse the week 8 carousel helpers (art_cover, art_slide, quote_card2, carousel, add_art)
exec('\n'.join(l for l in open('/home/claude/social/week8_images.py').read().split('# ---- Mon 10:00')[0].splitlines()
               if not l.startswith(('from cards', 'import icons9', 'OUT ='))))


def photo_cover(path, kicker, title, photo, pan=(0.5, 0.3), zoom=1.0, total=7, size=80):
    """Cover with one of Rob's photos fading into the navy, text below his face."""
    im = gradient_bg(W, H).convert('RGBA')
    src = ImageOps.exif_transpose(Image.open(photo)).convert('RGB')
    p = cover_crop(src, W, 820, zoom, pan).convert('RGBA')
    fade = Image.new('L', (W, 820), 255)
    fd = ImageDraw.Draw(fade)
    for i in range(520, 820):
        fd.line([(0, i), (W, i)], fill=int(255 * (1 - (i - 520) / 300)))
    im.paste(p, (0, 0), fade)
    d = ImageDraw.Draw(im)
    d.text((80, 800), kicker.upper(), font=font('Bold', 32), fill=ACCENT)
    text_block(d, (80, 856), title, font('ExtraBold', size), WHITE, W - 160, 1.1)
    sw = 'swipe →'
    d.rounded_rectangle([W - 110 - d.textlength(sw, font=font('Bold', 30)), 54, W - 50, 112], radius=28, fill=(15, 27, 51))
    d.text((W - 80 - d.textlength(sw, font=font('Bold', 30)), 66), sw, font=font('Bold', 30), fill=WHITE)
    d.text((80, H - 90), 'Dr. Rob Furman', font=font('Bold', 28), fill=WHITE)
    d.text((W - 80 - d.textlength(f'1/{total}', font=font('Medium', 28)), H - 90), f'1/{total}', font=font('Medium', 28), fill=MUTED)
    return save(im, path)


# ---- Mon 10:00: Interview Files #2, the late candidate (Professional Interview Secrets) ----
lc = icons10.late_clock()
carousel(f'{OUT}/mon-late', ('Interview Files', 'A candidate walked into my interview 15 minutes late. What he said next surprised me.',
                             (640, 505), (220, 170), 72), [
    ('The story', 'He showed up 15 minutes late for his interview.',
     'He knew it had killed his chance of landing the job.'),
    ('What he said', '“Well, I know I’m not going to get the job, but I’d love to hear your interview questions for practice.”', ''),
    ('What I thought', 'A great way to turn a negative into a positive.',
     'He owned the mistake, then asked for something useful.'),
    ('The tip', 'Plan on arriving at least 30 minutes early.',
     'It gives you a cushion for any travel problems, and it looks great in the eyes of the interviewer.'),
    ('Bonus', 'If the interviewer is running ahead of schedule, you might get in early.',
     'And check where you’ll park before the day of the interview.'),
], ('Arrive late and you’ve already soured the interviewer.',
    'More stories and tips from my years of hiring teachers are in my book Professional Interview Secrets.',
    'The book: link in bio'), lc, (W - 470, 900), (390, 308))

# ---- Tue 17:52: Where I Learned It, the interview my dad set up (Professional Interview Secrets) ----
ts = icons10.transcript()
photo_cover(f'{OUT}/tue-grilled-1.jpg', 'Before I was a principal',
            'I was the job candidate getting grilled. My dad set it up.',
            '/home/claude/rob-furman-portfolio/public/images/headshot-blue.jpg', pan=(0.5, 0.18), size=78)
for i, (k, t, b) in enumerate([
    ('The interview', 'I was interviewing for a music job.', 'I was fairly confident going in.'),
    ('Then', 'The interviewer pulled out my college transcripts.',
     'He started challenging me on a poor grade I had received in one of my classes.'),
    ('The question', '“How could you possibly consider teaching children if you couldn’t earn a higher grade in your music course?”',
     'He grilled me for several minutes. I stammered my way through an answer.'),
    ('The reveal', 'My dad had told him to give me a hard time.',
     'My dad was a fellow educator and his friend. The job was already earmarked for somebody else.'),
    ('What it gave me', 'Great practice for dealing with hard questions in interviews.',
     'Practice the hard questions out loud with colleagues or friends before the real one.'),
], start=2):
    art_slide(f'{OUT}/tue-grilled-{i}.jpg', i, 7, k, t, b, ts)
end_slide(f'{OUT}/tue-grilled-7.jpg', 7, 7, 'Sometimes the best practice is the hard question you didn’t see coming.',
          'I share stories like this from both sides of the interview table in my keynotes and school workshops.',
          'Speaking: link in bio')
add_art(f'{OUT}/tue-grilled-7.jpg', ts.resize((380, 300)), (W - 460, 900))

# ---- Thu 17:52: quote card (The Future Ready Challenge) ----
quote_card2(f'{OUT}/thu-pd-quote.jpg',
            'Just as students shouldn’t rely solely on teachers, we shouldn’t rely solely on school-based PD.',
            'From The Future Ready Challenge (ISTE)', highlight={'solely'},
            art=icons10.pd_network().resize((470, 371)), size=70)

# ---- Fri 17:52: What would you do? Scenario 05, Permission to say "shut up" ----
su = icons10.speak_up()
carousel(f'{OUT}/fri-shutup', ('Principals and teachers', 'What would you do? Permission to say “shut up.”', (700, 553), (190, 160)), [
    ('The note', 'A parent sends a note.',
     'Her daughter has permission to tell another student to “shut up” if he verbally bullies her.'),
    ('What’s new', 'It’s the first time the school has heard about it.',
     'The girl may be dealing with ongoing verbal bullying.'),
    ('The tension', 'How do you teach her to stand up for herself',
     'without teaching her to become the next bully?'),
    ('The parent', 'Honor the note? Overrule it?', 'Or does something else come first?'),
    ('Your call', 'What’s your first move?', 'Comment your call. What I chose is in the first comment.'),
], ('12 real dilemmas. What I actually chose.',
    'This is one of the scenarios in my What Would You Do? 12 School Leadership Scenarios deck, built for leadership teams and PD.',
    'Get the deck: link in bio'), su, (W - 500, 820), (420, 332))

# ---- Sat 10:22: parents, let your child be the critic (Technology, Reading & Digital Literacy) ----
cb = icons10.critic_book()
carousel(f'{OUT}/sat-critic', ('For parents', 'Stop quizzing your child about the book. Ask for their review.', (700, 553), (W - 760, 160)), [
    ('The idea', '“If they can evaluate their reading, they have reached the highest form of reading.”',
     'From my book Technology, Reading & Digital Literacy.'),
    ('Tip 1', 'Ask for a verdict, not a summary.', 'Was it good? Would you give it to a friend? Why?'),
    ('Tip 2', 'Let them own it.',
     '“Reading becomes powerful when children feel ownership over it.” Let them pick the next one, too.'),
    ('Tip 3', 'Send their review out into the world.',
     '“The cycle is not complete until students can communicate what they have read and send their ideas back into the world.”'),
    ('Tip 4', 'Give them a real audience.',
     'A note to the librarian, a review read to grandma, a short review you post together. Real readers make it matter.'),
], ('A child who reviews books is a child who thinks about books.',
    'The quotes here are from my book Technology, Reading & Digital Literacy (ISTE). My books for parents and teachers are linked in my bio.',
    'Save this • Share with a parent'), cb, (W - 420, 930), (340, 269))

# ---- covers for videos / pins ----
print('done')
