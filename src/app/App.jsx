import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage, ProtectedRoute, PublicOnlyRoute } from '@/features/auth'
import { ProjectsPage, ProjectDetailPage } from '@/features/projects'
import { ProfilePage } from '@/features/users'
import AppLayout from './AppLayout'
import NotFoundPage from './NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
  )
}

export default App
