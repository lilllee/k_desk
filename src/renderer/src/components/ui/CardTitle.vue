<template>
  <div
    data-slot="card-title"
    :class="cn('leading-none font-medium text-sm', $attrs.class)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
import { cn } from './utils.js'
</script>
