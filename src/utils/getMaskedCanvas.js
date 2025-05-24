/**
 * @param {Object} options
 * @param {{ name: string, url: string }} options.image
 * @param {'circle' | 'rect'} options.shape
 * @param {'transparent' | 'white' | 'black'} options.background
 * @param {Object} [options.offset]
 * @param {number} [options.scale]
 * @param {number} [options.size]
 * @returns {Promise<HTMLCanvasElement>}
 */
const getMaskedCanvas = async ({ image, shape = 'circle', background = 'transparent', offset = { x: 0, y: 0 }, scale = 1, size = 400 }) => {
  if (!image) return null

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = size
  canvas.height = size

  const img = new Image()
  img.src = image.url

  return new Promise((resolve) => {
    img.onload = () => {
      // 배경
      if (background === 'white') {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, size, size)
      } else if (background === 'black') {
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, size, size)
      } else {
        ctx.clearRect(0, 0, size, size)
      }

      // 마스킹
      ctx.save()
      ctx.beginPath()
      if (shape === 'circle') {
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      } else {
        ctx.rect(0, 0, size, size)
      }
      ctx.clip()

      // 이미지 그리기 (확대/위치 적용)
      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      ctx.drawImage(img, offset.x, offset.y, drawWidth, drawHeight)

      ctx.restore()
      resolve(canvas)
    }
  })
}

export default getMaskedCanvas
