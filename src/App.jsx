import { useState } from 'react'
import CropCanvasEditor from './components/CropCanvasEditor'
import NavigationButtons from './components/NavigationButtons'
import ShapeSelector from './components/ShapeSelector'
import ShapeRadiusControl from './components/ShapeRadiusControl'
import getMaskedCanvas from './utils/getMaskedCanvas'
import Sidebar from './components/sidebar' // ← 디렉토리 구조 반영됨

const App = () => {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [background, setBackground] = useState('transparent')
  const [roundedRadius, setRoundedRadius] = useState(20)

  const [cropStates, setCropStates] = useState([])

  const handleSetImages = (newImages) => {
    setImages(newImages)
    setCurrentIndex(0)
    setCropStates(newImages.map(() => ({
      offset: { x: 0, y: 0 },
      scale: 1,
      shape: '원형',
      shapeOptions: {}
    })))
  }

  const updateCurrentCrop = (newData) => {
    setCropStates(prev => {
      const next = [...prev]
      next[currentIndex] = { ...next[currentIndex], ...newData }
      return next
    })
  }

  const getCanvas = (index = currentIndex) => {
    const image = images[index]
    const crop = cropStates[index] || {}
    const imageShape = crop.shape || '원형'
    const imageShapeOptions = crop.shapeOptions || {}

    return getMaskedCanvas({
      image,
      shape: imageShape,
      background,
      offset: crop.offset,
      scale: crop.scale,
      shapeOptions: imageShapeOptions
    })
  }

  const currentImage = images[currentIndex] || null
  const currentCrop = cropStates[currentIndex] || {
    offset: { x: 0, y: 0 },
    scale: 1,
    shape: '원형',
    shapeOptions: {}
  }

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col md:flex-row">
      {/* 왼쪽: 작업 영역 */}
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
          onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onNext={() => setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1))}
        />
      </main>

      {/* 오른쪽: 사이드바 */}
      <Sidebar 
        onImagesSelected={handleSetImages} 
        
        images={images}
        currentIndex={currentIndex}
        shape={currentCrop.shape}
        background={background}
        getCanvas={getCanvas}
        onSelectIndex={setCurrentIndex}
      />
    </div>
  )
}

export default App
