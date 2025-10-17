<template>
  <div
    :class="bulletClasses"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from './utils.js'

const bulletVariants = cva('rounded-[1.5px]', {
  variants: {
    variant: {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
    },
    size: {
      sm: 'size-2',
      default: 'size-2.5',
      lg: 'size-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'destructive'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['sm', 'default', 'lg'].includes(value)
  },
  class: {
    type: String,
    default: ''
  }
})

const bulletClasses = computed(() => 
  cn(bulletVariants({ variant: props.variant, size: props.size }), props.class)
)
</script>
