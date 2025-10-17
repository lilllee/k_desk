<template>
  <ul
    data-slot="sidebar-menu"
    data-sidebar="menu"
    :class="cn('flex w-full min-w-0 flex-col gap-1', className)"
    v-bind="$attrs"
  >
    <slot />
  </ul>
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
