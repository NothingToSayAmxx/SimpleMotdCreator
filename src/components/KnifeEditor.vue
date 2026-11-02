<script setup>
import ImageUploader from './ImageUploader.vue'
import AbilitySelector from './AbilitySelector.vue'
import { ChevronDown, Settings2 } from '@lucide/vue'

defineProps({ modelValue: { type: Object, required: true }, cloudinary: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue', 'update:cloudinary', 'notify'])
</script>

<template>
  <section class="panel editor-panel">
    <header class="panel-heading"><span class="section-index">01 / НАСТРОЙКИ</span><div><h2>Редактор ножа</h2><p>Содержимое окна MOTD</p></div><Settings2 :size="17" class="heading-icon" /></header>
    <div class="form-field"><label for="motd-template">Стиль MOTD</label><select id="motd-template" :value="modelValue.template || 'classic'" @change="emit('update:modelValue', { ...modelValue, template: $event.target.value })"><option value="classic">Компактный</option><option value="table">Таблица сервера</option></select></div>
    <div class="form-field"><label for="knife-id">Номер ножа из конфига</label><select id="knife-id" :value="modelValue.knifeId || '0'" @change="emit('update:modelValue', { ...modelValue, knifeId: $event.target.value })"><option value="0">Нож 0</option><option value="1">Нож 1</option><option value="2">Нож 2</option><option value="3">Нож 3</option></select></div>
    <div class="form-field"><label for="knife-name">Название ножа <span class="required">*</span></label><input id="knife-name" :value="modelValue.name" maxlength="48" placeholder="Например, Shadow Fang" @input="emit('update:modelValue', { ...modelValue, name: $event.target.value })" /><div class="field-meta"><span>Заголовок в MOTD</span><span>{{ modelValue.name.length }}/48</span></div></div>
    <div class="form-field"><label for="knife-description">Краткое описание</label><textarea id="knife-description" :value="modelValue.description" maxlength="220" rows="3" placeholder="Опишите нож и его особенности…" @input="emit('update:modelValue', { ...modelValue, description: $event.target.value })"></textarea><div class="field-meta"><span>До 220 символов</span><span>{{ modelValue.description.length }}/220</span></div></div>
    <div class="form-field"><label>Изображение</label><ImageUploader :model-value="modelValue.imageUrl" :cloudinary="cloudinary" @update:model-value="emit('update:modelValue', { ...modelValue, imageUrl: $event })" @notify="emit('notify', $event)" /></div>
    <div class="form-field ability-field"><div class="label-row"><label>Способности</label><span class="field-hint">{{ modelValue.abilities.filter(a => a.configs?.[modelValue.knifeId || '0']?.enabled).length }} АКТИВНО</span></div><AbilitySelector :model-value="modelValue.abilities" :knife-id="modelValue.knifeId || '0'" @update:model-value="emit('update:modelValue', { ...modelValue, abilities: $event })" /></div>
    <details class="settings-disclosure"><summary><span>Настройки Cloudinary</span><ChevronDown :size="15" /></summary><div class="form-field"><label for="cloud-name">Имя облака (Cloud name)</label><input id="cloud-name" :value="cloudinary.cloudName" placeholder="your-cloud-name" @input="emit('update:cloudinary', { ...cloudinary, cloudName: $event.target.value })" /></div><div class="form-field"><label for="upload-preset">Предустановка загрузки (Upload preset, unsigned)</label><input id="upload-preset" :value="cloudinary.uploadPreset" placeholder="motd_unsigned" @input="emit('update:cloudinary', { ...cloudinary, uploadPreset: $event.target.value })" /><small class="field-hint">Значения по умолчанию берутся из .env. Эти поля можно переопределить; API secret не нужен.</small></div><div class="form-field"><label for="html-limit">Лимит MOTD (символов)</label><input id="html-limit" type="number" min="256" max="10000" :value="modelValue.maxLength" @input="emit('update:modelValue', { ...modelValue, maxLength: Math.max(256, Number($event.target.value) || 1536) })" /></div></details>
  </section>
</template>
