import CoreImage
import Foundation
import ImageIO
import UniformTypeIdentifiers
import Vision

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
  fputs("Usage: extractHomeCoachCutout.swift <source-image> <output-png>\n", stderr)
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
  let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
else {
  fputs("Could not decode source image\n", stderr)
  exit(65)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: image, options: [:])

do {
  try handler.perform([request])
  guard let observation = request.results?.first else {
    fputs("No foreground subject was detected\n", stderr)
    exit(66)
  }

  let maskBuffer = try observation.generateScaledMaskForImage(
    forInstances: observation.allInstances,
    from: handler
  )
  let subject = CIImage(cgImage: image)
  let mask = CIImage(cvPixelBuffer: maskBuffer)
    .applyingFilter("CIMorphologyMinimum", parameters: ["inputRadius": 8.0])
    .applyingFilter("CIGaussianBlur", parameters: [kCIInputRadiusKey: 0.4])
    .cropped(to: subject.extent)
  let transparent = CIImage(color: .clear).cropped(to: subject.extent)
  let isolated = subject.applyingFilter(
    "CIBlendWithMask",
    parameters: [
      kCIInputBackgroundImageKey: transparent,
      kCIInputMaskImageKey: mask,
    ]
  )
  let horizontalInset = subject.extent.width * 0.115
  let crop = subject.extent.insetBy(dx: horizontalInset, dy: 0)
  let output = isolated
    .cropped(to: crop)
    .transformed(by: CGAffineTransform(translationX: -crop.minX, y: -crop.minY))
  let context = CIContext(options: [.useSoftwareRenderer: false])
  let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
  try context.writePNGRepresentation(
    of: output,
    to: outputURL,
    format: .RGBA8,
    colorSpace: colorSpace
  )
} catch {
  fputs("Foreground extraction failed: \(error.localizedDescription)\n", stderr)
  exit(67)
}
