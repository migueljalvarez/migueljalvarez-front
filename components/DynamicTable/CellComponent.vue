<script lang="ts" setup>
  import { defineProps } from 'vue'
  import type { TableCellType } from './DynamicTable'

  defineProps<{ cell: { type: TableCellType; required: true } }>()
</script>

<template>
  <span v-if="typeof cell === 'string' || typeof cell === 'number'">
    {{ cell }}
  </span>
  <component :is="cell.component" v-else v-bind="cell.props">
    <template v-if="cell.props?.default">
      <component
        :is="child.component"
        v-for="(child, i) in cell.props.default"
        :key="i"
        v-bind="child.props"
      />
    </template>
  </component>
</template>
