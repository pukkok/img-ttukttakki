import { useRef, useEffect } from 'react'
import ChevronLeftIcon from '../icon/ChevronLeftIcon'
import ChevronRightIcon from '../icon/ChevronRightIcon'

const ScaleControl = ({ scale, onChange }) => {
  const intervalRef = useRef(null)
  const scaleRef = useRef(scale)

  useEffect(() => {
    scaleRef.current = scale
  }, [scale])

  const clampScale = (value) => Math.min(Math.max(value, 0.1), 5)

  const updateScale = (delta) => {
    onChange(clampScale(scaleRef.current + delta))
  }

  const startContinuousUpdate = (delta) => {
    updateScale(delta) // 첫 클릭 시 바로 실행
    intervalRef.current = setInterval(() => {
      updateScale(delta)
    }, 100)
  }

  const stopContinuousUpdate = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  const handleChange = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onChange(clampScale(value))
    }
  }

  return (
    <div className="flex items-center gap-3 text-sm text-gray-300">
      <label>확대/축소:</label>
      <input
        type="range"
        min="0.1"
        max="5"
        step="0.01"
        value={scale}
        onChange={handleChange}
        className="w-40 accent-emerald-400"
      />
      <span className="w-12 text-right font-mono">{scale.toFixed(2)}x</span>

      <button
        onMouseDown={() => startContinuousUpdate(-0.01)}
        onMouseUp={stopContinuousUpdate}
        onMouseLeave={stopContinuousUpdate}
        className="flex items-center justify-center w-8 h-8 rounded-sm bg-gray-600 hover:bg-emerald-500 active:scale-95 transition cursor-pointer"
      >
        <ChevronLeftIcon size={16} className="text-white" />
      </button>

      <button
        onMouseDown={() => startContinuousUpdate(0.01)}
        onMouseUp={stopContinuousUpdate}
        onMouseLeave={stopContinuousUpdate}
        className="flex items-center justify-center w-8 h-8 rounded-sm bg-gray-600 hover:bg-emerald-500 active:scale-95 transition cursor-pointer"
      >
        <ChevronRightIcon size={16} className="text-white" />
      </button>

      
    </div>
  )
}

export default ScaleControl
