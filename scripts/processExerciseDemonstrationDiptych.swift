import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
  fputs("Usage: processExerciseDemonstrationDiptych.swift <source> <output-directory>\n", stderr)
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

let detectedDivider = dividerRange(in: sourceImage)
let topPanelHeight = detectedDivider?.lowerBound ?? sourceHeight / 2
let bottomPanelOrigin = (detectedDivider?.upperBound).map { $0 + 1 } ?? sourceHeight / 2
let panelSpecs = [
  (name: "start", rect: CGRect(x: 0, y: 0, width: sourceWidth, height: topPanelHeight)),
  (name: "finish", rect: CGRect(
    x: 0,
    y: bottomPanelOrigin,
    width: sourceWidth,
    height: sourceHeight - bottomPanelOrigin
  )),
]

func cropToVisibleContent(_ image: CGImage) -> CGImage {
  guard let bitmap = rgbaPixels(for: image) else { return image }
  var minX = image.width
  var minY = image.height
  var maxX = -1
  var maxY = -1

  for y in stride(from: 0, to: image.height, by: 2) {
    for x in stride(from: 0, to: image.width, by: 2) {
      let offset = y * bitmap.bytesPerRow + x * 4
      let red = Int(bitmap.pixels[offset])
      let green = Int(bitmap.pixels[offset + 1])
      let blue = Int(bitmap.pixels[offset + 2])
      let luminance = (77 * red + 150 * green + 29 * blue) / 256
      // Exercise subjects and equipment are materially darker than the
      // near-white studio sweep. A conservative threshold avoids treating a
      // soft gray background gradient as content.
      if luminance < 225 {
        minX = min(minX, x)
        minY = min(minY, y)
        maxX = max(maxX, x)
        maxY = max(maxY, y)
      }
    }
  }

  guard maxX >= minX, maxY >= minY else { return image }
  let contentWidth = maxX - minX + 1
  let contentHeight = maxY - minY + 1
  guard
    contentWidth >= image.width / 10,
    contentHeight >= image.height / 10
  else {
    return image
  }

  let horizontalMargin = max(12, Int(Double(contentWidth) * 0.07))
  let verticalMargin = max(12, Int(Double(contentHeight) * 0.07))
  let cropMinX = max(0, minX - horizontalMargin)
  let cropMinY = max(0, minY - verticalMargin)
  let cropMaxX = min(image.width, maxX + horizontalMargin + 1)
  let cropMaxY = min(image.height, maxY + verticalMargin + 1)

  return image.cropping(to: CGRect(
    x: cropMinX,
    y: cropMinY,
    width: cropMaxX - cropMinX,
    height: cropMaxY - cropMinY
  )) ?? image
}

func aspectFitOnCanvas(_ image: CGImage, width: Int, height: Int) -> CGImage? {
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

  context.setFillColor(CGColor(
    red: 247.0 / 255.0,
    green: 247.0 / 255.0,
    blue: 244.0 / 255.0,
    alpha: 1
  ))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))

  let scale = min(
    Double(width) / Double(image.width),
    Double(height) / Double(image.height)
  )
  let fittedWidth = Double(image.width) * scale
  let fittedHeight = Double(image.height) * scale
  let destination = CGRect(
    x: (Double(width) - fittedWidth) / 2,
    y: (Double(height) - fittedHeight) / 2,
    width: fittedWidth,
    height: fittedHeight
  )

  context.interpolationQuality = .high
  context.draw(image, in: destination)
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
    let resizedPanel = aspectFitOnCanvas(
      cropToVisibleContent(panel),
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
