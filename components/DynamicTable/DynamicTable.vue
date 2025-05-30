<script lang="ts" setup>
  import CellComponent from './CellComponent.vue'
  import type { DynamicTableProps } from './DynamicTable.d.ts'
  defineProps<DynamicTableProps>()
</script>

<template>
  <div class="flex">
    <table class="w-full m-4 border border-gray-200 table-auto">
      <thead>
        <tr class="bg-blue-200">
          <th
            v-for="(header, index) in headers"
            :key="index"
            class="px-4 py-2 font-semibold text-left border-b border-gray-200"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="text-sm text-gray-700">
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="odd:bg-white even:bg-gray-50">
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="px-4 py-2 border-b border-r border-gray-200"
            :class="{ 'font-bold': cellIndex === columnIndex }"
          >
            <CellComponent :cell="cell" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
