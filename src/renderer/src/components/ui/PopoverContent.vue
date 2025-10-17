<template>
  <div
    data-slot="popover-content"
    :class="cn('bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden', className)"
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
