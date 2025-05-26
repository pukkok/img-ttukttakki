import { useEffect, useState } from 'react'
import { PAPER_SIZES } from '../../utils/paperSizes'
import { getPaperLabel } from '../../utils/getPaperLabel'

const SplitSettingsPanel = ({ onApply }) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [paperSize, setPaperSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')

  // 변경이 일어날 때마다 자동으로 onApply 실행
  useEffect(() => {
    onApply({ rows, cols, paperSize, orientation })
  }, [rows, cols, paperSize, orientation, onApply])

  return (
    <div className="space-y-4 px-2 py-6 text-white text-sm">
      <div className='flex gap-4 items-center'>
        <p className='pr-2 border-r border-gray-500'>분할</p>
        <div className="flex gap-2 items-center">
          <label>가로 : </label>
          <input
            type="number"
            min="1"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-600 px-2 py-1 w-20 rounded appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label>세로 : </label>
          <input
            type="number"
            min="1"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-600 px-2 py-1 w-20 rounded appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className='flex gap-4 items-center'>
        <p className='pr-2 border-r border-gray-500'>용지</p>
        <div className="flex gap-2 items-center">
          <label>크기 : </label>
          <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
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
            onChange={(e) => setOrientation(e.target.value)}
            className="bg-gray-800 border border-gray-600 px-2 py-1 rounded"
          >
            <option value="portrait">세로 (기본)</option>
            <option value="landscape">가로</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SplitSettingsPanel
