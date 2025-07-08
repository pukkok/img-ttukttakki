import { useState } from 'react'
import CropCanvasEditor from '../components/crop-tools/CropCanvasEditor'
import NavigationButtons from '../components/NavigationButtons'
import CropEditPanel from '../components/crop-tools/CropEditPanel'
import Sidebar from '../components/sidebar'
import getMaskedCanvas from '../utils/getMaskedCanvas'
import { useCommonStore } from '../stores/useCommonStore'

const CropPage = () => {
  const images = useCommonStore(s => s.images)
  const setImages = useCommonStore(s => s.setImages)
  const currentImageId = useCommonStore(s => s.currentImageId)
  const setCurrentImageId = useCommonStore(s => s.setCurrentImageId)
  const getCurrentIndex = useCommonStore(s => s.getCurrentIndex)

  const [cropStates, setCropStates] = useState({})

  const handleImageSelect = (newImages) => {
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
      offset: crop.offset,
      scale: crop.scale,
      shapeOptions: crop.shapeOptions || {},
      size: 500
    })
  }

  const currentIndex = getCurrentIndex()
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
          <CropEditPanel
            crop={currentCrop}
            onChange={updateCurrentCrop}
          />
        </header>

        {/* 미리보기 */}
        <main className="flex-1 flex flex-col items-center justify-center overflow-auto px-4 py-8">
          {currentImage ? (
            <CropCanvasEditor
              image={currentImage}
              shape={currentCrop.shape}
              offset={currentCrop.offset}
              scale={currentCrop.scale}
              onOffsetChange={(offset) => updateCurrentCrop({ offset })}
              onScaleChange={(scale) => updateCurrentCrop({ scale })}
              shapeOptions={currentCrop.shapeOptions || {}}
            />
          ) : (
            <p className="text-gray-500">도형 자르기 기능은 한번에 여러장 업로드가 가능합니다.</p>
          )}
        </main>

        {/* 푸터: 페이지네이션 */}
        <footer className="w-full border-t border-gray-800 py-4">
          <div className="max-w-screen-lg mx-auto px-4">
            <NavigationButtons />
          </div>
        </footer>
      </div>

      <Sidebar
        onImagesSelected={handleImageSelect}
        onClearAllImages={() => {
          setImages([])
          setCurrentImageId(null)
          setCropStates({})
        }}
        shape={currentCrop.shape}
        getCanvas={getCanvas}
        onDeleteImageId={handleDeleteImage}
      />
    </div>
  )
}

export default CropPage
