import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage, ProtectedRoute, PublicOnlyRoute } from '@/features/auth'
import { ProjectsPage } from '@/features/projects'

function App() {
  return (
    <Routes>
      
      <Route element = {<PublicOnlyRoute/>}>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Route>
      
      <Route element = {<ProtectedRoute/>}>
        <Route path="/projects" element={<ProjectsPage/>}/>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace/>}/>
      <Route path="*" element={<Navigate to="/login" replace/>}/>
    </Routes>
  )
}

export default App