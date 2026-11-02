<script setup>
import { Download, RotateCcw, Terminal } from '@lucide/vue'
defineEmits(['reset', 'export'])
</script>

<template><header class="app-header"><a class="brand" href="#" aria-label="MOTD Builder"><span class="brand-mark"><Terminal :size="21" /></span><span><strong>MOTD<span>_</span>BUILDER</strong><small>COUNTER-STRIKE 1.6</small></span></a><div class="header-meta"><span class="version-tag">ВЕРСИЯ 1.0.0</span><span class="header-separator"></span><button class="button header-button" type="button" @click="$emit('reset')"><RotateCcw :size="14" /> Сбросить</button><button class="button button-accent header-button" type="button" @click="$emit('export')"><Download :size="14" /> Скачать HTML</button></div></header></template>
