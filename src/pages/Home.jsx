import { useAuth } from '../context/AuthContext'
import { useDevices } from '../utils/useDevices'
import DashboardHeader from '../components/DashboardHeader'
import DeviceForm from '../components/DeviceForm'
import DeviceList from '../components/DeviceList'

export default function Home() {
  const { logout, user } = useAuth()
  const { devices, loading } = useDevices()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Inventário de Aparelhos</span>
          <h1>Painel geral</h1>
        </div>
        <div className="topbar-user">
          <span>{user?.email}</span>
          <button className="btn btn-ghost btn-small" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="app-main">
        <DashboardHeader devices={devices} />
        <DeviceForm />
        <DeviceList devices={devices} loading={loading} />
      </main>
    </div>
  )
}
