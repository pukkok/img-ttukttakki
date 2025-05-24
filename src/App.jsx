import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import CropCanvasEditor from './components/CropCanvasEditor'
import NavigationButtons from './components/NavigationButtons'
import DownloadButtons from './components/DownloadButtons'
import getMaskedCanvas from './utils/getMaskedCanvas'

const App = () => {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shape, setShape] = useState('circle')
  const [background, setBackground] = useState('transparent')

  const [cropStates, setCropStates] = useState([]) // 🆕 이미지별 offset/scale

  const handleSetImages = (newImages) => {
    setImages(newImages)
    setCurrentIndex(0)
    setCropStates(newImages.map(() => ({ offset: { x: 0, y: 0 }, scale: 1 })))
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
    const crop = cropStates[index] || { offset: { x: 0, y: 0 }, scale: 1 }
    return getMaskedCanvas({
      image,
      shape,
      background,
      offset: crop.offset,
      scale: crop.scale
    })
  }

  const currentImage = images[currentIndex] || null
  const currentCrop = cropStates[currentIndex] || { offset: { x: 0, y: 0 }, scale: 1 }

  return (
    <div className="min-h-screen bg-[#111] text-white px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">🖼️ 이미지 도형 자르기</h1>

      <ImageUploader onImagesSelected={handleSetImages} />

      <CropCanvasEditor
        image={currentImage}
        shape={shape}
        background={background}
        offset={currentCrop.offset}
        scale={currentCrop.scale}
        onOffsetChange={(offset) => updateCurrentCrop({ offset })}
        onScaleChange={(scale) => updateCurrentCrop({ scale })}
      />

      <NavigationButtons
        currentIndex={currentIndex}
        total={images.length}
        onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1))}
      />

      <DownloadButtons
        images={images}
        currentIndex={currentIndex}
        shape={shape}
        background={background}
        getCanvas={getCanvas}
      />
    </div>
  )
}

export default App
