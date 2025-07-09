import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { useMergeCanvasStore } from '../../../stores/useMergeCanvasStore'

export const useCropBox = (fabricCanvasRef, cropCanvasRef) => {
  const isLockCrop = useMergeCanvasStore(s => s.isLockCrop)
  const selectCrop = useMergeCanvasStore(s => s.selectCrop)

  const maskRefs = useRef({
    top: null,
    bottom: null,
    left: null,
    right: null,
  })

  const bringCropBoxToFront = () => {
    const canvas = fabricCanvasRef.current
    const cropBox = cropCanvasRef.current
    if (!canvas || !cropBox) return

    canvas.bringToFront(cropBox)
    Object.values(maskRefs.current).forEach(mask => {
      canvas.bringToFront(mask)
    })
  }

  const updateMask = () => {
    const canvas = fabricCanvasRef.current
    const cropBox = cropCanvasRef.current
    const masks = maskRefs.current
    if (!canvas || !cropBox) return

    const { left, top, width, height, scaleX, scaleY, originX, originY } = cropBox

    const actualWidth = Math.ceil(width * scaleX)
    const actualHeight = Math.ceil(height * scaleY)

    const boxLeft = originX === 'center' ? Math.ceil(left - actualWidth / 2) : Math.ceil(left)
    const boxTop = originY === 'center' ? Math.ceil(top - actualHeight / 2) : Math.ceil(top)

    const canvasWidth = Math.ceil(canvas.getWidth())
    const canvasHeight = Math.ceil(canvas.getHeight())

    masks.top.set({ left: 0, top: 0, width: canvasWidth, height: boxTop })
    masks.bottom.set({ left: 0, top: boxTop + actualHeight, width: canvasWidth, height: canvasHeight - (boxTop + actualHeight) })
    masks.left.set({ left: 0, top: boxTop, width: boxLeft, height: actualHeight })
    masks.right.set({ left: boxLeft + actualWidth, top: boxTop, width: canvasWidth - (boxLeft + actualWidth), height: actualHeight })

    bringCropBoxToFront()
    canvas.requestRenderAll()
  }

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const existing = canvas.getObjects().find(obj => obj.customType === 'cropBox')
    if (existing) {
      cropCanvasRef.current = existing
      updateMask()
      return
    }

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()
    const defaultWidth = 400
    const defaultHeight = 400

    const cropBox = new fabric.Rect({
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      width: defaultWidth,
      height: defaultHeight,
      originX: 'center',
      originY: 'center',
      fill: 'transparent',
      hasRotatingPoint: false,
      lockRotation: true,
      lockSkewingX: true,
      lockSkewingY: true,
      cornerStyle: 'circle',
      customType: 'cropBox',
      selectable: selectCrop && !isLockCrop,
      evented: selectCrop && !isLockCrop,
      hasControls: selectCrop && !isLockCrop,
    })

    const createMask = () =>
      new fabric.Rect({
        fill: 'rgba(0,0,0,0.8)',
        selectable: false,
        evented: false,
        customType: 'cropMask',
      })

    maskRefs.current = {
      top: createMask(),
      bottom: createMask(),
      left: createMask(),
      right: createMask(),
    }

    canvas.add(cropBox)
    canvas.add(...Object.values(maskRefs.current))
    cropCanvasRef.current = cropBox

    canvas.on('object:modified', updateMask)
    canvas.on('object:moving', updateMask)
    canvas.on('object:scaling', updateMask)
    updateMask()
  }, [])

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    const cropBox = cropCanvasRef.current
    if (!canvas || !cropBox) return

    cropBox.set({
      selectable: selectCrop,
      evented: selectCrop,
      hasControls: selectCrop,
    })

    canvas.requestRenderAll()
  }, [selectCrop])
}