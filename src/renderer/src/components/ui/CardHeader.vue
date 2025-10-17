<template>
  <div
    data-slot="card-header"
    :class="cn('@container/card-header h-9 grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 pl-1 pr-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', $attrs.class)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
import { cn } from './utils.js'
</script>
