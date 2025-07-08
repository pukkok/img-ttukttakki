import { useState } from 'react'
import { useMergeCanvasStore } from '../../stores/useMergeCanvasStore'

const MergeBackgroundUpload = () => {
  const setBackgroundImageUrl = useMergeCanvasStore(s => s.setBackgroundImageUrl)
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      setBackgroundImageUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-2 mb-0.5">
      <label
        htmlFor="background-upload"
        className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-1 pt-1.5 pb-2 rounded select-none"
      >
        배경 선택
      </label>
      <input
        id="background-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {fileName && <span className="border-l border-gray-500 pl-4 text-gray-300 truncate max-w-xs">{fileName}</span>}
    </div>
  )
}

export default MergeBackgroundUpload
