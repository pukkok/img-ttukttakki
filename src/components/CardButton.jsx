import { useEffect, useRef } from 'react'

const CardButton = ({ title, onClick, draw, label }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !draw) return
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, 120, 120)
    draw(ctx)
  }, [draw])

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 w-54 h-50 bg-[#2a2a2a] rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200"
    >
      <canvas ref={canvasRef} width={120} height={120} className="rounded" />
      <span className="text-white text-lg">{label}</span>
    </button>
  )
}

export default CardButton
