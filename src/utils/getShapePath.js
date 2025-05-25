/**
 * 공통된 shape 경로를 반환
 * @param {'circle' | 'rect' | 'heart' | 'roundedRect'} shape
 * @param {number} size - 정사각형 canvas size
 * @param {object} [options] - 추가 옵션
 * @param {number} [options.radius=20] - roundedRect일 때 모서리 반지름
 * @returns {Path2D}
 */
const getShapePath = (shape, size, options = {}) => {
  const path = new Path2D()
  const x = size / 2
  const y = size / 2
  const r = size / 2
  const { radius = 20 } = options

  if (shape === '하트') {
    const hr = r * 1.4 // 캔버스를 가득 채우는 통통한 하트
    const offsetY = hr * 0.35 // 중심을 아래로 보정
    const cy = y + offsetY

    path.moveTo(x, cy + hr * 0.3)
    path.bezierCurveTo(x + hr, cy - hr * 0.05, x + hr * 0.75, cy - hr * 1.35, x, cy - hr * 0.75)
    path.bezierCurveTo(x - hr * 0.75, cy - hr * 1.35, x - hr, cy - hr * 0.05, x, cy + hr * 0.3)

  } else if (shape === '원형') {
    path.arc(x, y, r, 0, Math.PI * 2)

  } else if (shape === '둥근 모서리') {
    const pad = 0
    const w = size - pad * 2
    const h = size - pad * 2
    const rx = Math.min(radius, w / 2)
    const ry = Math.min(radius, h / 2)

    path.moveTo(pad + rx, pad)
    path.lineTo(pad + w - rx, pad)
    path.quadraticCurveTo(pad + w, pad, pad + w, pad + ry)
    path.lineTo(pad + w, pad + h - ry)
    path.quadraticCurveTo(pad + w, pad + h, pad + w - rx, pad + h)
    path.lineTo(pad + rx, pad + h)
    path.quadraticCurveTo(pad, pad + h, pad, pad + h - ry)
    path.lineTo(pad, pad + ry)
    path.quadraticCurveTo(pad, pad, pad + rx, pad)

  } else {
    path.rect(0, 0, size, size)
  }

  return path
}

export default getShapePath
