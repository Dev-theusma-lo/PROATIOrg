import { isBroken } from '../utils/deviceService'

export default function DashboardHeader({ devices }) {
  const total = devices.length
  const notebooks = devices.filter((d) => d.tipo === 'Notebook').length
  const tablets = devices.filter((d) => d.tipo === 'Tablet').length
  const comDefeito = devices.filter(isBroken).length

  return (
    <section className="dashboard">
      <div className="stat-card stat-card--main">
        <span className="stat-label">Total de aparelhos</span>
        <span className="stat-value">{total}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Notebooks</span>
        <span className="stat-value">{notebooks}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Tablets</span>
        <span className="stat-value">{tablets}</span>
      </div>
      <div className="stat-card stat-card--alert">
        <span className="stat-label">Com defeito</span>
        <span className="stat-value">{comDefeito}</span>
      </div>
    </section>
  )
}
