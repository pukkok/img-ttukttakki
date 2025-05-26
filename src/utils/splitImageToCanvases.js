import { PAPER_SIZES } from './paperSizes'

/**
 * 이미지를 종이 비율 기준으로 늘린 후, 지정된 행과 열로 분할하여 축소된 canvas 조각들로 반환합니다.
 * 각 조각은 종이 비율을 따르며, 출력용으로 적당한 해상도를 자동 적용합니다.
 */
export const splitImageToCanvases = async (
  imageUrl,
  rows,
  cols,
  paperSize = 'A4',
  orientation = 'portrait'
) => {
  // 종이 규격 정보 가져오기
  const paper = PAPER_SIZES[paperSize] || PAPER_SIZES['A4']
  const unitW = orientation === 'landscape' ? paper.height : paper.width
  const unitH = orientation === 'landscape' ? paper.width : paper.height
  const paperRatio = unitW / unitH

  // 전체 출력 비율 (cols : rows * 종이 비율)
  const outputRatio = cols / (rows * paperRatio)

  // 이미지 로드
  const img = await loadImage(imageUrl)
  const originalWidth = img.width
  const originalHeight = img.height

  // 전체 이미지 사이즈를 출력 비율에 맞춰 가상으로 스케일 조정
  const scaledWidth = originalWidth
  const scaledHeight = scaledWidth / outputRatio

  // 원본 이미지 한 조각의 실제 높이 (화질 보존 조건용)
  const rawTileHeight = originalHeight / rows

  // 기본 출력 크기 = 종이 높이의 1/4, 단 원본 해상도보다 크면 축소하지 않음
  const baseHeight = unitH / 4
  const tileRatio = paperRatio
  const targetTileHeight = Math.min(baseHeight, rawTileHeight)
  const targetTileWidth = targetTileHeight * tileRatio

  const canvases = []

  // 행과 열을 기준으로 이미지 분할
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 비율 보정을 위해 가상 스케일링 기준으로 crop 영역 계산
      const cropX = (col * scaledWidth) / cols
      const cropY = (row * scaledHeight) / rows
      const cropW = scaledWidth / cols
      const cropH = scaledHeight / rows

      // 원본 이미지 좌표계로 다시 매핑
      const sx = cropX * (originalWidth / scaledWidth)
      const sy = cropY * (originalHeight / scaledHeight)
      const sw = cropW * (originalWidth / scaledWidth)
      const sh = cropH * (originalHeight / scaledHeight)

      // 출력용 canvas 생성 및 그림 그리기
      const canvas = document.createElement('canvas')
      canvas.width = targetTileWidth
      canvas.height = targetTileHeight
      const ctx = canvas.getContext('2d')

      ctx.drawImage(
        img,
        sx, sy, sw, sh,               // 원본에서 잘라낼 영역
        0, 0, targetTileWidth, targetTileHeight // 축소된 출력 영역
      )

      canvases.push(canvas)
    }
  }

  return canvases
}

/**
 * 이미지 객체를 비동기로 불러오기
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
