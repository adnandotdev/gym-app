import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let arguments = CommandLine.arguments
guard arguments.count == 3 || (arguments.count == 4 && arguments[3] == "--allow-equal-split") else {
  fputs("Usage: processExerciseDemonstrationDiptych.swift <source> <output-directory> [--allow-equal-split]\n", stderr)
  exit(64)
}

let sourceURL = URL(fileURLWithPath: arguments[1])
let outputDirectory = URL(fileURLWithPath: arguments[2], isDirectory: true)
let fileManager = FileManager.default

guard fileManager.fileExists(atPath: sourceURL.path) else {
  fputs("Source image does not exist: \(sourceURL.path)\n", stderr)
  exit(66)
}

try fileManager.createDirectory(
  at: outputDirectory,
  withIntermediateDirectories: true
)

guard
  let imageSource = CGImageSourceCreateWithURL(sourceURL as CFURL, nil),
  let sourceImage = CGImageSourceCreateImageAtIndex(imageSource, 0, nil)
else {
  fputs("Could not decode source image: \(sourceURL.path)\n", stderr)
  exit(65)
}

let sourceWidth = sourceImage.width
let sourceHeight = sourceImage.height
guard sourceWidth >= 2, sourceHeight >= 2 else {
  fputs("Expected a top-and-bottom two-panel diptych, got \(sourceWidth)x\(sourceHeight)\n", stderr)
  exit(65)
}

func rgbaPixels(for image: CGImage) -> (pixels: [UInt8], bytesPerRow: Int)? {
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
    else {
      return false
    }
    context.draw(image, in: CGRect(x: 0, y: 0, width: image.width, height: image.height))
    return true
  }
  return rendered ? (pixels, bytesPerRow) : nil
}

func isNearWhiteDividerRow(
  _ row: Int,
  pixels: [UInt8],
  width: Int,
  bytesPerRow: Int
) -> Bool {
  var nearWhiteSamples = 0
  var sampleCount = 0
  for x in stride(from: 0, to: width, by: 4) {
    let offset = row * bytesPerRow + x * 4
    let red = Int(pixels[offset])
    let green = Int(pixels[offset + 1])
    let blue = Int(pixels[offset + 2])
    if red >= 247, green >= 247, blue >= 244 {
      nearWhiteSamples += 1
    }
    sampleCount += 1
  }
  return sampleCount > 0 && Double(nearWhiteSamples) / Double(sampleCount) >= 0.995
}

func dividerRange(in image: CGImage) -> ClosedRange<Int>? {
  guard let bitmap = rgbaPixels(for: image) else { return nil }
  let midpoint = image.height / 2
  let searchStart = max(1, Int(Double(image.height) * 0.38))
  let searchEnd = min(image.height - 2, Int(Double(image.height) * 0.62))
  let candidates = (searchStart...searchEnd).filter {
    isNearWhiteDividerRow(
      $0,
      pixels: bitmap.pixels,
      width: image.width,
      bytesPerRow: bitmap.bytesPerRow
    )
  }
  guard let nearest = candidates.min(by: { abs($0 - midpoint) < abs($1 - midpoint) }) else {
    return nil
  }

  var lowerBound = nearest
  var upperBound = nearest
  while lowerBound > searchStart,
        isNearWhiteDividerRow(
          lowerBound - 1,
          pixels: bitmap.pixels,
          width: image.width,
          bytesPerRow: bitmap.bytesPerRow
        ) {
    lowerBound -= 1
  }
  while upperBound < searchEnd,
        isNearWhiteDividerRow(
          upperBound + 1,
          pixels: bitmap.pixels,
          width: image.width,
          bytesPerRow: bitmap.bytesPerRow
        ) {
    upperBound += 1
  }
  return lowerBound...upperBound
}

let allowEqualSplit = arguments.count == 4
let detectedDivider = dividerRange(in: sourceImage)
guard detectedDivider != nil || allowEqualSplit else {
  fputs("Could not find a near-white divider between Start and Finish panels; visually verify the source before using --allow-equal-split\n", stderr)
  exit(65)
}
let topPanelHeight = allowEqualSplit ? sourceHeight / 2 : detectedDivider!.lowerBound
let bottomPanelOrigin = allowEqualSplit ? sourceHeight / 2 : detectedDivider!.upperBound + 1
let panelSpecs = [
  (name: "start", rect: CGRect(x: 0, y: 0, width: sourceWidth, height: topPanelHeight)),
  (name: "finish", rect: CGRect(
    x: 0,
    y: bottomPanelOrigin,
    width: sourceWidth,
    height: sourceHeight - bottomPanelOrigin
  )),
]

func renderNativePanel(_ image: CGImage, width: Int, height: Int) -> CGImage? {
  let panelRatio = Double(image.width) / Double(image.height)
  guard abs(panelRatio - 4.0 / 3.0) <= 0.02 else {
    return nil
  }
  guard let context = CGContext(
    data: nil,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: 0,
    space: CGColorSpaceCreateDeviceRGB(),
    bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
  ) else {
    return nil
  }

  context.interpolationQuality = .high
  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
  return context.makeImage()
}

func writeJpeg(_ image: CGImage, to url: URL) -> Bool {
  guard let destination = CGImageDestinationCreateWithURL(
    url as CFURL,
    UTType.jpeg.identifier as CFString,
    1,
    nil
  ) else {
    return false
  }

  let options = [kCGImageDestinationLossyCompressionQuality: 0.78] as CFDictionary
  CGImageDestinationAddImage(destination, image, options)
  return CGImageDestinationFinalize(destination)
}

for panelSpec in panelSpecs {
  guard
    let panel = sourceImage.cropping(to: panelSpec.rect),
    let resizedPanel = renderNativePanel(
      panel,
      width: 768,
      height: 576
    )
  else {
    fputs("Could not process \(panelSpec.name) panel\n", stderr)
    exit(65)
  }

  let outputURL = outputDirectory.appendingPathComponent("male-\(panelSpec.name).jpg")
  guard writeJpeg(resizedPanel, to: outputURL) else {
    fputs("Could not write \(outputURL.path)\n", stderr)
    exit(74)
  }
}

print("Created male-start.jpg and male-finish.jpg in \(outputDirectory.path)")
