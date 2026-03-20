import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tf-tasks') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('tf-tasks', JSON.stringify(tasks))
  }, [tasks])

  const add = useCallback((data) => {
    const task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [task, ...prev])
    return task
  }, [])

  const update = useCallback((id, changes) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t))
  }, [])

  const remove = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const get = useCallback((id) => {
    return tasks.find(t => t.id === id) || null
  }, [tasks])

  const reorder = useCallback((oldIdx, newIdx) => {
    setTasks(prev => {
      const arr = [...prev]
      arr.splice(newIdx, 0, arr.splice(oldIdx, 1)[0])
      return arr
    })
  }, [])

  const stats = useMemo(() => ({
    total:      tasks.length,
    pending:    tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed:  tasks.filter(t => t.status === 'completed').length,
    overdue:    tasks.filter(t =>
      t.dueDate && t.status !== 'completed' &&
      new Date(t.dueDate) < new Date(new Date().toDateString())
    ).length,
  }), [tasks])

  const projects = useMemo(() =>
    [...new Set(tasks.map(t => t.project).filter(Boolean))].sort()
  , [tasks])

  return (
    <TaskContext.Provider value={{ tasks, stats, projects, add, update, remove, get, reorder }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be inside TaskProvider')
  return ctx
}