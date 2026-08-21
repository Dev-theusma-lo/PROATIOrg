import { useMemo, useState } from 'react'
import DeviceEditModal from './DeviceEditModal'
import ExportButton from './ExportButton'
import { isBroken } from '../utils/deviceService'

export default function DeviceList({ devices, loading }) {
  const [filterTipo, setFilterTipo] = useState('Todos')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      const matchesTipo = filterTipo === 'Todos' || d.tipo === filterTipo
      const term = search.trim().toLowerCase()
      const matchesSearch =
        !term ||
        d.modelo?.toLowerCase().includes(term) ||
        d.numeracao?.toLowerCase().includes(term)
      return matchesTipo && matchesSearch
    })
  }, [devices, filterTipo, search])

  return (
    <section className="card list-card">
      <div className="list-toolbar">
        <h2>Lista de aparelhos</h2>
        <div className="list-toolbar-controls">
          <input
            type="search"
            placeholder="Buscar por modelo ou numeração…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
            <option value="Todos">Todos os tipos</option>
            <option value="Notebook">Notebook</option>
            <option value="Tablet">Tablet</option>
          </select>
          <ExportButton devices={filtered} />
        </div>
      </div>

      {loading ? (
        <p className="empty-state">Carregando aparelhos…</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">Nenhum aparelho encontrado.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Modelo</th>
                <th>Numeração</th>
                <th>Situação</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((device) => {
                const broken = isBroken(device)
                return (
                  <tr key={device.id}>
                    <td>{device.tipo}</td>
                    <td>{device.modelo}</td>
                    <td className="mono">{device.numeracao}</td>
                    <td>
                      <span className={`badge ${broken ? 'badge--broken' : 'badge--ok'}`}>
                        {broken ? device.funcionando : 'Funcionando'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-small" onClick={() => setEditing(device)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && <DeviceEditModal device={editing} onClose={() => setEditing(null)} />}
    </section>
  )
}
