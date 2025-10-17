<template>
  <button
    data-slot="popover-trigger"
    :class="cn('', className)"
    v-bind="$attrs"
  >
    <slot />
  </button>
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
