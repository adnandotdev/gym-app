import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
  fputs("Usage: repairOverheadPressFinishFrame.swift <source-jpeg> <output-jpeg>\n", stderr)
  exit(64)
}

let sourceURL = URL(fileURLWithPath: arguments[1])
let outputURL = URL(fileURLWithPath: arguments[2])
guard sourceURL.standardizedFileURL != outputURL.standardizedFileURL else {
  fputs("Source and output paths must be different\n", stderr)
  exit(64)
}
guard
  let source = CGImageSourceCreateWithURL(sourceURL as CFURL, nil),
  let image = CGImageSourceCreateImageAtIndex(source, 0, nil),
  image.width == 768,
  image.height == 576
else {
  fputs("Expected the approved 768x576 Overhead Press finish frame\n", stderr)
  exit(65)
}

let width = image.width
let height = image.height
let bytesPerRow = width * 4
var sourcePixels = [UInt8](repeating: 0, count: bytesPerRow * height)
let decoded = sourcePixels.withUnsafeMutableBytes { buffer -> Bool in
  guard
    let baseAddress = buffer.baseAddress,
    let context = CGContext(
      data: baseAddress,
      width: width,
      height: height,
      bitsPerComponent: 8,
      bytesPerRow: bytesPerRow,
      space: CGColorSpaceCreateDeviceRGB(),
      bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    )
  else { return false }
  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
  return true
}
guard decoded else {
  fputs("Could not decode source pixels\n", stderr)
  exit(65)
}

func averageBackground(startX: Int, endX: Int) -> [Double] {
  var sums = [Double](repeating: 0, count: 3)
  var count = 0.0
  for y in 90..<150 {
    for x in startX..<endX {
      let offset = y * bytesPerRow + x * 4
      for channel in 0..<3 { sums[channel] += Double(sourcePixels[offset + channel]) }
      count += 1
    }
  }
  return sums.map { $0 / count }
}

let leftBackground = averageBackground(startX: 0, endX: 96)
let rightBackground = averageBackground(startX: width - 96, endX: width)
var repairedPixels = [UInt8](repeating: 255, count: bytesPerRow * height)

for y in 0..<height {
  for x in 0..<width {
    let progress = Double(x) / Double(width - 1)
    let offset = y * bytesPerRow + x * 4
    for channel in 0..<3 {
      let value = leftBackground[channel] * (1 - progress)
        + rightBackground[channel] * progress
      repairedPixels[offset + channel] = UInt8(max(0, min(255, Int(value.rounded()))))
    }
    repairedPixels[offset + 3] = 255
  }
}

// Move the original frame into its unused lower-floor space without scaling it.
// The lowest 48 rows are empty studio floor, so no athlete or equipment is lost.
let verticalShift = 48
for sourceY in 0..<(height - verticalShift) {
  let destinationY = sourceY + verticalShift
  let sourceOffset = sourceY * bytesPerRow
  let destinationOffset = destinationY * bytesPerRow
  repairedPixels.replaceSubrange(
    destinationOffset..<(destinationOffset + bytesPerRow),
    with: sourcePixels[sourceOffset..<(sourceOffset + bytesPerRow)]
  )
}

// The source cuts through the upper arcs of both plates. Their intact lower arcs
// are mirrored around the shared bar centre, reconstructing only the missing arcs.
let plateCenterY = 58
let plateTopY = 3
let plateRanges = [205..<285, 490..<558]
for y in plateTopY..<verticalShift {
  let mirroredY = 2 * plateCenterY - y
  for xRange in plateRanges {
    for x in xRange {
      let sourceOffset = mirroredY * bytesPerRow + x * 4
      let destinationOffset = y * bytesPerRow + x * 4
      let luminance = 0.2126 * Double(repairedPixels[sourceOffset])
        + 0.7152 * Double(repairedPixels[sourceOffset + 1])
        + 0.0722 * Double(repairedPixels[sourceOffset + 2])
      let backgroundDifference = (0..<3).map {
        abs(Int(repairedPixels[sourceOffset + $0]) - Int(repairedPixels[destinationOffset + $0]))
      }.max() ?? 0
      if luminance < 235 || backgroundDifference > 10 {
        for channel in 0..<4 {
          repairedPixels[destinationOffset + channel] = repairedPixels[sourceOffset + channel]
        }
      }
    }
  }
}

guard let outputImage = repairedPixels.withUnsafeMutableBytes({ buffer -> CGImage? in
  guard
    let baseAddress = buffer.baseAddress,
    let context = CGContext(
      data: baseAddress,
      width: width,
      height: height,
      bitsPerComponent: 8,
      bytesPerRow: bytesPerRow,
      space: CGColorSpaceCreateDeviceRGB(),
      bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    )
  else { return nil }
  return context.makeImage()
}) else {
  fputs("Could not create repaired image\n", stderr)
  exit(65)
}

guard let destination = CGImageDestinationCreateWithURL(
  outputURL as CFURL,
  UTType.jpeg.identifier as CFString,
  1,
  nil
) else {
  fputs("Could not create output destination\n", stderr)
  exit(74)
}
CGImageDestinationAddImage(
  destination,
  outputImage,
  [kCGImageDestinationLossyCompressionQuality: 0.86] as CFDictionary
)
guard CGImageDestinationFinalize(destination) else {
  fputs("Could not write repaired image\n", stderr)
  exit(74)
}

print("Repaired Overhead Press finish framing in \(outputURL.path)")
