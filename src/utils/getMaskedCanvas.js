import getShapePath from './getShapePath'

const getMaskedCanvas = async ({
  image,
  shape = '원형',
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

      const cropW = Math.min(imgW - cropX, visibleW)
      const cropH = Math.min(imgH - cropY, visibleH)
      const outputSize = Math.min(cropW, cropH)

      const canvas = document.createElement('canvas')
      canvas.width = outputSize
      canvas.height = outputSize
      const ctx = canvas.getContext('2d')

      ctx.save()
      const shapePath = getShapePath(shape, outputSize, shapeOptions)
      ctx.clip(shapePath)

      // drawImage(원본에서 자를 부분, 캔버스에 그릴 부분)
      ctx.drawImage(
        img,
        cropX,
        cropY,
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
