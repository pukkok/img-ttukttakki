import { PAPER_SIZES } from '../../utils/paperSizes'
import { getPaperLabel } from '../../utils/getPaperLabel'

const PaperOptionControl = ({
  paperSize,
  orientation,
  onPaperSizeChange,
  onOrientationChange,
  rows,
  cols
}) => {
  const paper = PAPER_SIZES[paperSize] || PAPER_SIZES['A4']
  const unitWidth = orientation === 'portrait' ? paper.width : paper.height
  const unitHeight = orientation === 'portrait' ? paper.height : paper.width

  const totalW_cm = (unitWidth * cols / 10).toFixed(1)
  const totalH_cm = (unitHeight * rows / 10).toFixed(1)

  return (
    <div className='flex gap-4 items-center flex-wrap'>
      <p className='pr-2 border-r border-gray-500'>용지</p>

      <div className="flex gap-2 items-center">
        <label>크기 : </label>
        <select
          value={paperSize}
          onChange={(e) => onPaperSizeChange(e.target.value)}
          className="bg-gray-800 border border-gray-600 px-2 py-1 rounded"
        >
          {Object.keys(PAPER_SIZES).map((key) => (
            <option key={key} value={key}>
              {getPaperLabel(key, orientation)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <label>방향 : </label>
        <select
          value={orientation}
          onChange={(e) => onOrientationChange(e.target.value)}
          className="bg-gray-800 border border-gray-600 px-2 py-1 rounded"
        >
          <option value="portrait">세로 (기본)</option>
          <option value="landscape">가로</option>
        </select>
      </div>

      <p className="text-xs text-gray-400 ml-auto mr-4 whitespace-nowrap">
        전체 출력 크기: {totalW_cm}cm × {totalH_cm}cm
      </p>
    </div>
  )
}

export default PaperOptionControl
