<template>
  <div
    data-slot="sidebar-header"
    data-sidebar="header"
    :class="cn('flex flex-col gap-2 p-2 rounded-lg bg-sidebar ring-2 ring-sidebar-foreground/[0.025]', className)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
import { cn } from './utils.js'

defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
