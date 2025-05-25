import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const DownloadButtons = ({ images, currentImageId, shape, getCanvas }) => {
  const currentImage = images.find((img) => img.id === currentImageId)

  const handleSaveCurrent = async () => {
    if (!currentImage) return

    const canvas = await getCanvas(currentImage.id)
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        const filename = `${currentImage.name.replace(/\.[^/.]+$/, '')}_${shape}.png`
        saveAs(blob, filename)
      }
    }, 'image/png')
  }

  const handleSaveAll = async () => {
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
