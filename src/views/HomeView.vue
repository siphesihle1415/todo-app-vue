<script setup>
import TodoContainer from '../components/TodoContainer.vue'
</script>

<template>
  <main>
    <TodoContainer />
  </main>
</template>

<style scoped>
main {
  position: fixed;
  top: 11rem;
}

html {
  scroll-behavior: smooth;
}

@media (max-width: 768px) {
  main {
    width: 100vw;
  }
}

@media (min-width: 769px) and (max-width: 1368px) {
  main {
    width: 60vw;
  }
}

@media (min-width: 1369px) {
  main {
    width: 50vw;
  }
}
</style>