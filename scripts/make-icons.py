"""
Generates every app icon from the high-resolution London brand master.

Run with `python3 scripts/make-icons.py`. The single source of truth is
`assets/images/brand-master.png`, so Safari, the PWA manifest and native builds
always show the same mark.
"""

from PIL import Image, ImageDraw

ROYAL = (16, 42, 67)
ROYAL_LIGHT = (36, 75, 109)
BOX_RED = (214, 69, 69)
ROOF_RED = (155, 35, 51)
CREAM = (246, 243, 236)
GOLD = (242, 193, 78)
TUBE_BLUE = (86, 145, 210)
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

    # A simplified Tube map behind the kiosk: visible as movement at small
    # sizes, recognisable as London when the home-screen icon is viewed large.
    routes = [
        ((-80, 760, 1080, 320), BOX_RED, 24),
        ((-40, 270, 1070, 660), GOLD, 20),
        ((80, 930, 920, 70), TUBE_BLUE, 18),
    ]
    for coords, colour, width in routes:
        d.line(coords, fill=colour, width=width)
    for x, y, colour in [(146, 675, BOX_RED), (805, 565, GOLD), (746, 244, TUBE_BLUE)]:
        d.ellipse([x - 22, y - 22, x + 22, y + 22], fill=CREAM, outline=colour, width=11)

    # A soft backing plate separates the detailed kiosk from the route map.
    d.rounded_rectangle([250, 166, 774, 894], radius=72, fill=ROYAL_LIGHT)

    # kiosk body
    left, right = int(S * 0.30), int(S * 0.70)
    top, bottom = int(S * 0.20), int(S * 0.84)
    width = right - left

    d.rounded_rectangle([left, top, right, bottom], radius=int(S * 0.04), fill=BOX_RED)

    # K6 crown cap and a slim highlight give the flat drawing some crafted depth.
    d.rounded_rectangle(
        [int(S * 0.43), int(S * 0.175), int(S * 0.57), int(S * 0.215)],
        radius=int(S * 0.014),
        fill=GOLD,
    )

    # roof band
    d.rounded_rectangle(
        [left, top, right, top + int(S * 0.09)], radius=int(S * 0.035), fill=ROOF_RED
    )
    # TELEPHONE sign
    sign_top = top + int(S * 0.085)
    sign_bottom = sign_top + int(S * 0.075)
    d.rectangle([left, sign_top, right, sign_bottom], fill=CREAM)
    d.ellipse(
        [int(S * 0.475), sign_top + int(S * 0.012), int(S * 0.525), sign_bottom - int(S * 0.012)],
        fill=GOLD,
    )

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
                [x0, y0, x0 + pane_w, y0 + pane_h],
                radius=int(S * 0.012),
                fill=(235, 242, 245),
            )

    # Door split and handle survive even on the 64 px favicon.
    centre = (left + right) // 2
    d.line([centre, sign_bottom, centre, bottom], fill=ROOF_RED, width=int(S * 0.012))
    d.ellipse(
        [centre + int(S * 0.035), int(S * 0.66), centre + int(S * 0.052), int(S * 0.677)],
        fill=GOLD,
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


square = Image.open("assets/images/brand-master.png").convert("RGBA")

# native app icons
save(square, "assets/images/icon.png", 1024)
save(square, "assets/images/android-icon-foreground.png", 1024)
save(square, "assets/images/splash-icon.png", 512)
save(square, "assets/images/favicon.png", 64)

# web / Safari home screen
save(square, "public/apple-touch-icon.png", 180, background=ROYAL)
save(square, "public/icon-192.png", 192)
save(square, "public/icon-512.png", 512)
save(square, "public/favicon.png", 64)
