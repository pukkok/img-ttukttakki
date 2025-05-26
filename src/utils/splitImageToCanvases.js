import { PAPER_SIZES } from './paperSizes'

export const splitImageToCanvases = async (imageUrl, rows, cols, paperSize = 'A4', orientation = 'portrait') => {
  let { width, height } = PAPER_SIZES[paperSize] || PAPER_SIZES['A4']

  if (orientation === 'landscape') {
    [width, height] = [height, width] // swap
  }

  const img = await loadImage(imageUrl)
  const originalWidth = img.width
  const originalHeight = img.height

  const tileWidth = originalWidth / cols
  const tileHeight = originalHeight / rows

  const canvases = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      ctx.drawImage(
        img,
        col * tileWidth, row * tileHeight, tileWidth, tileHeight,
        0, 0, width, height
      )

      canvases.push(canvas)
    }
  }

  return canvases
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
