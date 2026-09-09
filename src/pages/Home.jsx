import { useDevices } from '../utils/useDevices'
import NavBar from '../components/NavBar'
import DashboardHeader from '../components/DashboardHeader'
import DeviceForm from '../components/DeviceForm'
import DeviceList from '../components/DeviceList'

export default function Home() {
  const { devices, loading } = useDevices()

  return (
    <div className="app-shell">
      <NavBar />

      <main className="app-main">
        <DashboardHeader devices={devices} />
        <DeviceForm devices={devices} />
        <DeviceList devices={devices} loading={loading} />
      </main>
    </div>
  )
}
