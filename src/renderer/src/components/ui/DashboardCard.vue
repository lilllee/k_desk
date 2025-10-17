<template>
  <Card :class="className" v-bind="$attrs">
    <CardHeader class="flex items-center justify-between">
      <CardTitle class="flex items-center gap-2.5">
        <Bullet :variant="intent" />
        {{ title }}
      </CardTitle>
      <div v-if="addon">{{ addon }}</div>
    </CardHeader>

    <CardContent class="flex-1 relative">
      <slot />
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from './Card.vue'
import CardHeader from './CardHeader.vue'
import CardTitle from './CardTitle.vue'
import CardContent from './CardContent.vue'
import Bullet from './Bullet.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  addon: {
    type: [String, Object],
    default: null
  },
  intent: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success'].includes(value)
  },
  class: {
    type: String,
    default: ''
  }
})

const className = computed(() => props.class)
</script>
