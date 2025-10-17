<template>
  <div
    data-slot="sidebar-menu-badge"
    data-sidebar="menu-badge"
    :class="cn('text-sidebar-foreground pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden', className)"
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
