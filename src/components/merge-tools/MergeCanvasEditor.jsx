import { useRef } from "react"
import { useBackgroundImage } from "./hooks/useBackgroundImage"
import { useSetupCanvas } from "./hooks/useSetupCanvas"
import { useOverlayImage } from "./hooks/useOverlayImage"
import { useCropBox } from "./hooks/useCropBox"

const MergeCanvasEditor = ({ fabricCanvasRef, overlayImageRef, cropCanvasRef }) => {
  const canvasRef = useRef(null)

  useSetupCanvas(canvasRef, fabricCanvasRef)
  const { bringCropBoxToFront } = useCropBox(fabricCanvasRef, cropCanvasRef)
  useBackgroundImage(fabricCanvasRef, bringCropBoxToFront)
  useOverlayImage(fabricCanvasRef, overlayImageRef, bringCropBoxToFront)

  return <canvas ref={canvasRef} />
}

export default MergeCanvasEditor
