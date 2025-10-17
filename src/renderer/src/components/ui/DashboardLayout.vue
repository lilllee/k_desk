<template>
  <div class="flex flex-col relative w-full min-h-full">
    <div class="flex items-center lg:items-baseline gap-2.5 md:gap-4 px-4 md:px-6 py-3 md:pb-4 lg:pt-7 bg-background">
      <h1 class="text-xl lg:text-4xl font-display leading-[1] mb-1">
        {{ header.title }}
      </h1>
      <span v-if="header.description" class="ml-auto text-xs md:text-sm text-muted-foreground block">
        {{ header.description }}
      </span>
    </div>
    <div class="min-h-full flex-1 flex flex-col gap-8 md:gap-14 px-3 lg:px-6 py-6 md:py-10 bg-background">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  header: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.title && value.icon
    }
  }
})
</script>
