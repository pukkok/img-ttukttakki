import ShapeSelector from './ShapeSelector'
import ShapeRadiusControl from './ShapeRadiusControl'
import ScaleControl from './ScaleControl'
import ShapeRatioControl from './ShapeRatioControl'

const EditorPanel = ({ crop, onChange, roundedRadius }) => {
  return (
    <div className="text-sm text-gray-300 px-2 py-6 space-y-2">
      <div className='flex gap-4 items-center min-h-7.5'>
        <p className='pr-2 border-r border-gray-500'>모양선택</p>
        <ShapeSelector
          shape={crop.shape}
          onChange={(newShape) =>
            onChange({
              shape: newShape,
              shapeOptions:
                newShape === '사각형(둥근 모서리)' ? { radius: roundedRadius } : {}
            })
          }
        />
      </div>

      <div className='flex items-center gap-4 min-h-7.5'>
        <p className='pr-2 border-r border-gray-500'>컨트롤러</p>
        <ScaleControl
          scale={crop.scale}
          onChange={(scale) => onChange({ scale })}
        />

        {crop.shape === '사각형(둥근 모서리)' && (
          <>
            <ShapeRadiusControl
              radius={crop.shapeOptions?.radius || 0}
              onChange={(radius) => onChange({ shapeOptions: { ...crop.shapeOptions, radius } })}
            />
            <ShapeRatioControl
              aspectRatio={crop.shapeOptions?.aspectRatio || '1:1'}
              onChange={(ratio) => onChange({ shapeOptions: { ...crop.shapeOptions, aspectRatio: ratio } })}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default EditorPanel