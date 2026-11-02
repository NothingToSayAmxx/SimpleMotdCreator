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
  const list = entries.length ? entries.join(' · ') : 'Активных способностей нет'
  return `<!doctype html><meta charset=utf-8><style>body{margin:0;padding:10px;background:#171914;color:#e7e5dc;font:13px Arial}.p{padding:10px;border:1px solid #45483f;background:#20221d}h1{margin:0 0 7px;color:#e82;font-size:18px}p{margin:0;line-height:1.45}.i{display:block;max-width:100%;width:220px;height:130px;object-fit:contain;margin:0 auto 9px}.d{color:#d5d4ca}.s{margin-top:9px;padding-top:7px;border-top:1px solid #45483f;color:#c6c5bc}.c{display:block;margin-bottom:4px;color:#bd0;font-size:10px;font-weight:bold;letter-spacing:.08em}</style><body><div class=p><h1>${title}</h1>${image}<p class=d>${description}</p><div class=s><b class=c>СПОСОБНОСТИ</b>${list}</div></div></body></html>`
}

function generateTable({ title, image, imageUrl, abilities, rating, price }) {
  // HTML permits omitted td/tr end tags here; this saves characters in the 1536-character MOTD budget.
  const selected = abilities.filter((item) => item.enabled)
  const rows = selected.map((item) => `<tr><td>${escapeHtml(item.shortName || item.name)}<td>+<td>${item.knifeOnly ? '+' : '-'}<td>${escapeHtml(item.value || '—')}`).join('')
  const abilityRows = rows || '<tr><td colspan=4>Способности не выбраны</tr>'
  const picture = imageUrl ? image : 'Изображение ножа не добавлено'
  const stars = '★'.repeat(rating)
  return `<!doctype html><meta charset=utf-8><style>body{margin:0;background:#242424;color:#eee;font:10px Arial}table{width:100%;border-spacing:0}td,th{padding:3px 5px;background:#292929;border-bottom:1px solid #333}th{color:#bd0;text-align:left;background:#303030}.pic{text-align:center;height:350px;background:#222}.i{width:100%;height:350px}td+td,th+th{text-align:center}.stars{color:#fc3}</style><table><tr><th colspan=4>Изображение ножа<tr><td class=pic colspan=4>${picture}</tr><tr><th colspan=4>Информация<tr><td>Название<td colspan=3>${title}<tr><td>Рейтинг<td colspan=3 class=stars>${stars}<tr><td>Цена<td colspan=3>${price}<tr><th>Способности<th>Наличие<th>С ножом<th>Доп. знач.</tr>${abilityRows}</table>`
}

export function generateHtml(settings) {
  const title = escapeHtml(settings.name || 'Нож без названия')
  const description = escapeHtml(settings.description || 'Добавьте краткое описание ножа.')
  const rating = Math.max(0, Math.min(10, Number(settings.rating ?? 10) || 0))
  const price = escapeHtml(settings.price ?? 'Секретные ножи не продаются')
  const imageUrl = safeImageUrl(settings.imageUrl || '')
  const image = makeImage(imageUrl, title)
  const abilities = settings.abilities || []
  const data = { title, description, image, imageUrl, abilities, rating, price }
  return settings.template === 'table' ? generateTable(data) : generateClassic(data)
}
