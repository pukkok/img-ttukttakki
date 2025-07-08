import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useState } from 'react'
import { useCommonStore } from '../../stores/useCommonStore'

const DownloadButtonsCrop = ({ currentImageId, shape, getCanvas }) => {
  const images = useCommonStore(s => s.images)

  const [isSavingCurrent, setIsSavingCurrent] = useState(false)
  const [isSavingAll, setIsSavingAll] = useState(false)

  // 현재 저장
  const handleSaveCurrent = async () => {
    if (!getCanvas || !currentImageId) return
    setIsSavingCurrent(true)

    try {
      const canvas = await getCanvas(currentImageId)
      if (!canvas) return

      canvas.toBlob((blob) => {
        if (blob) {
          const image = images.find(i => i.id === currentImageId)
          const filename = `${image.name.replace(/\.[^/.]+$/, '')}_${shape || 'crop'}.png`
          saveAs(blob, filename)
        }
      }, 'image/png')
    } finally {
      setIsSavingCurrent(false)
    }
  }

  // 전체 저장
  const handleSaveAll = async () => {
    if (!getCanvas || !images.length) return
    setIsSavingAll(true)

    try {
      const zip = new JSZip()

      for (const image of images) {
        const canvas = await getCanvas(image.id)
        if (!canvas) continue

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/png')
        )

        const filename = `${image.name.replace(/\.[^/.]+$/, '')}_${shape}.png`
        zip.file(filename, blob)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, 'cropped_images.zip')
    } finally {
      setIsSavingAll(false)
    }
  }

  return (
    <div className="mt-8 flex justify-center gap-4 items-center">
      <button
        onClick={handleSaveCurrent}
        className={`px-4 py-2 rounded text-white text-sm ${
          isSavingCurrent ? 'bg-gray-600' : 'bg-[#10B981] hover:bg-[#0ea672]'
        }`}
        disabled={isSavingCurrent || !images.length}
      >
        💾 현재 저장
      </button>

      <button
        onClick={handleSaveAll}
        className={`px-4 py-2 rounded text-white text-sm ${
          isSavingAll ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
        }`}
        disabled={isSavingAll || !images.length}
      >
        {isSavingAll ? '📦 압축 중...' : '📦 전체 저장'}
      </button>
    </div>
  )
}

export default DownloadButtonsCrop
