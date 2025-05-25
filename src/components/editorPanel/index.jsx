import ShapeSelector from './ShapeSelector'
import ShapeRadiusControl from './ShapeRadiusControl'
import ScaleControl from './ScaleControl'

const EditorPanel = ({ crop, onChange, roundedRadius }) => {
  return (
    <div className="w-fit border border-gray-700 rounded-lg p-4 bg-[#1e1e1e] h-fit">
      <h2 className="text-white font-semibold text-lg mb-4">✂️ 편집 도구</h2>

      <ShapeSelector
        shape={crop.shape}
        onChange={(newShape) =>
          onChange({
            shape: newShape,
            shapeOptions: newShape === '둥근 모서리' ? { radius: roundedRadius } : {}
          })
        }
      />

      {crop.shape === '둥근 모서리' && (
        <ShapeRadiusControl
          radius={crop.shapeOptions?.radius || 0}
          onChange={(radius) => onChange({ shapeOptions: { radius } })}
        />
      )}

      <div className="mt-4">
        <ScaleControl
          scale={crop.scale}
          onChange={(scale) => onChange({ scale })}
        />
      </div>
    </div>
  )
}

export default EditorPanel