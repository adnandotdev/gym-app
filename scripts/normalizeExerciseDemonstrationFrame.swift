import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
  fputs("Usage: normalizeExerciseDemonstrationFrame.swift <approved-4x3-source> <output-jpeg>\n", stderr)
  exit(64)
}

let inputURL = URL(fileURLWithPath: arguments[1])
let outputURL = URL(fileURLWithPath: arguments[2])
guard inputURL.standardizedFileURL != outputURL.standardizedFileURL else {
  fputs("Source and output paths must be different\n", stderr)
  exit(64)
}
guard
  FileManager.default.fileExists(atPath: inputURL.path),
  let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
  let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
else {
  fputs("Could not decode \(inputURL.path)\n", stderr)
  exit(65)
}
guard image.width * 3 == image.height * 4 else {
  fputs("Expected an approved 4:3 source, got \(image.width)x\(image.height)\n", stderr)
  exit(65)
}
guard let context = CGContext(
  data: nil,
  width: 768,
  height: 576,
  bitsPerComponent: 8,
  bytesPerRow: 0,
  space: CGColorSpaceCreateDeviceRGB(),
  bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
) else {
  fputs("Could not create output context\n", stderr)
  exit(65)
}

// This utility only downsamples an already approved full-bleed 4:3 source.
// It deliberately refuses to crop, stretch, or add a background canvas.
context.interpolationQuality = .high
context.draw(image, in: CGRect(x: 0, y: 0, width: 768, height: 576))
guard
  let result = context.makeImage(),
  let destination = CGImageDestinationCreateWithURL(
    outputURL as CFURL,
    UTType.jpeg.identifier as CFString,
    1,
    nil
  )
else {
  fputs("Could not prepare \(outputURL.path)\n", stderr)
  exit(74)
}

CGImageDestinationAddImage(
  destination,
  result,
  [kCGImageDestinationLossyCompressionQuality: 0.82] as CFDictionary
)
guard CGImageDestinationFinalize(destination) else {
  fputs("Could not write \(outputURL.path)\n", stderr)
  exit(74)
}

print("Normalized \(outputURL.path) to 768x576")
