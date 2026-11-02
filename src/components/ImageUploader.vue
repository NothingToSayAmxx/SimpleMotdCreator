<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { ImagePlus, Link2, LoaderCircle, Trash2, Upload } from '@lucide/vue'
import { uploadToCloudinary, validateImage } from '../services/cloudinary.js'

const props = defineProps({ modelValue: { type: String, default: '' }, cloudinary: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue', 'notify'])
const fileInput = ref(null), urlInput = ref(''), file = ref(null), busy = ref(false), dragging = ref(false), error = ref('')
const objectUrl = ref('')
const preview = computed(() => objectUrl.value || props.modelValue)
function setFile(next) {
  error.value = ''
  try { validateImage(next) } catch (issue) { clearLocal(); error.value = issue.message; return }
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  file.value = next
  objectUrl.value = URL.createObjectURL(next)
}
function drop(event) { dragging.value = false; if (event.dataTransfer.files[0]) setFile(event.dataTransfer.files[0]) }
function choose(event) { if (event.target.files[0]) setFile(event.target.files[0]); event.target.value = '' }
function useUrl() {
  const value = urlInput.value.trim()
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'https:') throw new Error()
    clearLocal(); emit('update:modelValue', parsed.href); error.value = ''; emit('notify', { type: 'success', message: 'Посилання на зображення застосовано.' })
    } catch { error.value = 'Введіть коректне HTTPS-посилання на зображення.' }
}
async function upload() {
  if (!file.value) { error.value = 'Спочатку оберіть файл для завантаження.'; return }
  busy.value = true; error.value = ''
  try {
    const url = await uploadToCloudinary(file.value, props.cloudinary)
    clearLocal(); emit('update:modelValue', url); emit('notify', { type: 'success', message: 'Зображення завантажено в Cloudinary.' })
  } catch (issue) { error.value = issue.message }
  finally { busy.value = false }
}
function clearLocal() { if (objectUrl.value) URL.revokeObjectURL(objectUrl.value); objectUrl.value = ''; file.value = null }
function remove() { clearLocal(); emit('update:modelValue', ''); urlInput.value = ''; error.value = '' }
onBeforeUnmount(clearLocal)
</script>

<template>
  <div>
    <div class="image-drop" :class="{ dragging }" @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="drop">
      <img v-if="preview" :src="preview" alt="Попередній перегляд ножа" />
      <div v-else class="image-empty"><ImagePlus :size="25" /><span>Додайте зображення ножа</span><small>JPG · PNG · WEBP / до 3 MB</small></div>
      <div class="image-actions">
        <button class="button button-small" type="button" @click="fileInput?.click()"><Upload :size="14" /> Обрати файл</button>
        <button v-if="file" class="button button-small button-accent" type="button" :disabled="busy" @click="upload"><LoaderCircle v-if="busy" class="spin" :size="14" /><Upload v-else :size="14" /> {{ busy ? 'Завантаження…' : 'Завантажити' }}</button>
        <button v-if="preview" class="icon-button danger" aria-label="Видалити зображення" type="button" @click="remove"><Trash2 :size="15" /></button>
      </div>
      <input ref="fileInput" class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" @change="choose" />
    </div>
    <div v-if="file" class="field-hint file-note">Вибрано {{ file.name }}. Підтвердіть кнопкою «Завантажити», щоб отримати HTTPS-посилання.</div>
    <div class="url-entry"><input v-model="urlInput" type="url" placeholder="https://example.com/knife.jpg" aria-label="URL зображення" @keyup.enter="useUrl" /><button class="button button-small" type="button" @click="useUrl"><Link2 :size="14" /> Застосувати URL</button></div>
    <p v-if="!cloudinary.cloudName || !cloudinary.uploadPreset" class="field-hint">Cloudinary не налаштовано. Можна використати зовнішній URL.</p>
    <p v-if="error" class="error-note" role="alert">{{ error }}</p>
  </div>
</template>
