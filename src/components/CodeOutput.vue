<script setup>
import { computed, ref } from 'vue'
import { Check, Copy, Download } from '@lucide/vue'

const props = defineProps({ html: { type: String, required: true }, maxLength: { type: Number, default: 1536 } })
const emit = defineEmits(['notify'])
const copied = ref(false)
const length = computed(() => props.html.length)
async function copy() {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(props.html)
    else {
      const area = document.createElement('textarea'); area.value = props.html; area.style.position = 'fixed'; area.style.opacity = '0'; document.body.append(area); area.select()
      const ok = document.execCommand('copy'); area.remove(); if (!ok) throw new Error('copy failed')
    }
    copied.value = true; emit('notify', { type: 'success', message: 'HTML скопирован в буфер обмена.' }); setTimeout(() => copied.value = false, 1800)
  } catch { emit('notify', { type: 'error', message: 'Не удалось скопировать. Выделите код вручную.' }) }
}
function download() {
  const blob = new Blob([props.html], { type: 'text/html;charset=utf-8' }), link = document.createElement('a')
  link.href = URL.createObjectURL(blob); link.download = 'motd.html'; link.click(); URL.revokeObjectURL(link.href)
}
</script>

<template>
  <div class="code-output">
    <div class="code-actions"><div class="length-readout" :class="{ over: length > maxLength }"><span>{{ length.toLocaleString('ru-RU') }}</span><span>/ {{ maxLength.toLocaleString('ru-RU') }} символов</span></div><div class="button-group"><button class="button button-small" type="button" @click="copy"><Check v-if="copied" :size="14" /><Copy v-else :size="14" /> {{ copied ? 'Скопировано' : 'Скопировать' }}</button><button class="button button-small button-accent" type="button" @click="download"><Download :size="14" /> Скачать</button></div></div>
    <div v-if="length > maxLength" class="length-warning" role="alert"><strong>Лимит превышен на {{ (length - maxLength).toLocaleString('ru-RU') }} символов.</strong> Сократите текст или разметку. HTML не обрезается автоматически.</div>
    <textarea class="code-textarea" :value="html" readonly aria-label="Сгенерированный HTML MOTD" spellcheck="false"></textarea>
  </div>
</template>
