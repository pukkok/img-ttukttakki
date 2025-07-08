const predefinedRatios = ['1:1', '4:3', '3:2', '16:9', '5:7']

const ShapeRatioControl = ({ aspectRatio, onChange }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <label htmlFor="ratio">비율:</label>
      <select
        id="ratio"
        value={aspectRatio}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-600 px-2 py-1 rounded"
      >
        {predefinedRatios.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ShapeRatioControl