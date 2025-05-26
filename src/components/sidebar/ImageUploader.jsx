import { useRef } from 'react'
import { generateId } from '../../utils/generateId' // 상대경로 주의

const ImageUploader = ({ onImagesSelected }) => {
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

    Promise.all(readers).then((images) => {
      onImagesSelected(images)
    })
  }

  return (
    <div className="p-3 border border-dashed border-gray-400 rounded-lg text-center">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => fileInputRef.current.click()}
      >
        이미지 선택하기
      </button>
    </div>
  )
}

export default ImageUploader
