import { defineStore } from 'pinia'

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: null,

    filter: 'all',

    nextId: 0,

    error: null,

    loading: false
  }),
  getters: {
    finishedTodos(state) {
      return (state.todos)? state.todos.filter((todo) => todo.completed) : null
    },
    unfinishedTodos(state) {
      return (state.todos)? state.todos.filter((todo) => !todo.completed) : null
    },

    filteredTodos(state) {
      if (this.filter === 'finished') {
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },

    finalTodos(state) {
      return (this.filteredTodos)? this.filteredTodos.filter((todo) => !todo.deleted) : null
    }
  },
  actions: {
    addTodo(text, completed = false, deleted = false) {
      const trimmedText = text.trim();
      if (trimmedText != '') {
        this.todos.push({ text: trimmedText, id: this.nextId++, completed, deleted })
        localStorage.setItem("todos", JSON.stringify(this.todos))
      }
    },
    setTodos(todos) {
      this.todos = []
      this.nextId = 0
      for (const todo of todos) {
        this.addTodo(todo.text, todo.completed, todo.deleted)
      }
    },
    removeTodo(id) {
      this.todos = this.todos.map((todo) => todo.id == id? ({...todo, deleted: true}) : todo)
      localStorage.setItem("todos", JSON.stringify(this.todos))
    },
    undoRemovedTodos() {
      this.todos = this.todos.map((todo) => todo.deleted? ({...todo, deleted: false}) : todo)
      localStorage.setItem("todos", JSON.stringify(this.todos))
    },
    editTodo(id, text, completed) {      
      this.todos = this.todos.map((todo) => todo.id == id? ({...todo, text, completed}) : todo)
      localStorage.setItem("todos", JSON.stringify(this.todos))
    },
    fetchTodos() {
      const that = this
      fetch('http://192.168.56.1:9200/data/todo/v1/todos', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((response) => {
        const cachedTodos = JSON.parse(localStorage.getItem("todos"))
        if (response.ok) {
          response.json().then((todos) => {
            if (todos.length != 0) {
              if (cachedTodos) { 
                that.setTodos(cachedTodos)
              } else {
                that.setTodos(todos)
                localStorage.setItem("todos", JSON.stringify(todos))
              }
            } else {
              that.setTodos([])
              if (cachedTodos) localStorage.removeItem("todos") 
            }
          })
        } else {
          that.error = "Oops! Something happened. Please try again later."
          if (cachedTodos) localStorage.removeItem("todos")
        }
      })
    }
  },
})