<script lang="ts" setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import Button from '~/components/atoms/Button/Button.vue'
  import { WHATSAPP_URL } from '~/constants/common'
  import { HERO_BRIEF, HERO_BRIEF_SCENARIOS, HERO_BRIEF_TIMING } from '~/constants/heroBrief'
  import { nextScenarioIndex, tabIndexForKey } from '~/utils/heroBrief'

  const scenarios = HERO_BRIEF_SCENARIOS
  const uid = useId()

  // Estado inicial (servidor y primer render del cliente): escenario 1 COMPLETO. La escritura y la rotación
  // empiezan solo tras montar, y no existen con prefers-reduced-motion.
  const active = ref(0)
  const settled = ref(true)
  const typed = ref(0)
  const rowsShown = ref(0)
  const stepShown = ref(false)
  const stopped = ref(false)
  const hovering = ref(false)
  const focusInside = ref(false)

  let timer: ReturnType<typeof setTimeout> | undefined
  let phase: 'typing' | 'rows' | 'dwell' = 'dwell'
  let reducedQuery: MediaQueryList | undefined

  const schedule = (ms: number) => {
    clearTimeout(timer)
    timer = setTimeout(tick, ms)
  }

  const startCycle = (index: number) => {
    settled.value = false
    active.value = index
    typed.value = 0
    rowsShown.value = 0
    stepShown.value = false
    phase = 'typing'
    schedule(HERO_BRIEF_TIMING.typeStep)
  }

  function tick() {
    if (stopped.value) return
    // Pausa con el cursor encima o con el foco dentro de la tarjeta.
    if (hovering.value || focusInside.value) return schedule(250)
    const t = HERO_BRIEF_TIMING
    if (phase === 'typing') {
      typed.value += t.typeChars
      if (typed.value >= scenarios[active.value]!.message.length) {
        phase = 'rows'
        schedule(t.rowsStart)
      } else schedule(t.typeStep)
    } else if (phase === 'rows') {
      if (rowsShown.value < HERO_BRIEF.rows.length) {
        rowsShown.value += 1
        schedule(t.rowGap)
      } else {
        stepShown.value = true
        settled.value = true
        phase = 'dwell'
        schedule(t.dwell)
      }
    } else startCycle(nextScenarioIndex(active.value, scenarios.length))
  }

  // Al elegir una pestaña (clic o teclado) la rotación se detiene y el escenario queda fijo y completo.
  const stop = () => {
    stopped.value = true
    clearTimeout(timer)
    settled.value = true
  }

  const select = (index: number) => {
    stop()
    active.value = index
  }

  const tabRefs = ref<HTMLButtonElement[]>([])
  const onTabKeydown = (event: KeyboardEvent) => {
    const next = tabIndexForKey(event.key, active.value, scenarios.length)
    if (next === null) return
    event.preventDefault()
    select(next)
    tabRefs.value[next]?.focus()
  }

  const onReducedChange = () => {
    if (reducedQuery?.matches) stop()
  }

  onMounted(() => {
    reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedQuery.addEventListener('change', onReducedChange)
    if (reducedQuery.matches) return stop()
    schedule(HERO_BRIEF_TIMING.firstDwell)
  })

  onBeforeUnmount(() => {
    clearTimeout(timer)
    reducedQuery?.removeEventListener('change', onReducedChange)
  })

  const visibleMessage = (index: number) => {
    const full = scenarios[index]!.message
    return settled.value || index !== active.value ? full : full.slice(0, typed.value)
  }
  const pendingMessage = (index: number) =>
    scenarios[index]!.message.slice(visibleMessage(index).length)
  const rowOn = (index: number, row: number) =>
    settled.value || index !== active.value || row < rowsShown.value
  const stepOn = (index: number) => settled.value || index !== active.value || stepShown.value
  const isTyping = computed(() => !settled.value)
</script>

