<script setup>
import ImageUploader from './ImageUploader.vue'
import AbilitySelector from './AbilitySelector.vue'
import { Settings2 } from '@lucide/vue'

defineProps({ modelValue: { type: Object, required: true }, cloudinary: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue', 'notify'])
</script>

<template>
  <section class="panel editor-panel">
    <header class="panel-heading"><span class="section-index">01 / НАСТРОЙКИ</span><div><h2>Редактор ножа</h2><p>Содержимое окна MOTD</p></div><Settings2 :size="17" class="heading-icon" /></header>
    <div class="form-field"><label for="motd-template">Стиль MOTD</label><select id="motd-template" :value="modelValue.template || 'classic'" @change="emit('update:modelValue', { ...modelValue, template: $event.target.value })"><option value="classic">Компактный</option><option value="table">Таблица характеристик</option></select></div>
    <div class="form-field"><label for="knife-name">Название ножа <span class="required">*</span></label><input id="knife-name" :value="modelValue.name" maxlength="48" placeholder="Например, Shadow Fang" @input="emit('update:modelValue', { ...modelValue, name: $event.target.value })" /><div class="field-meta"><span>Заголовок в MOTD</span><span>{{ modelValue.name.length }}/48</span></div></div>
    <div class="form-field"><label for="knife-rating">Рейтинг (звёзды)</label><select id="knife-rating" :value="modelValue.rating ?? 10" @change="emit('update:modelValue', { ...modelValue, rating: Number($event.target.value) })"><option v-for="stars in 11" :key="stars" :value="stars - 1">{{ stars - 1 }} / 10</option></select></div>
    <div class="form-field"><label for="knife-price">Цена / подпись</label><input id="knife-price" :value="modelValue.price ?? 'Секретные ножи не продаются'" maxlength="64" placeholder="Секретные ножи не продаются" @input="emit('update:modelValue', { ...modelValue, price: $event.target.value })" /></div>
    <div v-if="modelValue.template !== 'table'" class="form-field"><label for="knife-description">Краткое описание</label><textarea id="knife-description" :value="modelValue.description" maxlength="220" rows="3" placeholder="Опишите нож и его особенности…" @input="emit('update:modelValue', { ...modelValue, description: $event.target.value })"></textarea><div class="field-meta"><span>До 220 символов</span><span>{{ modelValue.description.length }}/220</span></div></div>
    <div class="form-field"><label>Изображение</label><ImageUploader :model-value="modelValue.imageUrl" :cloudinary="cloudinary" @update:model-value="emit('update:modelValue', { ...modelValue, imageUrl: $event })" @notify="emit('notify', $event)" /></div>
    <div class="form-field ability-field"><div class="label-row"><label>Способности</label><span class="field-hint">{{ modelValue.abilities.filter(a => a.enabled).length }} АКТИВНО</span></div><AbilitySelector :model-value="modelValue.abilities" @update:model-value="emit('update:modelValue', { ...modelValue, abilities: $event })" /></div>
    <div class="form-field"><label for="html-limit">Лимит MOTD (символов)</label><input id="html-limit" type="number" min="256" max="10000" :value="modelValue.maxLength" @input="emit('update:modelValue', { ...modelValue, maxLength: Math.max(256, Number($event.target.value) || 1536) })" /></div>
  </section>
</template>
