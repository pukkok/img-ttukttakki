const ScaleControl = ({ scale, onChange }) => {
  const handleChange = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onChange(Math.min(Math.max(value, 0.1), 5))
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <label>확대/축소:</label>
      <input
        type="range"
        min="0.1"
        max="5"
        step="0.05"
        value={scale}
        onChange={handleChange}
        className="w-40"
      />
      <span>{scale.toFixed(2)}x</span>
    </div>
  )
}

export default ScaleControl
