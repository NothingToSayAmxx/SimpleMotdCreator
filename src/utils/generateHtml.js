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
  const rows = abilities.filter((item) => item.enabled).map((item) => `<tr><td class="mark">+</td><td><b>${escapeHtml(item.name)}</b><br><small>${escapeHtml(item.description)}</small></td></tr>`).join('')
  const list = rows ? `<table>${rows}</table>` : '<p class="muted">Активных способностей нет</p>'
  return `<!doctype html><html><head><meta charset=utf-8><title>${title}</title><style>body{margin:0;padding:10px;background:#171914;color:#e7e5dc;font:13px Arial,sans-serif}.p{padding:10px;border:1px solid #45483f;background:#20221d}h1{margin:0 0 7px;color:#e82;font-size:18px}p{margin:0;line-height:1.4}small,.muted{color:#999}.i{display:block;width:220px;height:130px;margin:0 auto 8px}table{width:100%;margin-top:8px;border-collapse:collapse}td{padding:4px 6px;border-top:1px solid #45483f}.mark{width:18px;color:#e82}</style></head><body><div class=p><small>COUNTER-STRIKE 1.6</small><h1>${title}</h1>${image}<p>${description}</p>${list}</div></body></html>`
}

function generateTable({ title, description, image, imageUrl, abilities }) {
  const rows = abilities.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td class="c ${item.enabled ? 'y' : 'n'}">${item.enabled ? '+' : '−'}</td><td class="c ${item.always ? 'y' : 'n'}">${item.always ? '+' : '−'}</td><td class="c">${escapeHtml(item.value || '—')}</td></tr>`).join('')
  const picture = imageUrl ? image : '<span class="empty">Изображение ножа</span>'
  return `<!doctype html><html><head><meta charset=utf-8><title>${title}</title><style>body{margin:0;padding:7px;background:#242424;color:#eee;font:10px Arial,sans-serif}table{width:100%;border-collapse:collapse}td,th{padding:4px;background:#292929;border-bottom:1px solid #333}th{color:#b5d900;text-align:left}h1{margin:0;padding:5px;background:#303030;font-size:12px;color:#b6dc00}.c{text-align:center}.y{color:#0c0}.n{color:#b44}.pic{text-align:center;height:330px;background:#222}.i{width:100%;height:330px}.empty{color:#b5d900}.desc{color:#bbb}</style></head><body><table><tr><td class=pic colspan=4>${picture}</td></tr><tr><th colspan=4>Информация</th></tr><tr><td>Название</td><td colspan=3 class=c>${title}</td></tr><tr><td>Описание</td><td colspan=3 class=desc>${description}</td></tr><tr><th>Способности</th><th class=c>Наличие</th><th class=c>Всегда</th><th class=c>Доп. знач.</th></tr>${rows}</table></body></html>`
}

export function generateHtml(settings) {
  const title = escapeHtml(settings.name || 'Нож без названия')
  const description = escapeHtml(settings.description || 'Добавьте краткое описание ножа.')
  const imageUrl = safeImageUrl(settings.imageUrl || '')
  const image = makeImage(imageUrl, title)
  const data = { title, description, image, imageUrl, abilities: settings.abilities || [] }
  return settings.template === 'table' ? generateTable(data) : generateClassic(data)
}
