import { useNavigate } from 'react-router-dom'
import CardButton from '../components/CardButton'

const App = () => {
  const navigate = useNavigate()

  const drawCrop = (ctx) => {
    ctx.clearRect(0, 0, 120, 120)

    // 둥근 테두리 사각형
    const x = 6
    const y = 6
    const width = 106
    const height = 106
    const radius = 16

    ctx.strokeStyle = '#bbb'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.stroke()

    // 중앙 원 (점선)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.arc(60, 60, 30, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.setLineDash([])
  }

  const drawSplit = (ctx) => {
    ctx.clearRect(0, 0, 120, 120)
    const boxSize = 30
    const gap = 4
    const startX = 12
    const startY = 12
    ctx.fillStyle = '#bbb'

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = startX + col * (boxSize + gap)
        const y = startY + row * (boxSize + gap)
        ctx.fillRect(x, y, boxSize, boxSize)
      }
    }
  }

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
      </div>

      {/* 푸터 */}
      <p className="text-xs text-gray-600 mt-6">
        © 2025 이미지 뚝딱기 · 만든 사람: <a href="https://github.com/pukkok" target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:underline">pukkok</a>
      </p>
    </div>
  )
}

export default App
