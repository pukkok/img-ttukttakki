import { useEffect, useRef } from 'react'
import { Canvas, FabricImage } from 'fabric'
import { useMergeCanvasStore } from '../../stores/useMergeCanvasStore'

const BackgroundCanvas = ({ backgroundRef }) => {
  const backgroundImage = useMergeCanvasStore(s => s.backgroundImageUrl)
  const isFixBackground = useMergeCanvasStore(s => s.isFixBackground)
  const setBackgroundImageInfo = useMergeCanvasStore(s => s.setBackgroundImageInfo)

  const canvasRef = useRef(null)

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

    backgroundRef.current = canvas

    const handleObjectModified = (e) => {
      const obj = e.target
      if (obj && obj.get('customType') === 'background') {
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
      backgroundRef.current = null
    }
  }, [setBackgroundImageInfo])


  useEffect(() => {
    const loadBackground = async () => {
      const canvas = backgroundRef.current
      if(!canvas) return

      const existingBg = canvas.getObjects().find(obj => obj.get('customType') === 'background')
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
        })

        bgImg.set('customType', 'background')

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
  }, [backgroundImage, setBackgroundImageInfo])

  useEffect(() => {
    const canvas = backgroundRef.current
    if (!canvas) return

    const bgObj = canvas.getObjects().find(obj => obj.get('customType') === 'background')
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

  return (
    <canvas ref={canvasRef} />
  )
}

export default BackgroundCanvas
