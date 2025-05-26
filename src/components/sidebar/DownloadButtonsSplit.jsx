import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useState } from 'react'

const DownloadButtonsSplit = ({ images, getSplitCanvases }) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveAll = async () => {
    if (!getSplitCanvases || !images.length) return
    setIsSaving(true)

    try {
      const canvases = await getSplitCanvases()
      if (!canvases?.length) return

      const zip = new JSZip()
      for (let i = 0; i < canvases.length; i++) {
        const blob = await new Promise((resolve) =>
          canvases[i].toBlob(resolve, 'image/png')
        )
        zip.file(`tile_${i + 1}.png`, blob)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, 'split_images.zip')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={handleSaveAll}
        className={`px-4 py-2 rounded text-white text-sm ${
          isSaving ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
        }`}
        disabled={isSaving || !images.length}
      >
        {isSaving ? '🧩 파일 모으는 중...' : '📦 ZIP으로 저장'}
      </button>
    </div>
  )
}

export default DownloadButtonsSplit
