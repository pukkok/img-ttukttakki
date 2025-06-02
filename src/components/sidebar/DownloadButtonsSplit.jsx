import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useState } from 'react'
import jsPDF from 'jspdf'
import { PAPER_SIZES } from '../../utils/paperSizes'

const DownloadButtonsSplit = ({ images, getSplitCanvases, paperSize, orientation }) => {
  const [isSavingZip, setIsSavingZip] = useState(false)
  const [isSavingPdf, setIsSavingPdf] = useState(false)

  const handleSaveAllZip = async () => {
    if (!getSplitCanvases || !images.length) return
    setIsSavingZip(true)

    try {
      const canvases = await getSplitCanvases()
      if (!canvases?.length) return

      const zip = new JSZip()
      for (let i = 0; i < canvases.length; i++) {
        const blob = await new Promise((resolve) =>
          canvases[i].toBlob(resolve, 'image/png')
        )
        zip.file(`image_${i + 1}.png`, blob)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, 'split_images.zip')
    } finally {
      setIsSavingZip(false)
    }
  }

  const handleSavePDF = async () => {
    if (!getSplitCanvases || !images.length) return
    setIsSavingPdf(true)

    try {
      const canvases = await getSplitCanvases()
      if (!canvases?.length) return

      const paper = PAPER_SIZES[paperSize] || PAPER_SIZES['A4']
      const widthMM = orientation === 'portrait' ? paper.width : paper.height
      const heightMM = orientation === 'portrait' ? paper.height : paper.width

      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: [widthMM, heightMM]
      })

      canvases.forEach((canvas, i) => {
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, widthMM, heightMM)
        if (i < canvases.length - 1) pdf.addPage()
      })

      pdf.save('split_output.pdf')
    } finally {
      setIsSavingPdf(false)
    }
  }

  return (
    <div className="mt-8 flex justify-center gap-4">
      <button
        onClick={handleSaveAllZip}
        className={`px-4 py-2 rounded text-white text-sm ${
          isSavingZip ? 'bg-gray-600' : 'bg-[#10B981] hover:bg-[#0ea672]'
        }`}
        disabled={isSavingZip || !images.length}
      >
        {isSavingZip ? '🧩 파일 모으는 중...' : '📦 ZIP으로 저장'}
      </button>

      <button
        onClick={handleSavePDF}
        className={`px-4 py-2 rounded text-white text-sm ${
          isSavingPdf ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
        }`}
        disabled={isSavingPdf || !images.length}
      >
        {isSavingPdf ? '📄 PDF 생성 중...' : '📄 PDF로 저장'}
      </button>
    </div>
  )
}

export default DownloadButtonsSplit
