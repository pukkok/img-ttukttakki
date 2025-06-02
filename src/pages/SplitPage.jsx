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
  const [padding, setPadding] = useState(10)

  // ✅ 새로 추가된 옵션들
  const [bleed, setBleed] = useState(5) // 고정값이지만 체크 여부로 0 또는 5
  const [useActualSize, setUseActualSize] = useState(false)

  const handleApply = ({
    rows,
    cols,
    paperSize,
    orientation,
    padding,
    bleed,
    useActualSize
  }) => {
    setRows(rows)
    setCols(cols)
    setPaperSize(paperSize)
    setOrientation(orientation)
    setPadding(padding)
    setBleed(bleed)
    setUseActualSize(useActualSize)
  }

  const currentImage = images.find(img => img.id === currentImageId)

  return (
    <div className="flex h-screen bg-[#111] text-white overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="w-full border-b border-gray-800">
          <SplitSettingsPanel onApply={handleApply} />
        </header>

        <main className="flex-1 flex items-center justify-center overflow-auto px-4 py-8">
          {currentImage ? (
            <SplitImageEditor
              image={currentImage}
              rows={rows}
              cols={cols}
              paperSize={paperSize}
              orientation={orientation}
            />
          ) : (
            <p className="text-gray-500">분할 기능은 이미지 한장만 업로드 가능합니다.</p>
          )}
        </main>
      </div>

      <Sidebar
        onImagesSelected={(newImages) => {
          setImages(newImages)
          setCurrentImageId(newImages[0]?.id || null)
        }}
        images={images}
        paperSize={paperSize}
        orientation={orientation}
        onClearAllImages={() => {
          setImages([])
          setCurrentImageId(null)
        }}
        currentImageId={currentImageId}
        shape={`${rows}x${cols}`}
        getSplitCanvases={() =>
          currentImage
            ? splitImageToCanvases(
                currentImage.url,
                rows,
                cols,
                paperSize,
                orientation,
                padding,
                bleed,
                useActualSize
              )
            : Promise.resolve([])
        }
        onSelectImageId={setCurrentImageId}
        onDeleteImageId={(idToDelete) => {
          const updated = images.filter(img => img.id !== idToDelete)
          setImages(updated)
          if (idToDelete === currentImageId) {
            setCurrentImageId(updated[0]?.id || null)
          }
        }}
        allowMultiple={false}
      />
    </div>
  )
}

export default SplitPage
