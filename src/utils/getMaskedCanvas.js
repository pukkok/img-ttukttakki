import getShapePath from './getShapePath'

const getMaskedCanvas = async ({ image, shape = '원형', background = 'transparent', offset = { x: 0, y: 0 }, scale = 1, size = 400, shapeOptions = {} }) => {
  if (!image) return null

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = size
  canvas.height = size

  const img = new Image()
  img.src = image.url

  return new Promise((resolve) => {
    img.onload = () => {
      if (background === 'white') {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, size, size)
      } else if (background === 'black') {
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, size, size)
      } else {
        ctx.clearRect(0, 0, size, size)
      }

      ctx.save()
      const shapePath = getShapePath(shape, size, shapeOptions)
      ctx.clip(shapePath)

      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      ctx.drawImage(img, offset.x, offset.y, drawWidth, drawHeight)

      ctx.restore()
      resolve(canvas)
    }
  })
}

export default getMaskedCanvas