<template>
  <div
    class="hero-brief"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @focusin="focusInside = true"
    @focusout="focusInside = false"
  >
    <div
      role="tablist"
      :aria-label="HERO_BRIEF.tablistLabel"
      class="mb-3 flex flex-wrap gap-2"
      @keydown="onTabKeydown"
    >
      <button
        v-for="(scenario, index) in scenarios"
        :id="`${uid}-tab-${index}`"
        :key="scenario.id"
        :ref="el => (tabRefs[index] = el as HTMLButtonElement)"
        type="button"
        role="tab"
        :aria-selected="active === index"
        :aria-controls="`${uid}-panel-${index}`"
        :tabindex="active === index ? 0 : -1"
        class="min-h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white motion-reduce:transition-none"
        :class="
          active === index
            ? 'border-brand-warm/60 bg-brand-warm/12 text-brand-text-strong'
            : 'border-brand-text-soft/15 text-brand-text-subtle hover:border-brand-text-soft/40 hover:text-brand-text-strong'
        "
        @click="select(index)"
      >
        {{ scenario.tab }}
      </button>
    </div>

    <!-- Los tres paneles comparten celda: el más alto reserva el espacio (sin saltos al cambiar). -->
    <div class="grid">
      <div
        v-for="(scenario, index) in scenarios"
        :id="`${uid}-panel-${index}`"
        :key="scenario.id"
        role="tabpanel"
        :aria-labelledby="`${uid}-tab-${index}`"
        :aria-hidden="active !== index"
        :inert="active !== index"
        class="col-start-1 row-start-1"
        :class="active === index ? '' : 'invisible'"
      >
        <div class="rounded-2xl border border-brand-text-soft/15 bg-brand-surface-panel p-5">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-brand-blue-light">
            {{ HERO_BRIEF.messageLabel }}
          </p>
          <!-- El texto completo va estable para lectores de pantalla; lo que se escribe es solo visual. -->
          <p class="min-h-18 text-base leading-6 text-brand-text-strong">
            <span class="sr-only">{{ scenario.message }}</span>
            <span aria-hidden="true">
              {{ visibleMessage(index) }}
              <span v-if="index === active && isTyping" class="hero-caret" />
              <span class="invisible">{{ pendingMessage(index) }}</span>
            </span>
          </p>
        </div>

        <div class="relative mx-auto h-8 w-px" aria-hidden="true">
          <span class="hero-link absolute inset-0" />
          <span
            class="hero-flow absolute top-0 left-1/2 -ml-0.75 size-1.75 rounded-full bg-brand-warm"
          />
        </div>

        <div class="hero-plan rounded-2xl border border-brand-blue/40 p-5 pb-4">
          <p class="mb-1 text-xs font-semibold uppercase tracking-[0.06em] text-brand-blue-light">
            {{ HERO_BRIEF.planLabel }}
          </p>
          <ul class="list-none">
            <li
              v-for="(row, rowIndex) in HERO_BRIEF.rows"
              :key="row.key"
              class="hero-reveal grid grid-cols-[28px_1fr] gap-3 border-t border-brand-text-soft/15 py-3"
              :class="rowOn(index, rowIndex) ? 'is-on' : ''"
            >
              <span
                class="grid size-7 place-items-center rounded-lg bg-brand-blue/20 text-brand-blue-light"
                aria-hidden="true"
              >
                <Icon :name="row.icon" size="16" />
              </span>
              <div>
                <p class="mb-0.5 text-xs font-medium text-brand-text-subtle">{{ row.label }}</p>
                <p class="text-sm leading-5.5 text-brand-text-strong">
                  {{ scenario.rows[rowIndex] }}
                </p>
              </div>
            </li>
          </ul>
          <div
            class="hero-reveal mt-1 flex flex-wrap items-center justify-between gap-3 border-t border-brand-text-soft/15 pt-4"
            :class="stepOn(index) ? 'is-on' : ''"
          >
            <p class="text-sm text-brand-text-soft">{{ scenario.nextStep }}</p>
            <Button
              v-track="HERO_BRIEF.ctaTrackId"
              as="a"
              :href="WHATSAPP_URL"
              target="_blank"
              rel="noopener noreferrer"
              :on-dark="true"
              size="sm"
              class="whitespace-nowrap"
            >
              {{ HERO_BRIEF.cta }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <p class="mt-3 text-xs text-brand-text-subtle">{{ HERO_BRIEF.caption }}</p>
  </div>
</template>

<style scoped>
  .hero-plan {
    background: linear-gradient(
      180deg,
      var(--color-brand-surface-panel-strong),
      var(--color-brand-surface-panel)
    );
    box-shadow: var(--shadow-inverse);
  }

  .hero-link {
    background: linear-gradient(var(--color-brand-border-strong), var(--color-brand-warm));
  }

  .hero-flow {
    animation: hero-flow 2.2s ease-in-out infinite;
  }

  .hero-reveal {
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 0.5s,
      transform 0.5s;
  }

  .hero-reveal.is-on {
    opacity: 1;
    transform: none;
  }

  .hero-caret {
    display: inline-block;
    width: 2px;
    height: 1.05em;
    margin-left: 2px;
    vertical-align: -2px;
    background: var(--color-brand-warm);
    animation: hero-blink 1s steps(1) infinite;
  }

  @keyframes hero-flow {
    0% {
      top: 0;
      opacity: 0;
    }
    20%,
    80% {
      opacity: 1;
    }
    100% {
      top: 100%;
      opacity: 0;
    }
  }

  @keyframes hero-blink {
    50% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-flow,
    .hero-caret {
      animation: none;
    }

    .hero-reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
