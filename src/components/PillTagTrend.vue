<script setup>
import { computed } from 'vue'
import PillTag from '@/components/PillTag.vue'

const props = defineProps({
  trend: {
    type: String,
    required: true
  },
  trendType: {
    type: String,
    default: null
  },
  small: Boolean
})

const trendStyle = computed(() => {
  if (props.trendType === 'up') {
    return {
      icon: 'accountArrowDown',
      style: 'success'
    }
  }

  if (props.trendType === 'down') {
    return {
      icon: 'accountArrowUp',
      style: 'danger'
    }
  }

  if (props.trendType === 'alert') {
    return {
      icon: 'accountAlert',
      style: 'warning'
    }
  }

  return {
    style: 'info'
  }
})
</script>

<template>
  <PillTag
    :text="trend"
    :type="trendStyle.style"
    :icon="trendStyle.icon"
    :small="small"
  />
</template>
