import ImageUploader from './ImageUploader'
import DownloadButtons from './DownloadButtons'
import ImageList from './ImageList'

const Sidebar = ({ onImagesSelected, images, currentIndex, shape, getCanvas, onSelectIndex }) => {
  return (
    <aside className="w-full md:w-[280px] shrink-0 border-l border-gray-700 p-4 bg-[#1a1a1a] flex flex-col h-screen">
      <h2 className="text-lg font-semibold text-white mb-4">🗂 파일 관리</h2>

      <ImageUploader onImagesSelected={onImagesSelected} />

      {/* 썸네일 리스트 (스크롤) */}
      <div className="flex-1 mt-6 overflow-y-auto">
        <ImageList
          images={images}
          currentIndex={currentIndex}
          onSelect={onSelectIndex}
        />
      </div>

      {/* 하단 저장 버튼 */}
      <div className="mt-6">
        <DownloadButtons
          images={images}
          currentIndex={currentIndex}
          shape={shape}
          getCanvas={getCanvas}
        />
      </div>
    </aside>
  )
}

export default Sidebar
