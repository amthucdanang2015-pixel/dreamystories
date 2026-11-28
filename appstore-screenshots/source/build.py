#!/usr/bin/env python3
"""Compose App Store screenshots from real simulator captures.

Captures live in ./captures (1320x2868, iPhone 17 Pro Max simulator, Release build).
Each slide is an HTML page rendered by headless Chrome at exactly 1320x2868 (6.9"),
then resampled to 1206x2622 (6.3").

    python3 appstore-screenshots/source/build.py
"""
import os
import subprocess
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
CAPS = HERE / "captures"
OUT69 = HERE.parent / "6.9in"
OUT63 = HERE.parent / "6.3in"
TMP = HERE / ".html"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
W, H = 1320, 2868
SW, SH = 1320, 2868  # capture size

ICON = (HERE.parent.parent / "assets/images/icon.png").as_uri()


def cap(name):
    return (CAPS / f"{name}.png").as_uri()


# ---------------------------------------------------------------- building blocks

def phone(img, left, top, width, z=1, extra=""):
    """Device frame with the real screenshot inside. Screen keeps its exact aspect ratio."""
    bezel = round(width * 0.022)
    sw = width - 2 * bezel
    sh = round(sw * SH / SW)
    r_out = round(width * 0.155)
    r_in = r_out - bezel
    isl_w, isl_h = round(sw * 0.285), round(sw * 0.083)
    isl_top = round(sh * 0.0145)
    return f"""
<div class="phone" style="left:{left}px;top:{top}px;width:{width}px;height:{sh + 2*bezel}px;
     border-radius:{r_out}px;padding:{bezel}px;z-index:{z};{extra}">
  <div class="screen" style="width:{sw}px;height:{sh}px;border-radius:{r_in}px;background-image:url('{img}')"></div>
  <div class="island" style="width:{isl_w}px;height:{isl_h}px;top:{bezel + isl_top}px;left:{bezel + (sw-isl_w)//2}px"></div>
</div>"""


def callout(img, box, scale, left, top, radius=44, z=5, extra=""):
    """Enlarged crop of a real screenshot region (x1, y1, x2, y2 in capture pixels)."""
    x1, y1, x2, y2 = box
    w, h = round((x2 - x1) * scale), round((y2 - y1) * scale)
    return f"""
<div class="callout" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;border-radius:{radius}px;z-index:{z};
     background-image:url('{img}');background-size:{round(SW*scale)}px {round(SH*scale)}px;
     background-position:{-round(x1*scale)}px {-round(y1*scale)}px;{extra}"></div>"""


def text(eyebrow, title, sub, align="left", top=190, night=False, width=1100, left=110):
    return f"""
<div class="copy {'dark' if night else ''}" style="top:{top}px;left:{left}px;width:{width}px;text-align:{align}">
  <div class="eyebrow">{eyebrow}</div>
  <h1>{title}</h1>
  <p>{sub}</p>
</div>"""


STARS_NIGHT = "".join(
    f'<i class="star" style="left:{x}px;top:{y}px;width:{s}px;height:{s}px;opacity:{o}"></i>'
    for x, y, s, o in [
        (90, 120, 6, .7), (260, 90, 4, .5), (1180, 150, 5, .6), (1240, 520, 4, .5), (70, 640, 5, .55),
        (980, 80, 3, .5), (520, 60, 4, .45), (1270, 900, 5, .5), (40, 1100, 4, .45), (1220, 1500, 4, .4),
        (60, 1900, 5, .45), (1260, 2300, 4, .4), (30, 2600, 4, .35), (720, 140, 3, .5),
    ])

STARS_PAPER = "".join(
    f'<i class="dot" style="left:{x}px;top:{y}px;width:{s}px;height:{s}px"></i>'
    for x, y, s in [(1120, 140, 12), (1230, 300, 8), (960, 96, 7), (1265, 520, 9)])

CSS = f"""
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:{W}px; height:{H}px; overflow:hidden; }}
body {{ position:relative; font-family:-apple-system, 'SF Pro Text', system-ui, sans-serif;
       -webkit-font-smoothing:antialiased; }}
.paper {{ background:
    radial-gradient(900px 700px at 92% 4%, rgba(243,227,181,.95), rgba(243,227,181,0) 70%),
    radial-gradient(1100px 900px at 0% 100%, rgba(184,201,176,.35), rgba(184,201,176,0) 70%),
    linear-gradient(180deg, #F8F4EA 0%, #F1EAD8 100%); }}
.sage {{ background:
    radial-gradient(900px 700px at 8% 4%, rgba(243,227,181,.8), rgba(243,227,181,0) 70%),
    radial-gradient(1200px 1000px at 100% 100%, rgba(124,139,110,.35), rgba(124,139,110,0) 70%),
    linear-gradient(180deg, #F3F1E6 0%, #E7E7D6 100%); }}
.night {{ background:
    radial-gradient(800px 640px at 84% 6%, rgba(243,227,181,.28), rgba(243,227,181,0) 70%),
    linear-gradient(180deg, #1C2240 0%, #151A31 55%, #10131F 100%); }}
.moon {{ position:absolute; border-radius:50%; }}
.star {{ position:absolute; border-radius:50%; background:#F3E3B5; }}
.dot {{ position:absolute; border-radius:50%; background:#C6A66B; opacity:.55; }}
.copy {{ position:absolute; z-index:10; color:#26271F; }}
.eyebrow {{ font-size:34px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#85652B; margin-bottom:30px; }}
h1 {{ font-family:Georgia, 'Times New Roman', serif; font-weight:700; font-size:118px; line-height:1.05;
      letter-spacing:-.015em; text-wrap:balance; }}
.copy p {{ font-size:46px; line-height:1.36; color:#4F5048; margin-top:34px; font-weight:400; text-wrap:balance; }}
.copy.dark {{ color:#F1E9D4; }}
.copy.dark .eyebrow {{ color:#D9BC85; }}
.copy.dark p {{ color:rgba(232,223,200,.78); }}
.phone {{ position:absolute; background:#0E0E10;
          box-shadow: 0 0 0 5px #4A4A4F, 0 0 0 7px #1d1d20, 0 70px 140px rgba(48,40,22,.30), 0 20px 40px rgba(48,40,22,.18); }}
.night .phone, body.night .phone {{ box-shadow: 0 0 0 5px #5a5d6e, 0 0 0 7px #1d1d20, 0 70px 160px rgba(0,0,0,.55); }}
.screen {{ background-size:100% 100%; background-repeat:no-repeat; }}
.island {{ position:absolute; background:#000; border-radius:999px; }}
.callout {{ position:absolute; background-repeat:no-repeat;
            box-shadow: 0 0 0 3px rgba(255,255,255,.9), 0 50px 100px rgba(48,40,22,.30), 0 14px 30px rgba(48,40,22,.18); }}
.brand {{ position:absolute; width:150px; height:150px; border-radius:36px; background:url('{ICON}') center/cover;
          box-shadow:0 18px 40px rgba(48,40,22,.18), 0 0 0 2px rgba(198,166,107,.25); z-index:10; }}
"""


