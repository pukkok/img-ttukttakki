import { useState } from 'react'
import Sidebar from '../components/sidebar'
import SplitSettingsPanel from '../components/splitImage/SplitSettingsPanel'
import SplitImageEditor from '../components/splitImage/SplitImageEditor'
import { splitImageToCanvases } from '../utils/splitImageToCanvases'

const SplitPage = () => {
  const [images, setImages] = useState([])
  const [currentImageId, setCurrentImageId] = useState(null)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [paperSize, setPaperSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')

  const handleApply = ({ rows, cols, paperSize, orientation }) => {
    setRows(rows)
    setCols(cols)
    setPaperSize(paperSize)
    setOrientation(orientation)
  }

  const currentImage = images.find(img => img.id === currentImageId)

  return (
    <div className="flex h-screen bg-[#111] text-white overflow-hidden">
      {/* 왼쪽: 작업 영역 */}
      <div className="flex flex-col flex-1 p-6 gap-6">
        <SplitSettingsPanel onApply={handleApply} />

        <div className="flex-1 flex items-center justify-center">
          {currentImage ? (
            <SplitImageEditor
              image={currentImage}
              rows={rows}
              cols={cols}
              paperSize={paperSize}
              orientation={orientation}
            />
          ) : (
            <p className="text-gray-500">이미지를 업로드해주세요.</p>
          )}
        </div>
      </div>

      {/* 오른쪽: 사이드바 재활용 */}
      <Sidebar
        onImagesSelected={(newImages) => {
          setImages(newImages)
          setCurrentImageId(newImages[0]?.id || null)
        }}
        images={images}
        currentImageId={currentImageId}
        shape={`${rows}x${cols}`} // shape은 여기선 의미 없음, 이름용만
        getSplitCanvases={() =>
          splitImageToCanvases(currentImage.url, rows, cols, paperSize, orientation)
        }
        onSelectImageId={setCurrentImageId}
        onDeleteImageId={(idToDelete) => {
          const updated = images.filter(img => img.id !== idToDelete)
          setImages(updated)
          if (idToDelete === currentImageId) {
            setCurrentImageId(updated[0]?.id || null)
          }
        }}
      />
    </div>
  )
}

export default SplitPage
