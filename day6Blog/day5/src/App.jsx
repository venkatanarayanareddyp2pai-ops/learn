import { useCallback, useState } from 'react'
import { TaskProvider } from './context/TaskContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import TaskForm from './pages/TaskForm'
import TaskDetail from './pages/TaskDetail'

export default function App() {
  const [page,   setPageRaw] = useState('home')
  const [taskId, setTaskId]  = useState(null)

  const setPage = useCallback((p, id = null) => {
    setPageRaw(p)
    setTaskId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <TaskProvider>
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Navbar page={page} setPage={setPage} />

        {page === 'home'   && <Home       setPage={setPage} />}
        {page === 'tasks'  && <Tasks      setPage={setPage} />}
        {page === 'create' && <TaskForm   editId={null}   setPage={setPage} />}
        {page === 'edit'   && <TaskForm   editId={taskId} setPage={setPage} />}
        {page === 'detail' && <TaskDetail taskId={taskId} setPage={setPage} />}
      </div>
    </TaskProvider>
  )
}