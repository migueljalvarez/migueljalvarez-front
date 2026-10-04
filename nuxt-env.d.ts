/// <reference types="nuxt" />

declare module '#app' {
  interface NuxtApp {
    $firebaseAuth: any
    $firebaseUser: any
  }
}
