import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import DatalistField from '../components/DatalistField'
import { useDevices } from '../utils/useDevices'
import { useDistinctValues } from '../utils/useDistinctValues'
import { createDevicesBatch } from '../utils/deviceService'

let rowUid = 0
function newRow() {
  rowUid += 1
  return { rowId: rowUid, numeracao: '', funcionando: '' }
}

export default function BatchRegister() {
  const navigate = useNavigate()
  const { devices } = useDevices()
  const tipos = useDistinctValues(devices, 'tipo', ['Notebook', 'Tablet'])
  const modelos = useDistinctValues(devices, 'modelo')
  const salas = useDistinctValues(devices, 'sala')
  const problemas = useDistinctValues(devices, 'funcionando')

  const [shared, setShared] = useState({ tipo: '', modelo: '', sala: '' })
  const [rows, setRows] = useState([newRow(), newRow(), newRow()])
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  function handleSharedChange(field) {
    return (e) => setShared((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function updateRow(rowId, field, value) {
    setRows((prev) => prev.map((r) => (r.rowId === rowId ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    setRows((prev) => [...prev, newRow()])
  }

  function removeRow(rowId) {
    setRows((prev) => prev.filter((r) => r.rowId !== rowId))
  }

  const validRows = rows.filter((r) => r.numeracao.trim().length > 0)

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback(null)

    if (!shared.tipo.trim() || !shared.modelo.trim() || !shared.sala.trim()) {
      setFeedback({ type: 'error', text: 'Preencha tipo, modelo e sala antes de salvar.' })
      return
    }
    if (validRows.length === 0) {
      setFeedback({ type: 'error', text: 'Adicione a numeração de pelo menos um aparelho.' })
      return
    }

    setSaving(true)
    try {
      const payload = validRows.map((r) => ({
        tipo: shared.tipo,
        modelo: shared.modelo,
        sala: shared.sala,
        numeracao: r.numeracao,
        funcionando: r.funcionando,
      }))
      await createDevicesBatch(payload)
      setFeedback({ type: 'success', text: `${payload.length} aparelho(s) cadastrado(s) com sucesso.` })
      setRows([newRow(), newRow(), newRow()])
    } catch (err) {
      setFeedback({ type: 'error', text: 'Não foi possível salvar o lote. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <div className="page-heading">
          <span className="eyebrow">Cadastro em lote</span>
          <h1>Vários aparelhos, mesmo tipo e modelo</h1>
        </div>

        <form className="card" onSubmit={handleSubmit}>
          <h2>Dados comuns ao lote</h2>
          <div className="form-grid">
            <DatalistField
              label="Tipo de aparelho"
              value={shared.tipo}
              onChange={handleSharedChange('tipo')}
              options={tipos}
              placeholder="Notebook ou Tablet"
              required
            />
            <DatalistField
              label="Modelo"
              value={shared.modelo}
              onChange={handleSharedChange('modelo')}
              options={modelos}
              placeholder="Ex.: Dell Latitude 5420"
              required
            />
            <DatalistField
              label="Sala"
              value={shared.sala}
              onChange={handleSharedChange('sala')}
              options={salas}
              placeholder="Ex.: Sala 12 / Laboratório"
              required
              hint="Vale para todos os aparelhos deste lote. Pode ser alterada depois, individualmente."
            />
          </div>

          <h2>Aparelhos do lote</h2>
          <div className="batch-rows">
            <div className="batch-row batch-row--header">
              <span>Numeração</span>
              <span>Problema (opcional)</span>
              <span />
            </div>
            {rows.map((row) => (
              <div className="batch-row" key={row.rowId}>
                <input
                  type="text"
                  placeholder="Ex.: NB-0032"
                  value={row.numeracao}
                  onChange={(e) => updateRow(row.rowId, 'numeracao', e.target.value)}
                />
                <input
                  type="text"
                  list={`problema-${row.rowId}`}
                  placeholder="Deixe em branco se estiver OK"
                  value={row.funcionando}
                  onChange={(e) => updateRow(row.rowId, 'funcionando', e.target.value)}
                />
                <datalist id={`problema-${row.rowId}`}>
                  {problemas.map((p) => (
                    <option value={p} key={p} />
                  ))}
                </datalist>
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => removeRow(row.rowId)}
                  disabled={rows.length === 1}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="btn btn-ghost" onClick={addRow}>
            + Adicionar linha
          </button>

          {feedback && (
            <p className={feedback.type === 'error' ? 'form-error' : 'form-success'}>
              {feedback.text}
            </p>
          )}

          <div className="batch-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
              Voltar ao painel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Salvando…' : `Salvar ${validRows.length || ''} aparelho(s)`}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
