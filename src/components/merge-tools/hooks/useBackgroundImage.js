import { useEffect } from 'react'
import { fabric } from 'fabric'
import { useMergeCanvasStore } from '../../../stores/useMergeCanvasStore'

export const useBackgroundImage = (fabricCanvasRef, onLoaded) => {
  const backgroundImageUrl = useMergeCanvasStore(s => s.backgroundImageUrl)
  const isBackgroundLocked = useMergeCanvasStore(s => s.isBackgroundLocked)
  const setBackgroundImageInfo = useMergeCanvasStore(s => s.setBackgroundImageInfo)

  // INFO: 배경이벤트 등록
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const handleModified = (e) => {
      const obj = e.target
      if (obj.customType !== 'background') return
      
      setBackgroundImageInfo({
        width: Math.round(obj.width * obj.scaleX),
        height: obj.height * obj.scaleY,
        rotation: Math.round(obj.angle),
        skewX: +obj.skewX.toFixed(2),
        skewY: +obj.skewY.toFixed(2)
      })

      obj.set({
        left: Math.round(obj.left),
        top: Math.round(obj.top),
        scaleX: +obj.scaleX.toFixed(3),
        scaleY: +obj.scaleY.toFixed(3),
        angle: Math.round(obj.angle),
        skewX: +obj.skewX.toFixed(2),
        skewY: +obj.skewY.toFixed(2),
      })

      console.log(obj)
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

      const targetHeight = (canvasHeight * 3) / 4
      const scale = +(targetHeight / bgImg.height).toFixed(3)
      const scaledWidth = Math.round(bgImg.width * scale)
      const scaledHeight = Math.round(bgImg.height * scale)

      bgImg.set({
        left: Math.round(canvasWidth / 2 - scaledWidth / 2),
        top: Math.round(canvasHeight / 2 - scaledHeight / 2),
        width: bgImg.width,
        height: bgImg.height,
        scaleX: scale,
        scaleY: scale,  
        angle: 0,
        skewX: 0,
        skewY: 0,
        cornerStyle: 'circle',
        selectable: true,
        evented: true,
        hasControls: true,
        customType: 'background',
      })

      canvas.add(bgImg)
      canvas.sendToBack(bgImg)
      setBackgroundImageInfo({
        width: scaledWidth,
        height: scaledHeight,
        rotation: 0,
        skewX: 0,
        skewY: 0,
      })
      
      canvas.setActiveObject(bgImg)

      if (typeof onLoaded === 'function') {
        onLoaded()
      }
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
