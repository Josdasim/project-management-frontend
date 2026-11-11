import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage } from '@/features/auth'
import { ProjectsPage } from '@/features/projects'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/projects" element={<ProjectsPage/>}/>
      <Route path="*" element={<Navigate to="/login" replace/>}/>
    </Routes>
  )
}

export default App