<script lang="ts" setup>
import { computed } from "vue";
const emit = defineEmits([
  "update:currentIndex",
  "update:portafolioCurrentIndex",
]);
const props = defineProps({
  title: { type: String, default: "" },
  items: { type: Array, required: true },
  currentIndex: { type: Number, default: 0 },
  portafolioCurrentIndex: { type: Number, default: 0 },
  background: { type: String, default: "" },
  backgroundColor: { type: String, default: "" },
  showArrow: { type: Boolean, default: true },
});

const prevSlide = () => {
  if (props.title === "Portafolio") {
    const newIndex = (props.portafolioCurrentIndex - 1 + props.items.length) % props.items.length;
    emit("update:portafolioCurrentIndex", newIndex);
  } else {
    const newIndex = (props.currentIndex - 1 + props.items.length) % props.items.length;
    emit("update:currentIndex", newIndex);
  }
};
const nextSlide = () => {
  if (props.title === "Portafolio") {
    const newIndex = (props.portafolioCurrentIndex + 1) % props.items.length;
    emit("update:portafolioCurrentIndex", newIndex);
  } else {
    const newIndex = (props.currentIndex + 1) % props.items.length;
    emit("update:currentIndex", newIndex);
  }
};

const backgroundStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.backgroundColor) {
    style.backgroundColor = `color-mix(in oklab, ${props.backgroundColor} 90%, transparent)`;
  }
  if (props.background) {
    style.backgroundImage = `url(${props.background})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    style.backgroundRepeat = "no-repeat";
    style.backgroundAttachment = "fixed";
  }
  return style;
});
</script>

<template>
  <section :style="backgroundStyle" class="flex flex-col min-h-[400px]">
    <div
      class="relative flex flex-col items-center justify-center w-full px-2 py-8 mx-auto shadow-lg max-w-8xl sm:px-6 bg-black/30 backdrop-blur-md"
    >
      <h3
        v-if="title"
        class="py-6 text-xl italic text-center text-white sm:text-2xl md:text-3xl"
      >
        {{ title }}
      </h3>
      <div
        class="flex items-center justify-center w-full min-h-[700px] relative overflow-hidden"
      >
        <Transition name="fade" mode="out-in">
          <slot :go-prev="prevSlide" :go-next="nextSlide" />
        </Transition>
      </div>
      <!-- Arrows -->
      <button
        v-if="showArrow"
        class="absolute z-10 flex items-center justify-center text-white -translate-y-1/2 rounded-full cursor-pointer left-2 md:left-4 lg:left-30 2xl:left-42 top-1/2 size-10 md:size-12 bg-white/20 backdrop-blur-md hover:bg-white/40"
        @click="prevSlide"
      >
        <Icon name="mdi:chevron-left" size="24" />
      </button>

      <button
        v-if="showArrow"
        class="absolute z-10 flex items-center justify-center text-white -translate-y-1/2 rounded-full cursor-pointer right-2 md:right-4 lg:right-30 2xl:right-42 top-1/2 size-10 md:size-12 bg-white/20 backdrop-blur-md hover:bg-white/40"
        @click="nextSlide"
      >
        <Icon name="mdi:chevron-right" size="24" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s, transform 0.4s;
  position: absolute;
  width: 100%;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
