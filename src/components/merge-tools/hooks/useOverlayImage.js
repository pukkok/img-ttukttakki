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

      const ref = overlayImageRef.current[currentImage.id]
      if (!ref) return

      ref.left = obj.left
      ref.top = obj.top
      ref.width = obj.width * obj.scaleX
      ref.height = obj.height * obj.scaleY
      ref.angle = obj.angle || 0
      ref.skewX = obj.skewX || 0
      ref.skewY = obj.skewY || 0
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

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas || !currentImage?.url) return

    // INFO: 기존 overlay 제거
    // TODO: 한번에 한장의 image만 불러와서 사용한다.
    canvas.getObjects().forEach(obj => {
      if (obj.customType === 'overlay') {
        canvas.remove(obj)
      }
    })

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()
    const saved = overlayImageRef.current[currentImage.id]

    // TODO: 초기 이미지를 불러온다.
    const initializeOverlayImage = (img) => {
      const maxHeight = (canvasHeight * 2) / 3
      const scale = Math.min(1, maxHeight / img.height)

      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale
      const left = canvasWidth / 2 - scaledWidth / 2
      const top = canvasHeight / 2 - scaledHeight / 2

      img.set({
        left,
        top,
        width: img.width,
        height: img.height,
        scaleX: scale,
        scaleY: scale,
        angle: 0,
        skewX: 0,
        skewY: 0,
        selectable: true,
        evented: true,
        hasControls: true,
        customType: 'overlay',
      })

      overlayImageRef.current[currentImage.id] = {
        left,
        top,
        width: img.width * scale,
        height: img.height * scale,
        angle: 0,
        skewX: 0,
        skewY: 0,
        img,
      }

      canvas.add(img)
      canvas.setActiveObject(img)

      const bgObj = canvas.getObjects().find(obj => obj.customType === 'background')
      if (bgObj) canvas.sendToBack(bgObj)

      if (typeof onLoaded === 'function') onLoaded()
    }

    // INFO: 클론이기 때문에 scale값을 되돌려서 다시 사용한다.
    // TODO : 복사하여 다시 가져온다. 계속 객체를 만드는 행위 제거
    const restoreOverlayImage = (img) => {
      const { left, top, width, height, angle, skewX, skewY } = saved
      const scaleX = width / img.width
      const scaleY = height / img.height

      img.set({
        left,
        top,
        scaleX,
        scaleY,
        angle,
        skewX,
        skewY,
        cornerStyle: 'circle',
        selectable: true,
        evented: true,
        hasControls: true,
        customType: 'overlay',
      })

      saved.img = img

      canvas.add(img)
      canvas.setActiveObject(img)

      const bgObj = canvas.getObjects().find(obj => obj.customType === 'background')
      if (bgObj) canvas.sendToBack(bgObj)

      if (typeof onLoaded === 'function') onLoaded()
    }

    const loadImage = async () => {
      try {
        if (saved?.img) {
          saved.img.clone(clone => restoreOverlayImage(clone))
        } else {
          // INFO: 새로운 이미지 객체를 불러온다.
          fabric.Image.fromURL(currentImage.url, img => {
            if (img) initializeOverlayImage(img)
            else console.error('Image load error')
          })
        }
      } catch (err) {
        console.error('작업 이미지 불러오기 실패:', err)
      }
    }

    loadImage()
  }, [currentImage])
}
