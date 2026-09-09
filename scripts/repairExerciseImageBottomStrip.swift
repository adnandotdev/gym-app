import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let arguments = CommandLine.arguments
guard arguments.count == 4, let repairStart = Int(arguments[3]) else {
  fputs("Usage: repairExerciseImageBottomStrip.swift <source-jpeg> <output-jpeg> <repair-start-row>\n", stderr)
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
  repairStart > 0,
  repairStart < image.height
else {
  fputs("Could not decode source or repair row is outside the image\n", stderr)
  exit(65)
}

let bytesPerRow = image.width * 4
var pixels = [UInt8](repeating: 0, count: bytesPerRow * image.height)
let decoded = pixels.withUnsafeMutableBytes { buffer -> Bool in
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
guard decoded else {
  fputs("Could not decode source pixels\n", stderr)
  exit(65)
}

let anchorRow = repairStart - 1
let edgeSampleWidth = max(8, image.width / 8)

func averageEdgeColor(startX: Int, endX: Int) -> [Double] {
  var sums = [Double](repeating: 0, count: 3)
  let sampleRows = max(1, anchorRow - 4)...anchorRow
  var count = 0.0
  for y in sampleRows {
    for x in startX..<endX {
      let offset = y * bytesPerRow + x * 4
      for channel in 0..<3 { sums[channel] += Double(pixels[offset + channel]) }
      count += 1
    }
  }
  return sums.map { $0 / count }
}

let leftBackground = averageEdgeColor(startX: 0, endX: edgeSampleWidth)
let rightBackground = averageEdgeColor(
  startX: image.width - edgeSampleWidth,
  endX: image.width
)
let repairedHeight = image.height - repairStart

for y in repairStart..<image.height {
  let verticalProgress = Double(y - repairStart + 1) / Double(repairedHeight)
  for x in 0..<image.width {
    let horizontalProgress = Double(x) / Double(max(1, image.width - 1))
    let offset = y * bytesPerRow + x * 4
    let anchorOffset = anchorRow * bytesPerRow + x * 4
    for channel in 0..<3 {
      let background = leftBackground[channel] * (1 - horizontalProgress)
        + rightBackground[channel] * horizontalProgress
      let value = Double(pixels[anchorOffset + channel]) * (1 - verticalProgress)
        + background * verticalProgress
      pixels[offset + channel] = UInt8(max(0, min(255, Int(value.rounded()))))
    }
    pixels[offset + 3] = 255
  }
}

guard let outputImage = pixels.withUnsafeMutableBytes({ buffer -> CGImage? in
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

print("Repaired bottom strip in \(outputURL.path)")
