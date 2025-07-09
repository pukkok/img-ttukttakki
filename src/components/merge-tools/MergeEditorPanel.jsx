import MergeBackgroundUpload from './MergeBackgroundUpload'
import MergeBackgroundControl from './MergeBackgroundControl'
import MergeCropControl from './MergeCropControl'

const MergeEditorPanel = ({ fabricCanvasRef, cropCanvasRef }) => {

  return (
    <div className="flex flex-col gap-3 px-4 py-3 text-sm text-white">
      <MergeBackgroundUpload />

      <MergeBackgroundControl 
        fabricCanvasRef={fabricCanvasRef}
      />

      <MergeCropControl 
        cropCanvasRef={cropCanvasRef}
      />
    </div>
  )
}

export default MergeEditorPanel
