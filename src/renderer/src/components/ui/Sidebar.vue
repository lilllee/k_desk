<template>
  <div
    data-slot="sidebar"
    :class="cn('text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', className)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
import { cn } from './utils.js'

const props = defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
