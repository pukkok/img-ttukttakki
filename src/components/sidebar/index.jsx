import { useLocation, useNavigate } from 'react-router-dom'
import ImageUploader from './ImageUploader'
import ImageList from './ImageList'
import DownloadButtonsCrop from './DownloadButtonsCrop'
import DownloadButtonsSplit from './DownloadButtonsSplit'

const Sidebar = ({
  onImagesSelected,
  onClearAllImages,
  images,
  currentImageId,
  shape,
  getCanvas,
  getSplitCanvases,
  onSelectImageId,
  onDeleteImageId,
  allowMultiple = true,
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isSplitPage = location.pathname === '/split'

  return (
    <aside className="w-full md:w-[280px] shrink-0 border-l border-gray-700 p-4 bg-[#1a1a1a] flex flex-col h-screen">
      <button
        className="mb-10 text-sm text-gray-300 hover:text-white px-3 py-1 border border-gray-600 rounded"
        onClick={() => navigate(-1)}
      >
        ← 돌아가기
      </button>
      <h2 className="text-lg font-semibold text-white mb-2">🗂 파일 관리</h2>

      <ImageUploader
        onImagesSelected={onImagesSelected}
        onClearImages={onClearAllImages}
        existingImages={images}
        allowMultiple={allowMultiple}
      />

      <div className="flex-1 mt-6 overflow-y-auto">
        <ImageList
          images={images}
          currentImageId={currentImageId}
          onSelect={onSelectImageId}
          onDelete={onDeleteImageId}
        />
      </div>

      <div className="mt-6">
        {isSplitPage ? (
          <DownloadButtonsSplit
            images={images}
            getSplitCanvases={getSplitCanvases}
          />
        ) : (
          <DownloadButtonsCrop
            images={images}
            currentImageId={currentImageId}
            shape={shape}
            getCanvas={getCanvas}
          />
        )}
      </div>
    </aside>
  )
}

export default Sidebar
