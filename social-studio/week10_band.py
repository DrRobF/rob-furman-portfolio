# Week of 2026-12-07: Tue band-tour carousel (Rob's own words, sent 2026-11-26)
from cards import *
import icons12
OUT = '/home/claude/social/out/2026-12-07'
exec('\n'.join(l for l in open('/home/claude/social/week8_images.py').read().split('# ---- Mon 10:00')[0].splitlines()
               if not l.startswith(('from cards', 'import icons9', 'OUT ='))))
tc = icons12.tour_case()
art_cover(f'{OUT}/tue-band-1.jpg', 'Before I was a principal', 'I was a band director. Band took me places I never would have gone.',
          tc.resize((700, 553)), (190, 170), size=76)
for i, (k, t, art) in enumerate([
    ('Paris', 'I performed under the Eiffel Tower.', icons12.eiffel()),
    ('Berlin', 'I performed behind the Berlin Wall.', icons12.berlin_wall()),
    ('Shakespeare and Mozart', 'I was at the houses of Shakespeare and Mozart.', icons12.two_houses()),
    ('Switzerland', 'I performed in Lucerne.', icons12.lucerne()),
    ('The Alps', 'I traveled over the Saint Bernard Pass.', icons12.alps_pass()),
], start=2):
    art_slide(f'{OUT}/tue-band-{i}.jpg', i, 7, k, t, 'Opportunities I never would have had without band.', art, size=(640, 505))
end_slide(f'{OUT}/tue-band-7.jpg', 7, 7, 'And so many more. Join band!',
          'I still teach music. My course Write, Record, Release gives every middle schooler the chance to write, produce and release an original song.',
          'The course: link in bio')
add_art(f'{OUT}/tue-band-7.jpg', tc.resize((400, 316)), (W - 480, 900))
print('ok')
