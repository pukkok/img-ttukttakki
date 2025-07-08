import MergeBackgroundUpload from './MergeBackgroundUpload'
import MergeBackgroundControl from './MergeBackgroundControl'
import { useMergeCanvasStore } from '../../stores/useMergeCanvasStore'

const MergeEditorPanel = ({ backgroundRef }) => {

  const backgroundImageInfo = useMergeCanvasStore(s => s.backgroundImageInfo)

  return (
    <div className="flex flex-col gap-3 px-4 py-3 text-sm text-white">
      <MergeBackgroundUpload />

      {backgroundImageInfo && 
      <MergeBackgroundControl 
        backgroundImageInfo={backgroundImageInfo}
        backgroundRef={backgroundRef}
      />}
    </div>
  )
}

export default MergeEditorPanel
