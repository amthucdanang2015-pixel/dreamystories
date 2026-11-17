// ============================================================
// Dreamy Stories splash asset generator (macOS, CoreGraphics only)
//
//   swift scripts/splash/generate-splash.swift [--preview <dir>]
//
// Writes, relative to the project root:
//   assets/images/splash-logo.png          iOS composition (halo, paper grain,
//                                          moon + open book, stars, wordmark,
//                                          tagline). 1200px square = 300pt @4x.
//   assets/images/splash-logo-android.png  Android 12+ splash icon (mark + halo
//                                          only, inside the circular mask).
//                                          1024px square = 192dp.
//   assets/splash/native/…                 The exact-size native files
//                                          (iOS @1x/@2x/@3x, Android mdpi→xxxhdpi
//                                          on the 288dp canvas), copied in by
//                                          plugins/withSplashNativeAssets.js.
//
// Light only: the splash uses this one design whatever the device or App
// Appearance, so the OS launch screen and every later phase match
// (docs/SPLASH_APPEARANCE.md).
//
// All PNGs are transparent with straight (un-premultiplied) alpha and fade to
// nothing at the edges, so they sit seamlessly on the #F7F3E9 background.
// Why pre-render native sizes: Expo's prebuild resizer (@expo/image-utils,
// jimp path) premultiplies semi-transparent pixels and never undoes it, which
// turns the soft halo into a grey smudge.
// Wordmark font: Cormorant Garamond (SIL OFL 1.1, see fonts/OFL.txt).
// ============================================================

import CoreGraphics
import CoreText
import Foundation
import ImageIO
import UniformTypeIdentifiers

// MARK: - Palette (mirrors src/constants/theme.ts)

func rgb(_ hex: UInt32, _ a: CGFloat = 1) -> CGColor {
  CGColor(
    srgbRed: CGFloat((hex >> 16) & 0xFF) / 255,
    green: CGFloat((hex >> 8) & 0xFF) / 255,
    blue: CGFloat(hex & 0xFF) / 255,
    alpha: a)
}

let ivory: UInt32 = 0xF7F3E9
let gold: UInt32 = 0xC6A66B
let goldLight: UInt32 = 0xE2CB97
let goldInk: UInt32 = 0x85652B
let moonGlow: UInt32 = 0xF3E3B5
let sage: UInt32 = 0x7C8B6E
let sageDeep: UInt32 = 0x5E6C52
let page: UInt32 = 0xFDFAF3
let charcoal: UInt32 = 0x26271F
let textSecondary: UInt32 = 0x4F5048

// MARK: - Paths

let scriptDir = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
let projectRoot = scriptDir.deletingLastPathComponent().deletingLastPathComponent()
let fontsDir = scriptDir.appendingPathComponent("fonts")

// MARK: - Fonts (variable font, pinned weight)

func loadFont(_ file: String, size: CGFloat, weight: CGFloat) -> CTFont {
  let url = fontsDir.appendingPathComponent(file) as CFURL
  guard let descs = CTFontManagerCreateFontDescriptorsFromURL(url) as? [CTFontDescriptor],
    let base = descs.first
  else { fatalError("Cannot load font \(file)") }
  let wghtTag = 0x7767_6874  // 'wght'
  let desc = CTFontDescriptorCreateCopyWithVariation(
    base, NSNumber(value: wghtTag) as CFNumber, weight)
  return CTFontCreateWithFontDescriptor(desc, size, nil)
}

// MARK: - Canvas (y-down, in design units)

