/**
 * 비율 문자열 ("4:3")을 숫자 객체로 변환
 * @param {string} ratioStr
 * @returns {{ w: number, h: number }}
 */
const parseAspectRatio = (ratioStr) => {
  const [w, h] = ratioStr.split(':').map(Number)
  return { w: isNaN(w) ? 1 : w, h: isNaN(h) ? 1 : h }
}

/**
 * 선택된 도형 이름과 옵션에 따라 클리핑 경로를 반환
 * @param {string} shape
 * @param {number} size - 기준 캔버스 크기 (정사각형 기준)
 * @param {object} options - 도형별 추가 옵션 (radius, aspectRatio 등)
 * @returns {Path2D}
 */
function getShapePath(shape, size = 500, options = {}) {
  const path = new Path2D()

  if (shape === '원형') {
    const r = size / 2
    path.arc(r, r, r, 0, Math.PI * 2)
    return path
  }

  if (shape === '사각형(둥근 모서리)') {
    const radius = options.radius || 0
    const { w, h } = parseAspectRatio(options.aspectRatio || '1:1')

    // 캔버스 내에서 비율에 맞는 width/height 계산
    let width, height
    if (w >= h) {
      width = size
      height = (size * h) / w
    } else {
      height = size
      width = (size * w) / h
    }

    const x = (size - width) / 2
    const y = (size - height) / 2
    const r = Math.min(radius, Math.min(width, height) / 2)

    path.moveTo(x + r, y)
    path.arcTo(x + width, y, x + width, y + height, r)
    path.arcTo(x + width, y + height, x, y + height, r)
    path.arcTo(x, y + height, x, y, r)
    path.arcTo(x, y, x + width, y, r)
    path.closePath()
    return path
  }

  if (shape === '하트') {
    const cx = size / 2
    const cy = size / 2
    const r = size / 4
    const x = cx
    const y = cy + r * 0.3

    path.moveTo(x, y)
    path.bezierCurveTo(x + r, cy - r * 0.05, x + r * 0.75, cy - r * 1.35, x, cy - r * 0.75)
    path.bezierCurveTo(x - r * 0.75, cy - r * 1.35, x - r, cy - r * 0.05, x, y)
    path.closePath()
    return path
  }

  // fallback: 원형
  const r = size / 2
  path.arc(r, r, r, 0, Math.PI * 2)
  return path
}

export default getShapePath
