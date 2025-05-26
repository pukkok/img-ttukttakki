import { useEffect, useState } from 'react'
import SplitDividerControl from './SplitDividerControl'
import PaperOptionControl from './PaperOptionControl'

const SplitSettingsPanel = ({ onApply }) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [paperSize, setPaperSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')

  useEffect(() => {
    onApply({ rows, cols, paperSize, orientation })
  }, [rows, cols, paperSize, orientation, onApply])

  return (
    <div className="space-y-4 px-2 py-6 text-white text-sm">
      <SplitDividerControl
        rows={rows}
        cols={cols}
        onRowsChange={setRows}
        onColsChange={setCols}
      />
      <PaperOptionControl
        rows={rows}
        cols={cols}
        paperSize={paperSize}
        orientation={orientation}
        onPaperSizeChange={setPaperSize}
        onOrientationChange={setOrientation}
      />
    </div>
  )
}

export default SplitSettingsPanel