def page(cls, body):
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body class='{cls}'>{body}</body></html>"


# ---------------------------------------------------------------- slides

slides = {}

# 1 — Hero: what the app is.
slides["01-bilingual-bedtime"] = page("paper", f"""
{STARS_PAPER}
<div class="brand" style="left:{(W-150)//2}px;top:150px"></div>
{text("Dreamy Stories", "Bedtime stories in English &amp; Tiếng&nbsp;Việt",
      "Gentle tales and Vietnamese folk stories to share at bedtime.", align="center", top=350)}
{phone(cap("home"), 165, 1020, 990)}
""")

# 2 — Read aloud, sentence by sentence (bilingual narration + highlight).
slides["02-read-aloud"] = page("paper", f"""
{STARS_PAPER}
{text("Read aloud", "Listen along, line by line",
      "Each sentence is read in English, then in Vietnamese, and highlighted as it plays.")}
{phone(cap("reader_play2"), 300, 800, 940)}
{callout(cap("reader_play2"), (91, 1258, 1229, 1770), 0.98, 70, 1640)}
""")

# 3 — Learning Mode word card.
slides["03-learn-words"] = page("sage", f"""
{text("Learning Mode", "Tap a word to learn what it means",
      "See its Vietnamese meaning, pronunciation and an example from the story.", align="center")}
{phone(cap("word"), 200, 900, 920)}
{callout(cap("word"), (126, 904, 1198, 1966), 1.06, 92, 1480, radius=58)}
""")

# 4 — Moonlight reading appearance + sleep timer.
slides["04-moonlight"] = page("night", f"""
{STARS_NIGHT}
<div class="moon" style="left:1060px;top:120px;width:140px;height:140px;box-shadow:-38px 20px 0 0 #E8D39E"></div>
{text("Moonlight", "Calm pages for sleepy eyes",
      "A warm, dimmed reading page, plus a sleep timer that stops the narration for you.", night=True, width=1000)}
{phone(cap("moon"), 200, 880, 920)}
{callout(cap("sleep"), (62, 662, 1258, 1030), 0.93, 104, 2330, radius=46,
         extra="box-shadow:0 0 0 3px rgba(217,188,133,.55),0 50px 110px rgba(0,0,0,.6);")}
""")

# 5 — Folk tales library + story detail.
slides["05-folk-tales"] = page("paper", f"""
{STARS_PAPER}
{text("Folk tales &amp; legends", "Vietnamese tales, beautifully illustrated",
      "Legends, fables and bedtime stories, each with its own artwork.")}
{phone(cap("library_folk"), 60, 1130, 790, z=1)}
{phone(cap("detail"), 500, 1290, 790, z=2)}
""")

# 6 — Read your way (reading settings sheet).
slides["06-read-your-way"] = page("sage", f"""
{text("Your way", "Read the way your family likes",
      "Bilingual or one language, book or scroll, with Paper or Moonlight pages.")}
{phone(cap("readsettings"), 360, 820, 900)}
{callout(cap("readsettings"), (62, 1141, 1258, 1631), 0.9, 70, 1560, radius=46)}
""")


def render():
    TMP.mkdir(exist_ok=True)
    OUT69.mkdir(exist_ok=True)
    OUT63.mkdir(exist_ok=True)
    for name, html in slides.items():
        src = TMP / f"{name}.html"
        src.write_text(html, encoding="utf-8")
        out = OUT69 / f"{name}.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--force-device-scale-factor=1", f"--window-size={W},{H}",
                        f"--screenshot={out}", src.as_uri()],
                       check=True, capture_output=True)
        # App Store rejects alpha: flatten to opaque JPEG-free PNG via sips round trip.
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "100", str(out),
                        "--out", str(TMP / f"{name}.jpg")], check=True, capture_output=True)
        subprocess.run(["sips", "-s", "format", "png", str(TMP / f"{name}.jpg"), "--out", str(out)],
                       check=True, capture_output=True)
        subprocess.run(["sips", "-z", "2622", "1206", str(out), "--out", str(OUT63 / f"{name}.png")],
                       check=True, capture_output=True)
        print("rendered", name)


if __name__ == "__main__":
    render()
