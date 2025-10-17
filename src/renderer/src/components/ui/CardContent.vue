<template>
  <div
    data-slot="card-content"
    :class="cn('p-3 py-2 rounded bg-card', $attrs.class)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
import { cn } from './utils.js'
</script>
