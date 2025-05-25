import getShapePath from './getShapePath'

const getMaskedCanvas = async ({
  image,
  shape = '원형',
  background = 'transparent',
  offset = { x: 0, y: 0 },
  scale = 1,
  shapeOptions = {},
  size = 500 // 미리보기 크기
}) => {
  if (!image) return null

  const img = new Image()
  img.src = image.url

  return new Promise((resolve) => {
    img.onload = () => {
      const imgW = img.width
      const imgH = img.height

      // 실제로 이미지 내에서 보이는 영역 (원본 해상도 기준)
      const visibleW = size / scale
      const visibleH = size / scale

      const cropX = -offset.x / scale
      const cropY = -offset.y / scale

      // 잘라낼 영역이 이미지 범위를 벗어나지 않게 clamp
      const safeCropX = Math.max(0, cropX)
      const safeCropY = Math.max(0, cropY)
      const safeCropW = Math.min(imgW - safeCropX, visibleW)
      const safeCropH = Math.min(imgH - safeCropY, visibleH)
      const outputSize = Math.min(safeCropW, safeCropH)

      const canvas = document.createElement('canvas')
      canvas.width = outputSize
      canvas.height = outputSize
      const ctx = canvas.getContext('2d')

      // 배경 처리
      if (background === 'white') {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, outputSize, outputSize)
      } else if (background === 'black') {
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, outputSize, outputSize)
      } else {
        ctx.clearRect(0, 0, outputSize, outputSize)
      }

      ctx.save()
      const shapePath = getShapePath(shape, outputSize, shapeOptions)
      ctx.clip(shapePath)

      // drawImage(원본에서 자를 부분, 캔버스에 그릴 부분)
      ctx.drawImage(
        img,
        safeCropX,
        safeCropY,
        outputSize,
        outputSize,
        0,
        0,
        outputSize,
        outputSize
      )

      ctx.restore()
      resolve(canvas)
    }
  })
}

export default getMaskedCanvas
