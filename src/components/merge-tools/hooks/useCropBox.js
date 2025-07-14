import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { useMergeCanvasStore } from '../../../stores/useMergeCanvasStore'

export const useCropBox = (fabricCanvasRef, cropCanvasRef) => {
  const selectCrop = useMergeCanvasStore(s => s.selectCrop)
  const cropBoxInfo = useMergeCanvasStore(s => s.cropBoxInfo)
  const setCropBoxInfo = useMergeCanvasStore(s => s.setCropBoxInfo)

  const maskRefs = useRef({
    topLeft: null,
    top: null,
    topRight: null,
    left: null,
    right: null,
    bottomLeft: null,
    bottom: null,
    bottomRight: null,
  })

  const bringCropBoxToFront = () => {
    const canvas = fabricCanvasRef.current
    const cropBox = cropCanvasRef.current
    if (!canvas || !cropBox) return

    Object.values(maskRefs.current).forEach(mask => {
      canvas.bringToFront(mask)
    })
    canvas.bringToFront(cropBox)
  }

  const updateMask = () => {
    const canvas = fabricCanvasRef.current
    const cropBox = cropCanvasRef.current

    const masks = maskRefs.current
    if (!canvas || !cropBox) return

    const { left, top, width, height, scaleX, scaleY } = cropBox

    const actualWidth = Math.round(width * scaleX)
    const actualHeight = Math.round(height * scaleY)

    const boxLeft = Math.round(left)
    const boxTop = Math.round(top)
    const boxRight = Math.round(boxLeft + actualWidth)
    const boxBottom = Math.round(boxTop + actualHeight)

    const canvasWidth = Math.round(canvas.getWidth())
    const canvasHeight = Math.round(canvas.getHeight())

    // 좌상단
    masks.topLeft.set({
      left: 0, top: 0, width: boxLeft, height: boxTop,
    })

    // 상단 중앙
    masks.top.set({
      left: boxLeft, top: 0, width: actualWidth, height: boxTop,
    })

    // 우상단
    masks.topRight.set({
      left: boxRight, top: 0, width: canvasWidth - boxRight, height: boxTop,
    })

    // 좌
    masks.left.set({
      left: 0, top: boxTop, width: boxLeft, height: actualHeight,
    })

    // 우
    masks.right.set({
      left: boxRight, top: boxTop, width: canvasWidth - boxRight, height: actualHeight,
    })

    // 좌하단
    masks.bottomLeft.set({
      left: 0, top: boxBottom, width: boxLeft, height: canvasHeight - boxBottom,
    })

    // 하단 중앙
    masks.bottom.set({
      left: boxLeft, top: boxBottom, width: actualWidth, height: canvasHeight - boxBottom,
    })

    // 우하단
    masks.bottomRight.set({
      left: boxRight, top: boxBottom, width: canvasWidth - boxRight, height: canvasHeight - boxBottom,
    })

    cropBox.set({
      left: Math.round(left),
      top: Math.round(top),
      scaleX: +scaleX.toFixed(3),
      scaleY: +scaleY.toFixed(3)
    })

    bringCropBoxToFront()
    setCropBoxInfo({
      width: actualWidth, height: actualHeight
    })
    canvas.requestRenderAll()
  }

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()
    const defaultWidth = 400
    const defaultHeight = 400

    const cropBox = new fabric.Rect({
      left: Math.round(canvasWidth / 2 - defaultWidth / 2),
      top: Math.round(canvasHeight / 2 - defaultHeight / 2),
      width: defaultWidth,
      height: defaultHeight,
      fill: 'transparent',
      stroke: '#10B981',
      strokeWidth: 1,
      strokeUniform: true,
      lockSkewingX: true,
      lockSkewingY: true,
      cornerStyle: 'circle',
      customType: 'cropBox',
      selectable: selectCrop,
      evented: selectCrop,
      hasControls: selectCrop,
      scaleX: 1,
      scaleY: 1,
    })

    // INFO: rotate 핸들러를 제거한다.
    cropBox.setControlsVisibility({ mtr: false })

    const createMask = () =>
      new fabric.Rect({
        fill: 'rgba(0,0,0,0.4)',
        stroke: 'rgba(0,0,0,0.4)',
        strokeWidth:0.1,
        strokeUniform: true,
        selectable: false,
        evented: false,
        customType: 'cropMask',
      })

    for(const key in maskRefs.current) {
      maskRefs.current[key] = createMask()
    }

    canvas.add(cropBox)
    cropCanvasRef.current = cropBox
    updateMask()

    canvas.on('object:modified', updateMask)
    canvas.on('object:moving', updateMask)
    canvas.on('object:scaling', updateMask)

    return () => {
      canvas.off('object:modified', updateMask)
      canvas.off('object:moving', updateMask)
      canvas.off('object:scaling', updateMask)
    }
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

  useEffect(() => {
    updateMask()
  }, [cropBoxInfo.width, cropBoxInfo.height])

  return { updateMask, bringCropBoxToFront }
}