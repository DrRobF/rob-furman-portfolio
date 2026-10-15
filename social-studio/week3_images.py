from cards import *
import icons3
OUT = '/home/claude/social/out/2026-10-26'


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


# ---- Tue: information literacy carousel (The Future Ready Challenge) ----
T = f'{OUT}/tue-hydrant'
art_cover(f'{T}-1.jpg', 'For teachers and school leaders',
          'The internet is a fire hydrant. Teach kids to find the one drop they need.',
          icons3.hydrant(), (160, 110))
small_h = icons3.hydrant().resize((300, 253))
tp = [
    ('The idea', 'Information literacy has four parts.',
     '“Information literacy is our ability to control the sheer amount of information that is available by deftly identifying it, locating it, evaluating it, and using it.” From The Future Ready Challenge', None),
    ('Step 1', 'Identify', 'Before anyone types a search, name exactly what you need to know. A clear question is the first filter.', '1'),
    ('Step 2', 'Locate', 'Go past the first result. Show students where strong sources live, like Google Scholar, primary sources, and real experts.', '2'),
    ('Step 3', 'Evaluate', 'Who wrote this? When? Why? Can I confirm it somewhere else? Make these four questions a habit.', '3'),
    ('Step 4', 'Use', '“Possessing the information and being able to connect the dots are two very different things.” Have students make something with what they found.', '4'),
]
for i, (k, t, b, g) in enumerate(tp, start=2):
    slide(f'{T}-{i}.jpg', i, 7, t, b, kicker=k, ghost=g)
    add_art(f'{T}-{i}.jpg', small_h, (W - 400, H - 330))
end_slide(f'{T}-7.jpg', 7, 7, 'Identify. Locate. Evaluate. Use.',
          'Try the four steps on your next research assignment. Which one do your students struggle with most? Tell me in the comments.',
          'Save this for your next research project')
add_art(f'{T}-7.jpg', small_h, (W - 400, 960))

# ---- Thu: quote card ----
def quote_card2(path, quote, source, highlight=None, art=None, size=72):
    im = gradient_bg(W, H).convert('RGBA')
    im.alpha_composite(art, (W - art.size[0] - 60, 70))
    d = ImageDraw.Draw(im)
    d.text((72, 330), '\u201C', font=font('Black', 200), fill=ACCENT)
    y = text_block(d, (80, 500), quote, font('ExtraBold', size), WHITE, W - 160, 1.14, highlight=highlight)
    d.text((80, y + 30), source, font=font('Medium', 32), fill=MUTED)
    footer(im, H - 170)
    return save(im, path)


quote_card2(f'{OUT}/thu-remember-quote.jpg',
           'I guarantee the lessons you remember from childhood were the ones where you participated in a unique and creative way.',
           'From The Future Ready Challenge (ISTE)', highlight={'unique', 'creative'},
           art=icons3.chalkboard().resize((440, 341)))

# ---- Sat: parents, reluctant readers + technology ----
R = f'{OUT}/sat-screens'
art_cover(f'{R}-1.jpg', 'For parents', 'Your reluctant reader loves screens? Use that.',
          icons3.tablet_book(), (420, 150))
tb = icons3.tablet_book().resize((300, 260))
rp = [
    ('The idea', '“Technology should not replace imagination. It should amplify it.”', 'From my book Motivating the Reluctant Reader.'),
    ('Tip 1', 'A book on a screen is still a book.', 'E-readers and tablets count. If a device gets your child reading, let it.'),
    ('Tip 2', 'Give their ideas a real audience.', 'Kids often get motivated when they realize their ideas can reach real people. Help them write a short review of a book they finished.'),
    ('Tip 3', 'Help them find other readers.', 'Children want to know they are not the only ones who feel a certain way about a story. A friend, a cousin, a book club, or you.'),
    ('Tip 4', 'Teach them that online is forever.', 'Once something is published online, it is memorialized there forever. Look over what they post, together.'),
]
for i, (k, t, b) in enumerate(rp, start=2):
    slide(f'{R}-{i}.jpg', i, 7, t, b, kicker=k, ghost=str(i - 2) if i > 2 else None)
    add_art(f'{R}-{i}.jpg', tb, (W - 380, H - 360))
end_slide(f'{R}-7.jpg', 7, 7, 'Reading isn’t finished when the book closes.',
          '“The cycle is not complete until students can communicate what they have read and send their ideas back into the world.” From Motivating the Reluctant Reader.',
          'Save this • Share with a parent')
print('done')
