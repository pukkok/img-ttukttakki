import { useMergeCanvasStore } from "../../stores/useMergeCanvasStore"
import EditModeToggle from "../EditModeToggle"

const MergeBackgroundControl = ({ fabricCanvasRef }) => {
  const backgroundImageInfo = useMergeCanvasStore(s => s.backgroundImageInfo)
  const setBackgroundImageInfo = useMergeCanvasStore(s => s.setBackgroundImageInfo)
  const isBackgroundLocked = useMergeCanvasStore(s => s.isBackgroundLocked)
  const toggleIsBackgroundLocked = useMergeCanvasStore(s => s.toggleIsBackgroundLocked)

  const inputs = [
    { key: 'width', label: '너비 (px)', step: '1' },
    { key: 'height', label: '높이 (px)', step: '1' },
    { key: 'rotation', label: '회전(°)', step: '0.1' },
    { key: 'skewX', label: '기울기 X', step: '0.1' },
    { key: 'skewY', label: '기울기 Y', step: '0.1' },
  ]

  const formatNumber = (num) => {
    if (typeof num !== 'number') return num
    return Number.isInteger(num) ? num.toString() : Math.round(num)
  }

  const handleChange = (key, value) => {
    const numVal = parseFloat(value)
    if (isNaN(numVal)) return

    setBackgroundImageInfo({ ...backgroundImageInfo, [key]: numVal })

    if (!fabricCanvasRef.current) return
    const bgImg = fabricCanvasRef.current.getObjects().find(obj => obj.customType === 'background')
    if (!bgImg) return

    if (key === 'rotation') bgImg.set('angle', numVal)
    else if (key === 'skewX') bgImg.set('skewX', numVal)
    else if (key === 'skewY') bgImg.set('skewY', numVal)
    else if (key === 'width') {
      const scaleX = numVal / bgImg.width
      bgImg.set('scaleX', scaleX)
      setBackgroundImageInfo({ ...backgroundImageInfo, width: numVal })
    }
    else if (key === 'height') {
      const scaleY = numVal / bgImg.height
      bgImg.set('scaleY', scaleY)
      setBackgroundImageInfo({ ...backgroundImageInfo, height: numVal })
    }

    fabricCanvasRef.current.renderAll()
  }

  return (
    <div className='flex gap-4 items-center'>
      <p className='pr-3 border-r px-1 border-gray-500'>배경 옵션</p>
      {inputs.map(({ key, label, step }) => (
        <div key={key} className="flex gap-2 items-center">
          <label>{label} : </label>
          <input 
            type="number"
            value={formatNumber(backgroundImageInfo?.[key]) || 0}
            step={step}
            onChange={e => handleChange(key, e.target.value)}
            className="bg-gray-800 border border-gray-600 px-2 py-1 w-20 rounded appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      ))}
      <EditModeToggle 
        isEditMode={!isBackgroundLocked}
        onToggle={toggleIsBackgroundLocked}
      />
    </div>
  )
}

export default MergeBackgroundControl