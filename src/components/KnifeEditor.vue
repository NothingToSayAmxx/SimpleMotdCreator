<script setup>
import ImageUploader from './ImageUploader.vue'
import AbilitySelector from './AbilitySelector.vue'
import { ChevronDown, Settings2 } from '@lucide/vue'

defineProps({ modelValue: { type: Object, required: true }, cloudinary: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue', 'update:cloudinary', 'notify'])
</script>

<template>
  <section class="panel editor-panel">
    <header class="panel-heading"><span class="section-index">01 / CONFIG</span><div><h2>Редактор ножа</h2><p>Контент вашого MOTD-вікна</p></div><Settings2 :size="17" class="heading-icon" /></header>
    <div class="form-field"><label for="knife-name">Назва ножа <span class="required">*</span></label><input id="knife-name" :value="modelValue.name" maxlength="48" placeholder="Наприклад, Shadow Fang" @input="emit('update:modelValue', { ...modelValue, name: $event.target.value })" /><div class="field-meta"><span>Заголовок у MOTD</span><span>{{ modelValue.name.length }}/48</span></div></div>
    <div class="form-field"><label for="knife-description">Короткий опис</label><textarea id="knife-description" :value="modelValue.description" maxlength="220" rows="3" placeholder="Опишіть ніж та його особливості…" @input="emit('update:modelValue', { ...modelValue, description: $event.target.value })"></textarea><div class="field-meta"><span>До 220 символів</span><span>{{ modelValue.description.length }}/220</span></div></div>
    <div class="form-field"><label>Зображення</label><ImageUploader :model-value="modelValue.imageUrl" :cloudinary="cloudinary" @update:model-value="emit('update:modelValue', { ...modelValue, imageUrl: $event })" @notify="emit('notify', $event)" /></div>
    <div class="form-field ability-field"><div class="label-row"><label>Здібності</label><span class="field-hint">{{ modelValue.abilities.filter(a => a.enabled).length }} АКТИВНО</span></div><AbilitySelector :model-value="modelValue.abilities" @update:model-value="emit('update:modelValue', { ...modelValue, abilities: $event })" /></div>
    <details class="settings-disclosure"><summary><span>Cloudinary / налаштування</span><ChevronDown :size="15" /></summary><div class="form-field"><label for="cloud-name">Cloud name</label><input id="cloud-name" :value="cloudinary.cloudName" placeholder="your-cloud-name" @input="emit('update:cloudinary', { ...cloudinary, cloudName: $event.target.value })" /></div><div class="form-field"><label for="upload-preset">Unsigned upload preset</label><input id="upload-preset" :value="cloudinary.uploadPreset" placeholder="motd_unsigned" @input="emit('update:cloudinary', { ...cloudinary, uploadPreset: $event.target.value })" /><small class="field-hint">Налаштування зберігаються лише у цьому браузері. Не додавайте API secret.</small></div><div class="form-field"><label for="html-limit">Ліміт MOTD (символів)</label><input id="html-limit" type="number" min="256" max="10000" :value="modelValue.maxLength" @input="emit('update:modelValue', { ...modelValue, maxLength: Math.max(256, Number($event.target.value) || 1536) })" /></div></details>
  </section>
</template>
