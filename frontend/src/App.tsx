import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthContext'
import Login from '@/features/auth/Login'
import ProtectedRoute from '@/features/auth/ProtectedRoute'
import Dashboard from '@/features/dashboard/Dashboard'
import TaskManager from '@/features/tasks/TaskManager'
import DashboardLayout from '@/components/layout/DashboardLayout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TaskManager />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          {/* Add more routes here wrapped in DashboardLayout as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
