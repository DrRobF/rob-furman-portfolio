# Wed 2026-11-18 extra: peanut-free table carousel (Rob's own story, from his LinkedIn post Wed 11-18 12:30)
exec(open('/home/claude/social/week7_images.py').read().split('# ---- Tue')[0])
pf = icons8.peanut_free()
P = f'{OUT}/wed-peanut'
art_cover(f'{P}-1.jpg', 'Principals and allergy parents',
          'One parent took peanut butter to the school board.', pf.resize((700, 553)), (190, 160), size=76)
sl = [
    ('Around 2010', 'A kindergartner arrived at my school with a peanut allergy.',
     'Severe enough that an adult walked the building with him, wiping down surfaces before he touched them.'),
    ('No playbook', 'The CDC didn’t publish its first food-allergy guidelines for schools until 2013.',
     'We were making it up in real time around one five-year-old.'),
    ('The ask', 'Leave the peanut butter at home. One room.',
     'Most parents said fine, I’ll pack something else. One did not. She went to the school board and argued that her son had a right to eat peanut butter in that classroom.'),
    ('The cost', 'The fight moved to the cafeteria.',
     'This kid couldn’t sit with his friends anymore, because their lunches could put him in an ambulance.'),
    ('The fix', 'So we built a peanut-free table.',
     'He could bring anyone he wanted, as long as their lunch was safe. He was with us from kindergarten through fourth grade.'),
]
for i, (k, t, b) in enumerate(sl, start=2):
    art_slide(f'{P}-{i}.jpg', i, 7, k, t, b, pf, (300, 237))
end_slide(f'{P}-7.jpg', 7, 7, 'The fight was never really about lunch. It never is.',
          'When a parent escalates, find out what they are actually asking for. How I prepare for those talks is in my Difficult Conversations Prep Kit.',
          'Prep kit: link in bio')
add_art(f'{P}-7.jpg', pf.resize((400, 316)), (W - 480, 830))
print('ok')
