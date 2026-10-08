from cards import *
OUT = '/home/claude/social/out/2026-10-19'
P = '/home/claude/social/photos'

# ---- Tue: feedback carousel (The Future Ready Challenge) ----
F = f'{OUT}/tue-feedback'
cover_slide(f'{F}-1.jpg', 'For teachers and school leaders',
            'How to give feedback that grows people, not crushes them', photo=f'{P}/Furman_9028_(2).jpg', pan=(0.5, 0.12), zoom=1.0)
fb = [
    ('The idea', '“Criticism, like rain, should be gentle enough to nourish growth without destroying roots.”', 'From The Future Ready Challenge', None),
    ('Step 1', 'Compliment', 'Start with what is working. Be specific, so they know exactly what to keep doing.', '1'),
    ('Step 2', 'Suggest', 'Offer one idea to try. Frame it as a possibility, not an order.', '2'),
    ('Step 3', 'Correct', 'Name what has to change, clearly and kindly. Talk about the work, never the person.', '3'),
    ('Teach kids this too', 'Kind critique is a skill.', 'Students who learn to give compliments, suggestions, and corrections grow into adults who can disagree without going for the jugular.', None),
]
for i, (k, t, b, g) in enumerate(fb, start=2):
    slide(f'{F}-{i}.jpg', i, 7, t, b, kicker=k, ghost=g)
end_slide(f'{F}-7.jpg', 7, 7, 'Compliment. Suggest. Correct.',
          'Try it in your next observation, your next staff meeting, or with your students tomorrow.',
          'Save this for your next hard conversation')

# ---- Thu: quote card ----
book = icons.open_book().resize((560, 368))
quote_card(f'{OUT}/thu-textbook-quote.jpg',
           'Just because a lesson is in a book doesn’t mean it’s the best lesson for your students.',
           'From The Future Ready Challenge (ISTE)', highlight={'best', 'your', 'students'}, art=book)

# ---- Sat: parents, books vs movies ----
R = f'{OUT}/sat-reader'
cover_slide(f'{R}-1.jpg', 'For parents', 'Your child knows every movie release date. But not one new book.')
rp = [
    ('You can’t be interested in something you don’t know exists.', 'Movies and games are marketed to kids nonstop. Books usually aren’t. That’s a fixable problem.'),
    ('Make new books an event.', 'Watch a book trailer together. Mark the release date of the next book in a series. Make it something to look forward to.'),
    ('Let them follow what grabs them.', 'If a book captures your child’s attention, let them explore it, even if it isn’t what you would have picked.'),
    ('Read the same story.', 'Some of the strongest family bonds are built through shared stories.'),
    ('Talk about it afterward.', 'The conversation after the book may be as important as the book itself.'),
]
for i, (t, b) in enumerate(rp, start=2):
    slide(f'{R}-{i}.jpg', i, 7, t, b, kicker=f'Tip {i - 1}' if i > 2 else 'The real problem', ghost=str(i - 2) if i > 2 else None)
end_slide(f'{R}-7.jpg', 7, 7, 'Give books the movie treatment.',
          'Twenty years as an elementary principal taught me this: kids rarely hate reading. They just haven’t met the right book yet.',
          'Save this • Share with a parent')
print('done')
