import { useEffect, useRef } from 'react'
import { PAPER_SIZES } from '../../utils/paperSizes'

const SplitImageEditor = ({
  image,
  rows = 3,
  cols = 3,
  paperSize = 'A4',
  orientation = 'portrait'
}) => {
  const canvasRef = useRef(null)
  const maxLength = 600 // 캔버스 최대 너비 또는 높이

  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = image.url

    img.onload = () => {
      // 출력 종이 크기 기준 비율 계산
      const paper = PAPER_SIZES[paperSize] || PAPER_SIZES['A4']
      const unitW = orientation === 'landscape' ? paper.height : paper.width
      const unitH = orientation === 'landscape' ? paper.width : paper.height

      const totalW = unitW * cols
      const totalH = unitH * rows
      const aspectRatio = totalW / totalH

      // 캔버스 사이즈 계산 (긴 쪽이 600)
      let canvasWidth, canvasHeight
      if (aspectRatio >= 1) {
        canvasWidth = maxLength
        canvasHeight = maxLength / aspectRatio
      } else {
        canvasHeight = maxLength
        canvasWidth = maxLength * aspectRatio
      }

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // 이미지 비율 맞춰서 캔버스에 꽉 채우기
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

      // 분할선 그리기
      ctx.strokeStyle = '#111'
      ctx.lineWidth = 1

      const tileW = canvasWidth / cols
      const tileH = canvasHeight / rows

      for (let i = 1; i < cols; i++) {
        const x = tileW * i
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasHeight)
        ctx.stroke()
      }

      for (let i = 1; i < rows; i++) {
        const y = tileH * i
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvasWidth, y)
        ctx.stroke()
      }
    }
  }, [image, rows, cols, paperSize, orientation])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-gray-700 rounded shadow"
      />
    </div>
  )
}

export default SplitImageEditor
