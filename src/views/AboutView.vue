<script setup>
const tools = ['Vue.js (Composition API)', 'Pinia', 'Vue router', 'Vite', 'Datahub']
</script>

<template>
  <div class="about">
    <h1>Tools/frameworks used in this project:</h1>
    <ol class="list">
      <li v-for="tool in tools">
        {{ tool }}
      </li>
    </ol>
  </div>
</template>

<style>
.about {
  position: fixed;
  padding: 0 2rem;
  top: 10rem;
  color: white;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.about h1 {
  font-size: 1.7rem;
}

ol { 
  padding-left: 0;
}
li { 
  color: #fff; 
  padding-left: 1.5rem;
  margin: 2.5rem;
  position: relative;
  font-size: 16px;
  line-height: 20px;
  
  &:before {
    content: '';
    display: block;
    height: 42px;
    width: 42px;
    border-radius: 50%;
    border: 2px solid #1db954;
    position: absolute;
    top: -12px;
    left: -32px;
  }
}
</style>
