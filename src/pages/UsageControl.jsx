import { useState } from 'react'
import NavBar from '../components/NavBar'
import DatalistField from '../components/DatalistField'
import { useDevices } from '../utils/useDevices'
import { useDistinctValues } from '../utils/useDistinctValues'
import { useUsageLogs } from '../utils/useUsageLogs'
import { createUsageLog, deleteUsageLog, markUsageReturned } from '../utils/usageService'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function nowHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const EMPTY_FORM = {
  data: todayISO(),
  hora: nowHHMM(),
  professor: '',
  disciplina: '',
  quantidade: 1,
  tipo: '',
  modelo: '',
  observacao: '',
}

export default function UsageControl() {
  const { devices } = useDevices()
  const { logs, loading } = useUsageLogs()
  const tipos = useDistinctValues(devices, 'tipo', ['Notebook', 'Tablet'])
  const modelos = useDistinctValues(devices, 'modelo')

  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [showHistorico, setShowHistorico] = useState(true)

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.professor.trim() || !form.tipo.trim() || !form.modelo.trim() || !form.quantidade) {
      setFeedback({ type: 'error', text: 'Preencha professor, quantidade, tipo e modelo.' })
      return
    }
    setSaving(true)
    setFeedback(null)
    try {
      await createUsageLog(form)
      setForm({ ...EMPTY_FORM, data: form.data, tipo: form.tipo, modelo: form.modelo })
      setFeedback({ type: 'success', text: 'Uso registrado.' })
    } catch (err) {
      setFeedback({ type: 'error', text: 'Não foi possível registrar. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleReturn(id) {
    await markUsageReturned(id)
  }

  async function handleRemove(id) {
    if (!window.confirm('Remover este registro do histórico?')) return
    await deleteUsageLog(id)
  }

  const emUso = logs.filter((l) => !l.devolvido)
  const historico = logs.filter((l) => l.devolvido)

  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <div className="page-heading">
          <span className="eyebrow">Uso temporário</span>
          <h1>Controle de empréstimo de aparelhos</h1>
        </div>

        <form className="card" onSubmit={handleSubmit}>
          <h2>Registrar uso</h2>
          <div className="form-grid form-grid--usage">
            <label className="field">
              <span>Dia</span>
              <input type="date" value={form.data} onChange={handleChange('data')} required />
            </label>
            <label className="field">
              <span>Hora</span>
              <input type="time" value={form.hora} onChange={handleChange('hora')} required />
            </label>
            <label className="field">
              <span>Professor</span>
              <input
                type="text"
                placeholder="Nome do professor"
                value={form.professor}
                onChange={handleChange('professor')}
                required
              />
            </label>
            <label className="field">
              <span>Disciplina</span>
              <input
                type="text"
                placeholder="Ex.: Matemática"
                value={form.disciplina}
                onChange={handleChange('disciplina')}
              />
            </label>
            <label className="field">
              <span>Quantidade</span>
              <input
                type="number"
                min="1"
                value={form.quantidade}
                onChange={handleChange('quantidade')}
                required
              />
            </label>
            <DatalistField
              label="Tipo"
              value={form.tipo}
              onChange={handleChange('tipo')}
              options={tipos}
              placeholder="Notebook ou Tablet"
              required
            />
            <DatalistField
              label="Modelo"
              value={form.modelo}
              onChange={handleChange('modelo')}
              options={modelos}
              placeholder="Ex.: Dell Latitude 5420"
              required
            />
            <label className="field field--wide">
              <span>Observação (opcional)</span>
              <input
                type="text"
                placeholder="Alguma observação sobre este uso"
                value={form.observacao}
                onChange={handleChange('observacao')}
              />
            </label>
          </div>

          {feedback && (
            <p className={feedback.type === 'error' ? 'form-error' : 'form-success'}>
              {feedback.text}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Registrando…' : 'Registrar uso'}
          </button>
        </form>

        <section className="card">
          <h2>Em uso agora ({emUso.length})</h2>
          {loading ? (
            <p className="empty-state">Carregando…</p>
          ) : emUso.length === 0 ? (
            <p className="empty-state">Nenhum aparelho em uso no momento.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Dia</th>
                    <th>Hora</th>
                    <th>Professor</th>
                    <th>Disciplina</th>
                    <th>Qtd.</th>
                    <th>Tipo / Modelo</th>
                    <th>Observação</th>
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {emUso.map((log) => (
                    <tr key={log.id}>
                      <td>{formatDate(log.data)}</td>
                      <td>{log.hora}</td>
                      <td>{log.professor}</td>
                      <td>{log.disciplina || '—'}</td>
                      <td>{log.quantidade}</td>
                      <td>
                        {log.tipo} · {log.modelo}
                      </td>
                      <td>{log.observacao || '—'}</td>
                      <td>
                        <button className="btn btn-secondary btn-small" onClick={() => handleReturn(log.id)}>
                          Devolver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card">
          <div className="list-toolbar">
            <h2>Histórico devolvido ({historico.length})</h2>
            <button className="btn btn-ghost btn-small" onClick={() => setShowHistorico((v) => !v)}>
              {showHistorico ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {showHistorico &&
            (historico.length === 0 ? (
              <p className="empty-state">Nenhum registro devolvido ainda.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Dia</th>
                      <th>Hora</th>
                      <th>Professor</th>
                      <th>Disciplina</th>
                      <th>Qtd.</th>
                      <th>Tipo / Modelo</th>
                      <th>Observação</th>
                      <th aria-label="Ações" />
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((log) => (
                      <tr key={log.id}>
                        <td>{formatDate(log.data)}</td>
                        <td>{log.hora}</td>
                        <td>{log.professor}</td>
                        <td>{log.disciplina || '—'}</td>
                        <td>{log.quantidade}</td>
                        <td>
                          {log.tipo} · {log.modelo}
                        </td>
                        <td>{log.observacao || '—'}</td>
                        <td>
                          <button className="btn btn-danger btn-small" onClick={() => handleRemove(log.id)}>
                            Remover histórico
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </section>
      </main>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}
