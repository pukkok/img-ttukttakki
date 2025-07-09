import { useEffect } from 'react'
import { fabric } from 'fabric'
import { useMergeCanvasStore } from '../../../stores/useMergeCanvasStore'

export const useBackgroundImage = (fabricCanvasRef) => {
  const backgroundImageUrl = useMergeCanvasStore(s => s.backgroundImageUrl)
  const isBackgroundLocked = useMergeCanvasStore(s => s.isBackgroundLocked)
  const setBackgroundImageInfo = useMergeCanvasStore(s => s.setBackgroundImageInfo)

  // INFO: 배경이벤트 등록
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const handleModified = (e) => {
      const obj = e.target
      if (obj?.get('customType') !== 'background') return

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
  }, [])

  // INFO: 배경 넣기
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // INFO: 이미 배경이 들어있다면 지운다.
    const existingBg = canvas.getObjects().find(obj => obj.customType === 'background')
    if (existingBg) canvas.remove(existingBg)

    if (!backgroundImageUrl) { // INFO: 배경 삽입이 잘못된 경우
      setBackgroundImageInfo(null)
      canvas.renderAll()
      return
    }

    fabric.Image.fromURL(backgroundImageUrl, (bgImg) => {
      if (!bgImg) return

      const canvasWidth = canvas.getWidth()
      const canvasHeight = canvas.getHeight()

      const targetHeight = (canvasHeight * 2) / 3
      const scale = targetHeight / bgImg.height
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
      
      canvas.setActiveObject(bgImg)
      canvas.requestRenderAll()
    }, { crossOrigin: 'anonymous' }) // 이미지가 외부일 경우를 위해
  }, [backgroundImageUrl])

  // INFO: 배경 잠금시 처리
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const bgObj = canvas.getObjects().find(obj => obj.customType === 'background')
    if (!bgObj) return

    bgObj.set({
      selectable: !isBackgroundLocked,
      evented: !isBackgroundLocked,
      hasControls: !isBackgroundLocked,
    })

    if (isBackgroundLocked) {
      canvas.discardActiveObject()
    }
    canvas.requestRenderAll()
  }, [isBackgroundLocked])
}
