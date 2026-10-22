# Week of 2026-11-02 (5th autopilot week; week4_videos.py was an extra 10-19 render)
from cards import *
import icons, icons6
OUT = '/home/claude/social/out/2026-11-02'


def add_art(path, art, xy):
    im = Image.open(path).convert('RGBA')
    im.alpha_composite(art, xy)
    save(im, path)


def art_cover(path, kicker, title, art, art_xy, total=7):
    im = gradient_bg(W, H).convert('RGBA')
    im.alpha_composite(art, art_xy)
    d = ImageDraw.Draw(im)
    d.text((80, 790), kicker.upper(), font=font('Bold', 32), fill=ACCENT)
    text_block(d, (80, 850), title, font('ExtraBold', 84), WHITE, W - 160, 1.1)
    d.text((W - 80 - d.textlength('swipe →', font=font('Bold', 30)), 70), 'swipe →', font=font('Bold', 30), fill=WHITE)
    d.text((80, H - 90), 'Dr. Rob Furman', font=font('Bold', 28), fill=WHITE)
    d.text((W - 80 - d.textlength(f'1/{total}', font=font('Medium', 28)), H - 90), f'1/{total}', font=font('Medium', 28), fill=MUTED)
    return save(im, path)


# ---- Tue: TOOHAK, the backwards Kahoot (The Future Ready Challenge) ----
T = f'{OUT}/tue-toohak'
art_cover(f'{T}-1.jpg', 'Teachers who live on Kahoot', 'Flip it. Let your students write the quiz.',
          icons6.quiz_flip(), (160, 110))
small_q = icons6.quiz_flip().resize((300, 253))
tp = [
    ('The idea', 'It’s called TOOHAK! The backwards version of Kahoot!',
     'From my book The Future Ready Challenge. Instead of you writing the review questions, your students do.', None),
    ('Step 1', 'Hand over the questions.', 'Give each group one part of the unit. Their job is to write the review questions for it.', '1'),
    ('Step 2', 'The wrong answers count too.', 'Writing three believable wrong choices takes real understanding. That is where the learning shows.', '2'),
    ('Step 3', 'Let them run the game.', 'Each group hosts its questions for the class. You get to watch, listen, and take notes.', '3'),
    ('Step 4', 'Read the questions, not just the scores.', 'What they chose to ask tells you what they understood, and what they missed.', '4'),
]
for i, (k, t, b, g) in enumerate(tp, start=2):
    slide(f'{T}-{i}.jpg', i, 7, t, b, kicker=k, ghost=g)
    add_art(f'{T}-{i}.jpg', small_q, (W - 400, H - 330))
end_slide(f'{T}-7.jpg', 7, 7, 'When students build the review, they own the learning.',
          'I bring ideas like this to schools in keynotes and hands-on workshops.',
          'Bring this to your staff: link in bio')
add_art(f'{T}-7.jpg', icons6.quiz_flip().resize((400, 337)), (W - 480, 800))

# ---- Thu: quote card ----
def quote_card2(path, quote, source, highlight=None, art=None, size=72):
    im = gradient_bg(W, H).convert('RGBA')
    im.alpha_composite(art, (W - art.size[0] - 60, 70))
    d = ImageDraw.Draw(im)
    d.text((72, 400), '“', font=font('Black', 200), fill=ACCENT)
    y = text_block(d, (80, 570), quote, font('ExtraBold', size), WHITE, W - 160, 1.14, highlight=highlight)
    d.text((80, y + 30), source, font=font('Medium', 32), fill=MUTED)
    footer(im, H - 170)
    return save(im, path)


quote_card2(f'{OUT}/thu-no-process-quote.jpg',
            'The best way to allow our students to be creative is not to give them a process!',
            'From The Future Ready Challenge (ISTE)', highlight={'creative', 'process'},
            art=icons6.palette().resize((496, 416)), size=80)

# ---- Sat: parents, let them read what they love ----
R = f'{OUT}/sat-hooked'
art_cover(f'{R}-1.jpg', 'For parents', 'Your child is hooked on a book? Let them keep going.',
          icons.open_book().resize((640, 420)), (W - 700, 200))
ob = icons.open_book().resize((300, 197))
rp = [
    ('The idea', '“If a book captures a child’s attention, let them explore it.”', 'From my book Motivating the Reluctant Reader.'),
    ('Tip 1', 'Don’t push books that are too hard.', '“If struggling readers are consistently given books that are too difficult, they will learn to hate reading.”'),
    ('Tip 2', 'More reading beats harder reading.', '“People who read more read better.” The series, the comic, the same book a third time: let them read.'),
    ('Tip 3', 'Join them where they are.', '“Try to be open to what is motivating your child and join them in those journeys.”'),
    ('Tip 4', 'Talk about it after.', '“The conversation after the book may be as important as the book itself.” Ask what they would have done.'),
]
for i, (k, t, b) in enumerate(rp, start=2):
    slide(f'{R}-{i}.jpg', i, 7, t, b, kicker=k, ghost=str(i - 2) if i > 2 else None)
    add_art(f'{R}-{i}.jpg', ob, (W - 380, H - 300))
end_slide(f'{R}-7.jpg', 7, 7, 'Interest first. The skill follows.',
          'Every quote here is from my book Motivating the Reluctant Reader. My books for parents and teachers are linked in my bio.',
          'Save this • Share with a parent')
add_art(f'{R}-7.jpg', icons.open_book().resize((460, 302)), (W - 540, 760))
print('done')
