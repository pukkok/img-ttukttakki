import { useRef } from "react"
import { useBackgroundImage } from "./hooks/useBackgroundImage"
import { useSetupCanvas } from "./hooks/useSetupCanvas.js"
import { useOverlayImage } from "./hooks/useOverlayImage.js"

const MergeCanvasEditor = ({ fabricCanvasRef, overlayImageRef }) => {
  const canvasRef = useRef(null)

  useSetupCanvas(canvasRef, fabricCanvasRef)
  useBackgroundImage(fabricCanvasRef)
  useOverlayImage(fabricCanvasRef, overlayImageRef)

  return (
    <canvas ref={canvasRef} />
  )
}

export default MergeCanvasEditor
