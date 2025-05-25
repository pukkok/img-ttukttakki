import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const DownloadButtons = ({ images, currentIndex, shape, getCanvas }) => {
  const handleSaveCurrent = async () => {
    const canvas = await getCanvas()
    if (!canvas) return

    canvas.toBlob(blob => {
      if (blob) {
        const filename = `${images[currentIndex].name.replace(/\.[^/.]+$/, '')}_${shape}.png`
        saveAs(blob, filename)
      }
    }, 'image/png')
  }

  const handleSaveAll = async () => {
    const zip = new JSZip()

    for (let i = 0; i < images.length; i++) {
      const canvas = await getCanvas(i)
      if (!canvas) continue

      const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/png')
      )

      const filename = `${images[i].name.replace(/\.[^/.]+$/, '')}_${shape}.png`
      zip.file(filename, blob)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, 'cropped_images.zip')
  }

  return (
    <div className="mt-8 flex gap-4 justify-center">
      <button
        onClick={handleSaveCurrent}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        disabled={!images.length}
      >
        현재 저장
      </button>
      <button
        onClick={handleSaveAll}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        disabled={!images.length}
      >
        전체 저장
      </button>
    </div>
  )
}

export default DownloadButtons
