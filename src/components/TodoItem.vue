<script setup>
import { ref , watch} from 'vue'
import { useTodosStore } from '@/stores/todos'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['itemDeleted', 'itemEdited'])

const todotext = ref(props.text)
const edit = ref(false)
const checked = ref(props.completed)
const todoinput = ref(null)

const todos = useTodosStore()

watch(edit, (newEdit) => {
  if (newEdit) todoinput.value.focus()
}, {flush: 'post'})

function editItem(e) {
  if (todotext.value.trim() != '') {
    todos.editTodo(props.id, todotext.value.trim(), checked.value)
    edit.value = false
    emit('itemEdited')
  }
}

function deleteItem(e) {
  todos.removeTodo(props.id)
  emit('itemDeleted')
}

function onEdit(e) {
  edit.value = true
}

function onBlur(e) {
  edit.value = false
  todotext.value = props.text
}

</script>

<template>
  <div class="todo-item">
    <template v-if="edit">
      <input class="item-textbox" ref="todoinput" @blur="onBlur" @keyup.enter="editItem" type="text" v-model="todotext"/>
    </template>
    <template v-else>
      <div class="item-content">
        <label class="checkbox-container">
          <span :class="{'item-strike': checked}">{{ text }}</span>
          <input type="checkbox" @change="editItem" :id="props.id" :checked="checked" v-model="checked">
          <span class="checkmark"></span>
        </label>
        <!-- <label :for="props.id"></label> -->
      </div>
    </template>
    <div class="item-controls">
      <button v-show="!edit" @click="onEdit">
        <font-awesome-icon :icon="['fas', 'pencil-alt']" />
      </button>
      <button @click="deleteItem">
        <font-awesome-icon :icon="['fas', 'trash-alt']" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  flex-direction: row;
  padding: 1rem 1rem;
  min-height: 4rem;
  background-color: rgba(60, 60, 60, 0.29);
  margin: 0.15rem 0.6rem;
  border-radius: 5px;
  align-items: flex-start;
  justify-content: flex-start;
  color: #fff;
}

.todo-item:hover {
  background-color: rgba(60, 60, 60, 0.64);
}

.item-textbox {
  margin-top: 1px;
  margin-right: 0.5rem;
  margin-left: 38px;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  outline: none;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  transition: border-bottom 0.3s ease-in-out;
}

.item-textbox:focus {
  border-bottom: 1px solid #fff;
}

.item-content {
  flex-grow: 6;
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  margin-right: 10px;
}

.item-controls {
  flex-grow: 1;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
}

.item-controls button + button {
  margin-left: 0.7rem;
}

.item-controls button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.05rem;
  border-radius: 15px;
}

.item-controls button:hover {
  color: rgb(209,209,209)
}

.item-controls button:active {
  color: rgb(192,192,192);
}

/** Rounded checkbox **/
/* Hide the browser's default checkbox */
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 40px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: inherit;
  border: 2px solid #fff;
  border-radius: 15px;
}

/* On mouse-over, display the checkmark*/
.checkbox-container:hover .checkmark:after {
  display: block;
}

/* When the checkbox is checked, add a blue background */
.checkbox-container input:checked ~ .checkmark {
  background-color: #1db954;
  border: 2px solid transparent;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container input:active ~ .checkmark {
  background-color: #fff;
}

.item-strike {
  text-decoration: line-through;
  text-decoration-color: rgb(136,136,136);
  color: rgb(136,136,136);
}

/* Style the checkmark/indicator */
.checkbox-container .checkmark:after {
  left: 7px;
  top: 4px;
  width: 7px;
  height: 12px;
  border: solid #fff;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>