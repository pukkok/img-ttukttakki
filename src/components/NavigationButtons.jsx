import { useCommonStore } from "../stores/useCommonStore"

const NavigationButtons = ({ }) => {
  const { getCurrentIndex, getMaxLength } = useCommonStore()

  // const setCurrentImageId = useCommonStore(s => s.setCurrentImageId)
  const currentIndex = getCurrentIndex()
  const total = getMaxLength()

  const onNext = useCommonStore(s => s.onNext)
  const onPrev = useCommonStore(s => s.onPrev)

  return (
    <div className="flex items-center justify-center gap-6">
      <button
        className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
        onClick={onPrev}
        disabled={currentIndex <= 0 || null}
      >
        ← 이전
      </button>

      <span className="text-sm text-gray-300">
        {total === 0 ? '0 / 0' : `${currentIndex + 1} / ${total}`}
      </span>

      <button
        className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
        onClick={onNext}
        disabled={currentIndex >= total - 1}
      >
        다음 →
      </button>
    </div>
  )
}

export default NavigationButtons
