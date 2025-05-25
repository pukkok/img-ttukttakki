import { useRef, useEffect } from 'react'
import getShapePath from '../utils/getShapePath'

const CropCanvasEditor = ({ image, shape = '원형', background = 'transparent', offset, scale, onOffsetChange, onScaleChange, shapeOptions = {} }) => {
  const canvasRef = useRef(null)
  const size = 400
  const draggingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const drawCanvas = () => {
    if (!image || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = image.url

    img.onload = () => {
      canvas.width = size
      canvas.height = size

      ctx.save()
      const shapePath = getShapePath(shape, size, shapeOptions)
      ctx.clip(shapePath)

      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      ctx.drawImage(img, offset.x, offset.y, drawWidth, drawHeight)
      ctx.restore()

      ctx.beginPath()
      ctx.setLineDash([6, 6])
      ctx.strokeStyle = '#aaa'
      ctx.lineWidth = 2
      ctx.stroke(getShapePath(shape, size, shapeOptions))
      ctx.setLineDash([])
    }
  }

  useEffect(drawCanvas, [image, offset, scale, shape, background, shapeOptions])

  const handleMouseDown = (e) => {
    draggingRef.current = true
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return
    const dx = e.clientX - lastPosRef.current.x
    const dy = e.clientY - lastPosRef.current.y
    onOffsetChange({ x: offset.x + dx, y: offset.y + dy })
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    draggingRef.current = false
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    const newScale = Math.min(Math.max(scale + delta, 0.1), 5)
    onScaleChange(newScale)
  }

  const handleScaleInput = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onScaleChange(Math.min(Math.max(value, 0.1), 5))
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div className="relative w-[400px] h-[400px]">
        <div className="absolute inset-0 bg-transparent-grid rounded pointer-events-none z-0" />
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="relative z-10 border rounded shadow-lg cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-300">
        <label>확대/축소:</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.05"
          value={scale}
          onChange={handleScaleInput}
          className="w-40"
        />
        <span>{scale.toFixed(2)}x</span>
      </div>
    </div>
  )
}

export default CropCanvasEditor
