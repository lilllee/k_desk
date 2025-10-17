<template>
  <component
    :is="asChild ? 'a' : 'button'"
    data-slot="sidebar-menu-button"
    data-sidebar="menu-button"
    data-size="default"
    :data-active="isActive"
    :class="cn('peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded p-2 text-left text-sm uppercase outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:[&>svg]:text-sidebar-primary data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0', className)"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup>
import { cn } from './utils.js'

const props = defineProps({
  asChild: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})
</script>
