import { PAPER_SIZES } from './paperSizes'

/**
 * 이미지를 종이 비율 기준으로 늘린 후, 지정된 행과 열로 분할하여 축소된 canvas 조각들로 반환합니다.
 * 각 조각은 종이 비율을 따르며, padding(mm)은 출력용 여백, bleed(mm)는 재단 여유입니다.
 */
export const splitImageToCanvases = async (
  imageUrl,
  rows,
  cols,
  paperSize = 'A4',
  orientation = 'portrait',
  padding = 10,      // mm 단위 출력 여백 (흰 공간)
  bleed = 0          // mm 단위 재단 여유 (겹치는 영역)
) => {
  // 종이 규격 정보 (단위: mm)
  const paper = PAPER_SIZES[paperSize] || PAPER_SIZES['A4']
  
  const unitW = orientation === 'landscape' ? paper.height : paper.width
  const unitH = orientation === 'landscape' ? paper.width : paper.height
  
  const paperRatio = unitH / unitW
  
  // 이미지 로드
  const img = await loadImage(imageUrl)
  const originalWidth = img.width
  const originalHeight = img.height

  // 전체 출력 비율 (cols : rows * 종이 비율)
  const outputRatio = cols / (rows * paperRatio)
  const scaledWidth = originalWidth
  const scaledHeight = scaledWidth / outputRatio

  // crop 영역 크기 (스케일 기준)
  const cropW = scaledWidth / cols
  const cropH = scaledHeight / rows

  // 이미지 비율 대비 환산 (mm → px) - 단일 비율로 고정
  const pxPerMm = originalWidth / scaledWidth

  const canvases = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 각 방향의 padding 계산
      const padTop = Math.max(row === 0 ? padding : padding - bleed, 0)
      const padBottom = Math.max(row === rows - 1 ? padding : padding - bleed, 0)
      const padLeft = Math.max(col === 0 ? padding : padding - bleed, 0)
      const padRight = Math.max(col === cols - 1 ? padding : padding - bleed, 0)

      // bleed 계산 (이미지 확장 영역)
      const bleedTop = row === 0 ? 0 : bleed
      const bleedBottom = row === rows - 1 ? 0 : bleed
      const bleedLeft = col === 0 ? 0 : bleed
      const bleedRight = col === cols - 1 ? 0 : bleed

      // crop 좌표 (이미지 기준)
      const sx = (col * cropW - bleedLeft) * (originalWidth / scaledWidth)
      const sy = (row * cropH - bleedTop) * (originalHeight / scaledHeight)
      const sw = (cropW + bleedLeft + bleedRight) * (originalWidth / scaledWidth)
      const sh = (cropH + bleedTop + bleedBottom) * (originalHeight / scaledHeight)

      // 캔버스 크기 계산 (px 기준)
      const canvasWmm = cropW + padLeft + padRight
      const canvasHmm = cropH + padTop + padBottom
      const canvasWidth = canvasWmm * pxPerMm
      const canvasHeight = canvasHmm * pxPerMm
      const drawWidth = cropW * pxPerMm
      const drawHeight = cropH * pxPerMm
      const dx = padLeft * pxPerMm
      const dy = padTop * pxPerMm

      // canvas 생성
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(canvasWidth)
      canvas.height = Math.round(canvasHeight)
      const ctx = canvas.getContext('2d')

      // 배경 흰색 채우기
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 이미지 그리기
      ctx.drawImage(
        img,
        sx, sy, sw, sh,
        dx, dy, drawWidth, drawHeight
      )

      canvases.push(canvas)
    }
  }

  return canvases
}

// 이미지 비동기 로드
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
