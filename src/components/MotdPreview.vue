<script setup>
import { computed, ref } from 'vue'
import { Eye, Code2, Maximize2 } from '@lucide/vue'
import { generateHtml } from '../utils/generateHtml.js'
import CodeOutput from './CodeOutput.vue'

const props = defineProps({ settings: { type: Object, required: true } })
const emit = defineEmits(['notify'])
const mode = ref('preview')
const html = computed(() => generateHtml(props.settings))
</script>

<template>
  <section class="panel preview-panel">
    <header class="panel-heading preview-heading"><span class="section-index">02 / РЕЗУЛЬТАТ</span><div><h2>Предпросмотр</h2><p>Так будет выглядеть MOTD в игре</p></div><span class="live-indicator"><i></i> ОНЛАЙН</span></header>
    <div class="preview-toolbar"><div class="mode-switch"><button type="button" :class="{ selected: mode === 'preview' }" @click="mode = 'preview'"><Eye :size="14" /> Предпросмотр</button><button type="button" :class="{ selected: mode === 'code' }" @click="mode = 'code'"><Code2 :size="14" /> HTML-код</button></div><span class="toolbar-note"><Maximize2 :size="12" /> 640 × 480</span></div>
    <div v-show="mode === 'preview'" class="motd-frame-wrap"><div class="frame-top"><span>МОТD СЕРВЕРА</span><span>ПОДКЛЮЧЕНО</span></div><iframe class="motd-frame" :srcdoc="html" sandbox="" title="Предпросмотр HTML MOTD"></iframe><div class="frame-status"><span>ДВИЖОК GOLDSRC</span><span>HTML-СТРАНИЦА</span></div></div>
    <div v-if="mode === 'code'" class="code-mode"><CodeOutput :html="html" :max-length="settings.maxLength" @notify="emit('notify', $event)" /></div>
    <footer class="preview-foot"><span><i class="status-dot"></i> Предпросмотр обновляется автоматически</span><span>HTML · UTF-8</span></footer>
  </section>
</template>
