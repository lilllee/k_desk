<template>
  <div
    data-slot="card"
    :class="cn('text-card-foreground flex flex-col gap-2 rounded-lg p-1.5 bg-pop', $attrs.class)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
import { cn } from './utils.js'
</script>
