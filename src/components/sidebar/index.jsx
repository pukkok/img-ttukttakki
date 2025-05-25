import ImageUploader from './ImageUploader'
import DownloadButtons from './DownloadButtons'
import ImageList from './ImageList'

const Sidebar = ({
  onImagesSelected,
  images,
  currentImageId,
  shape,
  getCanvas,
  onSelectImageId,
  onDeleteImageId
}) => {
  return (
    <aside className="w-full md:w-[280px] shrink-0 border-l border-gray-700 p-4 bg-[#1a1a1a] flex flex-col h-screen">
      <h2 className="text-lg font-semibold text-white mb-4">🗂 파일 관리</h2>

      <ImageUploader onImagesSelected={onImagesSelected} />

      <div className="flex-1 mt-6 overflow-y-auto">
        <ImageList
          images={images}
          currentImageId={currentImageId}
          onSelect={onSelectImageId}
          onDelete={onDeleteImageId}
        />
      </div>

      <div className="mt-6">
        <DownloadButtons
          images={images}
          currentImageId={currentImageId}
          shape={shape}
          getCanvas={getCanvas}
        />
      </div>
    </aside>
  )
}

export default Sidebar
