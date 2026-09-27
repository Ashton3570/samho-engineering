import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
let root = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let shapes = try JSONSerialization.jsonObject(with: Data(contentsOf: root.appendingPathComponent("geometry.json"))) as! [[[Any]]]
func render(_ size: Int, white: Bool, name: String) throws {
 let space = CGColorSpace(name: CGColorSpace.sRGB)!
 let ctx = CGContext(data:nil,width:size,height:size,bitsPerComponent:8,bytesPerRow:size*4,space:space,bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue)!
 ctx.setAllowsAntialiasing(true);ctx.setShouldAntialias(true)
 if white { ctx.setFillColor(CGColor(red:1,green:1,blue:1,alpha:1));ctx.fill(CGRect(x:0,y:0,width:size,height:size)) }
 ctx.translateBy(x:0,y:CGFloat(size));ctx.scaleBy(x:CGFloat(size)/1260,y:-CGFloat(size)/1260);ctx.translateBy(x:54,y:54)
 ctx.setFillColor(CGColor(colorSpace:space,components:[30.0/255,32.0/255,131.0/255,1])!)
 for shape in shapes {
  let path=CGMutablePath()
  for c in shape {
   func n(_ i:Int)->CGFloat {CGFloat((c[i] as! NSNumber).doubleValue)}
   switch c[0] as! String {
   case "M":path.move(to:CGPoint(x:n(1),y:n(2)))
   case "L":path.addLine(to:CGPoint(x:n(1),y:n(2)))
   case "C":path.addCurve(to:CGPoint(x:n(5),y:n(6)),control1:CGPoint(x:n(1),y:n(2)),control2:CGPoint(x:n(3),y:n(4)))
   default:path.closeSubpath()
   }
  }
  ctx.addPath(path);ctx.fillPath()
 }
 let dest=CGImageDestinationCreateWithURL(root.appendingPathComponent(name) as CFURL,UTType.png.identifier as CFString,1,nil)!
 CGImageDestinationAddImage(dest,ctx.makeImage()!,[kCGImagePropertyDPIWidth:300,kCGImagePropertyDPIHeight:300] as CFDictionary)
 guard CGImageDestinationFinalize(dest) else {throw NSError(domain:"PNG",code:1)}
 print(name, size)
}
try render(4096,white:false,name:"samho-logo-indigo-4096-transparent.png")
try render(4096,white:true,name:"samho-logo-indigo-4096-white.png")
try render(1200,white:true,name:"samho-logo-indigo-preview.png")
