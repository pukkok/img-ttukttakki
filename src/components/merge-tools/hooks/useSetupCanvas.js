import { useEffect } from 'react'
import { fabric } from 'fabric'

export const useSetupCanvas = (canvasRef, fabricCanvasRef) => {
  useEffect(() => {
    if (!canvasRef.current) return
    const parent = canvasRef.current.parentElement
    if (!parent) return

    const { width, height } = parent.getBoundingClientRect()

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      preserveObjectStacking: true,
      selection: false,
    })

    fabricCanvasRef.current = canvas

    return () => {
      canvas.dispose()
      fabricCanvasRef.current = null
    }
  }, [])
}
