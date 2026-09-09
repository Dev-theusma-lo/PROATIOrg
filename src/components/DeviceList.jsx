import { useMemo, useState } from 'react'
import DeviceEditModal from './DeviceEditModal'
import ExportButton from './ExportButton'
import { isBroken } from '../utils/deviceService'

const COLUMNS = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'modelo', label: 'Modelo' },
  { key: 'numeracao', label: 'Numeração' },
  { key: 'sala', label: 'Sala' },
]

export default function DeviceList({ devices, loading }) {
  const [filterTipo, setFilterTipo] = useState('Todos')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [sort, setSort] = useState({ key: 'modelo', direction: 'asc' })

  const tiposDisponiveis = useMemo(() => {
    const set = new Set(devices.map((d) => d.tipo).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [devices])

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' }
      return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
    })
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const result = devices.filter((d) => {
      const matchesTipo = filterTipo === 'Todos' || d.tipo === filterTipo
      const matchesSearch =
        !term ||
        d.modelo?.toLowerCase().includes(term) ||
        d.numeracao?.toLowerCase().includes(term) ||
        d.sala?.toLowerCase().includes(term)
      return matchesTipo && matchesSearch
    })

    const sorted = [...result].sort((a, b) => {
      const valueA = (a[sort.key] || '').toString()
      const valueB = (b[sort.key] || '').toString()
      const comparison = valueA.localeCompare(valueB, 'pt-BR', { numeric: true, sensitivity: 'base' })
      return sort.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [devices, filterTipo, search, sort])

  return (
    <section className="card list-card">
      <div className="list-toolbar">
        <h2>Lista de aparelhos</h2>
        <div className="list-toolbar-controls">
          <input
            type="search"
            placeholder="Buscar por modelo, numeração ou sala…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
            <option value="Todos">Todos os tipos</option>
            {tiposDisponiveis.map((tipo) => (
              <option value={tipo} key={tipo}>
                {tipo}
              </option>
            ))}
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
                {COLUMNS.map((col) => (
                  <th key={col.key}>
                    <button
                      type="button"
                      className="sort-header"
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.label}
                      {sort.key === col.key && (
                        <span className="sort-arrow">{sort.direction === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </button>
                  </th>
                ))}
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
                    <td>{device.sala}</td>
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

      {editing && (
        <DeviceEditModal device={editing} devices={devices} onClose={() => setEditing(null)} />
      )}
    </section>
  )
}
