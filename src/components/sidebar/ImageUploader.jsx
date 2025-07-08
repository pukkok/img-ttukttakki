import { useRef } from 'react'
import { generateId } from '../../utils/generateId'
import { useCommonStore } from '../../stores/useCommonStore'

const ImageUploader = ({ onImagesSelected, onClearImages, allowMultiple=true }) => {
  const images = useCommonStore(s => s.images)

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    const readers = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () =>
          resolve({
            id: generateId(file.name),
            name: file.name,
            url: reader.result
          })
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then((newImages) => {
      const merged = allowMultiple
        ? [...images, ...newImages]
        : [newImages[0]] // 하나만 유지

      onImagesSelected(merged)
      e.target.value = null
    })
  }

  const handleClear = () => {
    const confirmed = window.confirm('정말 모든 이미지를 삭제하시겠습니까?')
    if (confirmed) {
      onClearImages()
    }
  }

  return (
    <div className="p-3 border border-dashed border-gray-400 rounded-lg text-center space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple={allowMultiple}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex justify-center gap-4">
        <button
          className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 text-sm"
          onClick={() => fileInputRef.current.click()}
        >
          이미지 추가
        </button>

        <button
          className="bg-gray-700 text-red-400 px-3 py-2 rounded hover:bg-gray-600 text-sm"
          onClick={handleClear}
        >
          초기화
        </button>
      </div>
    </div>
  )
}

export default ImageUploader
