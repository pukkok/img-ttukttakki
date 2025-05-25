const ShapeSelector = ({ shape, onChange }) => {
  const shapes = ['원형', '정사각형', '하트', '둥근 모서리']

  return (
    <div className="flex gap-2 my-4 justify-center text-sm">
      {shapes.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-3 py-1 rounded border transition ${
            shape === s
              ? 'bg-white text-black font-semibold'
              : 'border-gray-500 text-gray-300 hover:border-white hover:text-white'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

export default ShapeSelector
