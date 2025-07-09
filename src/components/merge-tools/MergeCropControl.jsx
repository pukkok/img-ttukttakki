import { useMergeCanvasStore } from "../../stores/useMergeCanvasStore"
import EditModeToggle from "../EditModeToggle"

const MergeCropControl = ({ cropCanvasRef }) => {
  const cropBoxInfo = useMergeCanvasStore(s => s.cropBoxInfo)
  const setCropBoxInfo = useMergeCanvasStore(s => s.setCropBoxInfo)
  const selectCrop = useMergeCanvasStore(s => s.selectCrop)
  const toggleSelectCrop = useMergeCanvasStore(s => s.toggleSelectCrop)

  const inputs = [
    { key: 'width', label: '너비 (px)', step: '1' },
    { key: 'height', label: '높이 (px)', step: '1' }
  ]

  const formatNumber = (num) => {
    if (typeof num !== 'number') return num
    return Number.isInteger(num) ? num.toString() : num.toFixed(0)
  }

  const handleChange = (key, value) => {
    if(!selectCrop) return alert('수정 모드에서만 가능합니다.')

    const numVal = parseFloat(value)
    if (isNaN(numVal)) return

    setCropBoxInfo({ ...cropBoxInfo, [key] : numVal })
    if(!cropCanvasRef.current) return
    const cropBox = cropCanvasRef.current
    if (!cropBox) return

    if (key === 'width') {
      const scaleX = numVal / cropBox.width
      cropBox.set('scaleX', scaleX)
      setCropBoxInfo({ ...cropBoxInfo, width: numVal })
    } else if (key === 'height') {
      const scaleY = numVal / cropBox.height
      cropBox.set('scaleY', scaleY)
      setCropBoxInfo({ ...cropBoxInfo, height: numVal })
    }
  }

  return (
    <div className='flex gap-4 items-center'>
      <p className='pr-3 border-r px-1 border-gray-500'>저장 영역</p>
      {inputs.map(({ key, label, step }) => (
        <div key={key} className="flex gap-2 items-center">
          <label>{label} : </label>
          <input 
            type="number"
            value={formatNumber(cropBoxInfo?.[key]) || 0}
            step={step}
            onChange={e => handleChange(key, e.target.value)}
            className="bg-gray-800 border border-gray-600 px-2 py-1 w-20 rounded appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      ))}
      <EditModeToggle 
        isEditMode={selectCrop}
        onToggle={toggleSelectCrop}
      />
    </div>
  )
}

export default MergeCropControl