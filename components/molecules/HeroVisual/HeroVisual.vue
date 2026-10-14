<script lang="ts" setup>
  const nodes = [
    { x: 120, y: 90 },
    { x: 220, y: 70 },
    { x: 310, y: 120 },
    { x: 330, y: 220 },
    { x: 250, y: 310 },
    { x: 140, y: 290 },
    { x: 80, y: 190 }
  ]

  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 0],
    [1, 4],
    [2, 5]
  ]
</script>

<template>
  <div aria-hidden="true" class="hero-visual hidden w-full max-w-65 md:flex lg:max-w-107.5">
    <svg viewBox="0 0 420 420" class="h-full w-full" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="hero-visual-glow" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#243B62" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#1C2F4C" stop-opacity="0.32" />
        </linearGradient>
      </defs>

      <circle cx="210" cy="210" r="168" fill="rgba(36,59,98,0.12)" />
      <circle cx="210" cy="210" r="130" fill="rgba(36,59,98,0.08)" />
      <circle cx="210" cy="210" r="110" fill="rgba(28,47,76,0.04)" />

      <g class="connections">
        <path
          v-for="(link, index) in links"
          :key="`link-${index}`"
          :class="['link', index < 3 ? 'is-active' : '']"
          :d="`M ${nodes[link[0]].x} ${nodes[link[0]].y} L ${nodes[link[1]].x} ${nodes[link[1]].y}`"
        />
      </g>

      <g class="nodes">
        <circle
          v-for="(node, index) in nodes"
          :key="`node-${index}`"
          :cx="node.x"
          :cy="node.y"
          r="10"
        />
      </g>

      <g class="orbit orbit-1">
        <circle
          cx="210"
          cy="210"
          r="155"
          fill="none"
          stroke="rgba(36,59,98,0.12)"
          stroke-width="1.5"
        />
      </g>
      <g class="orbit orbit-2">
        <circle
          cx="210"
          cy="210"
          r="180"
          fill="none"
          stroke="rgba(28,47,76,0.08)"
          stroke-width="1.5"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
  .hero-visual {
    position: relative;
    min-height: 260px;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .connections {
    filter: drop-shadow(0 0 10px rgba(36, 59, 98, 0.18));
  }

  .link {
    fill: none;
    stroke: rgba(36, 59, 98, 0.62);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 6 12;
    opacity: 0.85;
  }

  .link.is-active {
    stroke: url(#hero-visual-glow);
    stroke-dasharray: 10 18;
    animation: pulseLine 2.4s ease-in-out infinite;
  }

  .nodes circle {
    fill: #243b62;
    stroke: rgba(255, 255, 255, 0.95);
    stroke-width: 3;
    opacity: 1;
  }

  .nodes circle:nth-child(even) {
    fill: #1c2f4c;
  }

  .orbit {
    transform-origin: center;
    animation: slowRotate 22s linear infinite;
  }

  .orbit-2 {
    animation-direction: reverse;
    animation-duration: 30s;
  }

  @media (min-width: 1024px) {
    .hero-visual {
      min-height: 340px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .link.is-active,
    .orbit {
      animation: none;
    }
  }

  @keyframes pulseLine {
    0% {
      stroke-dashoffset: 0;
      opacity: 0.35;
    }
    50% {
      stroke-dashoffset: -40;
      opacity: 1;
    }
    100% {
      stroke-dashoffset: -80;
      opacity: 0.35;
    }
  }

  @keyframes slowRotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
