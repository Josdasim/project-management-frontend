import { Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage, ProtectedRoute, PublicOnlyRoute } from '@/features/auth'
import { ProjectsPage, ProjectDetailPage, TrashPage } from '@/features/projects'
import { ProfilePage } from '@/features/users'
import AppLayout from './AppLayout'
import NotFoundPage from './NotFoundPage'
import { LandingPage } from '@/features/landing'

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/trash" element={<TrashPage/>}/>
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
  )
}

export default App
