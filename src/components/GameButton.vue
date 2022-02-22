<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: Event): void
}>()

const onClick = (e: Event) => {
  emit('click', e)
}
</script>

<template>
<button
  :class="{ disabled: props.disabled }"
  class="game-button"
  :disabled="props.disabled"
  @click="onClick"><slot></slot></button>
</template>

<style lang="scss" scoped>
@use "../config";

.game-button {
  background-color: config.$theme-color;
  color: #fff;
  border-radius: 8rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  opacity: 0.9;
  min-width: 200rpx;

  &.disabled {
    background-color: rgb(75,85,99);
    color: #fff;
    opacity: 0.5;
    &:active {
      opacity: 0.5;
    }
  }

  &:active {
    opacity: 1;
  }
}
</style>
