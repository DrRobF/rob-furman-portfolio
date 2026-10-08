"""Dr. Rob Furman social brand toolkit: cards, carousels, and vertical videos."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import subprocess, os, math

FONT_DIR = '/usr/share/fonts/opentype/inter/'
SITE = '/home/claude/rob-furman-portfolio/public'
NAVY = (15, 27, 51)
NAVY_2 = (23, 37, 63)
WHITE = (255, 255, 255)
MUTED = (195, 205, 224)
ACCENT = (110, 160, 255)
GOLD = (242, 184, 75)


def font(weight, size):
    return ImageFont.truetype(f'{FONT_DIR}Inter-{weight}.otf', size)


def wrap(draw, text, fnt, width):
    lines = []
    for para in text.split('\n'):
        line = ''
        for word in para.split():
            test = (line + ' ' + word).strip()
            if draw.textlength(test, font=fnt) <= width:
                line = test
            else:
                if line:
                    lines.append(line)
                line = word
        lines.append(line)
    return lines


def text_block(draw, xy, text, fnt, fill, width, line_h=1.18, align='left', highlight=None):
    """Draw wrapped text. Words in `highlight` (set of lowercase words) get the accent color."""
    x, y = xy
    lines = wrap(draw, text, fnt, width)
    size = fnt.size
    for ln in lines:
        lw = draw.textlength(ln, font=fnt)
        cx = x if align == 'left' else x + (width - lw) / 2
        if highlight:
            for i, word in enumerate(ln.split(' ')):
                w = word + (' ' if i < len(ln.split(' ')) - 1 else '')
                key = ''.join(ch for ch in word.lower() if ch.isalnum() or ch == "'")
                draw.text((cx, y), w, font=fnt, fill=ACCENT if key in highlight else fill)
                cx += draw.textlength(w, font=fnt)
        else:
            draw.text((cx, y), ln, font=fnt, fill=fill)
        y += int(size * line_h)
    return y


def gradient_bg(w, h):
    im = Image.new('RGB', (w, h), NAVY)
    d = ImageDraw.Draw(im)
    for i in range(h):
        t = i / h
        c = tuple(int(NAVY[k] * (1 - t) + NAVY_2[k] * t) for k in range(3))
        d.line([(0, i), (w, i)], fill=c)
    return im


_head = None


def headshot(size):
    global _head
    if _head is None:
        src = Image.open(f'{SITE}/images/headshot-blue.jpg').convert('RGB')
        # square crop around the face
        w, h = src.size
        _head = src.crop((150, 60, 1050, 960))
    im = _head.resize((size, size), Image.LANCZOS)
    mask = Image.new('L', (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4, size * 4), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    im.putalpha(mask)
    return im


def footer(im, y, x=80, light=True, sub='Principal · Author · TEDx Speaker'):
    d = ImageDraw.Draw(im)
    hs = headshot(96)
    im.paste(hs, (x, y), hs)
    d.text((x + 120, y + 14), 'Dr. Rob Furman', font=font('Bold', 34), fill=WHITE if light else NAVY)
    d.text((x + 120, y + 56), sub, font=font('Medium', 24), fill=MUTED if light else (80, 90, 110))


def save(im, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.convert('RGB').save(path, quality=92)
    return path


# ---------- video ----------

def ease(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def cover_crop(src, w, h, zoom=1.0, pan=(0.5, 0.5)):
    sw, sh = src.size
    scale = max(w / sw, h / sh) * zoom
    rw, rh = int(sw * scale), int(sh * scale)
    im = src.resize((rw, rh), Image.LANCZOS)
    left = int((rw - w) * pan[0])
    top = int((rh - h) * pan[1])
    return im.crop((left, top, left + w, top + h))


class Video:
    """Frame-by-frame renderer piped into ffmpeg. 1080x1920, 30fps."""

    def __init__(self, path, w=1080, h=1920, fps=30):
        self.path, self.w, self.h, self.fps = path, w, h, fps
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.proc = subprocess.Popen(
            ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
             '-s', f'{w}x{h}', '-r', str(fps), '-i', '-',
             '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
             '-shortest', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
             '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', path],
            stdin=subprocess.PIPE)

    def frame(self, im):
        self.proc.stdin.write(im.convert('RGB').tobytes())

    def close(self):
        self.proc.stdin.close()
        self.proc.wait()
        return self.path


def fade_text_layer(w, h, draw_fn, alpha):
    layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(layer))
    if alpha < 1:
        a = layer.getchannel('A').point(lambda v: int(v * alpha))
        layer.putalpha(a)
    return layer
