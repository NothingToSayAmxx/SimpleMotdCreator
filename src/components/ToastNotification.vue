<script setup>
import { computed, watch } from 'vue'
import { CheckCircle2, CircleAlert, X } from '@lucide/vue'

const props = defineProps({ toast: { type: Object, default: null } })
const emit = defineEmits(['dismiss'])
const icon = computed(() => props.toast?.type === 'error' ? CircleAlert : CheckCircle2)
watch(() => props.toast?.id, (id) => { if (id) setTimeout(() => emit('dismiss', id), 3600) })
</script>

<template><Transition name="toast"><div v-if="toast" class="toast" :class="toast.type" role="status"><component :is="icon" :size="17" /><span>{{ toast.message }}</span><button aria-label="Закрити повідомлення" @click="emit('dismiss', toast.id)"><X :size="15" /></button></div></Transition></template>
