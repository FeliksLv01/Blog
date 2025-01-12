---
title: iOS KMeans 图片取色
date: 2025-01-12
categories:
    - 客户端
tags:
    - iOS
---

具体参考苹果的 Accelerate 库教程。UI 实现，iOS 14.0 可以使用，但是使用了 PhotoUI，整体升到了 17.0。

```swift
import PhotosUI
import SwiftUI

@available(iOS 17.0, *)
struct DebugPaletteView: View {
    @State private var pickerItem: PhotosPickerItem?
    @State private var cgImage: CGImage?
    @StateObject private var kMeansCalculator = KMeansCalculator()

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            if let cgImage = cgImage {
                GeometryReader { geometry in
                    Image(decorative: cgImage, scale: 1.0)
                        .resizable()
                        .scaledToFit()
                        .frame(width: geometry.size.width, height: geometry.size.width)
                        .cornerRadius(10)
                }
            } else {
                // 空态视图
                VStack {
                    Text("请选择一张图片")
                        .font(.title2)
                        .foregroundColor(.gray)
                        .padding(.bottom, 10)
                    Text("点击下面的按钮以选择图片")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(.systemGray5))
                .cornerRadius(10)
                .aspectRatio(1.0, contentMode: .fit) // 保持 1:1 比例
            }

            if let dominantColor = kMeansCalculator.dominantColors.first {
                VStack {
                    RoundedRectangle(cornerSize: .init(width: 5, height: 5))
                        .fill(dominantColor.color)
                        .frame(height: 50)
                    Text(dominantColor.color.description)
                        .font(.title3)
                        .foregroundColor(.gray)
                }
            }

            Spacer()

            // 圆角选择按钮
            PhotosPicker(selection: $pickerItem, matching: .images) {
                Text("选择照片")
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
            .disabled(kMeansCalculator.isBusy)
            .padding(.horizontal, 32)
        }
        .overlay {
            ProgressView()
                .opacity(kMeansCalculator.isBusy ? 1 : 0)
        }
        .navigationTitle("图片取色")
        .padding(.horizontal, 32)
        .onChange(of: pickerItem) {
            Task {
                guard let imageData = try? await pickerItem?.loadTransferable(type: Data.self),
                      let uiImage = UIImage(data: imageData), let cgImage = uiImage.cgImage
                else {
                    return
                }
                self.cgImage = cgImage
                kMeansCalculator.sourceImage = cgImage
            }
        }
    }
}

@available(iOS 17.0, *)
#Preview {
    DebugPaletteView()
}
```

KMeans 部分实现

