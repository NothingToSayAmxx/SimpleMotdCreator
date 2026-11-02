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

const defaults = () => ({ name: 'Shadow Fang', description: 'Легендарный клинок для настоящих охотников. Стиль, точность и холодная сталь — всё в одном.', imageUrl: '', template: 'classic', abilities: abilityDefaults.map(item => ({ ...item })), maxLength: MAX_MOTD_LENGTH })
const settings = ref(defaults())
const cloudinary = ref({ cloudName: '', uploadPreset: '' })
const toast = ref(null)
const html = computed(() => generateHtml(settings.value))
let saveTimer
onMounted(() => {
  const saved = loadSettings()
  if (!saved) return
  const base = defaults()
  const oldExampleNames = { damage: 'Підсилена шкода', speed: 'Швидкість', precision: 'Точність', bonus: 'Бонус раунду' }
  const abilities = Array.isArray(saved.abilities) ? saved.abilities.map((item) => {
    const current = abilityDefaults.find((ability) => ability.id === item.id)
    return current && item.name === oldExampleNames[item.id] ? { ...current, enabled: item.enabled } : item
  }) : base.abilities
  const description = saved.description === 'Легендарний клинок для справжніх мисливців. Стиль, точність і холодна сталь — усе в одному.' ? base.description : saved.description
  settings.value = { ...base, ...saved, description, abilities }
  cloudinary.value = { cloudName: saved.cloudName || '', uploadPreset: saved.uploadPreset || '' }
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
  settings.value = defaults(); cloudinary.value = { cloudName: '', uploadPreset: '' }; clearSettings()
  notify({ type: 'success', message: 'Настройки сброшены.' })
}
</script>

<template>
  <div class="app-shell">
    <AppHeader @reset="reset" @export="exportHtml" />
    <main class="workspace">
      <div class="page-intro"><div><div class="eyebrow"><span></span> GOLDSRC TOOLKIT / НАСТРОЙКА</div><h1>Создай свой <em>MOTD.</em></h1><p>Создай приветственное окно для своего сервера Counter-Strike 1.6.</p></div><div class="intro-stamp"><Crosshair :size="18" /><span>АРСЕНАЛ<br />СЕРВЕРА</span><small>ЛОКАЛЬНАЯ ВЕРСИЯ</small></div></div>
      <div class="workspace-grid"><KnifeEditor v-model="settings" v-model:cloudinary="cloudinary" @notify="notify" /><div class="preview-column"><MotdPreview :settings="settings" @notify="notify" /><div class="limit-note" :class="{ warning: html.length > settings.maxLength }"><AlertTriangle v-if="html.length > settings.maxLength" :size="15" /><Cpu v-else :size="15" /><span v-if="html.length > settings.maxLength">HTML превышает лимит CS 1.6: {{ html.length }} / {{ settings.maxLength }} символов. Проверьте вкладку «HTML-код».</span><span v-else>Рекомендуемый лимит MOTD — {{ settings.maxLength }} символов. <b>{{ html.length }} / {{ settings.maxLength }}</b></span></div></div></div>
      <footer class="app-footer"><span>CS 1.6 MOTD BUILDER <i>·</i> ДЛЯ АДМИНИСТРАТОРОВ СЕРВЕРОВ</span><span>СЕРВЕР НЕ ТРЕБУЕТСЯ <i>·</i> v1.0.0</span></footer>
    </main>
    <ToastNotification :toast="toast" @dismiss="dismiss" />
  </div>
</template>
