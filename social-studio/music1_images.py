from cards import *
import icons4
OUT = '/home/claude/social/out/2026-11-02'
import os; os.makedirs(OUT, exist_ok=True)
def add_art(path, art, xy):
    im = Image.open(path).convert('RGBA'); im.alpha_composite(art, xy); save(im, path)
def art_cover(path, kicker, title, art, art_xy, total=7):
    im = gradient_bg(W, H).convert('RGBA'); im.alpha_composite(art, art_xy)
    d = ImageDraw.Draw(im)
    d.text((80, 790), kicker.upper(), font=font('Bold', 32), fill=ACCENT)
    text_block(d, (80, 850), title, font('ExtraBold', 84), WHITE, W-160, 1.1)
    d.text((W-80-d.textlength('swipe →', font=font('Bold', 30)), 70), 'swipe →', font=font('Bold', 30), fill=WHITE)
    d.text((80, H-90), 'Dr. Rob Furman', font=font('Bold', 28), fill=WHITE)
    d.text((W-80-d.textlength(f'1/{total}', font=font('Medium', 28)), H-90), f'1/{total}', font=font('Medium', 28), fill=MUTED)
    return save(im, path)
T = f'{OUT}/music-drummer'
art_cover(f'{T}-1.jpg', 'Before I was a principal, I was a musician',
          'My snare drum ripped mid-show. I kept playing.', icons4.snare(), (160, 130))
small = icons4.snare().resize((260, 192))
ls = [
 ('Lesson 1', 'A band is project-based learning.', 'Every song was a project: learn it, prepare it, perform it. We all shared one goal, to get it as right as we could. Staying upbeat and energized together is a great way to run a school too.'),
 ('Lesson 2', 'Celebrate the wins, even the odd ones.', 'Every football game our marching band played was a win to us. Even with no score, we beat the other band. End of story.'),
 ('Lesson 3', 'Speak the same language.', 'It is easier to teach and learn when everyone speaks the same language. Music has one. When two musicians share it, magic can happen.'),
 ('Lesson 4', 'Love the work. People can hear it.', 'The more we loved the songs, the better they sounded, and the more fun we had learning our craft.'),
 ('Lesson 5', 'Never grade practice like a performance.', 'Homework is practice. The unit test is the performance. Do not grade them the same way.'),
]
for i, (k, t, b) in enumerate(ls, start=2):
    slide(f'{T}-{i}.jpg', i, 7, t, b, kicker=k, ghost=str(i-1))
    add_art(f'{T}-{i}.jpg', small, (W-340, H-300))
end_slide(f'{T}-7.jpg', 7, 7, 'And always carry a spare drum head.',
          'Fellow musicians: which of the five hit home? Tell me in the comments.',
          'Save this • Tag a musician')
add_art(f'{T}-7.jpg', small, (W-340, 980))
print('done')
