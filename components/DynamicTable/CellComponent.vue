<script lang="ts" setup>
  import type { RenderableComponent, TableCellType } from './DynamicTable'

  defineProps<{ cell: TableCellType }>()

  const attrs = useAttrs()
  const isPrimitive = (val: unknown): val is string | number =>
    typeof val === 'string' || typeof val === 'number'

  const isRenderable = (
    val: unknown
  ): val is {
    component: RenderableComponent
    props?: Record<string, unknown> & { theme?: string; value?: string }
  } => typeof val === 'object' && val !== null && 'component' in val
</script>

<template>
  <template v-if="cell && isPrimitive(cell)">
    <span v-bind="attrs">{{ cell }}</span>
  </template>

  <template v-else-if="isRenderable(cell)">
    <ClientOnly>
      <component :is="cell.component" v-bind="{ ...cell.props, ...attrs }">
        <template v-if="Array.isArray(cell.props?.default)">
          <component
            :is="child.component"
            v-for="(child, i) in cell.props.default"
            :key="i"
            v-bind="child.props"
          />
        </template>
      </component>
    </ClientOnly>
  </template>

  <template v-else>
    <span class="text-red-500">[Valor inválido]</span>
  </template>
</template>
