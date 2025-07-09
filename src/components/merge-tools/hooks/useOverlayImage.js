import { useEffect } from 'react'
import { fabric } from 'fabric'
import { useCommonStore } from '../../../stores/useCommonStore'

export const useOverlayImage = (fabricCanvasRef, overlayImageRef, onLoaded) => {
  const images = useCommonStore(s => s.images)
  const getCurrentIndex = useCommonStore(s => s.getCurrentIndex)

  const currentIndex = getCurrentIndex()
  const currentImage = images[currentIndex] || null

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const handleModified = (e) => {
      const obj = e.target
      if (!obj || obj.customType !== 'overlay' || !currentImage?.id) return

      overlayImageRef.current[currentImage.id] = {
        left: obj.left,
        top: obj.top,
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY,
        angle: obj.angle || 0,
        skewX: obj.skewX || 0,
        skewY: obj.skewY || 0,
      }
    }

    canvas.on('object:modified', handleModified)
    canvas.on('object:moving', handleModified)
    canvas.on('object:scaling', handleModified)
    canvas.on('object:rotating', handleModified)

    return () => {
      canvas.off('object:modified', handleModified)
      canvas.off('object:moving', handleModified)
      canvas.off('object:scaling', handleModified)
      canvas.off('object:rotating', handleModified)
    }
  }, [currentImage?.id])

  // 불러오기
  useEffect(() => {
    const loadImage = async () => {
      const canvas = fabricCanvasRef.current
      if (!canvas || !currentImage?.url) return

      // 기존 오버레이 제거
      canvas.getObjects().forEach(obj => {
        if (obj.customType === 'overlay') {
          canvas.remove(obj)
        }
      })

      try {
        const img = await new Promise((resolve, reject) => {
          fabric.Image.fromURL(currentImage.url, (img) => {
            if (img) resolve(img)
            else reject(new Error('Image load error'))
          })
        })

        const canvasWidth = canvas.getWidth()
        const canvasHeight = canvas.getHeight()

        const saved = overlayImageRef.current[currentImage.id]
        const targetMaxHeight = (canvasHeight * 2) / 3
        const scale = Math.min(1, targetMaxHeight / img.height)

        img.set({
          left: saved?.left ?? canvasWidth / 2,
          top: saved?.top ?? canvasHeight / 2,
          originX: 'center',
          originY: 'center',
          scaleX: saved ? (saved.width / img.width) : scale,
          scaleY: saved ? (saved.height / img.height) : scale,
          angle: saved?.angle ?? 0,
          skewX: saved?.skewX ?? 0,
          skewY: saved?.skewY ?? 0,
          cornerStyle: 'circle',
          selectable: true,
          evented: true,
          hasControls: true,
          customType: 'overlay',
        })

        canvas.add(img)
        canvas.setActiveObject(img)

        const bgObj = canvas.getObjects().find(obj => obj.customType === 'background')
        if (bgObj) canvas.sendToBack(bgObj)

        if (typeof onLoaded === 'function') {
          onLoaded()
        }
      } catch (err) {
        console.error('작업 이미지 불러오기 실패:', err)
      }
    }

    loadImage()
  }, [currentImage])
}
