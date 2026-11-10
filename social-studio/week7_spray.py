# Thu 2026-11-19 extra: the happy spray interview (Rob's own story, told 2026-11-10)
exec(open('/home/claude/social/week7_images.py').read().split('# ---- Tue')[0])
sb = icons8.spray_bottle()
P = f'{OUT}/thu-spray'
art_cover(f'{P}-1.jpg', 'Principals and teachers',
          'A teacher candidate sprayed me in the face. In the interview.', sb.resize((700, 553)), (190, 160), size=76)
sl = [
    ('One summer', 'Close to 800 resumes for one elementary teaching position.', 'So you can imagine the stories I’ve gathered over the years.'),
    ('The question', '“How do you motivate students in a lesson?”', 'First-round screening interview. Ten questions. That type of thing.'),
    ('Her answer', '“I use my happy spray.”', 'Whenever a kid gets an answer correct, she sprays them in the face with her water bottle.'),
    ('Then it gets better', '“Oh, here, let me show you. I happen to have it.”',
     'In one motion: hand in her purse, spray bottle out, spray to my face. “Good job, Dr. Furman.”'),
    ('Me', 'Shocked. Stunned. Trying really hard not to laugh.',
     'She wasn’t wrong. It did make me chuckle. I just didn’t want the legal side of it when a kid didn’t want to be sprayed in the face.'),
]
for i, (k, t, b) in enumerate(sl, start=2):
    art_slide(f'{P}-{i}.jpg', i, 7, k, t, b, sb, (300, 237))
end_slide(f'{P}-7.jpg', 7, 7, 'Principals: what’s the wildest interview answer you’ve ever heard?',
          'As they say, you can’t make this stuff up. I bring stories like this to schools in my keynotes and workshops.',
          'Speaking: link in bio')
add_art(f'{P}-7.jpg', sb.resize((400, 316)), (W - 480, 830))
print('ok')
