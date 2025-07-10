import { useEffect, useRef } from 'react'
import MergeCanvasEditor from '../components/merge-tools/MergeCanvasEditor'
import MergeEditorPanel from '../components/merge-tools/MergeEditorPanel'
import Sidebar from '../components/sidebar'
import NavigationButtons from '../components/NavigationButtons'
import { useCommonStore } from '../stores/useCommonStore'
import { useMergeCanvasStore } from '../stores/useMergeCanvasStore'
import { fabric } from 'fabric'

const MergePage = () => {
  const images = useCommonStore(s => s.images)
  const setImages = useCommonStore(s => s.setImages)
  const currentImageId = useCommonStore(s => s.currentImageId)
  const setCurrentImageId = useCommonStore(s => s.setCurrentImageId)
  
  const fabricCanvasRef = useRef(null)
  const overlayImageRef = useRef({})
  const cropCanvasRef = useRef(null)

  const getMergedCanvas = async (targetId) => {
    const originalCanvas = fabricCanvasRef.current
    // if (!originalCanvas || !targetId) return null

    const bgObj = originalCanvas.getObjects().find(obj => obj.customType === 'background')
    const overlayInfo = overlayImageRef.current[targetId]
    if (!bgObj) {
      alert('배경 이미지를 넣어주세요.')
      return console.error('배경이미지 없음.')
    }
    if (!overlayInfo?.img) return alert('병합할 이미지가 없습니다.')
    
    const { cropBoxInfo } = useMergeCanvasStore.getState()
    const { left: cropLeft, top: cropTop, width: cropW, height: cropH } = cropBoxInfo

    const canvasEl = document.createElement('canvas')
    canvasEl.width = cropW
    canvasEl.height = cropH
    const mergedCanvas = new fabric.Canvas(canvasEl, { width: cropW, height: cropH})
    
    const bgClone = await new Promise(resolve => bgObj.clone(resolve))
    const adjustedBgLeft = bgObj.left - cropLeft
    const adjustedBgTop = bgObj.top - cropTop
    bgClone.set({ left: adjustedBgLeft, top: adjustedBgTop })
    mergedCanvas.add(bgClone)

    const adjustedOverlayLeft = overlayInfo.left - cropLeft
    const adjustedOverlayTop = overlayInfo.top - cropTop
    const overlayClone = await new Promise(resolve => overlayInfo.img.clone(resolve))
    overlayClone.set({ left: adjustedOverlayLeft, top: adjustedOverlayTop })
    mergedCanvas.add(overlayClone)

    mergedCanvas.renderAll()

    return mergedCanvas.lowerCanvasEl
  }

  const handleDeleteImage = (idToDelete) => {
    const updatedImages = images.filter(img => img.id !== idToDelete)
    setImages(updatedImages)

    delete overlayImageRef.current[idToDelete]

    const canvas = fabricCanvasRef.current
    if (canvas) {
      canvas.getObjects().forEach(obj => {
        if (obj.customType === 'overlay' && idToDelete === currentImageId) {
          canvas.remove(obj)
        }
      })
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }

    if (idToDelete === currentImageId) {
      setCurrentImageId(updatedImages[0]?.id || null)
    }
  }

  const handleClearAllImages = () => {
    setImages([])
    overlayImageRef.current = {}

    const canvas = fabricCanvasRef.current
    if (canvas) {
      canvas.getObjects().forEach(obj => {
        if (obj.customType === 'overlay') {
          canvas.remove(obj)
        }
      })
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
  }

  useEffect(() => {
    return () => {
      useCommonStore.getState().resetCommonStates()
      useMergeCanvasStore.getState().resetMergeCanvasStates()
    }
  }, [])

  return (
    <div className="flex h-screen bg-[#111] text-white overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 패널 */}
        <header className="w-full border-b border-gray-800">
          <MergeEditorPanel
            fabricCanvasRef={fabricCanvasRef}
            cropCanvasRef={cropCanvasRef}
          />
        </header>

        {/* 캔버스 */}
        <main className="flex-1 shrink-0">
          <MergeCanvasEditor
            fabricCanvasRef={fabricCanvasRef}
            overlayImageRef={overlayImageRef}
            cropCanvasRef={cropCanvasRef}
          />
        </main>

        <footer className="w-full border-t border-gray-800 py-4">
          <div className="max-w-screen-lg mx-auto px-4">
            <NavigationButtons />
          </div>
        </footer>
      </div>

      <Sidebar
        onImagesSelected={(newImages) => {
          setImages(newImages)
          setCurrentImageId(newImages[0]?.id || null)
        }}
        onClearAllImages={handleClearAllImages}
        allowMultiple={true}
        getCanvas={getMergedCanvas}
        onDeleteImageId={handleDeleteImage}
      />
    </div>
  )
}

export default MergePage