```swift
import Foundation
import Accelerate
import CoreGraphics
import SwiftUI

let dimension = 256
let channelCount = 3
let tolerance = 10

/// A structure that represents a centroid.
struct Centroid {
    /// The red channel value.
    var red: Float

    /// The green channel value.
    var green: Float

    /// The blue channel value.
    var blue: Float

    /// The number of pixels assigned to this cluster center.
    var pixelCount: Int = 0
}

/// A structure that represents a dominant color.
struct DominantColor: Identifiable, Comparable {

    init(_ centroid: Centroid) {
        self.color = Color(red: Double(centroid.red), green: Double(centroid.green), blue: Double(centroid.blue))
        self.percentage = Int(Float(centroid.pixelCount) / Float(dimension * dimension) * 100)
    }

    init(color: Color, percentage: Int) {
        self.color = color
        self.percentage = percentage
    }

    static func < (lhs: DominantColor, rhs: DominantColor) -> Bool {
        return lhs.percentage < rhs.percentage
    }

    var id = UUID()

    let color: Color
    let percentage: Int

    static var zero: DominantColor {
        return DominantColor(color: .clear, percentage: 0)
    }
}

/// A structure that represents a thumbnail.
struct Thumbnail: Identifiable, Hashable {
    var id = UUID()

    let thumbnail: CGImage
    var resource: String
    var ext: String
}

@available(iOS 17.0, *)
class KMeansCalculator: ObservableObject {
    /// A Boolean value that indicates whether the app is running.
    @Published var isBusy = false

    /// The number of centroids.
    @Published var k = 1 {
        didSet {
            allocateDistancesBuffer()
            calculateKMeans()
        }
    }

    static var emptyCGImage: CGImage = {
        let buffer = vImage.PixelBuffer(
            pixelValues: [0],
            size: .init(width: 1, height: 1),
            pixelFormat: vImage.Planar8.self)

        let fmt = vImage_CGImageFormat(
            bitsPerComponent: 8,
            bitsPerPixel: 8 ,
            colorSpace: CGColorSpaceCreateDeviceGray(),
            bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.none.rawValue),
            renderingIntent: .defaultIntent)

        return buffer.makeCGImage(cgImageFormat: fmt!)!
    }()

    /// The current source image.
    @Published var sourceImage: CGImage? {
        didSet {
            calculateKMeans()
        }
    }

    /// The Core Graphics image format.
    var rgbImageFormat = vImage_CGImageFormat(
        bitsPerComponent: 32,
        bitsPerPixel: 32 * 3,
        colorSpace: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGBitmapInfo(
            rawValue: kCGBitmapByteOrder32Host.rawValue |
            CGBitmapInfo.floatComponents.rawValue |
            CGImageAlphaInfo.none.rawValue))!

    /// Storage for a matrix with `dimension * dimension` columns and `k` rows that stores the
    /// distances squared of each pixel color for each centroid.
    var distances: UnsafeMutableBufferPointer<Float>!

    /// The storage and pixel buffer for each red value.
    let redStorage = UnsafeMutableBufferPointer<Float>.allocate(capacity: dimension * dimension)
    let redBuffer: vImage.PixelBuffer<vImage.PlanarF>

    /// The storage and pixel buffer for each green value.
    let greenStorage = UnsafeMutableBufferPointer<Float>.allocate(capacity: dimension * dimension)
    let greenBuffer: vImage.PixelBuffer<vImage.PlanarF>

    /// The storage and pixel buffer for each blue value.
    let blueStorage = UnsafeMutableBufferPointer<Float>.allocate(capacity: dimension * dimension)
    let blueBuffer: vImage.PixelBuffer<vImage.PlanarF>

    /// The storage and pixel buffer for each quantized red value.
    let redQuantizedStorage = UnsafeMutableBufferPointer<Float>.allocate(capacity: dimension * dimension)
    let redQuantizedBuffer: vImage.PixelBuffer<vImage.PlanarF>

    /// The storage and pixel buffer for each quantized green value.
    let greenQuantizedStorage = UnsafeMutableBufferPointer<Float>.allocate(capacity: dimension * dimension)
    let greenQuantizedBuffer: vImage.PixelBuffer<vImage.PlanarF>

    /// The storage and pixel buffer for each quantized blue value.
    let blueQuantizedStorage = UnsafeMutableBufferPointer<Float>.allocate(capacity: dimension * dimension)
    let blueQuantizedBuffer: vImage.PixelBuffer<vImage.PlanarF>

    /// The array of `k` centroids.
    var centroids = [Centroid]()

    /// The array of `k` dominant colors that the app derives from `centroids` and displays  in the user interface.
    @Published var dominantColors: [DominantColor] = []

    /// The BNNS array descriptor that receives the centroid indices.
    let centroidIndicesDescriptor: BNNSNDArrayDescriptor

    let maximumIterations = 50
    var iterationCount = 0

    /// - Tag: initClass
    init() {
        redBuffer = vImage.PixelBuffer<vImage.PlanarF>(
            data: redStorage.baseAddress!,
            width: dimension,
            height: dimension,
            byteCountPerRow: dimension * MemoryLayout<Float>.stride)

        greenBuffer = vImage.PixelBuffer<vImage.PlanarF>(
            data: greenStorage.baseAddress!,
            width: dimension,
            height: dimension,
            byteCountPerRow: dimension * MemoryLayout<Float>.stride)

        blueBuffer = vImage.PixelBuffer<vImage.PlanarF>(
            data: blueStorage.baseAddress!,
            width: dimension,
            height: dimension,
            byteCountPerRow: dimension * MemoryLayout<Float>.stride)

        redQuantizedBuffer = vImage.PixelBuffer<vImage.PlanarF>(
            data: redQuantizedStorage.baseAddress!,
            width: dimension,
            height: dimension,
            byteCountPerRow: dimension * MemoryLayout<Float>.stride)

        greenQuantizedBuffer = vImage.PixelBuffer<vImage.PlanarF>(
            data: greenQuantizedStorage.baseAddress!,
            width: dimension,
            height: dimension,
            byteCountPerRow: dimension * MemoryLayout<Float>.stride)

        blueQuantizedBuffer = vImage.PixelBuffer<vImage.PlanarF>(
            data: blueQuantizedStorage.baseAddress!,
            width: dimension,
            height: dimension,
            byteCountPerRow: dimension * MemoryLayout<Float>.stride)

        centroidIndicesDescriptor = BNNSNDArrayDescriptor.allocateUninitialized(
            scalarType: Int32.self,
            shape: .matrixRowMajor(dimension * dimension, 1))

        allocateDistancesBuffer()
    }

    deinit {
        redStorage.deallocate()
        greenStorage.deallocate()
        blueStorage.deallocate()

        redQuantizedStorage.deallocate()
        greenQuantizedStorage.deallocate()
        blueQuantizedStorage.deallocate()

        centroidIndicesDescriptor.deallocate()
        distances.deallocate()
    }

    /// Allocates the memory required for the distances matrix.
    func allocateDistancesBuffer() {
        if distances != nil {
            distances.deallocate()
        }
        distances = UnsafeMutableBufferPointer<Float>.allocate(capacity: dimension * dimension * k)
    }

    /// Calculates k-means for the selected thumbnail.
    func calculateKMeans() {
        guard let sourceImage = sourceImage else {
            return
        }
        isBusy = true
        let rgbSources: [vImage.PixelBuffer<vImage.PlanarF>] = try! vImage.PixelBuffer<vImage.InterleavedFx3>(
            cgImage: sourceImage,
            cgImageFormat: &rgbImageFormat).planarBuffers()

        rgbSources[0].scale(destination: redBuffer)
        rgbSources[1].scale(destination: greenBuffer)
        rgbSources[2].scale(destination: blueBuffer)

        initializeCentroids()
        update()
    }

    /// Iterates over the `updateCentroids` function until the solution converges or the
    /// iteration count equals `maximumIterations`.
    func update() {
        Task {
            var converged = false
            var iterationCount = 0

            while !converged && iterationCount < maximumIterations {
                converged = updateCentroids()
                iterationCount += 1
            }

            NSLog("Converged in \(iterationCount) iterations.")

            DispatchQueue.main.async { [self] in

                dominantColors = centroids.map {
                    DominantColor($0)
                }

                isBusy = false
            }
        }
    }

    /// - Tag: initializeCentroids
    func initializeCentroids() {
        centroids.removeAll()

        let randomIndex = Int.random(in: 0 ..< dimension * dimension)
        centroids.append(Centroid(red: redStorage[randomIndex],
                                  green: greenStorage[randomIndex],
                                  blue: blueStorage[randomIndex]))

        // Use the first row of the `distances` buffer as temporary storage.
        let tmp = UnsafeMutableBufferPointer(start: distances.baseAddress!,
                                             count: dimension * dimension)
        for i in 1 ..< k {
            distanceSquared(x0: greenStorage.baseAddress!, x1: centroids[i - 1].green,
                            y0: blueStorage.baseAddress!, y1: centroids[i - 1].blue,
                            z0: redStorage.baseAddress!, z1: centroids[i - 1].red,
                            n: greenStorage.count,
                            result: tmp.baseAddress!)

            let randomIndex = weightedRandomIndex(tmp)

            centroids.append(Centroid(red: redStorage[randomIndex],
                                      green: greenStorage[randomIndex],
                                      blue: blueStorage[randomIndex]))
        }
    }

    /// Updates centroids and returns true if pixel counts haven't changed (that is, the solution converged).
    ///
    /// 1. Create k random centroids selected from the RGB colors in an image.
    /// 2. Create a distances matrix that has pixel-count columns and k rows.
    /// 3. For each centroid, populate the corresponding row in distances matrix with the distance-squared
    /// between it and each matrix.
    /// 4. Use BNNS reduction argMin on the distances matrix to create a vector with pixel-count elements.
    /// Each element in the vector is the centroid that's the closest color to the corresponding pixel.
    /// 5. For each centroid, use BNNS gather to create a new vector for each RGB channel of the pixel
    /// colors for that centroid. Compute the mean value of that vector and set the centroid color to that average.
    /// 6. Repeat steps 3, 4, and 5 until the solution converges.
    /// - Tag: updateCentroids
    func updateCentroids() -> Bool {
        // The pixel counts per centroid before this iteration.
        let pixelCounts = centroids.map { return $0.pixelCount }

        populateDistances()
        let centroidIndices = makeCentroidIndices()

        for centroid in centroids.enumerated() {

            // The indices into the red, green, and blue descriptors for this centroid.
            let indices = centroidIndices.enumerated().filter {
                $0.element == centroid.offset
            }.map {
                // `vDSP.gather` uses one-based indices.
                UInt($0.offset + 1)
            }

            centroids[centroid.offset].pixelCount = indices.count

            if !indices.isEmpty {
                let gatheredRed = vDSP.gather(redStorage,
                                              indices: indices)

                let gatheredGreen = vDSP.gather(greenStorage,
                                                indices: indices)

                let gatheredBlue = vDSP.gather(blueStorage,
                                               indices: indices)

                centroids[centroid.offset].red = vDSP.mean(gatheredRed)
                centroids[centroid.offset].green = vDSP.mean(gatheredGreen)
                centroids[centroid.offset].blue = vDSP.mean(gatheredBlue)
            }
        }

        return pixelCounts.elementsEqual(centroids.map { return $0.pixelCount }) { a, b in
            return abs(a - b) < tolerance
        }
    }
}

@available(iOS 17.0, *)
extension KMeansCalculator {

    /// Populates the `distances` memory with the distance squared between each centroid and each color.
    func populateDistances() {
        for centroid in centroids.enumerated() {
            distanceSquared(x0: greenStorage.baseAddress!, x1: centroid.element.green,
                            y0: blueStorage.baseAddress!, y1: centroid.element.blue,
                            z0: redStorage.baseAddress!, z1: centroid.element.red,
                            n: greenStorage.count,
                            result: distances.baseAddress!.advanced(by: dimension * dimension * centroid.offset))
        }
    }

    /// Returns the index of the closest centroid for each color.
    func makeCentroidIndices() -> [Int32] {
        let distancesDescriptor = BNNSNDArrayDescriptor(
            data: distances,
            shape: .matrixRowMajor(dimension * dimension, k))!

        let reductionLayer = BNNS.ReductionLayer(function: .argMin,
                                                 input: distancesDescriptor,
                                                 output: centroidIndicesDescriptor,
                                                 weights: nil)

        try! reductionLayer?.apply(batchSize: 1,
                                   input: distancesDescriptor,
                                   output: centroidIndicesDescriptor)

        return centroidIndicesDescriptor.makeArray(of: Int32.self)!
    }

    func weightedRandomIndex(_ weights: UnsafeMutableBufferPointer<Float>) -> Int {
        var outputDescriptor = BNNSNDArrayDescriptor.allocateUninitialized(
            scalarType: Float.self,
            shape: .vector(1))

        var probabilities = BNNSNDArrayDescriptor(
            data: weights,
            shape: .vector(weights.count))!

        let randomGenerator = BNNSCreateRandomGenerator(
            BNNSRandomGeneratorMethodAES_CTR,
            nil)

        BNNSRandomFillCategoricalFloat(
            randomGenerator, &outputDescriptor, &probabilities, false)

        defer {
            BNNSDestroyRandomGenerator(randomGenerator)
            outputDescriptor.deallocate()
        }

        return Int(outputDescriptor.makeArray(of: Float.self)!.first!)
    }

    func distanceSquared(
        x0: UnsafePointer<Float>, x1: Float,
        y0: UnsafePointer<Float>, y1: Float,
        z0: UnsafePointer<Float>, z1: Float,
        n: Int,
        result: UnsafeMutablePointer<Float>) {

            var x = subtract(a: x0, b: x1, n: n)
            vDSP.square(x, result: &x)

            var y = subtract(a: y0, b: y1, n: n)
            vDSP.square(y, result: &y)

            var z = subtract(a: z0, b: z1, n: n)
            vDSP.square(z, result: &z)

            vDSP_vadd(x, 1, y, 1, result, 1, vDSP_Length(n))
            vDSP_vadd(result, 1, z, 1, result, 1, vDSP_Length(n))
        }

    func subtract(a: UnsafePointer<Float>, b: Float, n: Int) -> [Float] {
        return [Float](unsafeUninitializedCapacity: n) {
            buffer, count in

            vDSP_vsub(a, 1,
                      [b], 0,
                      buffer.baseAddress!, 1,
                      vDSP_Length(n))

            count = n
        }
    }

    func saturate<T: FloatingPoint>(_ x: T) -> T {
        return min(max(0, x), 1)
    }
}
```
