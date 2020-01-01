<template>
  <div
    id="dropdown"
    class="relative inline-block"
    :style="{ zIndex: zIndexValue }"
  >
    <button
      @click="toggle"
      type="button"
      class="block focus:outline-none w-full"
      @focus="buttonHasFocus = true"
      @blur="buttonHasFocus = false"
    >
      <slot name="trigger" :isOpen="isOpen"></slot>
    </button>

    <div
      v-show="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 opacity-25 bg-black"
      tabindex="-1"
    ></div>

    <transition
      enter-class="opacity-0 scale-90"
      enter-active-class="ease-out transition-fastest"
      enter-to-class="opacity-100 scale-100"
      leave-class="opacity-100 scale-100"
      leave-active-class="ease-in transition-fastest"
      leave-to-class="opacity-0 scale-90"
    >
      <div
        v-show="isOpen"
        :class="position"
        class="mt-2 absolute origin-top-right text-left z-200"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['placement', 'z-index'],
  data() {
    return {
      buttonHasFocus: false,
      isOpen: false
    }
  },
  mounted() {
    const onEscape = e => {
      if (!this.isOpen || e.key !== 'Escape') {
        return
      }
      this.isOpen = false
    }
    document.addEventListener('keydown', onEscape)

    this.$on('hook:destroyed', () => {
      document.removeEventListener('keydown', onEscape)
    })
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
    }
  },
  computed: {
    position() {
      switch (this.placement) {
        case 'l':
          return 'left-0'
        case 'r':
          return 'right-0'
        default:
          return 'left-0'
      }
    },
    zIndexValue() {
      return _.isNil(this.zIndex) ? '200' : this.zIndex
    }
  }
}
</script>
