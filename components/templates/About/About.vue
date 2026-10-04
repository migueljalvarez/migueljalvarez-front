<script lang="ts" setup></script>

<template>
  <section
    id="about"
    class="relative box-border flex w-full flex-col items-center justify-center overflow-hidden bg-brand-surface px-4 py-8 pt-20"
  >
    <div
      class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
    >
      <div class="flex w-full justify-center">
        <div
          class="w-full max-w-xl overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-card p-2 shadow-[0_14px_34px_rgba(18,30,48,0.10)] lg:max-w-none"
        >
          <NuxtImg
            src="ma.webp"
            alt="Miguel Alvarez"
            width="600"
            sizes="100vw sm:544px lg:600px"
            format="webp"
            loading="lazy"
            class="aspect-[3/2] w-full rounded-xl object-cover object-center"
          />
        </div>
      </div>

      <div class="flex max-w-2xl flex-col items-start gap-4 text-left">
        <div>
          <h5 class="text-brand-blue font-semibold text-sm mb-2 tracking-[0.08em] uppercase">
            Sobre mí
          </h5>
          <h3 class="text-2xl font-semibold text-brand-ink">Un poco más sobre mí</h3>
        </div>

        <p class="font-normal leading-7 text-brand-muted">
          Soy
          <strong class="text-brand-ink">Ingeniero de Sistemas</strong>
          y me dedico al desarrollo de software desde hace más de
          <strong class="text-brand-ink">9 años.</strong>
          Me apasiona ayudar a personas y empresas a alcanzar sus objetivos a través de la
          tecnología.
        </p>
        <p class="font-normal leading-7 text-brand-muted">
          Fui
          <strong class="text-brand-ink">Microsoft Student Partner (MSP)</strong>
          para Microsoft de Venezuela durante mi época de estudiante, lo que me permitió aprender,
          liderar y compartir conocimientos con otros estudiantes y profesionales del sector.
        </p>
        <p class="font-normal leading-7 text-brand-muted">
          Cuando no estoy programando, disfruto de la música, el cine, salir a caminar, ver videos y
          tutoriales, siempre estoy en constante aprendizaje.
        </p>
      </div>
    </div>
  </section>
</template>

<style></style>
