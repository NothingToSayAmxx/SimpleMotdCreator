export const IMAGE_MAX_BYTES = 3 * 1024 * 1024
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

export function validateImage(file) {
  if (!file) throw new Error('Выберите файл изображения.')
  if (!allowedTypes.includes(file.type)) throw new Error('Поддерживаются только JPG, PNG и WEBP.')
  if (file.size > IMAGE_MAX_BYTES) throw new Error('Файл слишком большой. Максимальный размер — 3 МБ.')
}

export async function uploadToCloudinary(file, { cloudName, uploadPreset }) {
  validateImage(file)
  if (!cloudName?.trim() || !uploadPreset?.trim()) throw new Error('Сначала укажите Cloud name и Upload preset в настройках.')
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', uploadPreset.trim())
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName.trim())}/image/upload`, { method: 'POST', body })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error?.message || `Cloudinary вернул ошибку (${response.status}).`)
  if (!result.secure_url) throw new Error('Cloudinary не вернул защищённую ссылку на изображение.')
  return result.secure_url
}
