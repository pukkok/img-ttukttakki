import { useState } from 'react'
import { PAPER_SIZES } from '../../utils/paperSizes'
import { getPaperLabel } from '../../utils/getPaperLabel'

const SplitSettingsPanel = ({ onApply }) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [paperSize, setPaperSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')

  const handleApply = () => {
    onApply({ rows, cols, paperSize, orientation })
  }

  return (
    <div className="space-y-4 p-4 bg-gray-900 text-white border border-gray-700 rounded">
      <div className="flex gap-4 items-center">
        <label className="w-20">가로 분할</label>
        <input
          type="number"
          min="1"
          max="10"
          value={cols}
          onChange={(e) => setCols(parseInt(e.target.value))}
          className="bg-gray-800 border border-gray-600 px-2 py-1 w-20 rounded"
        />
      </div>

      <div className="flex gap-4 items-center">
        <label className="w-20">세로 분할</label>
        <input
          type="number"
          min="1"
          max="10"
          value={rows}
          onChange={(e) => setRows(parseInt(e.target.value))}
          className="bg-gray-800 border border-gray-600 px-2 py-1 w-20 rounded"
        />
      </div>

      <div className="flex gap-4 items-center">
        <label className="w-20">용지 크기</label>
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

      <div className="flex gap-4 items-center">
        <label className="w-20">용지 방향</label>
        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
          className="bg-gray-800 border border-gray-600 px-2 py-1 rounded"
        >
          <option value="portrait">세로 (기본)</option>
          <option value="landscape">가로</option>
        </select>
      </div>

      <button
        onClick={handleApply}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4"
      >
        미리보기 적용
      </button>
    </div>
  )
}

export default SplitSettingsPanel
