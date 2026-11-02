<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { AlertTriangle, Cpu, Crosshair } from '@lucide/vue'
import AppHeader from './components/AppHeader.vue'
import KnifeEditor from './components/KnifeEditor.vue'
import MotdPreview from './components/MotdPreview.vue'
import ToastNotification from './components/ToastNotification.vue'
import { abilities as abilityDefaults } from './data/abilities.js'
import { loadSettings, saveSettings, clearSettings } from './utils/storage.js'
import { generateHtml, MAX_MOTD_LENGTH } from './utils/generateHtml.js'
import { CLOUDINARY_DEFAULTS } from './services/cloudinary.js'

const defaults = () => ({ name: 'Shadow Fang', description: 'Легендарный клинок для настоящих охотников. Стиль, точность и холодная сталь — всё в одном.', imageUrl: '', template: 'classic', knifeId: '0', rating: 10, price: 'Секретные ножи не продаются', abilities: abilityDefaults.map(item => ({ ...item })), maxLength: MAX_MOTD_LENGTH })
const settings = ref(defaults())
const cloudinary = ref({ ...CLOUDINARY_DEFAULTS })
const toast = ref(null)
const html = computed(() => generateHtml(settings.value))
let saveTimer
onMounted(() => {
  const saved = loadSettings()
  if (!saved) return
  const base = defaults()
  const savedAbilities = new Map((Array.isArray(saved.abilities) ? saved.abilities : []).map((item) => [item.id, item]))
  const abilities = abilityDefaults.map((current) => {
    const previous = savedAbilities.get(current.id)
    return previous?.configs ? { ...current, configs: { ...current.configs, ...previous.configs } } : current
  })
  const description = saved.description === 'Легендарний клинок для справжніх мисливців. Стиль, точність і холодна сталь — усе в одному.' ? base.description : saved.description
  const knifeId = ['0', '1', '2', '3'].includes(String(saved.knifeId)) ? String(saved.knifeId) : '0'
  settings.value = { ...base, ...saved, description, knifeId, abilities }
  const storedPreset = String(saved.uploadPreset || '').trim()
  const storedCloudName = String(saved.cloudName || '').trim()
  cloudinary.value = {
    cloudName: storedCloudName && storedCloudName !== storedPreset ? storedCloudName : CLOUDINARY_DEFAULTS.cloudName,
    uploadPreset: storedPreset || CLOUDINARY_DEFAULTS.uploadPreset,
  }
})
watch([settings, cloudinary], () => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const ok = saveSettings({ ...settings.value, cloudName: cloudinary.value.cloudName, uploadPreset: cloudinary.value.uploadPreset })
    if (!ok) notify({ type: 'error', message: 'Не удалось сохранить настройки. Проверьте доступность LocalStorage.' })
  }, 250)
}, { deep: true })
onUnmounted(() => clearTimeout(saveTimer))
function notify(message) { toast.value = { ...message, id: Date.now() + Math.random() } }
function dismiss(id) { if (toast.value?.id === id) toast.value = null }
function exportHtml() {
  const blob = new Blob([html.value], { type: 'text/html;charset=utf-8' }), link = document.createElement('a')
  link.href = URL.createObjectURL(blob); link.download = 'motd.html'; link.click(); URL.revokeObjectURL(link.href)
  notify({ type: 'success', message: 'Файл motd.html скачан.' })
}
function reset() {
  settings.value = defaults(); cloudinary.value = { ...CLOUDINARY_DEFAULTS }; clearSettings()
  notify({ type: 'success', message: 'Настройки сброшены.' })
}
</script>

<template>
  <div class="app-shell">
    <AppHeader @reset="reset" @export="exportHtml" />
    <main class="workspace">
      <div class="page-intro"><div><div class="eyebrow"><span></span> GOLDSRC TOOLKIT / НАСТРОЙКА</div><h1>Создай свой <em>MOTD.</em></h1><p>Создай приветственное окно для своего сервера Counter-Strike 1.6.</p></div></div>
      <div class="workspace-grid"><KnifeEditor v-model="settings" v-model:cloudinary="cloudinary" @notify="notify" /><div class="preview-column"><MotdPreview :settings="settings" @notify="notify" /><div class="limit-note" :class="{ warning: html.length > settings.maxLength }"><AlertTriangle v-if="html.length > settings.maxLength" :size="15" /><Cpu v-else :size="15" /><span v-if="html.length > settings.maxLength">HTML превышает лимит CS 1.6: {{ html.length }} / {{ settings.maxLength }} символов. Проверьте вкладку «HTML-код».</span><span v-else>Рекомендуемый лимит MOTD — {{ settings.maxLength }} символов. <b>{{ html.length }} / {{ settings.maxLength }}</b></span></div></div></div>
      <footer class="app-footer"><span>CS 1.6 MOTD BUILDER <i>·</i> ДЛЯ АДМИНИСТРАТОРОВ СЕРВЕРОВ</span><span>СЕРВЕР НЕ ТРЕБУЕТСЯ <i>·</i> v1.0.0</span></footer>
    </main>
    <ToastNotification :toast="toast" @dismiss="dismiss" />
  </div>
</template>
