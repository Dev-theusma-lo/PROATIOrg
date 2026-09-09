import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Home from './pages/Home'
import BatchRegister from './pages/BatchRegister'
import UsageControl from './pages/UsageControl'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lote"
            element={
              <ProtectedRoute>
                <BatchRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uso"
            element={
              <ProtectedRoute>
                <UsageControl />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
