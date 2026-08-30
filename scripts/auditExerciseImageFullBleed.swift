import CoreGraphics
import Foundation
import ImageIO

let arguments = CommandLine.arguments
guard arguments.count == 2 else {
  fputs("Usage: auditExerciseImageFullBleed.swift <demonstrations-root>\n", stderr)
  exit(64)
}

let rootURL = URL(fileURLWithPath: arguments[1], isDirectory: true)
let acceptedNames = Set(["male-thumbnail.jpg", "male-start.jpg", "male-finish.jpg"])
guard let enumerator = FileManager.default.enumerator(
  at: rootURL,
  includingPropertiesForKeys: [.isRegularFileKey],
  options: [.skipsHiddenFiles]
) else {
  fputs("Could not enumerate \(rootURL.path)\n", stderr)
  exit(66)
}

let imageURLs = enumerator.compactMap { item -> URL? in
  guard let url = item as? URL, acceptedNames.contains(url.lastPathComponent) else {
    return nil
  }
  return url
}.sorted { $0.path < $1.path }

guard imageURLs.count == 480 else {
  fputs("Expected 480 demonstration images, found \(imageURLs.count)\n", stderr)
  exit(65)
}

struct Bitmap {
  let pixels: [UInt8]
  let width: Int
  let height: Int
  let bytesPerRow: Int
}

func decode(_ url: URL) -> Bitmap? {
  guard
    let source = CGImageSourceCreateWithURL(url as CFURL, nil),
    let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
  else { return nil }

  let bytesPerRow = image.width * 4
  var pixels = [UInt8](repeating: 0, count: bytesPerRow * image.height)
  let rendered = pixels.withUnsafeMutableBytes { buffer -> Bool in
    guard
      let baseAddress = buffer.baseAddress,
      let context = CGContext(
        data: baseAddress,
        width: image.width,
        height: image.height,
        bitsPerComponent: 8,
        bytesPerRow: bytesPerRow,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
      )
    else { return false }
    context.draw(image, in: CGRect(x: 0, y: 0, width: image.width, height: image.height))
    return true
  }
  return rendered
    ? Bitmap(pixels: pixels, width: image.width, height: image.height, bytesPerRow: bytesPerRow)
    : nil
}

func isUniformNearWhiteLine(_ bitmap: Bitmap, horizontal: Bool, index: Int) -> Bool {
  let sampleCount = horizontal ? bitmap.width : bitmap.height
  let strideSize = max(1, sampleCount / 192)
  var count = 0.0
  var luminanceSum = 0.0
  var luminanceSquareSum = 0.0

  for sample in stride(from: 0, to: sampleCount, by: strideSize) {
    let x = horizontal ? sample : index
    let y = horizontal ? index : sample
    let offset = y * bitmap.bytesPerRow + x * 4
    let red = Double(bitmap.pixels[offset])
    let green = Double(bitmap.pixels[offset + 1])
    let blue = Double(bitmap.pixels[offset + 2])
    let luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    count += 1
    luminanceSum += luminance
    luminanceSquareSum += luminance * luminance
  }

  let mean = luminanceSum / count
  let variance = max(0, luminanceSquareSum / count - mean * mean)
  return mean > 246 && sqrt(variance) < 0.8
}

func uniformBandDepth(_ bitmap: Bitmap, edge: String) -> Int {
  let horizontal = edge == "top" || edge == "bottom"
  let lineCount = horizontal ? bitmap.height : bitmap.width
  var depth = 0
  for offset in 0..<lineCount {
    let index = (edge == "top" || edge == "left") ? offset : lineCount - 1 - offset
    guard isUniformNearWhiteLine(bitmap, horizontal: horizontal, index: index) else { break }
    depth += 1
  }
  return depth
}

func seamChangeFraction(_ bitmap: Bitmap, edge: String, bandDepth: Int) -> Double {
  let horizontal = edge == "top" || edge == "bottom"
  let lineCount = horizontal ? bitmap.height : bitmap.width
  guard bandDepth > 0, bandDepth < lineCount else { return 0 }
  let outerIndex = (edge == "top" || edge == "left")
    ? bandDepth - 1
    : lineCount - bandDepth
  let innerIndex = (edge == "top" || edge == "left")
    ? bandDepth
    : lineCount - bandDepth - 1
  let sampleCount = horizontal ? bitmap.width : bitmap.height
  let strideSize = max(1, sampleCount / 192)
  var changed = 0
  var total = 0

  for sample in stride(from: 0, to: sampleCount, by: strideSize) {
    let outerX = horizontal ? sample : outerIndex
    let outerY = horizontal ? outerIndex : sample
    let innerX = horizontal ? sample : innerIndex
    let innerY = horizontal ? innerIndex : sample
    let outerOffset = outerY * bitmap.bytesPerRow + outerX * 4
    let innerOffset = innerY * bitmap.bytesPerRow + innerX * 4
    let channelChange = (0..<3).map {
      abs(Int(bitmap.pixels[outerOffset + $0]) - Int(bitmap.pixels[innerOffset + $0]))
    }.max() ?? 0
    if channelChange > 3 { changed += 1 }
    total += 1
  }
  return total > 0 ? Double(changed) / Double(total) : 0
}

var failures: [String] = []
for url in imageURLs {
  guard let bitmap = decode(url) else {
    failures.append("\(url.path): decode failed")
    continue
  }
  for edge in ["top", "bottom", "left", "right"] {
    let depth = uniformBandDepth(bitmap, edge: edge)
    let dimension = (edge == "top" || edge == "bottom") ? bitmap.height : bitmap.width
    let hasVisibleFullEdgeSeam = seamChangeFraction(bitmap, edge: edge, bandDepth: depth) > 0.25
    if Double(depth) / Double(dimension) > 0.02 && hasVisibleFullEdgeSeam {
      failures.append("\(url.path): \(edge) near-white uniform band is \(depth)px (\(dimension)px dimension)")
    }
  }
}

guard failures.isEmpty else {
  failures.prefix(50).forEach { fputs("\($0)\n", stderr) }
  if failures.count > 50 {
    fputs("... omitted \(failures.count - 50) additional edge failures\n", stderr)
  }
  fputs("Found inserted padding-band candidates in \(failures.count) image edges\n", stderr)
  exit(1)
}

print("Audited 480 full-bleed exercise images")
