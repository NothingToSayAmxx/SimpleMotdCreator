export const MAX_MOTD_LENGTH = 1536
const MOTD_STYLESHEET_URL = import.meta.env.VITE_MOTD_STYLESHEET_URL || ''

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function safeImageUrl(value = '') {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : ''
  } catch { return '' }
}

function makeStylesheetLink(value = '') {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? `<link rel=stylesheet href="${escapeHtml(url.href)}">` : ''
  } catch { return '' }
}

function makeImage(url, title, className = 'i') {
  return url ? `<img class="${className}" src="${escapeHtml(url)}" alt="${title}">` : ''
}

function generateClassic({ title, description, image, abilities, stylesheet }) {
  const entries = abilities.filter((item) => item.enabled).map((item) => `${escapeHtml(item.shortName || item.name)}:${escapeHtml(item.value || '—')}`)
  const list = entries.length ? entries.join('<br>') : 'Активных способностей нет'
  return `<!doctype html><meta charset=utf-8>${stylesheet}<body class=compact><div class=p><h1>${title}</h1>${image}<p class=d>${description}</p><div class=s><b class=c>СПОСОБНОСТИ</b>${list}</div></div></body></html>`
}

function generateTable({ title, image, imageUrl, abilities, rating, price, stylesheet }) {
  // HTML permits omitted td/tr end tags here; this saves characters in the 1536-character MOTD budget.
  const selected = abilities.filter((item) => item.enabled)
  const rows = selected.map((item) => `<tr><td>${escapeHtml(item.shortName || item.name)}<td>+<td>${item.knifeOnly ? '+' : '-'}<td>${escapeHtml(item.value || '—')}`).join('')
  const abilityRows = rows || '<tr><td colspan=4>Способности не выбраны</tr>'
  const picture = imageUrl ? image : 'Изображение ножа не добавлено'
  const stars = '★'.repeat(rating)
  return `<!doctype html><meta charset=utf-8>${stylesheet}<body class=table><table><tr><th colspan=4>Изображение ножа<tr><td class=pic colspan=4>${picture}</tr><tr><th colspan=4>Информация<tr><td>Название<td colspan=3>${title}<tr><td>Рейтинг<td colspan=3 class=stars>${stars}<tr><td>Цена<td colspan=3>${price}<tr><th>Способности<th>Наличие<th>С ножом<th>Доп. знач.</tr>${abilityRows}</table></body>`
}

export function generateHtml(settings) {
  const title = escapeHtml(settings.name || 'Нож без названия')
  const description = escapeHtml(settings.description || 'Добавьте краткое описание ножа.')
  const rating = Math.max(0, Math.min(10, Number(settings.rating ?? 10) || 0))
  const price = escapeHtml(settings.price ?? 'Секретные ножи не продаются')
  const imageUrl = safeImageUrl(settings.imageUrl || '')
  const image = makeImage(imageUrl, title)
  const stylesheet = makeStylesheetLink(MOTD_STYLESHEET_URL)
  const abilities = settings.abilities || []
  const data = { title, description, image, imageUrl, abilities, rating, price, stylesheet }
  return settings.template === 'table' ? generateTable(data) : generateClassic(data)
}
