import { useState } from 'react'
import CropCanvasEditor from './components/CropCanvasEditor'
import NavigationButtons from './components/NavigationButtons'
import EditorPanel from './components/editorPanel'
import Sidebar from './components/sidebar'
import getMaskedCanvas from './utils/getMaskedCanvas'

const App = () => {
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
      size: 500  // ✅ 미리보기 사이즈 명시적으로 전달!
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
    <div className="min-h-screen bg-[#111] text-white flex flex-col md:flex-row">
      {/* 왼쪽: 작업 영역 */}
      <main className="flex flex-col md:flex-row flex-1 gap-6 px-4 py-8 max-w-6xl mx-auto">
        {/* 왼쪽 작업 화면 */}
        <div>
          <h1 className="text-2xl text-center font-bold mb-6">🖼️ 이미지 도형 자르기</h1>

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

        {/* 오른쪽: 편집 도구 패널 */}
        <EditorPanel
          crop={currentCrop}
          onChange={updateCurrentCrop}
          roundedRadius={roundedRadius}
        />
      </main>

      {/* 오른쪽 사이드바 */}
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

export default App
