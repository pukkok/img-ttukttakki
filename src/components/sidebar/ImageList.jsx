import { useCommonStore } from "../../stores/useCommonStore"

const ImageList = ({ onDelete }) => {
  const images = useCommonStore(s => s.images)
  const currentImageId = useCommonStore(s => s.currentImageId)
  const setCurrentImageId = useCommonStore(s => s.setCurrentImageId)

  const handleDelete = (name, id) => {
    const confirmDelete = window.confirm(`${name} 를 삭제하시겠습니까?`)
    if (confirmDelete) {
      onDelete(id)
    }
  }

  return (
    <div className="overflow-y-auto flex flex-col gap-3">
      {images.map((img) => (
        <div
          key={img.id}
          title={img.name}
          className={`relative w-full flex items-center gap-3 p-2 rounded-lg border border-gray-700 transition
            ${img.id === currentImageId ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <button
            onClick={() => handleDelete(img.name, img.id)}
            title="삭제"
            className="absolute top-1 right-1 w-6 h-6 bg-gray-800 text-white hover:bg-red-500 rounded-full flex items-center justify-center text-xs"
          >
            ✕
          </button>

          <button onClick={() => setCurrentImageId(img.id)} className="flex items-center gap-3 flex-1 text-left pr-6 min-w-0">
            <img
              src={img.url}
              alt={img.name}
              className="w-12 h-12 object-cover rounded shrink-0"
            />
            <span className="truncate overflow-hidden whitespace-nowrap text-sm text-white">
              {img.name}
            </span>
          </button>
        </div>
      ))}
    </div>
  )
}

export default ImageList
