/**
 * 파일 이름 기반 고유 ID 생성
 * @param {string} name - 원본 파일 이름
 * @returns {string} - 고유 ID
 */
export const generateId = (name) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  return `${name}-${timestamp}-${random}`
}