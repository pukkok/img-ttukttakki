import { useState } from 'react'

const SplitSettingsPanel = ({ onApply }) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [paperSize, setPaperSize] = useState('A4')

  const handleApply = () => {
    onApply({ rows, cols, paperSize })
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
          <option value="A3">A3</option>
          <option value="A4">A4</option>
          <option value="A5">A5</option>
          <option value="B3">B3</option>
          <option value="B4">B4</option>
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
