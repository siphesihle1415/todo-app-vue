<script setup>
import { ref, watch, nextTick } from 'vue'
import TodoList from './TodoList.vue'
import { storeToRefs } from 'pinia'
import { useTodosStore } from '@/stores/todos'

const todotext = ref("")
const todos = useTodosStore()
const todoinput = ref(null)
const { filter, filteredTodos, loading } = storeToRefs(todos)
const can_undo = ref(false)
const todolist = ref(null)

const scrollbar = ref(null)

watch(filteredTodos, (todos) => {
  if (todos) can_undo.value = todos.some((todo) => todo.deleted)
})

watch([filteredTodos, loading], async ([filteredTodos, loading]) => {
  await nextTick()
  if (scrollbar.value && !loading) {
    if (scrollbar.value.$el.scrollHeight > scrollbar.value.ps.containerHeight) {
      toggleClass(scrollbar.value.$el, "shadow-bottom", "add")
    } else {
      toggleClass(scrollbar.value.$el, "scrolled-up", "remove")
      toggleClass(scrollbar.value.$el, "shadow-bottom", "remove")
    }
  } 
}, {flush: 'post'})

watch(filter, (filter) => {
  if (scrollbar.value) {
    scrollbar.value.update()
    scrollbar.value.$el.scrollTop = 0
  }

  if (todoinput.value) {
    todoinput.value.focus()
  }
}, {flush: 'post'})

async function addItem(e) {
  if (todotext.value.trim() != '') {
    todos.addTodo(todotext.value.trim())
    todotext.value = ""

    await nextTick()
    if (scrollbar.value) {
      scrollbar.value.$el.scrollTop = scrollbar.value.$el.scrollHeight - scrollbar.value.ps.containerHeight
    }
  }
}

function onScroll(event) {
  const scrollPos = scrollbar.value.$el.scrollTop
  const container = scrollbar.value.$el

  if (scrollPos > 0) {
    if (scrollPos + scrollbar.value.ps.containerHeight == container.scrollHeight) {
      if (container.scrollHeight > scrollbar.value.ps.containerHeight) {
        toggleClass(container, "shadow-bottom", "remove")
        toggleClass(container, "both", "remove") 
        toggleClass(container, "scrolled-up", "add")
      }

    } else {
      toggleClass(container, "shadow-bottom", "remove")
      toggleClass(container, "both", "add")
    }
  } else {
    toggleClass(container, "both", "remove")
    if (container.scrollHeight > scrollbar.value.ps.containerHeight) {
      toggleClass(container, "shadow-bottom", "add")
    }
  } 
}

function toggleClass(element, cls, action) {
  if (element) {
    if (action == "add") {
      if (!element.classList.contains(cls)) element.classList.add(cls)
    } else {
      if (element.classList.contains(cls)) element.classList.remove(cls)
    }
  }
}

function undo(event) {
  todos.undoRemovedTodos()
}

async function updateScrollHeight() {
  if (scrollbar.value) {
    await nextTick()
    scrollbar.value.update()
  }
}
</script>

<template>
  <div class="filter-section">
    <div class="filters">
      <div class="filter-category">
        <input v-model="filter" id="all" type="radio" value="all">
        <label for="all">All</label>
      </div>
      <div class="filter-category">
        <input v-model="filter" id="finished" type="radio" value="finished">
        <label for="finished">Finished</label>
      </div>
      <div class="filter-category">
        <input v-model="filter" id="unfinished" type="radio" value="unfinished">
        <label for="unfinished">Unfinished</label>
      </div>
    </div>
    <div class="undo-button">
      <button v-show="can_undo" @click="undo">
        <font-awesome-icon :icon="['fas', 'undo-alt']" />
      </button>
    </div>
  </div>

  <perfect-scrollbar @ps-scroll-y="onScroll" ref="scrollbar">
    <TodoList ref="todolist" @item-edited="updateScrollHeight" @item-deleted="updateScrollHeight"/>
  </perfect-scrollbar>

  <div class="input-section">
    <input autofocus :disabled="filter=='finished'" @keyup.enter="addItem" type="text" placeholder="Add something to do" v-model="todotext" ref="todoinput"/>
  </div>
</template>

<style scoped>
.ps {
  padding-top: 0.5rem;
  padding-bottom: 0.3rem;
  height: calc(100vh - 11rem - 3.5rem - 4rem - 2rem);
}

.ps, .input-section, .filter-section {
  margin: 0 2rem;
}

.filter-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3.5rem;
  padding: 0.2rem 1rem;
  border-radius: 10px;
  background-color: rgba(84, 84, 84, 0.65);
}

.filters {
  flex-grow: 4;
  display: flex;
  justify-content: flex-start;
}

.undo-button {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

.input-section {
  padding-top: 0.5rem;
  height: 3rem;
}

.input-section input {
  width: 100%;
  height: 100%;
  border-radius: 0.4rem;
  border: none;
  padding: 0.4rem 0.8rem;
  outline: none;
}

.scrolled-up {
  box-shadow: 0px 10px 10px -10px #000 inset;
}

.shadow-bottom {
  box-shadow: 0px -10px 10px -10px #000 inset;
}

.both {
  box-shadow: 0px 10px 10px -10px #000 inset, 0px -10px 10px -10px #000 inset;
}

.filter-category + .filter-category {
  margin-left: 1.1rem;
}

.filter-category input {
  display: none;
}

.filter-category label {
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 20px;
  background-color: #282828;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

@media (max-width: 398px) {
  .filter-category label { 
    padding: 0.4rem 0.7rem;
  }
}

.filter-category input:checked + label, .filter-category input:checked:hover + label {
  background-color: #1db954;
  color: #000;
}

.filter-category input:hover + label {
  background-color: #303030;
}

.undo-button button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.05rem;
  border-radius: 15px;
}

.undo-button button:hover {
  color: rgb(209,209,209)
}

.undo-button button:active {
  color: rgb(192,192,192);
}

</style>