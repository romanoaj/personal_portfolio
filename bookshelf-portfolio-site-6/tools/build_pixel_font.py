"""Build the small project-local pixel serif webfont.

The glyph silhouettes are rasterized on a deliberately coarse grid from the
freely redistributable DejaVu Serif Bold font, then rebuilt as square
TrueType contours. See assets/fonts/LICENSE.txt for the source font license.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen


ROOT = Path(__file__).resolve().parents[1]
SOURCE_FONT = Path("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf")
OUTPUT_TTF = ROOT / "assets/fonts/cabinet-pixel-serif.ttf"

UNITS_PER_EM = 1024
PIXEL_UNITS = 64
RASTER_SIZE = 16
BASELINE = 23
THRESHOLD = 104

CODEPOINTS = list(range(0x20, 0x7F)) + list(range(0x00A0, 0x0100)) + [
    0x2013,  # en dash
    0x2014,  # em dash
    0x2018,  # left single quote
    0x2019,  # right single quote
    0x201C,  # left double quote
    0x201D,  # right double quote
    0x2026,  # ellipsis
    0x2022,  # bullet
    0x20AC,  # euro
    0x2192,  # right arrow
    0x2197,  # north-east arrow
    0x2726,  # four-pointed star
]


def glyph_name(codepoint: int) -> str:
    return f"uni{codepoint:04X}"


def empty_glyph():
    return TTGlyphPen(None).glyph()


def notdef_glyph():
    pen = TTGlyphPen(None)
    for x, y in ((0, 0), (0, 12), (7, 12), (7, 0)):
        if (x, y) == (0, 0):
            pen.moveTo((x * PIXEL_UNITS, y * PIXEL_UNITS))
        else:
            pen.lineTo((x * PIXEL_UNITS, y * PIXEL_UNITS))
    pen.closePath()
    for x, y in ((1, 1), (6, 1), (6, 11), (1, 11)):
        if (x, y) == (1, 1):
            pen.moveTo((x * PIXEL_UNITS, y * PIXEL_UNITS))
        else:
            pen.lineTo((x * PIXEL_UNITS, y * PIXEL_UNITS))
    pen.closePath()
    return pen.glyph()


def raster_cells(font: ImageFont.FreeTypeFont, character: str):
    if character == "✦":
        # A hand-plotted nine-by-nine sparkle; the source typeface does not
        # contain this decorative glyph.
        return [
            (5, 13),
            (5, 14),
            (4, 15), (5, 15), (6, 15),
            (3, 16), (4, 16), (5, 16), (6, 16), (7, 16),
            (1, 17), (2, 17), (3, 17), (4, 17), (5, 17), (6, 17), (7, 17), (8, 17), (9, 17),
            (3, 18), (4, 18), (5, 18), (6, 18), (7, 18),
            (4, 19), (5, 19), (6, 19),
            (5, 20),
            (5, 21),
        ], 11

    canvas = Image.new("L", (48, 40), 0)
    draw = ImageDraw.Draw(canvas)
    draw.text((6, BASELINE), character, font=font, fill=255, anchor="ls")

    cells = []
    pixels = canvas.load()
    for y in range(canvas.height):
        for x in range(canvas.width):
            if pixels[x, y] >= THRESHOLD:
                cells.append((x, y))

    if not cells:
        return [], 0

    min_x = min(x for x, _ in cells)
    max_x = max(x for x, _ in cells)
    normalized = [(x - min_x + 1, y) for x, y in cells]
    return normalized, max_x - min_x + 3


def pixel_glyph(cells):
    pen = TTGlyphPen(None)
    for x, y in cells:
        x0 = x * PIXEL_UNITS
        y0 = (BASELINE - y - 1) * PIXEL_UNITS
        x1 = x0 + PIXEL_UNITS
        y1 = y0 + PIXEL_UNITS
        pen.moveTo((x0, y0))
        pen.lineTo((x1, y0))
        pen.lineTo((x1, y1))
        pen.lineTo((x0, y1))
        pen.closePath()
    return pen.glyph()


def build_font():
    source = ImageFont.truetype(str(SOURCE_FONT), RASTER_SIZE)
    glyph_order = [".notdef"]
    cmap = {}
    glyphs = {".notdef": notdef_glyph()}
    metrics = {".notdef": (9 * PIXEL_UNITS, PIXEL_UNITS)}

    for codepoint in CODEPOINTS:
        name = glyph_name(codepoint)
        character = chr(codepoint)
        glyph_order.append(name)
        cmap[codepoint] = name

        if character in {" ", "\u00a0"}:
            glyphs[name] = empty_glyph()
            metrics[name] = (5 * PIXEL_UNITS, 0)
            continue

        cells, width = raster_cells(source, character)
        glyphs[name] = pixel_glyph(cells)
        metrics[name] = (max(width, 3) * PIXEL_UNITS, 0)

    builder = FontBuilder(UNITS_PER_EM, isTTF=True)
    builder.setupGlyphOrder(glyph_order)
    builder.setupCharacterMap(cmap)
    builder.setupGlyf(glyphs)
    builder.setupHorizontalMetrics(metrics)
    builder.setupHorizontalHeader(ascent=896, descent=-256, lineGap=128)
    builder.setupNameTable(
        {
            "familyName": "Cabinet Pixel Serif",
            "styleName": "Regular",
            "uniqueFontIdentifier": "Cabinet Pixel Serif 1.0",
            "fullName": "Cabinet Pixel Serif Regular",
            "psName": "CabinetPixelSerif-Regular",
            "version": "Version 1.0",
            "copyright": "Derived from DejaVu fonts; see bundled LICENSE.txt.",
            "licenseDescription": "Distributed under the Bitstream Vera font license.",
        }
    )
    builder.setupOS2(
        sTypoAscender=896,
        sTypoDescender=-256,
        sTypoLineGap=128,
        usWinAscent=896,
        usWinDescent=256,
        usWeightClass=700,
        sxHeight=448,
        sCapHeight=704,
    )
    builder.setupPost(underlinePosition=-128, underlineThickness=64)
    builder.setupMaxp()

    OUTPUT_TTF.parent.mkdir(parents=True, exist_ok=True)
    builder.save(str(OUTPUT_TTF))

if __name__ == "__main__":
    build_font()
