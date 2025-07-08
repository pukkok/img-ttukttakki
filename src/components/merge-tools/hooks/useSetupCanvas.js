import { useEffect } from 'react'
import { Canvas } from 'fabric'
import { useMergeCanvasStore } from '../../../stores/useMergeCanvasStore'

export const useSetupCanvas = (canvasRef, fabricCanvasRef) => {
  const setBackgroundImageInfo = useMergeCanvasStore(s => s.setBackgroundImageInfo)

  useEffect(() => {
    if (!canvasRef.current) return
    const parent = canvasRef.current.parentElement
    if (!parent) return

    const { width, height } = parent.getBoundingClientRect()

    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      preserveObjectStacking: true,
      selection: false,
    })

    fabricCanvasRef.current = canvas

    const handleObjectModified = (e) => {
      const obj = e.target
      if (obj?.get('customType') === 'background') {
        setBackgroundImageInfo({
          width: obj.width * obj.scaleX,
          height: obj.height * obj.scaleY,
          left: obj.left,
          top: obj.top,
          rotation: obj.angle || 0,
          skewX: obj.skewX || 0,
          skewY: obj.skewY || 0,
        })
      }
    }

    canvas.on('object:modified', handleObjectModified)
    canvas.on('object:moving', handleObjectModified)
    canvas.on('object:scaling', handleObjectModified)
    canvas.on('object:rotating', handleObjectModified)

    return () => {
      canvas.off('object:modified', handleObjectModified)
      canvas.off('object:moving', handleObjectModified)
      canvas.off('object:scaling', handleObjectModified)
      canvas.off('object:rotating', handleObjectModified)
      canvas.dispose()
      fabricCanvasRef.current = null
    }
  }, [setBackgroundImageInfo])
}
