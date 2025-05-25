const ShapeRadiusControl = ({ radius, onChange }) => {
  return (
    <div className="flex gap-2 text-sm text-gray-300 mb-4">
      <label htmlFor="radius">둥근 모서리:</label>
      <input
        id="radius"
        type="range"
        min="0"
        max="100"
        step="1"
        value={radius}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-40"
      />
      <span>{radius}px</span>
    </div>
  )
}

export default ShapeRadiusControl
