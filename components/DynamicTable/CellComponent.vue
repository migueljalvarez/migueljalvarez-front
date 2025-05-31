<script lang="ts" setup>
  import type { TableCellType } from './DynamicTable'

  defineProps<{ cell: TableCellType }>()

  const isPrimitive = (val: unknown): val is string | number =>
    typeof val === 'string' || typeof val === 'number'

  const isRenderable = (
    val: unknown
  ): val is {
    component: string
    props?: Record<string, unknown> & { default?: Array<any> }
  } => typeof val === 'object' && val !== null && 'component' in val
</script>

<template>
  <template v-if="isPrimitive(cell)">
    <span>{{ cell }}</span>
  </template>

  <template v-else-if="isRenderable(cell)">
    <component :is="cell.component" v-bind="cell.props">
      <template v-if="Array.isArray(cell.props?.default)">
        <component
          :is="child.component"
          v-for="(child, i) in cell.props.default"
          :key="i"
          v-bind="child.props"
        />
      </template>
    </component>
  </template>

  <template v-else>
    <span class="text-red-500">[Valor inválido]</span>
  </template>
</template>
