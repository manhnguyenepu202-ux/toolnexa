"""Generate illustrated SVG covers for blog posts.

Run:  python scripts/make-covers.py
Writes public/img/covers/<slug>.svg. Each cover is a small flat illustration
built from simple shapes, coloured from the post's cover colour. Logos for
first looks are embedded as data URIs so the SVG works inside <img>.
"""
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "img" / "covers"
W, H = 1200, 750

GREEN = "#22C55E"
RED = "#EF4444"
AMBER = "#F59E0B"
PEACH = "#FDBA74"
CREAM = "#FEF3C7"
INK = "#0F172A"
SOFT = "#E2E8F0"
MUTED = "#CBD5E1"


def mix(hex_a, hex_b, t):
    a = [int(hex_a[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(hex_b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x + (y - x) * t):02X}" for x, y in zip(a, b))


def frame(color, body):
    dark = mix(color, "#0B1120", 0.45)
    light = mix(color, "#FFFFFF", 0.35)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{light}"/><stop offset=".55" stop-color="{color}"/><stop offset="1" stop-color="{dark}"/></linearGradient>
  <radialGradient id="glow" cx=".25" cy=".2" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#fff" fill-opacity=".12"/></pattern>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#0B1120" flood-opacity=".28"/></filter>
  <filter id="sh2" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0B1120" flood-opacity=".25"/></filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<rect width="{W}" height="{H}" fill="url(#dots)"/>
<rect width="{W}" height="{H}" fill="url(#glow)"/>
<circle cx="1080" cy="660" r="260" fill="#fff" fill-opacity=".07"/>
<circle cx="120" cy="700" r="160" fill="#fff" fill-opacity=".06"/>
{body}
</svg>
'''


# ── primitives ──
def card(x, y, w, h, r=26, fill="#fff", shadow="sh", extra=""):
    f = f' filter="url(#{shadow})"' if shadow else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"{f} {extra}/>'


def line(x, y, w, h=14, fill=SOFT, r=7):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"/>'


def badge(cx, cy, r, fill, kind, stroke="#fff", sw=None):
    sw = sw or max(4, r * 0.18)
    s = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" filter="url(#sh2)"/>'
    k = r * 0.45
    if kind == "check":
        s += f'<path d="M{cx - k} {cy + k * 0.05} L{cx - k * 0.25} {cy + k * 0.75} L{cx + k} {cy - k * 0.6}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
    elif kind == "x":
        s += f'<path d="M{cx - k * 0.75} {cy - k * 0.75} L{cx + k * 0.75} {cy + k * 0.75} M{cx + k * 0.75} {cy - k * 0.75} L{cx - k * 0.75} {cy + k * 0.75}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round"/>'
    elif kind == "star":
        pts = []
        import math
        for i in range(10):
            ang = -math.pi / 2 + i * math.pi / 5
            rr = k * 1.15 if i % 2 == 0 else k * 0.5
            pts.append(f"{cx + rr * math.cos(ang):.1f},{cy + rr * math.sin(ang):.1f}")
        s += f'<polygon points="{" ".join(pts)}" fill="{stroke}"/>'
    elif kind == "play":
        s += f'<path d="M{cx - k * 0.55} {cy - k * 0.85} L{cx + k * 0.95} {cy} L{cx - k * 0.55} {cy + k * 0.85} Z" fill="{stroke}"/>'
    elif kind == "bolt":
        s += f'<path d="M{cx + k * 0.15} {cy - k * 1.1} L{cx - k * 0.7} {cy + k * 0.15} L{cx - k * 0.05} {cy + k * 0.15} L{cx - k * 0.2} {cy + k * 1.1} L{cx + k * 0.7} {cy - k * 0.2} L{cx + k * 0.05} {cy - k * 0.2} Z" fill="{stroke}"/>'
    elif kind == "lock":
        s += f'<rect x="{cx - k * 0.75}" y="{cy - k * 0.1}" width="{k * 1.5}" height="{k * 1.1}" rx="{k * 0.2}" fill="{stroke}"/><path d="M{cx - k * 0.45} {cy - k * 0.1} V{cy - k * 0.5} a{k * 0.45} {k * 0.45} 0 0 1 {k * 0.9} 0 V{cy - k * 0.1}" fill="none" stroke="{stroke}" stroke-width="{sw * 0.8}"/>'
    return s


def sparkle(cx, cy, r, fill="#fff", op=0.9):
    return f'<path d="M{cx} {cy - r} Q{cx + r * 0.18} {cy - r * 0.18} {cx + r} {cy} Q{cx + r * 0.18} {cy + r * 0.18} {cx} {cy + r} Q{cx - r * 0.18} {cy + r * 0.18} {cx - r} {cy} Q{cx - r * 0.18} {cy - r * 0.18} {cx} {cy - r} Z" fill="{fill}" fill-opacity="{op}"/>'


def envelope(x, y, w, h, fill="#fff", flap="#E2E8F0", shadow="sh"):
    return (card(x, y, w, h, r=18, fill=fill, shadow=shadow) +
            f'<path d="M{x + 10} {y + 14} L{x + w / 2} {y + h * 0.58} L{x + w - 10} {y + 14}" fill="none" stroke="{flap}" stroke-width="{max(6, w * 0.035)}" stroke-linejoin="round" stroke-linecap="round"/>')


def window(x, y, w, h, color, title=True):
    s = card(x, y, w, h, r=24)
    s += f'<path d="M{x} {y + 24} a24 24 0 0 1 24 -24 h{w - 48} a24 24 0 0 1 24 24 v26 h-{w} Z" fill="{mix(color, "#FFFFFF", 0.85)}"/>'
    for i, c in enumerate(["#F87171", "#FBBF24", "#34D399"]):
        s += f'<circle cx="{x + 30 + i * 24}" cy="{y + 25}" r="7" fill="{c}"/>'
    if title:
        s += line(x + 120, y + 18, w * 0.35, 14, fill="#fff", r=7)
    return s


def magnifier(cx, cy, r, color):
    return (f'<g filter="url(#sh2)"><line x1="{cx + r * 0.7}" y1="{cy + r * 0.7}" x2="{cx + r * 1.45}" y2="{cy + r * 1.45}" stroke="{INK}" stroke-width="{r * 0.28}" stroke-linecap="round"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff" fill-opacity=".92" stroke="{INK}" stroke-width="{r * 0.16}"/></g>'
            f'<circle cx="{cx}" cy="{cy}" r="{r * 0.62}" fill="{mix(color, "#FFFFFF", 0.75)}"/>' +
            sparkle(cx, cy, r * 0.4, fill=color, op=1))


def logo_badge(cx, cy, r, slug):
    p = ROOT / "public" / "img" / "logos" / f"{slug}.png"
    data = base64.b64encode(p.read_bytes()).decode()
    clip = f"clip-{slug}"
    return (f'<defs><clipPath id="{clip}"><circle cx="{cx}" cy="{cy}" r="{r * 0.78}"/></clipPath></defs>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff" filter="url(#sh)"/>'
            f'<image x="{cx - r * 0.78}" y="{cy - r * 0.78}" width="{r * 1.56}" height="{r * 1.56}" clip-path="url(#{clip})" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{data}" xlink:href="data:image/png;base64,{data}"/>')


def pill(x, y, w, h, fill, text_fill=None):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h / 2}" fill="{fill}"/>'


def text(x, y, s, size, fill=INK, weight=800, anchor="start"):
    return f'<text x="{x}" y="{y}" font-family="Plus Jakarta Sans, Segoe UI, Arial, sans-serif" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{s}</text>'


# ── scenes ──
def scene_test_week(c):
    s = card(250, 130, 620, 470, r=30)
    s += f'<path d="M250 160 a30 30 0 0 1 30 -30 h560 a30 30 0 0 1 30 30 v60 h-620 Z" fill="{c}"/>'
    s += f'<rect x="330" y="104" width="22" height="60" rx="11" fill="{INK}"/><rect x="768" y="104" width="22" height="60" rx="11" fill="{INK}"/>'
    s += text(560, 200, "7-DAY TEST", 34, fill="#fff", anchor="middle")
    cells = [(0, 0), (1, 0), (2, 0), (3, 0), (0, 1), (1, 1), (2, 1)]
    for i, (gx, gy) in enumerate(cells):
        x = 290 + gx * 140
        y = 250 + gy * 160
        s += f'<rect x="{x}" y="{y}" width="120" height="135" rx="20" fill="{mix(c, "#FFFFFF", 0.9)}"/>'
        s += text(x + 16, y + 34, f"D{i + 1}", 22, fill=mix(c, INK, 0.4), weight=700)
        if i < 6:
            s += badge(x + 60, y + 82, 30, GREEN, "check")
        else:
            s += badge(x + 60, y + 82, 30, AMBER, "star")
    # credit card
    s += f'<g transform="rotate(-10 950 470)">{card(810, 400, 300, 190, r=22, fill=INK)}<rect x="810" y="440" width="300" height="34" fill="#334155"/>{line(840, 510, 120, 16, fill="#475569")}{line(840, 540, 70, 16, fill="#475569")}<rect x="1030" y="505" width="50" height="38" rx="8" fill="{PEACH}"/></g>'
    s += badge(1080, 370, 52, c, "lock")
    s += sparkle(960, 170, 26) + sparkle(1010, 240, 14) + sparkle(170, 560, 20)
    return s


def scene_refund(c):
    # receipt
    x, y, w, h = 190, 110, 360, 500
    zig = " ".join(f"L{x + w - i * 30} {y + h + (14 if i % 2 else 0)}" for i in range(0, 13))
    s = f'<path d="M{x} {y + 24} a24 24 0 0 1 24 -24 h{w - 48} a24 24 0 0 1 24 24 V{y + h} {zig} L{x} {y + h} Z" fill="#fff" filter="url(#sh)"/>'
    s += text(x + w / 2, y + 70, "RECEIPT", 30, fill=mix(c, INK, 0.3), anchor="middle")
    for i in range(6):
        s += line(x + 40, y + 110 + i * 46, 170 - (i % 3) * 30, 14)
        s += line(x + w - 110, y + 110 + i * 46, 70, 14, fill=MUTED)
    s += line(x + 40, y + 410, w - 80, 4, fill=MUTED, r=2)
    s += text(x + 40, y + 460, "TOTAL", 26, fill=INK)
    s += line(x + w - 140, y + 440, 100, 24, fill=mix(c, "#FFFFFF", 0.6), r=12)
    s += f'<g transform="rotate(-14 470 370)"><rect x="380" y="320" width="230" height="96" rx="16" fill="none" stroke="{RED}" stroke-width="9"/>' + text(495, 384, "NO REFUND", 34, fill=RED, anchor="middle") + '</g>'
    # chart card
    s += card(640, 170, 400, 380, r=28)
    bars = [(50, RED, "50%"), (23, AMBER, "23%"), (27, GREEN, "27%")]
    for i, (v, col, lab) in enumerate(bars):
        bh = v * 5.2
        bx = 690 + i * 115
        s += f'<rect x="{bx}" y="{500 - bh}" width="80" height="{bh}" rx="14" fill="{col}"/>'
        s += text(bx + 40, 490 - bh, lab, 26, fill=INK, anchor="middle")
    s += line(670, 506, 340, 6, fill=SOFT, r=3)
    s += magnifier(1010, 180, 70, c)
    s += sparkle(600, 120, 22) + sparkle(1100, 600, 18)
    return s


def first_look(c, slug, motif):
    s = window(170, 140, 760, 470, c)
    x0, y0 = 170, 190
    if motif == "email":
        s += line(x0 + 50, y0 + 50, 90, 16, fill=MUTED) + line(x0 + 160, y0 + 50, 300, 16)
        s += line(x0 + 50, y0 + 90, 90, 16, fill=MUTED) + line(x0 + 160, y0 + 90, 220, 16)
        for i in range(5):
            s += line(x0 + 50, y0 + 150 + i * 34, 600 - (i % 2) * 140, 16)
        s += f'<rect x="{x0 + 50}" y="{y0 + 340}" width="170" height="54" rx="27" fill="{c}"/>' + text(x0 + 135, y0 + 376, "Generate", 24, fill="#fff", anchor="middle")
        s += sparkle(x0 + 600, y0 + 360, 30, fill=c, op=1)
    elif motif == "record":
        s += f'<rect x="{x0 + 40}" y="{y0 + 30}" width="680" height="350" rx="18" fill="{mix(c, INK, 0.55)}"/>'
        s += line(x0 + 80, y0 + 80, 260, 18, fill="#475569") + line(x0 + 80, y0 + 120, 380, 18, fill="#334155") + line(x0 + 80, y0 + 160, 320, 18, fill="#334155")
        s += badge(x0 + 380, y0 + 230, 56, "#fff", "play", stroke=c)
        s += f'<circle cx="{x0 + 640}" cy="{y0 + 300}" r="62" fill="{PEACH}" stroke="#fff" stroke-width="8"/><circle cx="{x0 + 640}" cy="{y0 + 285}" r="22" fill="#fff" fill-opacity=".9"/><path d="M{x0 + 606} {y0 + 340} a34 30 0 0 1 68 0" fill="#fff" fill-opacity=".9"/>'
        s += f'<circle cx="{x0 + 80}" cy="{y0 + 345}" r="12" fill="{RED}"/>' + line(x0 + 102, y0 + 337, 80, 16, fill="#475569")
    elif motif == "api":
        s += f'<rect x="{x0 + 40}" y="{y0 + 30}" width="680" height="370" rx="18" fill="{INK}"/>'
        rows = [(0, 120, c), (1, 220, PEACH), (1, 160, "#7DD3FC"), (2, 260, "#86EFAC"), (2, 140, PEACH), (1, 200, "#7DD3FC"), (0, 60, c)]
        for i, (ind, wd, col) in enumerate(rows):
            s += line(x0 + 80 + ind * 40, y0 + 70 + i * 44, wd, 16, fill=col)
            s += line(x0 + 80 + ind * 40 + wd + 16, y0 + 70 + i * 44, 90, 16, fill="#334155")
        s += text(x0 + 640, y0 + 120, "{ }", 64, fill="#fff", anchor="middle")
    elif motif == "video":
        s += f'<rect x="{x0 + 40}" y="{y0 + 30}" width="680" height="370" rx="18" fill="{mix(c, INK, 0.35)}"/>'
        s += f'<circle cx="{x0 + 520}" cy="{y0 + 140}" r="60" fill="{PEACH}"/>'
        s += f'<path d="M{x0 + 40} {y0 + 330} L{x0 + 230} {y0 + 170} L{x0 + 380} {y0 + 290} L{x0 + 480} {y0 + 220} L{x0 + 720} {y0 + 360} V{y0 + 400} H{x0 + 40} Z" fill="{mix(c, "#FFFFFF", 0.35)}"/>'
        s += badge(x0 + 380, y0 + 215, 50, "#fff", "play", stroke=c)
        for i in range(9):
            s += f'<rect x="{x0 + 60 + i * 74}" y="{y0 + 410}" width="50" height="12" rx="4" fill="{MUTED}"/>'
    elif motif == "app":
        s += f'<rect x="{x0 + 260}" y="{y0 + 20}" width="240" height="400" rx="34" fill="{INK}"/><rect x="{x0 + 274}" y="{y0 + 40}" width="212" height="360" rx="24" fill="#fff"/>'
        s += f'<rect x="{x0 + 294}" y="{y0 + 64}" width="172" height="90" rx="14" fill="{mix(c, "#FFFFFF", 0.75)}"/>'
        for i in range(3):
            s += line(x0 + 294, y0 + 180 + i * 40, 172 - i * 30, 18)
        s += f'<rect x="{x0 + 294}" y="{y0 + 320}" width="172" height="48" rx="24" fill="{c}"/>'
        for i, (bx, by) in enumerate([(60, 70), (60, 230), (560, 90), (560, 250)]):
            s += f'<rect x="{x0 + bx}" y="{y0 + by}" width="140" height="110" rx="18" fill="{mix([c, PEACH, "#7DD3FC", "#86EFAC"][i], "#FFFFFF", 0.35)}"/>'
            s += line(x0 + bx + 20, y0 + by + 70, 90, 14, fill="#fff")
    s += logo_badge(930, 180, 92, slug)
    s += f'<g filter="url(#sh2)"><rect x="770" y="540" width="300" height="76" rx="38" fill="{INK}"/></g>' + text(920, 590, "FIRST LOOK", 30, fill="#fff", anchor="middle")
    s += magnifier(1060, 420, 64, c)
    s += sparkle(120, 120, 24) + sparkle(1110, 90, 16)
    return s


def scene_verify(c):
    s = card(220, 110, 560, 520, r=30)
    rows = [("check", GREEN), ("x", RED), ("check", GREEN), ("check", GREEN), ("x", AMBER)]
    for i, (k, col) in enumerate(rows):
        y = 150 + i * 94
        s += envelope(260, y, 100, 68, fill=mix(c, "#FFFFFF", 0.85), flap=mix(c, "#FFFFFF", 0.4), shadow=None)
        s += line(390, y + 14, 220 - (i % 2) * 50, 16) + line(390, y + 42, 140, 14, fill=MUTED)
        s += badge(710, y + 34, 28, col, k)
    s += f'<g filter="url(#sh)"><path d="M960 170 L1080 215 V330 C1080 420 1020 480 960 510 C900 480 840 420 840 330 V215 Z" fill="#fff"/></g>'
    s += f'<path d="M960 205 L1048 238 V330 C1048 402 1003 452 960 476 C917 452 872 402 872 330 V238 Z" fill="{c}"/>'
    s += f'<path d="M915 335 L948 368 L1010 300" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>'
    s += f'<g filter="url(#sh2)"><rect x="850" y="545" width="220" height="70" rx="35" fill="{INK}"/></g>' + text(960, 592, "VERIFIED", 28, fill="#fff", anchor="middle")
    s += sparkle(1120, 120, 22) + sparkle(160, 640, 18)
    return s


def scene_choose_email(c):
    s = ""
    specs = [(180, 200, 270, 380, False), (465, 140, 290, 460, True), (770, 200, 270, 380, False)]
    for i, (x, y, w, h, hi) in enumerate(specs):
        s += card(x, y, w, h, r=26, fill="#fff")
        if hi:
            s += f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="26" fill="none" stroke="{c}" stroke-width="8"/>'
            s += f'<rect x="{x + w / 2 - 80}" y="{y - 22}" width="160" height="44" rx="22" fill="{c}"/>' + text(x + w / 2, y + 9, "BEST FIT", 22, fill="#fff", anchor="middle")
        s += text(x + 34, y + 90, "$" * (i + 1), 52, fill=INK)
        s += line(x + 34, y + 120, 90, 14, fill=MUTED)
        for j in range(4):
            s += badge(x + 46, y + 180 + j * 52, 13, GREEN if (j < 3 or hi) else MUTED, "check", sw=4)
            s += line(x + 72, y + 172 + j * 52, w - 120, 14)
    s += f'<g transform="rotate(12 1040 170)">{envelope(960, 110, 170, 115, flap=mix(c, "#FFFFFF", 0.3))}</g>'
    s += badge(1105, 120, 30, RED, "star")
    s += sparkle(130, 140, 24) + sparkle(1100, 620, 18)
    return s


def scene_deliverability(c):
    s = ""
    # motion lines
    for i, (y, w) in enumerate([(220, 160), (270, 110), (320, 140)]):
        s += f'<rect x="{150}" y="{y}" width="{w}" height="12" rx="6" fill="#fff" fill-opacity=".55"/>'
    s += f'<g transform="rotate(-8 420 270)">{envelope(320, 190, 220, 150, flap=mix(c, "#FFFFFF", 0.3))}</g>'
    s += f'<path d="M560 270 C640 250 690 280 720 330" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>'
    # inbox tray
    s += card(640, 330, 380, 250, r=30)
    s += f'<path d="M680 430 H780 L810 480 H850 L880 430 H980 V540 H680 Z" fill="{mix(c, "#FFFFFF", 0.82)}"/>'
    s += text(830, 395, "INBOX", 30, fill=mix(c, INK, 0.3), anchor="middle")
    s += badge(1010, 340, 44, GREEN, "check")
    # checklist
    s += card(180, 420, 380, 230, r=26)
    for j in range(4):
        s += badge(222, 465 + j * 48, 14, GREEN if j < 3 else MUTED, "check", sw=4)
        s += line(250, 457 + j * 48, 250 - j * 30, 16)
    s += f'<g filter="url(#sh2)"><path d="M1040 110 L1110 135 V200 C1110 250 1075 280 1040 296 C1005 280 970 250 970 200 V135 Z" fill="#fff"/></g>'
    s += f'<path d="M1012 200 L1032 220 L1070 178" fill="none" stroke="{c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'
    s += sparkle(620, 120, 22) + sparkle(1120, 640, 16)
    return s


def scene_small_business(c):
    s = card(200, 200, 520, 420, r=24)
    stripes = ""
    for i in range(8):
        col = c if i % 2 == 0 else "#fff"
        stripes += f'<path d="M{200 + i * 65} 200 h65 v70 a32.5 32.5 0 0 1 -65 0 Z" fill="{col}"/>'
    s += f'<path d="M180 160 h560 v40 h-560 Z" fill="{mix(c, INK, 0.3)}"/>' + stripes
    s += f'<rect x="250" y="360" width="160" height="260" rx="10" fill="{mix(c, "#FFFFFF", 0.8)}"/><circle cx="385" cy="495" r="8" fill="{c}"/>'
    s += f'<rect x="450" y="360" width="220" height="150" rx="14" fill="{mix("#7DD3FC", "#FFFFFF", 0.4)}"/>'
    s += f'<rect x="465" y="430" width="70" height="60" rx="8" fill="{PEACH}"/><rect x="550" y="400" width="100" height="90" rx="8" fill="#fff" fill-opacity=".8"/>'
    # AI helpers around
    s += badge(860, 230, 70, "#fff", "star", stroke=c)
    s += badge(980, 400, 58, "#fff", "bolt", stroke=AMBER)
    s += f'<g filter="url(#sh2)"><circle cx="860" cy="530" r="78" fill="#fff"/></g><circle cx="860" cy="530" r="60" fill="none" stroke="{c}" stroke-width="10"/><path d="M860 490 V530 L890 552" fill="none" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>'
    s += sparkle(1080, 200, 34) + sparkle(1060, 560, 20) + sparkle(780, 120, 22)
    return s


def scene_prompt(c):
    s = window(180, 120, 640, 500, c)
    bubbles = [(220, 210, 360, 70, "#fff", True), (420, 300, 360, 90, c, False), (220, 420, 400, 70, "#fff", True), (480, 510, 300, 56, c, False)]
    s += f'<rect x="180" y="170" width="640" height="450" fill="{mix(c, "#FFFFFF", 0.9)}"/>'
    for x, y, w, h, col, left in bubbles:
        fill = "#fff" if left else col
        s += f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="22" fill="{fill}" filter="url(#sh2)"/>'
        lc = SOFT if left else mix(col, "#FFFFFF", 0.45)
        s += line(x + 24, y + 22, w * 0.7, 14, fill=lc)
        if h > 60:
            s += line(x + 24, y + h - 34, w * 0.45, 14, fill=lc)
    # megaphone
    s += f'<g transform="rotate(-18 990 330)" filter="url(#sh)"><path d="M890 290 L1050 210 V450 L890 370 Z" fill="#fff"/><rect x="860" y="290" width="44" height="80" rx="10" fill="{PEACH}"/><rect x="900" y="368" width="34" height="80" rx="12" fill="{INK}"/></g>'
    for i, (dx, dy) in enumerate([(1090, 230), (1110, 320), (1090, 410)]):
        s += f'<rect x="{dx}" y="{dy}" width="60" height="12" rx="6" fill="#fff" fill-opacity=".8" transform="rotate({-20 + i * 20} {dx} {dy})"/>'
    s += sparkle(130, 120, 24) + sparkle(1080, 600, 22) + sparkle(900, 140, 16)
    return s


def scene_automations(c):
    nodes = [(170, 300, "#fff", "bolt", AMBER), (470, 160, "#fff", "check", GREEN), (470, 440, "#fff", "star", c), (790, 300, "#fff", "play", "#0EA5E9")]
    s = ""
    edges = [((300, 365), (470, 225)), ((300, 365), (470, 505)), ((600, 225), (790, 365)), ((600, 505), (790, 365))]
    for (x1, y1), (x2, y2) in edges:
        mx = (x1 + x2) / 2
        s += f'<path d="M{x1} {y1} C{mx} {y1} {mx} {y2} {x2} {y2}" fill="none" stroke="#fff" stroke-width="10" stroke-opacity=".85" stroke-dasharray="2 18" stroke-linecap="round"/>'
    for x, y, fill, k, col in nodes:
        s += card(x, y, 130, 130, r=28)
        s += badge(x + 65, y + 65, 38, col, k)
    s += f'<g filter="url(#sh)"><circle cx="1040" cy="230" r="90" fill="#fff"/></g><circle cx="1040" cy="230" r="70" fill="none" stroke="{c}" stroke-width="12"/><path d="M1040 180 V230 L1076 256" fill="none" stroke="{INK}" stroke-width="12" stroke-linecap="round"/>'
    s += f'<path d="M985 140 a95 95 0 0 1 120 0" fill="none" stroke="{AMBER}" stroke-width="12" stroke-linecap="round"/>'
    s += card(820, 520, 300, 110, r=24) + text(970, 590, "Hours back", 40, fill=mix(c, INK, 0.3), anchor="middle")
    s += sparkle(140, 140, 26) + sparkle(700, 640, 20) + sparkle(1130, 420, 16)
    return s


SCENES = {
    "test-ai-tool-before-you-pay": scene_test_week,
    "ai-tool-refund-policies-study": scene_refund,
    "toolsaday-first-look": lambda c: first_look(c, "toolsaday", "email"),
    "kommodo-first-look": lambda c: first_look(c, "kommodo", "record"),
    "context-dev-first-look": lambda c: first_look(c, "context-dev", "api"),
    "vidu-first-look": lambda c: first_look(c, "vidu", "video"),
    "pexo-first-look": lambda c: first_look(c, "pexo", "video"),
    "medo-first-look": lambda c: first_look(c, "medo", "app"),
    "best-email-verification-tools": scene_verify,
    "how-to-choose-email-marketing-software": scene_choose_email,
    "email-deliverability-checklist": scene_deliverability,
    "ai-tools-for-small-business": scene_small_business,
    "chatgpt-prompt-framework-for-marketers": scene_prompt,
    "automations-to-save-hours": scene_automations,
}


def main():
    import subprocess, json
    colors = json.loads(subprocess.check_output(
        ["node", "-e", "const C=require('./src/lib/content');console.log(JSON.stringify(Object.fromEntries(C.posts.map(p=>[p.slug,p.coverColor]))))"],
        cwd=ROOT, text=True))
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, fn in SCENES.items():
        if slug not in colors:
            continue
        svg = frame(colors[slug], fn(colors[slug]))
        (OUT / f"{slug}.svg").write_text(svg, encoding="utf-8")
        print(f"{slug}: {len(svg) // 1024} KB")
    missing = [s for s in colors if s not in SCENES]
    if missing:
        print("No scene yet for:", ", ".join(missing))


if __name__ == "__main__":
    main()
