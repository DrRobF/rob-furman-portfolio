# Week of 2026-11-09 (6th autopilot week)
from cards import *
import icons, icons7
OUT = '/home/claude/social/out/2026-11-09'


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
    """Lesson slide with the illustration in the lower right, clear of the text block."""
    slide(path, n, total, title, body, kicker=kicker)
    a = art.resize(size)
    top = 110
    # place art in the empty band above the text block; shrink if the block starts high
    im = Image.open(path); d = ImageDraw.Draw(im)
    th = len(wrap(d, title, font('ExtraBold', 84), W - 160)) * int(84 * 1.12)
    bh = (len(wrap(d, body, font('Regular', 48), W - 160)) * int(48 * 1.38) + 44) if body else 0
    ytext = max(150, (H - (th + bh + 60)) // 2 + 40)
    room = ytext - top - 30
    if room < size[1]:
        size = (int(size[0] * room / size[1]), room)
        a = art.resize(size)
    add_art(path, a, (W - size[0] - 80, top))


# ---- Tue: Where I Learned It: my dad, the principal (Rob's own stories, 2026-10-22) ----
T = f'{OUT}/tue-dad'
art_cover(f'{T}-1.jpg', 'Before I was a principal, I was a principal’s kid', '3 things my dad taught me about leading.',
          Image.new('RGBA', (1, 1)), (0, 0), total=5)
add_art(f'{T}-1.jpg', icons7.pizza().resize((360, 325)), (70, 170))
add_art(f'{T}-1.jpg', icons7.duck().resize((340, 295)), (400, 330))
add_art(f'{T}-1.jpg', icons7.plow().resize((300, 221)), (720, 170))
art_slide(f'{T}-2.jpg', 2, 5, 'Lesson 1', 'The power of pizza.',
          'My dad bribed my friends with lunch to come help at his school. I had no idea it was a management tactic. For the price of lunch, he got a lot of work out of them.',
          icons7.pizza(), (300, 271))
art_slide(f'{T}-3.jpg', 3, 5, 'Lesson 2', '“Kiss your ducks in the morning, your day is bound to get better.”',
          'His way of saying: don’t let the rough things hang over you. Get them done and get them behind you.',
          icons7.duck(), (300, 260))
art_slide(f'{T}-4.jpg', 4, 5, 'Lesson 3', 'Look where you’re going, not at your feet.',
          'My dad was a farmer’s kid. Plowing the garden, if you watch your feet, the line comes out crooked. Look way out to where you’re aiming, and it comes out straight.',
          icons7.plow(), (340, 250))
end_slide(f'{T}-5.jpg', 5, 5, 'Feed your people. Do the hard thing first. Keep your eyes on the goal.',
          'Simple lessons from a principal who never called them lessons. I talk about leading people like this in my keynotes and school workshops.',
          'Speaking: link in bio')
add_art(f'{T}-5.jpg', icons7.plow().resize((380, 280)), (W - 460, 760))

# ---- Thu: quote card (The Future Ready Challenge) ----
def quote_card2(path, quote, source, highlight=None, art=None, size=72):
    im = gradient_bg(W, H).convert('RGBA')
    im.alpha_composite(art, (W - art.size[0] - 60, 70))
    d = ImageDraw.Draw(im)
    d.text((72, 400), '“', font=font('Black', 200), fill=ACCENT)
    y = text_block(d, (80, 570), quote, font('ExtraBold', size), WHITE, W - 160, 1.14, highlight=highlight)
    d.text((80, y + 30), source, font=font('Medium', 32), fill=MUTED)
    footer(im, H - 170)
    return save(im, path)


quote_card2(f'{OUT}/thu-habit-quote.jpg',
            'It takes 28 days to create a pattern, but 90 days to create a habit.',
            'From The Future Ready Challenge (ISTE)', highlight={'pattern', 'habit.'},
            art=icons7.calendar().resize((440, 385)), size=82)

# ---- Fri: What would you do? Scenario 06, The Edited Field-Trip Form (carousel) ----
F = f'{OUT}/fri-fieldtrip'
art_cover(f'{F}-1.jpg', 'Principals and teachers', 'What would you do? The edited field-trip form.',
          icons7.field_trip().resize((700, 553)), (190, 150))
ft = icons7.field_trip()
fp = [
    ('The form', 'A parent returns the field-trip permission form, with handwritten changes.',
     'It’s the board-approved form, written by the school attorney.'),
    ('Her edits', 'Her changes say the school can’t use the form to escape responsibility if her child gets hurt.', None),
    ('You explain', 'The school is responsible for her child on the trip either way.',
     'The form mainly confirms she knows her child will be off campus.'),
    ('Then', 'She still refuses to sign a clean copy.', 'The trip is coming up.'),
    ('Your call', 'Keep arguing? Keep the child home? Or find out what the law actually requires?',
     'Comment your call. What I chose is in the first comment.'),
]
for i, (k, t, b) in enumerate(fp, start=2):
    art_slide(f'{F}-{i}.jpg', i, 7, k, t, b, ft, (300, 237))
end_slide(f'{F}-7.jpg', 7, 7, '12 real dilemmas. What I actually chose.',
          'This is one of the scenarios in my What Would You Do? 12 School Leadership Scenarios deck, built for leadership teams and PD.',
          'Get the deck: link in bio')
add_art(f'{F}-7.jpg', icons7.field_trip().resize((420, 332)), (W - 500, 790))

# ---- Sat: parents, reading is social (Motivating the Reluctant Reader) ----
R = f'{OUT}/sat-together'
art_cover(f'{R}-1.jpg', 'For parents', 'Your child doesn’t want to read alone.',
          icons7.two_readers().resize((660, 486)), (W - 720, 170))
tr = icons7.two_readers()
rp = [
    ('The idea', '“Children want to feel relevant, connected, and part of a group.”', 'From my book Motivating the Reluctant Reader. Reading is no different.'),
    ('Tip 1', 'Find them a reading buddy.', '“Children want to know they are not the only ones who feel a certain way about a story.” A friend, a cousin, a grandparent on the same book.'),
    ('Tip 2', 'Read the book they’re reading.', '“Some of the strongest family bonds are built through shared stories.”'),
    ('Tip 3', 'Say yes to the book their friends love.', 'Being part of what the group is reading can be the whole reason to pick it up.'),
    ('Tip 4', 'Be the inspiration.', '“We can’t expect our children to develop a love of reading if we don’t provide them with inspiration for doing so.”'),
]
for i, (k, t, b) in enumerate(rp, start=2):
    art_slide(f'{R}-{i}.jpg', i, 7, k, t, b, tr, (300, 221))
end_slide(f'{R}-7.jpg', 7, 7, 'Reading alone is a skill. Reading together is a reason.',
          'The quotes here are from my book Motivating the Reluctant Reader. My books for parents and teachers are linked in my bio.',
          'Save this • Share with a parent')
add_art(f'{R}-7.jpg', icons7.two_readers().resize((440, 324)), (W - 520, 800))
print('done')
