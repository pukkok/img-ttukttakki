import { useState } from 'react'
import CropCanvasEditor from '../components/CropCanvasEditor'
import NavigationButtons from '../components/NavigationButtons'
import EditorPanel from '../components/editorPanel'
import Sidebar from '../components/sidebar'
import getMaskedCanvas from '../utils/getMaskedCanvas'

const CropPage = () => {
  const [images, setImages] = useState([])
  const [currentImageId, setCurrentImageId] = useState(null)
  const [background, setBackground] = useState('transparent')
  const [roundedRadius, setRoundedRadius] = useState(20)
  const [cropStates, setCropStates] = useState({})

  const handleSetImages = (newImages) => {
    const cropMap = {}
    newImages.forEach(img => {
      cropMap[img.id] = {
        offset: { x: 0, y: 0 },
        scale: 1,
        shape: '원형',
        shapeOptions: {}
      }
    })

    setImages(newImages)
    setCropStates(cropMap)
    setCurrentImageId(newImages[0]?.id || null)
  }

  const updateCurrentCrop = (newData) => {
    if (!currentImageId) return
    setCropStates(prev => ({
      ...prev,
      [currentImageId]: {
        ...prev[currentImageId],
        ...newData
      }
    }))
  }

  const handleDeleteImage = (idToDelete) => {
    const updatedImages = images.filter(img => img.id !== idToDelete)
    const newCropStates = { ...cropStates }
    delete newCropStates[idToDelete]

    setImages(updatedImages)
    setCropStates(newCropStates)

    if (idToDelete === currentImageId) {
      setCurrentImageId(updatedImages[0]?.id || null)
    }
  }

  const getCanvas = async (targetId = currentImageId) => {
    const image = images.find(img => img.id === targetId)
    const crop = cropStates[targetId]
    if (!image || !crop) return null

    return getMaskedCanvas({
      image,
      shape: crop.shape || '원형',
      background,
      offset: crop.offset,
      scale: crop.scale,
      shapeOptions: crop.shapeOptions || {},
      size: 500
    })
  }

  const currentIndex = images.findIndex(img => img.id === currentImageId)
  const currentImage = images[currentIndex] || null
  const currentCrop = cropStates[currentImageId] || {
    offset: { x: 0, y: 0 },
    scale: 1,
    shape: '원형',
    shapeOptions: {}
  }

  return (
    <div className="flex h-screen bg-[#111] text-white overflow-hidden">
      {/* 왼쪽 전체 콘텐츠: 헤더 + 미리보기 + 푸터 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 헤더: 도구 패널 */}
        <header className="w-full border-b border-gray-800">
          <EditorPanel
            crop={currentCrop}
            onChange={updateCurrentCrop}
            roundedRadius={roundedRadius}
          />
        </header>

        {/* 미리보기 */}
        <main className="flex-1 flex flex-col items-center justify-center overflow-auto px-4 py-8">
          <CropCanvasEditor
            image={currentImage}
            shape={currentCrop.shape}
            background={background}
            offset={currentCrop.offset}
            scale={currentCrop.scale}
            onOffsetChange={(offset) => updateCurrentCrop({ offset })}
            onScaleChange={(scale) => updateCurrentCrop({ scale })}
            shapeOptions={currentCrop.shapeOptions || {}}
          />
        </main>

        {/* 푸터: 페이지네이션 */}
        <footer className="w-full border-t border-gray-800 py-4">
          <div className="max-w-screen-lg mx-auto px-4">
            <NavigationButtons
              currentIndex={currentIndex}
              total={images.length}
              onPrev={() => {
                if (currentIndex > 0) {
                  setCurrentImageId(images[currentIndex - 1].id)
                }
              }}
              onNext={() => {
                if (currentIndex < images.length - 1) {
                  setCurrentImageId(images[currentIndex + 1].id)
                }
              }}
            />
          </div>
        </footer>
      </div>

      {/* 오른쪽 고정 사이드바 */}
      <Sidebar
        onImagesSelected={handleSetImages}
        images={images}
        currentImageId={currentImageId}
        shape={currentCrop.shape}
        getCanvas={getCanvas}
        onSelectImageId={setCurrentImageId}
        onDeleteImageId={handleDeleteImage}
      />
    </div>
  )
}

export default CropPage
