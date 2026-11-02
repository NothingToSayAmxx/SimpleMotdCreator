export const MAX_MOTD_LENGTH = 1536

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function safeImageUrl(value = '') {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : ''
  } catch { return '' }
}

function makeImage(url, title, className = 'i') {
  return url ? `<img class="${className}" src="${escapeHtml(url)}" alt="${title}">` : ''
}

function generateClassic({ title, description, image, abilities }) {
  const entries = abilities.filter((item) => item.enabled).map((item) => `${escapeHtml(item.shortName || item.name)}:${escapeHtml(item.value || '—')}`)
  const list = entries.length ? `<p class=b>${entries.join(' · ')}</p>` : '<p class=b>Активных способностей нет</p>'
  return `<!doctype html><meta charset=utf-8><style>body{margin:0;padding:10px;background:#171914;color:#e7e5dc;font:13px Arial}.p{padding:10px;border:1px solid #45483f;background:#20221d}h1{margin:0 0 7px;color:#e82;font-size:18px}p{margin:0;line-height:1.4}.b{margin-top:8px;color:#c6c5bc}.i{display:block;width:220px;height:130px;margin:0 auto 8px}</style></head><body><div class=p><h1>${title}</h1>${image}<p>${description}</p>${list}</div></body></html>`
}

function generateTable({ title, image, imageUrl, abilities, rating, price }) {
  // HTML permits omitted td/tr end tags here; this saves characters in the 1536-character MOTD budget.
  const selected = abilities.filter((item) => item.enabled)
  const rows = selected.map((item) => `<tr><td>${escapeHtml(item.shortName || item.name)}<td>+<td>${item.knifeOnly ? '+' : '-'}<td>${escapeHtml(item.value || '—')}`).join('')
  const abilityRows = rows || '<tr><td colspan=4>Способности не выбраны</tr>'
  const picture = imageUrl ? image : 'Изображение ножа не добавлено'
  const stars = '★'.repeat(rating)
  return `<!doctype html><meta charset=utf-8><style>body{margin:0;background:#242;color:#eee;font:10px Arial}table{width:100%;border-spacing:0}td,th{padding:3px 5px;background:#292;border-bottom:1px solid #333}th{color:#bd0;text-align:left;background:#303}.pic{text-align:center;height:350px;background:#222}.i{width:100%;height:350px}td+td,th+th{text-align:center}.stars{color:#fc3}</style><table><tr><th colspan=4>Изображение ножа<tr><td class=pic colspan=4>${picture}</tr><tr><th colspan=4>Информация<tr><td>Название<td colspan=3>${title}<tr><td>Рейтинг<td colspan=3 class=stars>${stars}<tr><td>Цена<td colspan=3>${price}<tr><th>Способности<th>Наличие<th>С ножом<th>Доп. знач.</tr>${abilityRows}</table>`
}

export function generateHtml(settings) {
  const title = escapeHtml(settings.name || 'Нож без названия')
  const description = escapeHtml(settings.description || 'Добавьте краткое описание ножа.')
  const rating = Math.max(0, Math.min(10, Number(settings.rating ?? 10) || 0))
  const price = escapeHtml(settings.price ?? 'Секретные ножи не продаются')
  const imageUrl = safeImageUrl(settings.imageUrl || '')
  const image = makeImage(imageUrl, title)
  const knifeId = String(settings.knifeId || '0')
  const abilities = (settings.abilities || []).map((item) => ({
    ...item,
    ...(item.configs?.[knifeId] || { enabled: false, knifeOnly: false, value: '—' }),
  }))
  const data = { title, description, image, imageUrl, abilities, rating, price }
  return settings.template === 'table' ? generateTable(data) : generateClassic(data)
}
