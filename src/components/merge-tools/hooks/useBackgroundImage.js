import { useEffect } from 'react'
import { FabricImage } from 'fabric'
import { useMergeCanvasStore } from '../../../stores/useMergeCanvasStore'

export const useBackgroundImage = (fabricCanvasRef) => {
  const backgroundImage = useMergeCanvasStore(s => s.backgroundImageUrl)
  const isFixBackground = useMergeCanvasStore(s => s.isFixBackground)
  const setBackgroundImageInfo = useMergeCanvasStore(s => s.setBackgroundImageInfo)

  useEffect(() => {
    const loadBackground = async () => {
      const canvas = fabricCanvasRef.current
      if (!canvas) return

      const existingBg = canvas.getObjects().find(obj => obj.customType === 'background')
      if (existingBg) canvas.remove(existingBg)

      if (!backgroundImage) {
        setBackgroundImageInfo(null)
        canvas.renderAll()
        return
      }

      try {
        const bgImg = await FabricImage.fromURL(backgroundImage)
        const canvasWidth = canvas.getWidth()
        const canvasHeight = canvas.getHeight()

        const targetWidth = (canvasWidth * 2) / 3
        const scale = targetWidth / bgImg.width
        const scaledWidth = bgImg.width * scale
        const scaledHeight = bgImg.height * scale
        const left = (canvasWidth - scaledWidth) / 2
        const top = (canvasHeight - scaledHeight) / 2

        bgImg.set({
          left,
          top,
          scaleX: scale,
          scaleY: scale,
          angle: 0,
          skewX: 0,
          skewY: 0,
          selectable: true,
          evented: true,
          hasControls: true,
          customType: 'background',
        })

        canvas.add(bgImg)

        setBackgroundImageInfo({
          width: scaledWidth,
          height: scaledHeight,
          left,
          top,
          rotation: 0,
          skewX: 0,
          skewY: 0,
        })

        canvas.renderAll()
      } catch (err) {
        console.error('배경 이미지 불러오기 실패:', err)
        setBackgroundImageInfo(null)
      }
    }

    loadBackground()
  }, [backgroundImage])

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const bgObj = canvas.getObjects().find(obj => obj.customType === 'background')
    if (!bgObj) return

    bgObj.set({
      selectable: !isFixBackground,
      evented: !isFixBackground,
      hasControls: !isFixBackground,
    })

    if (isFixBackground) {
      canvas.discardActiveObject()
    }

    canvas.requestRenderAll()
  }, [isFixBackground])
}
