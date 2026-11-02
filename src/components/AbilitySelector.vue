<script setup>
const props = defineProps({ modelValue: { type: Array, required: true } })
const emit = defineEmits(['update:modelValue'])
function update(id, key, value) {
  emit('update:modelValue', props.modelValue.map((item) => item.id === id ? { ...item, [key]: value } : item))
}
</script>

<template>
  <div class="ability-list">
    <div v-for="item in modelValue" :key="item.id" class="ability-row" :class="{ active: item.enabled }">
      <div class="ability-main"><input :id="`ability-${item.id}`" type="checkbox" :checked="item.enabled" @change="update(item.id, 'enabled', $event.target.checked)" /><label :for="`ability-${item.id}`"><span class="ability-icon" aria-hidden="true">{{ item.icon }}</span><span class="ability-copy"><strong>{{ item.name }}</strong><small>{{ item.description }}</small></span></label><span class="ability-state">{{ item.enabled ? 'ВКЛ' : 'ВЫКЛ' }}</span></div>
      <div class="ability-meta"><label :for="`knife-only-${item.id}`"><input :id="`knife-only-${item.id}`" type="checkbox" :checked="Boolean(item.knifeOnly)" @change="update(item.id, 'knifeOnly', $event.target.checked)" /> Только с ножом</label><input class="ability-value" type="text" maxlength="32" :value="item.value || '—'" :aria-label="`Дополнительное значение: ${item.name}`" @input="update(item.id, 'value', $event.target.value)" /></div>
    </div>
    <p v-if="!modelValue.length" class="empty-note">Список способностей пуст.</p>
    <p class="field-hint">Названия и описания способностей меняются в <code>src/data/abilities.js</code>.</p>
  </div>
</template>
