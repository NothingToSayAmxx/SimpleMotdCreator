export const IMAGE_MAX_BYTES = 3 * 1024 * 1024
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

export function validateImage(file) {
  if (!file) throw new Error('Оберіть файл зображення.')
  if (!allowedTypes.includes(file.type)) throw new Error('Підтримуються лише JPG, PNG та WEBP.')
  if (file.size > IMAGE_MAX_BYTES) throw new Error('Файл завеликий. Максимальний розмір — 3 MB.')
}

export async function uploadToCloudinary(file, { cloudName, uploadPreset }) {
  validateImage(file)
  if (!cloudName?.trim() || !uploadPreset?.trim()) throw new Error('Спершу вкажіть Cloud name та Upload preset у налаштуваннях.')
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', uploadPreset.trim())
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName.trim())}/image/upload`, { method: 'POST', body })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error?.message || `Cloudinary повернув помилку (${response.status}).`)
  if (!result.secure_url) throw new Error('Cloudinary не повернув захищене посилання на зображення.')
  return result.secure_url
}
