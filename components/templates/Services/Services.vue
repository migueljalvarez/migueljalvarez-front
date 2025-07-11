<script lang="ts" setup>
  import { Section } from '~/components/organisms'
  import { SERVICES } from '~/constants/common'
</script>
<template>
  <Section id="services" title="Servicios" background="bg-white" class="gap-4 px-4 py-8 pt-20">
    <div class="grid w-full grid-cols-1 gap-8 p-2 rounded-lg lg:grid-cols-3 max-w-7xl">
      <div v-for="service in SERVICES" :key="service.title" class="flex flex-col gap-4 p-4">
        <div
          class="flex flex-col items-center w-full gap-2 text-blue-500 justify-baseline lg:justify-center"
        >
          <Icon :name="service.icon" size="40" />
          <p class="text-3xl italic font-normal text-center">{{ service.title }}</p>
        </div>

        <div v-for="(item, index) in service.items" :key="index" class="min-w-max">
          <ul class="space-x-2 space-y-2 font-light text-gray-700 list-none lg:px-8">
            <li
              v-if="item"
              class="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-green-500 before:font-bold"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Section>
</template>

<style></style>
