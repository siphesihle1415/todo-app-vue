<script setup>
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'
import { useTodosStore } from '@/stores/todos'
import { storeToRefs } from 'pinia'

const todos = useTodosStore()
const { filter, filteredTodos, finalTodos, loading } = storeToRefs(todos)
const error = ref(false)
const show_list = ref(false)

const emit = defineEmits(['itemDeleted', 'itemEdited'])

function populateTodos() {
  error.value = false
  todos.error = null
  loading.value = true

  todos.fetchTodos()

  setTimeout(() => {
    loading.value = false
    error.value = todos.error != null
    show_list.value = !loading.value && !error.value
  }, 800)
}

function emitDeletedEvent() {
  emit('itemDeleted')
}

function emitEditedEvent() {
  emit('itemEdited')
}

populateTodos()
</script>

<template>
  <div v-if="loading" class="loader-container"><div class="loader"></div></div>

  <div v-else-if="show_list" class="todo-list-container animate-bottom">
    <template v-if="finalTodos.length != 0">
      <TodoItem @item-edited="emitEditedEvent" @item-deleted="emitDeletedEvent" v-for="item in filteredTodos" v-show="!item.deleted" :id="item.id" :text="item.text" :completed="item.completed" :key="item.id"/>
    </template>
    <template v-else>
      <p v-if="filter!='finished'">Nothing to show. Add something to do.</p>
      <p v-else>Nothing to show. Mark items as finished.</p>
    </template>
  </div>

  <div v-else-if="error" class="animate-bottom error">{{ todos.error }}</div>

</template>

<style scoped>
.todo-list-container {
  display: flex;
  flex-direction: column;
}

.todo-list-container:has(p) {
  justify-content: center;
  align-items: center;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loader {
  width: 4rem;
  height: 4rem;
  border: 7px solid transparent;
  border-radius: 50%;
  border-top: 7px solid #fff;
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-bottom {
  position: relative;
  -webkit-animation-name: animatebottom;
  -webkit-animation-duration: 1s;
  animation-name: animatebottom;
  animation-duration: 1s
}

@-webkit-keyframes animatebottom {
  from { bottom:-150px; opacity:0 } 
  to { bottom:0px; opacity:1 }
}

@keyframes animatebottom { 
  from{ bottom:-150px; opacity:0 } 
  to{ bottom:0; opacity:1 }
}

</style>