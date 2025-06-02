const SplitOptionControl = ({ padding, onPaddingChange, useBleed, onToggleBleed }) => {
  return (
    <div className="flex gap-4 items-center flex-wrap">
      <p className="pr-2 border-r border-gray-500">옵션</p>

      <div className="flex gap-2 items-center">
        <label>여백 : </label>
        <input
          type="number"
          value={padding}
          onChange={(e) => onPaddingChange(e.target.value)}
          onBlur={() => {
            if(!padding) onPaddingChange(0)
          }}
          min={0}
          max={50}
          size={5}
          className={`bg-gray-800 border border-gray-600 px-2 py-1 rounded w-20
          appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
        mm
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="useBleed"
          checked={useBleed}
          onChange={(e) => onToggleBleed(e.target.checked)}
        />
        <label htmlFor="useBleed" className="text-gray-300 select-none">5mm 재단 여유 적용</label>
      </div>

      <span className="ml-auto text-gray-400 text-xs select-none mr-4 whitespace-nowrap">
        재단 여유 적용 시, 여백 중 5mm는 이미지 겹침 용도로 사용됩니다.
      </span>
    </div>
  )
}

export default SplitOptionControl
