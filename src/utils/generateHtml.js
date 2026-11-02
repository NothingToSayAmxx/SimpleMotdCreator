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

export function generateHtml(settings) {
  const title = escapeHtml(settings.name || 'Нож без названия')
  const description = escapeHtml(settings.description || 'Добавьте краткое описание ножа.')
  const imageUrl = safeImageUrl(settings.imageUrl || '')
  const image = imageUrl ? `<img src="${escapeHtml(imageUrl)}" width="220" height="130" alt="${title}" style="display:block;margin:0 auto 12px;border:1px solid #45483f;background:#171914">` : ''
  const active = (settings.abilities || []).filter((item) => item.enabled)
  const abilityRows = active.map((item) => `<tr><td style="padding:5px 8px;color:#e9822b;width:20px">&#10003;</td><td style="padding:5px 8px;color:#e6e5dd"><b>${escapeHtml(item.name)}</b><br><span style="color:#92958d;font-size:11px">${escapeHtml(item.description)}</span></td></tr>`).join('')
  const abilities = active.length ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #45483f;margin-top:12px">${abilityRows}</table>` : '<p style="color:#92958d;font-size:11px">Активных способностей нет</p>'
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>body{margin:0;padding:14px;background:#171914;color:#e7e5dc;font:13px Arial,sans-serif}table{border-collapse:collapse}.panel{border:1px solid #45483f;padding:14px;background:#20221d}h1{margin:0 0 10px;color:#ee872b;font-size:20px;text-transform:uppercase;letter-spacing:1px}p{line-height:1.5;margin:0;color:#c6c5bc}.label{font-size:9px;color:#78818a;letter-spacing:2px;margin-bottom:6px}</style></head><body><div class="panel"><div class="label">COUNTER-STRIKE 1.6 / АРСЕНАЛ</div><h1>${title}</h1>${image}<p>${description}</p>${abilities}</div></body></html>`
}
