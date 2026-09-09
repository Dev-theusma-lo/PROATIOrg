import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { logout, user } = useAuth()

  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Inventário de Aparelhos</span>
        <nav className="topbar-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Painel
          </NavLink>
          <NavLink to="/uso" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Uso temporário
          </NavLink>
          <NavLink to="/lote" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Cadastro em lote
          </NavLink>
        </nav>
      </div>
      <div className="topbar-user">
        <span>{user?.email}</span>
        <button className="btn btn-ghost btn-small" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  )
}
