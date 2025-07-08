import { useNavigate } from 'react-router-dom'
import CardButton from '../components/CardButton'
import { drawCrop, drawMerge, drawSplit } from '../utils/drawCanvasIcon'

const App = () => {
  const navigate = useNavigate()

  return (
    <div className="h-screen bg-[#111] text-white flex flex-col items-center justify-center gap-10 px-4">
      {/* 타이틀 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#10B981] tracking-tight">
          이미지 뚝딱기
        </h1>
        <p className="text-sm text-gray-400">
          이미지를 도형으로 자르고, 용지 기준으로 나누고, 저장 뚝딱!
        </p>
      </div>

      {/* 기능 선택 카드 */}
      <div className="flex flex-wrap justify-center gap-8">
        <CardButton
          title="이미지 자르기"
          label="이미지 자르기"
          draw={drawCrop}
          onClick={() => navigate('/crop')}
        />
        <CardButton
          title="이미지 분할"
          label="이미지 분할"
          draw={drawSplit}
          onClick={() => navigate('/split')}
        />
        <CardButton
          title="이미지 병합"
          label="이미지 병합"
          draw={drawMerge}
          onClick={() => navigate('/merge')}
        />
      </div>

      {/* 푸터 */}
      <p className="text-xs text-gray-600 mt-6">
        © 2025 이미지 뚝딱기 · 만든 사람: <a href="https://github.com/pukkok" target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:underline">pukkok</a>
      </p>
    </div>
  )
}

export default App
