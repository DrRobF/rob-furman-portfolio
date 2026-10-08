from brand import *
from PIL import ImageOps
import icons

W, H = 1080, 1350


def quote_card(path, quote, source, highlight=None, eyebrow=None, art=None):
    im = gradient_bg(W, H).convert('RGBA')
    card = art if art is not None else icons.report_card().rotate(-9, expand=True, resample=Image.BICUBIC).resize((520, 640))
    im.alpha_composite(card, (W - card.size[0] + 50, 60))
    d = ImageDraw.Draw(im)
    qf = font('ExtraBold', 86)
    d.text((72, 560), '\u201C', font=font('Black', 200), fill=ACCENT)
    y = text_block(d, (80, 720), quote, qf, WHITE, W - 160, 1.12, highlight=highlight)
    d.text((80, y + 30), source, font=font('Medium', 32), fill=MUTED)
    footer(im, H - 170)
    return save(im, path)


def slide(path, n, total, title, body=None, kicker=None, big=False, ghost=None):
    im = gradient_bg(W, H)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 10], fill=ACCENT)
    if ghost:
        gf = font('Black', 520)
        d.text((W - 60 - d.textlength(ghost, font=gf), 40), ghost, font=gf, fill=(32, 52, 92))
    tf, bf = font('ExtraBold', 84), font('Regular', 48)
    # measure, then center the block vertically
    th = len(wrap(d, title, tf, W - 160)) * int(84 * 1.12)
    bh = (len(wrap(d, body, bf, W - 160)) * int(48 * 1.38) + 44) if body else 0
    kh = 60 if kicker else 0
    y = max(150, (H - (th + bh + kh)) // 2 + 40)
    if kicker:
        d.text((80, y), kicker.upper(), font=font('Bold', 32), fill=ACCENT); y += kh
    y = text_block(d, (80, y), title, tf, WHITE, W - 160, 1.12)
    if body:
        y = text_block(d, (80, y + 44), body, bf, MUTED, W - 160, 1.38)
    if 'band' in path:
        im = im.convert('RGBA'); im.alpha_composite(icons.music_staff(1080, 200, notes=((200 + 120 * n, n % 5), (520, (n + 2) % 5), (840, (n + 4) % 5)), color=(40, 62, 104), note_color=(70, 104, 170)), (0, H - 330)); d = ImageDraw.Draw(im)
    if 'reader' in path:
        im = im.convert('RGBA'); im.alpha_composite(icons.open_book().resize((300, 197)), (W - 380, H - 330)); d = ImageDraw.Draw(im)
    d.text((80, H - 90), 'Dr. Rob Furman', font=font('Bold', 28), fill=WHITE)
    pg = f'{n}/{total}'
    d.text((W - 80 - d.textlength(pg, font=font('Medium', 28)), H - 90), pg, font=font('Medium', 28), fill=MUTED)
    if n < total:
        d.text((W - 80 - d.textlength('swipe →', font=font('Bold', 28)), 60), 'swipe →', font=font('Bold', 28), fill=MUTED)
    return save(im, path)


def cover_slide(path, kicker, title, photo=None, total=7, pan=(0.5, 0.4), zoom=1.0):
    im = gradient_bg(W, H).convert('RGBA')
    if photo:
        src = ImageOps.exif_transpose(Image.open(photo)).convert('RGB')
        p = cover_crop(src, W, 860, zoom, pan).convert('RGBA')
        fade = Image.new('L', (W, 860), 255)
        fd = ImageDraw.Draw(fade)
        for i in range(560, 860):
            fd.line([(0, i), (W, i)], fill=int(255 * (1 - (i - 560) / 300)))
        im.paste(p, (0, 0), fade)
    d = ImageDraw.Draw(im)
    if not photo and 'reader' in path:
        im.alpha_composite(icons.open_book().resize((640, 420)), (W - 700, 160)); d = ImageDraw.Draw(im)
    if not photo and 'band' in path:
        im.alpha_composite(icons.baton().resize((440, 440)), (W - 470, 90))
        im.alpha_composite(icons.music_staff(1080, 300), (0, 470))
        d = ImageDraw.Draw(im)
    d.text((80, 790), kicker.upper(), font=font('Bold', 32), fill=ACCENT)
    text_block(d, (80, 850), title, font('ExtraBold', 88), WHITE, W - 160, 1.1)
    d.text((W - 80 - d.textlength('swipe \u2192', font=font('Bold', 30)), 70), 'swipe \u2192', font=font('Bold', 30), fill=WHITE)
    d.text((80, H - 90), 'Dr. Rob Furman', font=font('Bold', 28), fill=WHITE)
    d.text((W - 80 - d.textlength(f'1/{total}', font=font('Medium', 28)), H - 90), f'1/{total}', font=font('Medium', 28), fill=MUTED)
    return save(im, path)


def end_slide(path, n, total, title, body, cta):
    im = gradient_bg(W, H)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 10], fill=ACCENT)
    y = text_block(d, (80, 200), title, font('ExtraBold', 72), WHITE, W - 160, 1.12)
    y = text_block(d, (80, y + 40), body, font('Regular', 40), MUTED, W - 160, 1.4)
    # CTA pill
    f = font('Bold', 40)
    tw = d.textlength(cta, font=f)
    d.rounded_rectangle([80, y + 60, 80 + tw + 80, y + 160], radius=50, fill=ACCENT)
    d.text((120, y + 86), cta, font=f, fill=NAVY)
    footer(im, H - 190)
    d.text((W - 80 - d.textlength(f'{n}/{total}', font=font('Medium', 28)), H - 90), f'{n}/{total}', font=font('Medium', 28), fill=MUTED)
    return save(im, path)


