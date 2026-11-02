<script setup>
import { abilities as examples } from '../data/abilities.js'

const props = defineProps({ modelValue: { type: Array, required: true } })
const emit = defineEmits(['update:modelValue'])
function toggle(id) {
  emit('update:modelValue', props.modelValue.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item))
}
</script>

<template>
  <div class="ability-list">
    <label v-for="item in modelValue" :key="item.id" class="ability-row" :class="{ active: item.enabled }">
      <input type="checkbox" :checked="item.enabled" @change="toggle(item.id)" />
      <span class="ability-icon" aria-hidden="true">{{ item.icon }}</span>
      <span class="ability-copy"><strong>{{ item.name }}</strong><small>{{ item.description }}</small></span>
      <span class="ability-state">{{ item.enabled ? 'ВКЛ' : 'ВЫКЛ' }}</span>
    </label>
    <p v-if="!modelValue.length" class="empty-note">Список способностей пуст.</p>
    <p class="field-hint">Примеры для демонстрации. Измените массив в <code>src/data/abilities.js</code>.</p>
  </div>
</template>
