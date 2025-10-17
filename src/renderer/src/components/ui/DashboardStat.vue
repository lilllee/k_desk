<template>
  <Card class="relative overflow-hidden">
    <CardHeader class="flex items-center justify-between">
      <CardTitle class="flex items-center gap-2.5">
        <Bullet />
        {{ label }}
      </CardTitle>
      <component :is="icon" class="size-4 text-muted-foreground" />
    </CardHeader>

    <CardContent class="bg-accent flex-1 pt-2 md:pt-6 overflow-clip relative">
      <div class="flex items-center">
        <span class="text-4xl md:text-5xl font-display">
          {{ isNumeric ? `${prefix}${numericValue}${suffix}` : value }}
        </span>
        <Badge v-if="tag" variant="default" class="uppercase ml-3">
          {{ tag }}
        </Badge>
      </div>

      <div v-if="description" class="justify-between">
        <p class="text-xs md:text-sm font-medium text-muted-foreground tracking-wide">
          {{ description }}
        </p>
      </div>

      <!-- Marquee Animation -->
      <div v-if="direction" class="absolute top-0 right-0 w-14 h-full pointer-events-none overflow-hidden group">
        <div
          :class="[
            'flex flex-col transition-all duration-500',
            'group-hover:scale-105 group-hover:brightness-110',
            getIntentClassName(),
            direction === 'up' ? 'animate-marquee-up' : 'animate-marquee-down'
          ]"
        >
          <div :class="['flex', direction === 'up' ? 'flex-col-reverse' : 'flex-col']">
            <Arrow
              v-for="i in 6"
              :key="i"
              :direction="direction"
              :index="i - 1"
            />
          </div>
          <div :class="['flex', direction === 'up' ? 'flex-col-reverse' : 'flex-col']">
            <Arrow
              v-for="i in 6"
              :key="i + 6"
              :direction="direction"
              :index="i - 1"
            />
          </div>
        </div>
      </div>
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
import Badge from './Badge.vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    required: true
  },
  intent: {
    type: String,
    default: 'neutral',
    validator: (value) => ['positive', 'negative', 'neutral'].includes(value)
  },
  direction: {
    type: String,
    default: '',
    validator: (value) => ['up', 'down', ''].includes(value)
  }
})

// Extract prefix, numeric value, and suffix from the value string
const parseValue = (val) => {
  const match = val.match(/^([^\d.-]*)([+-]?\d*\.?\d+)([^\d]*)$/)
  
  if (match) {
    const [, prefix, numStr, suffix] = match
    return {
      prefix: prefix || '',
      numericValue: parseFloat(numStr),
      suffix: suffix || '',
      isNumeric: !isNaN(parseFloat(numStr)),
    }
  }
  
  return {
    prefix: '',
    numericValue: 0,
    suffix: val,
    isNumeric: false,
  }
}

const getIntentClassName = () => {
  if (props.intent === 'positive') return 'text-success'
  if (props.intent === 'negative') return 'text-destructive'
  return 'text-muted-foreground'
}

// const { prefix, numericValue, suffix, isNumeric } = parseValue(props.value)
</script>

<script>
// Arrow component
import { defineComponent } from 'vue'

const Arrow = defineComponent({
  name: 'Arrow',
  props: {
    direction: {
      type: String,
      required: true,
      validator: (value) => ['up', 'down'].includes(value)
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const staggerDelay = props.index * 0.15
    const phaseDelay = (props.index % 3) * 0.8
    
    return {
      staggerDelay,
      phaseDelay
    }
  },
  template: `
    <span
      :style="{
        animationDelay: \`\${staggerDelay + phaseDelay}s\`,
        animationDuration: '3s',
        animationTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      }"
      class="text-center text-5xl size-14 font-display leading-none block transition-all duration-700 ease-out animate-marquee-pulse will-change-transform"
    >
      {{ direction === 'up' ? '↑' : '↓' }}
    </span>
  `
})

export { Arrow }
</script>
