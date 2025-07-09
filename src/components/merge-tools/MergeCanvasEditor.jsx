import { useRef, useEffect } from "react"
import { useBackgroundImage } from "./hooks/useBackgroundImage"
import { useSetupCanvas } from "./hooks/useSetupCanvas"
import { useOverlayImage } from "./hooks/useOverlayImage"
import { useCropBox } from "./hooks/useCropBox"

const MergeCanvasEditor = ({ fabricCanvasRef, overlayImageRef, cropCanvasRef }) => {
  const canvasRef = useRef(null)

  useSetupCanvas(canvasRef, fabricCanvasRef)
  useBackgroundImage(fabricCanvasRef)
  useOverlayImage(fabricCanvasRef, overlayImageRef)
  useCropBox(fabricCanvasRef, cropCanvasRef)
  
  return <canvas ref={canvasRef} />
}

export default MergeCanvasEditor
