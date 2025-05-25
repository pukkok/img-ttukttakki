import { useState } from 'react'
import CropCanvasEditor from './components/CropCanvasEditor'
import NavigationButtons from './components/NavigationButtons'
import ShapeSelector from './components/ShapeSelector'
import ShapeRadiusControl from './components/ShapeRadiusControl'
import getMaskedCanvas from './utils/getMaskedCanvas'
import Sidebar from './components/sidebar'

const App = () => {
  const [images, setImages] = useState([])
  const [currentImageId, setCurrentImageId] = useState(null)
  const [background, setBackground] = useState('transparent')
  const [roundedRadius, setRoundedRadius] = useState(20)
  const [cropStates, setCropStates] = useState({}) // id 기반

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
      shapeOptions: crop.shapeOptions || {}
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
      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">🖼️ 이미지 도형 자르기</h1>

        {images.length > 0 && (
          <ShapeSelector
            shape={currentCrop.shape}
            onChange={(newShape) =>
              updateCurrentCrop({
                shape: newShape,
                shapeOptions: newShape === '둥근 모서리' ? { radius: roundedRadius } : {},
              })
            }
          />
        )}

        <div className="min-h-6">
          {currentCrop.shape === '둥근 모서리' && (
            <ShapeRadiusControl
              radius={currentCrop.shapeOptions?.radius || 0}
              onChange={(radius) => updateCurrentCrop({ shapeOptions: { radius } })}
            />
          )}
        </div>

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
      </main>

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
