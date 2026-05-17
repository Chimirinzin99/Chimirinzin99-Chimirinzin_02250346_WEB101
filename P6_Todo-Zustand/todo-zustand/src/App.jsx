import React from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import useTodoStore from './store/TodoStore'

function App() {
  const todoCount = useTodoStore((state) => state.todos.length)
  const completedCount = useTodoStore(
    (state) => state.todos.filter((todo) => todo.completed).length
  )

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}>
      <div style={{
        width: '400px',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}>
        <h1>Todo List with Zustand</h1>
        <TodoInput />
        <div>
          <p>Total todos: {todoCount}</p>
          <p>Completed: {completedCount}</p>
        </div>
        <TodoList />
      </div>
    </div>
  )
}

export default App