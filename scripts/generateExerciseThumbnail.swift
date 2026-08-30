import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
  fputs("Usage: generateExerciseThumbnail.swift <approved-4x3-source> <output-jpeg>\n", stderr)
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
  let sourceImage = CGImageSourceCreateImageAtIndex(source, 0, nil)
else {
  fputs("Could not decode \(inputURL.path)\n", stderr)
  exit(65)
}
guard sourceImage.width * 3 == sourceImage.height * 4 else {
  fputs("Expected an approved 4:3 source, got \(sourceImage.width)x\(sourceImage.height)\n", stderr)
  exit(65)
}
guard let context = CGContext(
  data: nil,
  width: 480,
  height: 360,
  bitsPerComponent: 8,
  bytesPerRow: 0,
  space: CGColorSpaceCreateDeviceRGB(),
  bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
) else {
  fputs("Could not create thumbnail context\n", stderr)
  exit(65)
}

// Approved Detail sources are already native, full-bleed 4:3 compositions.
// A thumbnail is a deterministic downsample only: no crop, canvas, or transform
// may silently remove exercise-defining anatomy or equipment.
context.interpolationQuality = .high
context.draw(sourceImage, in: CGRect(x: 0, y: 0, width: 480, height: 360))
guard
  let thumbnail = context.makeImage(),
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
  thumbnail,
  [kCGImageDestinationLossyCompressionQuality: 0.78] as CFDictionary
)
guard CGImageDestinationFinalize(destination) else {
  fputs("Could not write \(outputURL.path)\n", stderr)
  exit(74)
}

print("Created 480x360 thumbnail at \(outputURL.path)")
