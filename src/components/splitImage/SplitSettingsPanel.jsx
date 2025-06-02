import { useEffect, useState } from 'react'
import SplitDividerControl from './SplitDividerControl'
import PaperOptionControl from './PaperOptionControl'
import SplitOptionControl from './SplitOptionControl'

const SplitSettingsPanel = ({ onApply }) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [paperSize, setPaperSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')
  const [padding, setPadding] = useState(10)

  const [useBleed, setUseBleed] = useState(true)

  useEffect(() => {
    onApply({
      rows, cols, paperSize, 
      orientation, // INFO : 용지 가로/세로
      padding, // INFO: 여백 주기
      bleed: useBleed ? 5 : 0, //INFO : 고정값 5mm
    })
  }, [rows, cols, paperSize, orientation, padding, useBleed, onApply])

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
      <SplitOptionControl
        padding={padding}
        useBleed={useBleed}
        onPaddingChange={setPadding}
        onToggleBleed={setUseBleed}
      />
    </div>
  )
}

export default SplitSettingsPanel
