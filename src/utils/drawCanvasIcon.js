export const drawCrop = (ctx) => {
  ctx.clearRect(0, 0, 120, 120)

  // 둥근 테두리 사각형
  const x = 6
  const y = 6
  const width = 106
  const height = 106
  const radius = 16

  ctx.strokeStyle = '#bbb'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.stroke()

  // 중앙 원 (점선)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.setLineDash([4, 4])
  ctx.arc(60, 60, 30, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.setLineDash([])
}

export const drawSplit = (ctx) => {
  ctx.clearRect(0, 0, 120, 120)
  const boxSize = 30
  const gap = 4
  const startX = 12
  const startY = 12
  ctx.fillStyle = '#bbb'

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = startX + col * (boxSize + gap)
      const y = startY + row * (boxSize + gap)
      ctx.fillRect(x, y, boxSize, boxSize)
    }
  }
}

export const drawMerge = (ctx) => {
  ctx.clearRect(0, 0, 120, 120)

  // 배경 사각형
  ctx.fillStyle = '#bbb'
  ctx.fillRect(10, 10, 100, 100)

  // 이미지1 (반투명 흰 배경 + 회색 테두리)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.fillRect(30, 30, 40, 40)
  ctx.strokeStyle = '#888'
  ctx.lineWidth = 1.5
  ctx.strokeRect(30, 30, 40, 40)

  // 이미지2 (살짝 겹쳐서 아래쪽)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.fillRect(50, 50, 40, 40)
  ctx.strokeStyle = '#888'
  ctx.lineWidth = 1.5
  ctx.strokeRect(50, 50, 40, 40)

  // 회전된 이미지3 (45도)
  ctx.save()
  ctx.translate(45, 80)
  ctx.rotate((15 * Math.PI) / 180)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.fillRect(-15, -15, 30, 30)
  ctx.strokeStyle = '#888'
  ctx.lineWidth = 1.5
  ctx.strokeRect(-15, -15, 30, 30)
  ctx.restore()
}