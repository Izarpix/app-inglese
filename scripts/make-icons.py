"""
Generates every app icon from one drawing: a flat London telephone box.

Run with `python3 scripts/make-icons.py`. Kept in the repo so the icons can be
regenerated after a colour change instead of being binary blobs nobody can edit.
"""

from PIL import Image, ImageDraw

ROYAL = (1, 33, 105)
BOX_RED = (216, 35, 42)
ROOF_RED = (142, 18, 24)
CREAM = (243, 233, 210)
WHITE = (255, 255, 255)

# Every measurement is a fraction of the canvas, so one drawing scales anywhere.
S = 1024


def draw_icon(rounded: bool) -> Image.Image:
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    if rounded:
        d.rounded_rectangle([0, 0, S, S], radius=int(S * 0.22), fill=ROYAL)
    else:
        d.rectangle([0, 0, S, S], fill=ROYAL)

    # kiosk body
    left, right = int(S * 0.29), int(S * 0.71)
    top, bottom = int(S * 0.20), int(S * 0.84)
    width = right - left

    d.rounded_rectangle([left, top, right, bottom], radius=int(S * 0.04), fill=BOX_RED)

    # roof band
    d.rounded_rectangle(
        [left, top, right, top + int(S * 0.09)], radius=int(S * 0.035), fill=ROOF_RED
    )
    # TELEPHONE sign
    sign_top = top + int(S * 0.085)
    sign_bottom = sign_top + int(S * 0.075)
    d.rectangle([left, sign_top, right, sign_bottom], fill=CREAM)

    # window: 2 columns x 3 rows of panes
    pad = int(width * 0.14)
    win_top = sign_bottom + int(S * 0.045)
    win_bottom = bottom - int(S * 0.10)
    gap = int(width * 0.07)
    cols, rows = 2, 3
    pane_w = (right - left - 2 * pad - (cols - 1) * gap) / cols
    pane_h = (win_bottom - win_top - (rows - 1) * gap) / rows

    for c in range(cols):
        for r in range(rows):
            x0 = left + pad + c * (pane_w + gap)
            y0 = win_top + r * (pane_h + gap)
            d.rounded_rectangle(
                [x0, y0, x0 + pane_w, y0 + pane_h], radius=int(S * 0.012), fill=WHITE
            )

    # base
    d.rectangle([left, bottom - int(S * 0.045), right, bottom], fill=ROOF_RED)

    return img


def save(img: Image.Image, path: str, size: int, background=None) -> None:
    out = img.resize((size, size), Image.LANCZOS)
    if background is not None:
        flat = Image.new("RGB", (size, size), background)
        flat.paste(out, (0, 0), out)
        out = flat
    out.save(path)
    print(f"{path}  {size}x{size}")


square = draw_icon(rounded=False)
rounded = draw_icon(rounded=True)

# native app icons
save(square, "assets/images/icon.png", 1024)
save(square, "assets/images/android-icon-foreground.png", 1024)
save(square, "assets/images/splash-icon.png", 512)
save(square, "assets/images/favicon.png", 64)

# web / Safari home screen
save(square, "public/apple-touch-icon.png", 180, background=ROYAL)
save(rounded, "public/icon-192.png", 192)
save(rounded, "public/icon-512.png", 512)
save(square, "public/favicon.png", 64)
