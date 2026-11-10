# Week of 2026-11-16 (7th autopilot week)
from cards import *
import icons8
OUT = '/home/claude/social/out/2026-11-16'


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


def art_slide(path, n, total, kicker, title, body, art, size=(320, 280)):
    """Slide with the illustration in the band above the text block (shrinks to fit)."""
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
    d.text((72, 400), '“', font=font('Black', 200), fill=ACCENT)
    y = text_block(d, (80, 570), quote, font('ExtraBold', size), WHITE, W - 160, 1.14, highlight=highlight)
    d.text((80, y + 30), source, font=font('Medium', 32), fill=MUTED)
    footer(im, H - 170)
    return save(im, path)


# ---- Tue: the secretary I didn't pick (Rob's own story, from his LinkedIn post queued for Tue Nov 17) ----
T = f'{OUT}/tue-secretary'
fd = icons8.front_desk()
art_cover(f'{T}-1.jpg', 'Principals and school secretaries',
          'The best person I ever worked with is someone I didn’t get to pick, and didn’t want.',
          fd.resize((720, 568)), (180, 150), size=72)
tp = [
    ('How it worked', 'Open positions went to whoever had the most seniority and raised their hand.',
     'No interview. No input from the principal.'),
    ('Then', 'My secretary position opened up.',
     'The person who took it was a paraprofessional in the building who, to put it plainly, did not like me.'),
    ('My plan', 'I had the whole year figured out before she ever sat down at that desk.',
     'I was wrong about every part of it.'),
    ('Her', 'She knew every student and every parent by name. All 750 of them.',
     'She handled it when the buses went down. Teachers went to her first and me second on anything operational.'),
    ('What it meant', '65 staff. 750 kids. No assistant principal.',
     'She was my assistant administrator in everything but title and pay. And she became one of the closest friends I’ve had.'),
]
for i, (k, t, b) in enumerate(tp, start=2):
    art_slide(f'{T}-{i}.jpg', i, 7, k, t, b, fd, (300, 237))
end_slide(f'{T}-7.jpg', 7, 7, 'I didn’t give her a fair shot from day one. She earned it anyway.',
          'Who’s the person at your school you were wrong about? I talk about leading people like this in my keynotes and school workshops.',
          'Speaking: link in bio')
add_art(f'{T}-7.jpg', fd.resize((400, 316)), (W - 480, 800))

# ---- Thu: quote card (The Future Ready Challenge) ----
quote_card2(f'{OUT}/thu-citizen-quote.jpg',
            'Digital citizenship has become as commonplace as physical citizenship.',
            'From The Future Ready Challenge (ISTE)', highlight={'digital', 'physical'},
            art=icons8.two_worlds().resize((470, 371)), size=82)

# ---- Fri: What would you do? Scenario 10, Just This Once (carousel) ----
F = f'{OUT}/fri-once'
rx = icons8.rule_exception()
art_cover(f'{F}-1.jpg', 'Principals and teachers', 'What would you do? “Just this once.”',
          rx.resize((700, 553)), (190, 160))
fp = [
    ('The rule', 'Parents ask for exceptions “just this once.”', 'Usually the answer is no.'),
    ('Case 1', 'A student is assigned out-of-school suspension.',
     'He’ll be home with an older sibling while the parent works. The family says plainly: it will be a vacation day.'),
    ('Case 2', 'Another student misses a major project for a private family reason.',
     'You know the reason. You can’t share it with the teacher.'),
    ('The tension', 'Same rule for everyone? Or an exception?',
     'When does an exception honor the purpose of a rule, and when does it become favoritism?'),
    ('Your call', 'Hold the line both times? Bend both? Or one and not the other?',
     'Comment your call. What I chose is in the first comment.'),
]
for i, (k, t, b) in enumerate(fp, start=2):
    art_slide(f'{F}-{i}.jpg', i, 7, k, t, b, rx, (300, 237))
end_slide(f'{F}-7.jpg', 7, 7, '12 real dilemmas. What I actually chose.',
          'This is one of the scenarios in my What Would You Do? 12 School Leadership Scenarios deck, built for leadership teams and PD.',
          'Get the deck: link in bio')
add_art(f'{F}-7.jpg', rx.resize((420, 332)), (W - 500, 790))

# ---- Sat: parents, strong in math but won't read (Motivating the Reluctant Reader) ----
R = f'{OUT}/sat-math'
cb = icons8.calc_book()
art_cover(f'{R}-1.jpg', 'For parents', 'Great at math. Won’t touch a book.',
          cb.resize((700, 553)), (W - 760, 160))
rp = [
    ('The truth', '“It is no longer acceptable to assume that a child’s strength in math or science can compensate for weak communication skills.”',
     'From my book Motivating the Reluctant Reader.'),
    ('Why it matters', '“Technology now demands that our students not only be proficient learners, but proficient readers.”',
     'The screens and games they love still run on words.'),
    ('Tip 1', 'Ask them to teach it back to you.',
     '“The cycle is not complete until students can communicate what they have read and send their ideas back into the world.”'),
    ('Tip 2', 'Ask what they think of it, not just what happened.',
     '“If they can evaluate their reading, they have reached the highest form of reading.”'),
    ('Tip 3', 'Aim for want-to, not have-to.',
     '“One of the most important responsibilities of an educator is helping students catch the desire to read.” At home, that educator is you.'),
]
for i, (k, t, b) in enumerate(rp, start=2):
    art_slide(f'{R}-{i}.jpg', i, 7, k, t, b, cb, (300, 237))
end_slide(f'{R}-7.jpg', 7, 7, 'Their strength in math is real. Reading is how they’ll explain it to the world.',
          'The quotes here are from my book Motivating the Reluctant Reader. My books for parents and teachers are linked in my bio.',
          'Save this • Share with a parent')
add_art(f'{R}-7.jpg', cb.resize((340, 269)), (W - 420, 930))
print('done')
