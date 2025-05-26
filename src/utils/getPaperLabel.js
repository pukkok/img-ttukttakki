import { PAPER_SIZES } from './paperSizes'

export const getPaperLabel = (key, orientation = 'portrait') => {
  const paper = PAPER_SIZES[key]
  if (!paper) return key

  const isLandscape = orientation === 'landscape'

  const w = isLandscape ? paper.height : paper.width
  const h = isLandscape ? paper.width : paper.height
  const r = w / h

  const [left, right] =
    r >= 1 ? [r.toFixed(3), '1'] : ['1', (1 / r).toFixed(3)]

  return `${key} (${left} : ${right})`
}