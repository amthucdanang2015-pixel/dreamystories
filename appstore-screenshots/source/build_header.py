#!/usr/bin/env python3
"""Compose App Store "Header and Search Results" creative assets.

Header: 3840x1646. Search Results: 3840x2560.

Rendered by headless Chrome at 1920x1280 CSS px with device scale factor 2.
Key content is kept in the centre so it survives portrait cropping on iPhone.

    python3 appstore-screenshots/source/build_header.py
"""
import pathlib
import subprocess

from build import CSS as BASE_CSS, cap, phone, STARS_NIGHT, ICON, CHROME  # noqa: F401

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / "header-search"
TMP = HERE / ".html"
W, H = 1920, 1280
COVERS = HERE.parent.parent / "assets/images/online-stories"


def cover(slug):
    return (COVERS / slug / "cover.png").as_uri()


CSS = BASE_CSS + f"""
html, body {{ width:{W}px !important; height:{H}px !important; }}
.card {{ position:absolute; border-radius:34px; background-size:cover; background-position:center;
         box-shadow:0 0 0 3px rgba(243,227,181,.35), 0 40px 90px rgba(0,0,0,.55); }}
.center {{ position:absolute; left:0; right:0; text-align:center; z-index:10; }}
.hicon {{ width:132px; height:132px; border-radius:30px; margin:0 auto 34px;
          background:url('{ICON}') center/cover; box-shadow:0 20px 50px rgba(0,0,0,.45), 0 0 0 2px rgba(243,227,181,.35); }}
.ey {{ font-size:26px; font-weight:700; letter-spacing:.24em; text-transform:uppercase; color:#D9BC85; }}
.big {{ font-family:Georgia, 'Times New Roman', serif; font-weight:700; font-size:80px; line-height:1.08;
        letter-spacing:-.015em; color:#F1E9D4; margin-top:22px; }}
.sub {{ font-size:34px; line-height:1.4; color:rgba(232,223,200,.8); margin-top:26px; }}
.glow {{ position:absolute; border-radius:50%; background:radial-gradient(closest-side, rgba(243,227,181,.22), rgba(243,227,181,0)); }}
"""

STARS_WIDE = "".join(
    f'<i class="star" style="left:{x}px;top:{y}px;width:{s}px;height:{s}px;opacity:{o}"></i>'
    for x, y, s, o in [
        (80, 90, 5, .7), (240, 210, 3, .5), (420, 70, 4, .55), (610, 160, 3, .45), (760, 60, 4, .5),
        (1150, 80, 3, .5), (1320, 190, 4, .55), (1500, 60, 5, .6), (1700, 230, 3, .45), (1850, 110, 4, .6),
        (60, 520, 3, .4), (1870, 600, 4, .45), (130, 1100, 4, .4), (1800, 1150, 3, .4), (980, 1220, 3, .35),
        (700, 1180, 3, .35), (1240, 1160, 4, .4), (40, 820, 3, .35), (1880, 880, 3, .35),
    ])


SIZES = {}  # slide name -> CSS height (width is always W); output is 2x


def page(cls, body, h=H):
    fix = f"html, body {{ height:{h}px !important; }}"
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}{fix}</style></head><body class='{cls}'>{body}</body></html>"


slides = {}

# Header — product page hero, 3840x1646 (Apple's header size). Night sky,
# story artwork flanking a centred title; key copy stays in the middle third.
HH = 823
SIZES["header"] = HH
slides["header"] = page("night", f"""
{STARS_WIDE}
<div class="glow" style="left:680px;top:60px;width:560px;height:560px"></div>
<div class="moon" style="left:1700px;top:70px;width:96px;height:96px;box-shadow:-26px 14px 0 0 #E8D39E"></div>
<div class="card" style="left:110px;top:130px;width:330px;height:330px;transform:rotate(-7deg);background-image:url('{cover("meo-con-chuc-ngu-ngon")}')"></div>
<div class="card" style="left:250px;top:450px;width:255px;height:255px;transform:rotate(5deg);background-image:url('{cover("chiec-o-mau-vang")}')"></div>
<div class="card" style="left:1460px;top:250px;width:340px;height:340px;transform:rotate(7deg);background-image:url('{cover("ca-vang-dem-sao")}')"></div>
<div class="center" style="top:170px">
  <div class="hicon" style="width:104px;height:104px;border-radius:24px;margin-bottom:26px"></div>
  <div class="ey" style="font-size:22px">Dreamy Stories</div>
  <div class="big" style="font-size:70px;margin-top:16px">Bedtime stories in<br>English &amp; Tiếng&nbsp;Việt</div>
  <div class="sub" style="font-size:28px;margin-top:20px">Gentle tales, read aloud, line by line.</div>
</div>
""", h=HH)

# Search results — show the product: real app screens on warm paper.
slides["search-results"] = page("paper", f"""
<i class="dot" style="left:1700px;top:110px;width:14px;height:14px"></i>
<i class="dot" style="left:1820px;top:260px;width:9px;height:9px"></i>
<i class="dot" style="left:120px;top:1150px;width:10px;height:10px"></i>
<div class="copy" style="top:150px;left:0;width:{W}px;text-align:center">
  <div class="eyebrow" style="font-size:28px;margin-bottom:20px">Dreamy Stories</div>
  <h1 style="font-size:86px">Bilingual bedtime stories</h1>
  <p style="font-size:34px;margin-top:20px">English &amp; Tiếng Việt · Read aloud · Learn new words</p>
</div>
{phone(cap("library_folk"), 300, 560, 400, z=1, extra="transform:rotate(-6deg);")}
{phone(cap("home"), 760, 500, 400, z=3)}
{phone(cap("reader_play2"), 1220, 560, 400, z=2, extra="transform:rotate(6deg);")}
""")


def render():
    TMP.mkdir(exist_ok=True)
    OUT.mkdir(exist_ok=True)
    for name, html in slides.items():
        src = TMP / f"{name}.html"
        src.write_text(html, encoding="utf-8")
        png = TMP / f"{name}.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--force-device-scale-factor=2", f"--window-size={W},{SIZES.get(name, H)}",
                        f"--screenshot={png}", src.as_uri()],
                       check=True, capture_output=True)
        # App Store Connect wants PNG without alpha: flatten via a JPEG round trip.
        jpg = TMP / f"{name}.jpg"
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "100", str(png),
                        "--out", str(jpg)], check=True, capture_output=True)
        subprocess.run(["sips", "-s", "format", "png", str(jpg), "--out", str(OUT / f"{name}.png")],
                       check=True, capture_output=True)
        print(name, OUT / f"{name}.png")


if __name__ == "__main__":
    render()
