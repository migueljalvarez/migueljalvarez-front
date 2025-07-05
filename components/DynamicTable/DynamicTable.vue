<script lang="ts" setup>
  import CellComponent from './CellComponent.vue'
  import type { DynamicTableProps } from './DynamicTable'

  withDefaults(defineProps<Readonly<DynamicTableProps>>(), {
    headers: () => [],
    columnIndex: 0
  })
</script>

<template>
  <div class="w-full px-4">
    <!-- Desktop Table -->
    <table class="hidden w-full border border-gray-200 rounded-md shadow-sm table-auto md:table">
      <thead>
        <tr class="text-left text-gray-800 bg-blue-100">
          <th
            v-for="(header, index) in headers"
            :key="'header-' + index"
            class="px-4 py-2 font-semibold border-b border-gray-300"
            scope="col"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="text-sm text-gray-700">
        <tr
          v-for="(row, rowIndex) in rows"
          :key="'row-' + rowIndex"
          class="transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-100"
        >
          <td
            v-for="(cell, cellIndex) in row"
            :key="'cell-' + rowIndex + '-' + cellIndex"
            class="px-4 py-2 break-words align-top border-b border-r border-gray-200"
            :class="{ 'font-bold text-slate-800': cellIndex === columnIndex }"
          >
            <ClientOnly>
              <CellComponent :cell="cell" />
            </ClientOnly>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile stacked version -->
    <div class="flex flex-col gap-4 md:hidden">
      <div
        v-for="(row, rowIndex) in rows"
        :key="`stacked-row-${rowIndex}`"
        class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <div class="flex flex-col pb-2">
          <span class="text-xs font-bold text-gray-500">
            {{ row[0] }}
          </span>
          <div class="py-4 text-sm text-gray-800" :class="{ 'font-bold': 1 === columnIndex }">
            <CellComponent :cell="row[1]" class="flex-wrap" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
