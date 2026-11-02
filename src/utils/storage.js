const STORAGE_KEY = 'cs16-motd-builder-v1'

export function loadSettings() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return value && typeof value === 'object' ? value : null
  } catch { return null }
}

export function saveSettings(settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); return true }
  catch { return false }
}

export function clearSettings() {
  try { localStorage.removeItem(STORAGE_KEY); return true }
  catch { return false }
}