func makeContext(px: Int) -> CGContext {
  let ctx = CGContext(
    data: nil, width: px, height: px, bitsPerComponent: 8, bytesPerRow: 0,
    space: CGColorSpace(name: CGColorSpace.sRGB)!,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.setShouldAntialias(true)
  ctx.interpolationQuality = .high
  // Flip to a y-down coordinate system.
  ctx.translateBy(x: 0, y: CGFloat(px))
  ctx.scaleBy(x: 1, y: -1)
  return ctx
}

func writePNG(_ image: CGImage, to url: URL) {
  try? FileManager.default.createDirectory(
    at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
  let dest = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(dest, image, nil)
  guard CGImageDestinationFinalize(dest) else { fatalError("Failed writing \(url.path)") }
  print("wrote \(url.path) (\(image.width)x\(image.height))")
}

// Deterministic RNG so regenerated assets are byte-stable.
struct SplitMix64: RandomNumberGenerator {
  var state: UInt64
  mutating func next() -> UInt64 {
    state &+= 0x9E37_79B9_7F4A_7C15
    var z = state
    z = (z ^ (z >> 30)) &* 0xBF58_476D_1CE4_E5B9
    z = (z ^ (z >> 27)) &* 0x94D0_49BB_1331_11EB
    return z ^ (z >> 31)
  }
}

// MARK: - Elements

/// Very faint paper grain, feathered to nothing at `radius` so the square
/// image edge never shows against the plain native background.
func drawPaperGrain(_ ctx: CGContext, px: Int, center: CGPoint, radius: CGFloat, unit: CGFloat) {
  var rng = SplitMix64(state: 0x5709_4D00)
  let w = px, h = px
  var buf = [UInt8](repeating: 0, count: w * h * 4)
  let cx = center.x * unit, cy = center.y * unit, r = radius * unit
  for y in 0..<h {
    for x in 0..<w {
      let dx = CGFloat(x) - cx, dy = CGFloat(y) - cy
      let d = (dx * dx + dy * dy).squareRoot() / r
      if d >= 1 { continue }
      // Smooth falloff (1 at center → 0 at the rim).
      let t = 1 - d
      let mask = t * t * (3 - 2 * t)
      let n = Double(rng.next() % 1000) / 1000  // 0...1
      let i = (y * w + x) * 4
      if n < 0.5 {
        // Warm fibre fleck (darker), max ~4.5% alpha.
        let a = (0.5 - n) * 2 * 0.045 * Double(mask)
        let A = UInt8(a * 255)
        buf[i] = UInt8(Double(0x8A) * a); buf[i + 1] = UInt8(Double(0x78) * a)
        buf[i + 2] = UInt8(Double(0x55) * a); buf[i + 3] = A
      } else {
        // Light fleck, max ~5% alpha.
        let a = (n - 0.5) * 2 * 0.05 * Double(mask)
        let A = UInt8(a * 255)
        buf[i] = A; buf[i + 1] = A; buf[i + 2] = A; buf[i + 3] = A
      }
    }
  }
  let provider = CGDataProvider(data: Data(buf) as CFData)!
  let img = CGImage(
    width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: w * 4,
    space: CGColorSpace(name: CGColorSpace.sRGB)!,
    bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
    provider: provider, decode: nil, shouldInterpolate: false, intent: .defaultIntent)!
  // Draw in pixel space; undo the y-flip so rows map 1:1 (noise is symmetric anyway).
  ctx.saveGState()
  ctx.scaleBy(x: 1 / unit, y: 1 / unit)
  ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
  ctx.restoreGState()
}

func drawGlow(_ ctx: CGContext, center: CGPoint, radius: CGFloat, peak: CGFloat) {
  let colors = [rgb(moonGlow, peak), rgb(moonGlow, peak * 0.45), rgb(moonGlow, 0)] as CFArray
  let grad = CGGradient(colorsSpace: CGColorSpace(name: CGColorSpace.sRGB)!, colors: colors, locations: [0, 0.5, 1])!
  ctx.drawRadialGradient(grad, startCenter: center, startRadius: 0, endCenter: center, endRadius: radius, options: [])
}

func drawHalo(_ ctx: CGContext, center: CGPoint, radius: CGFloat, ring: CGFloat?) {
  let space = CGColorSpace(name: CGColorSpace.sRGB)!
  let colors = [rgb(moonGlow, 0.62), rgb(moonGlow, 0.34), rgb(moonGlow, 0.10), rgb(moonGlow, 0)] as CFArray
  let grad = CGGradient(colorsSpace: space, colors: colors, locations: [0, 0.38, 0.72, 1])!
  ctx.drawRadialGradient(
    grad, startCenter: center, startRadius: 0, endCenter: center, endRadius: radius, options: [])
  if let ring {
    // A single hairline orbit — the "editorial" touch.
    ctx.setStrokeColor(rgb(gold, 0.22))
    ctx.setLineWidth(0.45)
    ctx.strokeEllipse(in: CGRect(x: center.x - ring, y: center.y - ring, width: ring * 2, height: ring * 2))
  }
}

/// Four-point sparkle with gently concave sides.
func sparkle(_ ctx: CGContext, _ c: CGPoint, _ r: CGFloat, _ color: CGColor) {
  let k = r * 0.16
  let p = CGMutablePath()
  p.move(to: CGPoint(x: c.x, y: c.y - r))
  p.addQuadCurve(to: CGPoint(x: c.x + r, y: c.y), control: CGPoint(x: c.x + k, y: c.y - k))
  p.addQuadCurve(to: CGPoint(x: c.x, y: c.y + r), control: CGPoint(x: c.x + k, y: c.y + k))
  p.addQuadCurve(to: CGPoint(x: c.x - r, y: c.y), control: CGPoint(x: c.x - k, y: c.y + k))
  p.addQuadCurve(to: CGPoint(x: c.x, y: c.y - r), control: CGPoint(x: c.x - k, y: c.y - k))
  ctx.addPath(p)
  ctx.setFillColor(color)
  ctx.fillPath()
}

func dot(_ ctx: CGContext, _ c: CGPoint, _ r: CGFloat, _ color: CGColor) {
  ctx.setFillColor(color)
  ctx.fillEllipse(in: CGRect(x: c.x - r, y: c.y - r, width: r * 2, height: r * 2))
}

/// The StoryMoon mark: crescent moon rising over an open storybook.
/// Drawn in a local 1024-unit space (same proportions as the app icon),
/// centred on the book spine. `origin` is where icon-space (512, 488) lands.
func drawMark(_ ctx: CGContext, origin: CGPoint, scale k: CGFloat) {
  ctx.saveGState()
  ctx.translateBy(x: origin.x, y: origin.y)
  ctx.scaleBy(x: k, y: k)
  ctx.translateBy(x: -512, y: -488)

  // Crescent moon (outer disc minus offset disc), above the book.
  let moonC = CGPoint(x: 512, y: 230), moonR: CGFloat = 190
  let cutC = CGPoint(x: 590, y: 172), cutR: CGFloat = 160
  let disc = CGRect(x: moonC.x - moonR, y: moonC.y - moonR, width: moonR * 2, height: moonR * 2)
  ctx.saveGState()
  ctx.addEllipse(in: disc)
  ctx.clip()  // keep the cut-out from leaking outside the moon
  let crescent = CGMutablePath()
  crescent.addEllipse(in: disc)
  crescent.addEllipse(in: CGRect(x: cutC.x - cutR, y: cutC.y - cutR, width: cutR * 2, height: cutR * 2))
  ctx.addPath(crescent)
  ctx.setFillColor(rgb(gold))
  ctx.fillPath(using: .evenOdd)
  ctx.restoreGState()

  // Book: cover (sage) with cream pages and a gold spine.
  func half(_ mirror: Bool) {
    ctx.saveGState()
    if mirror { ctx.translateBy(x: 1024, y: 0); ctx.scaleBy(x: -1, y: 1) }
    let cover = CGMutablePath()
    cover.move(to: CGPoint(x: 160, y: 488))
    cover.addCurve(to: CGPoint(x: 512, y: 523), control1: CGPoint(x: 290, y: 456), control2: CGPoint(x: 420, y: 476))
    cover.addLine(to: CGPoint(x: 512, y: 760))
    cover.addCurve(to: CGPoint(x: 160, y: 790), control1: CGPoint(x: 420, y: 738), control2: CGPoint(x: 280, y: 748))
    cover.closeSubpath()
    ctx.addPath(cover)
    ctx.setFillColor(rgb(sage))
    ctx.fillPath()

    let pg = CGMutablePath()
    pg.move(to: CGPoint(x: 200, y: 520))
    pg.addCurve(to: CGPoint(x: 508, y: 560), control1: CGPoint(x: 310, y: 496), control2: CGPoint(x: 430, y: 516))
    pg.addLine(to: CGPoint(x: 508, y: 738))
    pg.addCurve(to: CGPoint(x: 200, y: 736), control1: CGPoint(x: 430, y: 702), control2: CGPoint(x: 310, y: 704))
    pg.closeSubpath()
    ctx.addPath(pg)
    ctx.setFillColor(rgb(page))
    ctx.fillPath()

    // Three quiet lines of "text" on each page.
    ctx.setStrokeColor(rgb(sage, 0.38))
    ctx.setLineWidth(9)
    ctx.setLineCap(.round)
    for (i, y) in [586.0, 624.0, 662.0].enumerated() {
      let x0: CGFloat = 250, x1: CGFloat = i == 2 ? 390 : 460
      let line = CGMutablePath()
      line.move(to: CGPoint(x: x0, y: y - 6))
      line.addQuadCurve(to: CGPoint(x: x1, y: y + 10), control: CGPoint(x: (x0 + x1) / 2, y: y - 12))
      ctx.addPath(line)
      ctx.strokePath()
    }
    ctx.restoreGState()
  }
  half(false)
  half(true)

  // Spine.
  ctx.setFillColor(rgb(gold))
  ctx.fill(CGRect(x: 507, y: 556, width: 10, height: 184))
  ctx.restoreGState()
}

func drawCenteredText(
  _ ctx: CGContext, _ text: String, font: CTFont, color: CGColor, centerX: CGFloat, baseline: CGFloat,
  tracking: CGFloat
) -> CGFloat {
  let attrs: [NSAttributedString.Key: Any] = [
    NSAttributedString.Key(kCTFontAttributeName as String): font,
    NSAttributedString.Key(kCTForegroundColorAttributeName as String): color,
    NSAttributedString.Key(kCTKernAttributeName as String): tracking,
  ]
  let line = CTLineCreateWithAttributedString(NSAttributedString(string: text, attributes: attrs))
  // Exclude trailing tracking from the measured width.
  let width = CTLineGetTypographicBounds(line, nil, nil, nil) - Double(tracking)
  ctx.saveGState()
  ctx.textMatrix = CGAffineTransform(scaleX: 1, y: -1)  // undo the canvas flip for glyphs
  ctx.textPosition = CGPoint(x: centerX - CGFloat(width) / 2, y: baseline)
  CTLineDraw(line, ctx)
  ctx.restoreGState()
  return CGFloat(width)
}

// MARK: - iOS composition (300 x 300 design units)

func renderIOS(px: Int) -> CGImage {
  let unit = CGFloat(px) / 300
  let ctx = makeContext(px: px)
  ctx.scaleBy(x: unit, y: unit)

  // Moon centre in design units (see drawMark: icon y 230 → origin.y + (230-488)·k).
  let k: CGFloat = 0.19
  let markOrigin = CGPoint(x: 150, y: 133)
  let moonC = CGPoint(x: 150, y: markOrigin.y + (230 - 488) * k)

  drawPaperGrain(ctx, px: px, center: CGPoint(x: 150, y: 150), radius: 148, unit: unit)
  // Broad, barely-there warmth behind the whole lockup…
  drawGlow(ctx, center: CGPoint(x: 150, y: 140), radius: 140, peak: 0.22)
  // …and the lunar halo proper, concentric with the moon.
  drawHalo(ctx, center: moonC, radius: 76, ring: 50)

  drawMark(ctx, origin: markOrigin, scale: k)

  // A few restrained stars around the halo.
  sparkle(ctx, CGPoint(x: 96, y: 66), 5.6, rgb(gold, 0.85))
  sparkle(ctx, CGPoint(x: 207, y: 50), 4.0, rgb(goldLight))
  sparkle(ctx, CGPoint(x: 212, y: 112), 3.2, rgb(gold, 0.7))
  dot(ctx, CGPoint(x: 88, y: 112), 1.1, rgb(gold, 0.6))
  dot(ctx, CGPoint(x: 178, y: 26), 0.9, rgb(gold, 0.55))

  // Wordmark + tagline.
  let word = loadFont("CormorantGaramond[wght].ttf", size: 34, weight: 540)
  _ = drawCenteredText(ctx, "Dreamy Stories", font: word, color: rgb(charcoal), centerX: 150, baseline: 230, tracking: 0.8)

  let tag = loadFont("CormorantGaramond-Italic[wght].ttf", size: 14, weight: 500)
  let tw = drawCenteredText(
    ctx, "Stories beneath the moon", font: tag, color: rgb(textSecondary), centerX: 150, baseline: 258, tracking: 0.4)

  // Hairlines flanking the tagline.
  ctx.setStrokeColor(rgb(gold, 0.75))
  ctx.setLineWidth(0.5)
  let gap: CGFloat = 8, len: CGFloat = 16, ly: CGFloat = 254.5
  ctx.strokeLineSegments(between: [
    CGPoint(x: 150 - tw / 2 - gap - len, y: ly), CGPoint(x: 150 - tw / 2 - gap, y: ly),
    CGPoint(x: 150 + tw / 2 + gap, y: ly), CGPoint(x: 150 + tw / 2 + gap + len, y: ly),
  ])
  return ctx.makeImage()!
}

// MARK: - Android 12+ icon (192 x 192 design units, circle-safe)

/// `canvas`: 192 renders just the icon; 288 renders it centred on the full
/// Android 12 splash-icon canvas (what res/drawable-*/splashscreen_logo.png is).
func renderAndroid(px: Int, canvas: CGFloat = 192) -> CGImage {
  let unit = CGFloat(px) / canvas
  let ctx = makeContext(px: px)
  ctx.scaleBy(x: unit, y: unit)
  ctx.translateBy(x: (canvas - 192) / 2, y: (canvas - 192) / 2)
  let c = CGPoint(x: 96, y: 96)
  // The complete lockup (mark, wordmark, tagline) as a stacked badge that
  // stays inside the 192dp circle Android 12+ masks the splash icon to.
  // checkCircleSafe() below enforces it.
  let k: CGFloat = 0.097
  let origin = CGPoint(x: c.x, y: 78)
  let moonC = CGPoint(x: c.x, y: origin.y + (230 - 488) * k)
  drawGlow(ctx, center: c, radius: 90, peak: 0.24)
  drawHalo(ctx, center: moonC, radius: 34, ring: 25)
  drawMark(ctx, origin: origin, scale: k)
  sparkle(ctx, CGPoint(x: 60, y: 46), 3.6, rgb(gold, 0.85))
  sparkle(ctx, CGPoint(x: 132, y: 36), 2.8, rgb(goldLight))
  sparkle(ctx, CGPoint(x: 136, y: 72), 2.2, rgb(gold, 0.7))
  dot(ctx, CGPoint(x: 56, y: 80), 0.8, rgb(gold, 0.6))

  let word = loadFont("CormorantGaramond[wght].ttf", size: 22, weight: 560)
  _ = drawCenteredText(ctx, "Dreamy Stories", font: word, color: rgb(charcoal), centerX: c.x, baseline: 134, tracking: 0.5)
  let tag = loadFont("CormorantGaramond-Italic[wght].ttf", size: 12, weight: 560)
  let tw = drawCenteredText(
    ctx, "Stories beneath the moon", font: tag, color: rgb(textSecondary), centerX: c.x, baseline: 152, tracking: 0.3)
  ctx.setStrokeColor(rgb(gold, 0.75))
  ctx.setLineWidth(0.45)
  let gap: CGFloat = 5, len: CGFloat = 8, ly: CGFloat = 148.5
  ctx.strokeLineSegments(between: [
    CGPoint(x: c.x - tw / 2 - gap - len, y: ly), CGPoint(x: c.x - tw / 2 - gap, y: ly),
    CGPoint(x: c.x + tw / 2 + gap, y: ly), CGPoint(x: c.x + tw / 2 + gap + len, y: ly),
  ])
  return ctx.makeImage()!
}

/// Fails the run if anything visible falls outside the circle of `radius`
/// (in 192-unit icon space) that Android 12+ clips the splash icon to.
func checkCircleSafe(_ img: CGImage, radius: CGFloat) {
  let w = img.width
  let ctx = CGContext(
    data: nil, width: w, height: w, bitsPerComponent: 8, bytesPerRow: w * 4,
    space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: w))
  let d = ctx.data!.assumingMemoryBound(to: UInt8.self)
  let r = radius / 192 * CGFloat(w), mid = CGFloat(w) / 2
  var worst = 0
  for y in 0..<w {
    for x in 0..<w {
      let dx = CGFloat(x) + 0.5 - mid, dy = CGFloat(y) + 0.5 - mid
      if dx * dx + dy * dy > r * r { worst = max(worst, Int(d[(y * w + x) * 4 + 3])) }
    }
  }
  guard worst <= 2 else { fatalError("Android splash icon spills outside the \(radius)dp-radius circle (alpha \(worst))") }
  print("android icon is circle-safe (max alpha outside r=\(radius)dp: \(worst))")
}

// MARK: - Previews (phone-sized, composited on ivory) for design review

func preview(_ logo: CGImage, logoPt: CGFloat, size: CGSize, scale: CGFloat, to url: URL) {
  let w = Int(size.width * scale), h = Int(size.height * scale)
  let ctx = CGContext(
    data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
    space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.setFillColor(rgb(ivory))
  ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
  ctx.interpolationQuality = .high
  let s = logoPt * scale
  ctx.draw(logo, in: CGRect(x: (CGFloat(w) - s) / 2, y: (CGFloat(h) - s) / 2, width: s, height: s))
  writePNG(ctx.makeImage()!, to: url)
}

// MARK: - Main

let args = CommandLine.arguments
let ios = renderIOS(px: 1200)
let android = renderAndroid(px: 1024)
checkCircleSafe(android, radius: 92)
writePNG(ios, to: projectRoot.appendingPathComponent("assets/images/splash-logo.png"))
writePNG(android, to: projectRoot.appendingPathComponent("assets/images/splash-logo-android.png"))

// Exact-size native files (must match imageWidth in app.json: iOS 300pt, Android 192dp).
let native = projectRoot.appendingPathComponent("assets/splash/native")
for (name, scale) in [("image.png", 1), ("image@2x.png", 2), ("image@3x.png", 3)] {
  writePNG(renderIOS(px: 300 * scale), to: native.appendingPathComponent("ios/\(name)"))
}
for (density, scale) in [("mdpi", 1.0), ("hdpi", 1.5), ("xhdpi", 2.0), ("xxhdpi", 3.0), ("xxxhdpi", 4.0)] {
  writePNG(
    renderAndroid(px: Int(288 * scale), canvas: 288),
    to: native.appendingPathComponent("android/drawable-\(density)/splashscreen_logo.png"))
}

if let i = args.firstIndex(of: "--preview"), i + 1 < args.count {
  let dir = URL(fileURLWithPath: args[i + 1])
  preview(ios, logoPt: 300, size: CGSize(width: 393, height: 852), scale: 3, to: dir.appendingPathComponent("preview-iphone.png"))
  preview(ios, logoPt: 300, size: CGSize(width: 820, height: 1180), scale: 2, to: dir.appendingPathComponent("preview-ipad.png"))
  // Android: 192dp icon box on a 412dp-wide phone at xxhdpi-ish scale.
  preview(android, logoPt: 192, size: CGSize(width: 412, height: 915), scale: 2.625, to: dir.appendingPathComponent("preview-android.png"))
}
