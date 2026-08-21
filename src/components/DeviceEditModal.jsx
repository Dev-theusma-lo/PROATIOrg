import { useState } from 'react'
import { deleteDevice, updateDevice } from '../utils/deviceService'

export default function DeviceEditModal({ device, onClose }) {
  const [form, setForm] = useState({
    tipo: device.tipo,
    modelo: device.modelo,
    numeracao: device.numeracao,
    funcionando: device.funcionando || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateDevice(device.id, form)
      onClose()
    } catch (err) {
      setError('Não foi possível salvar as alterações.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Excluir este aparelho definitivamente?')) return
    setSaving(true)
    try {
      await deleteDevice(device.id)
      onClose()
    } catch (err) {
      setError('Não foi possível excluir o aparelho.')
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="card modal-card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSave}
      >
        <h2>Editar aparelho</h2>

        <div className="form-grid">
          <label className="field">
            <span>Tipo de aparelho</span>
            <select value={form.tipo} onChange={handleChange('tipo')}>
              <option value="Notebook">Notebook</option>
              <option value="Tablet">Tablet</option>
            </select>
          </label>

          <label className="field">
            <span>Modelo</span>
            <input type="text" value={form.modelo} onChange={handleChange('modelo')} required />
          </label>

          <label className="field">
            <span>Numeração</span>
            <input
              type="text"
              value={form.numeracao}
              onChange={handleChange('numeracao')}
              required
            />
          </label>

          <label className="field field--wide">
            <span>Funcionando</span>
            <input
              type="text"
              placeholder="Deixe em branco se estiver OK."
              value={form.funcionando}
              onChange={handleChange('funcionando')}
            />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
            Excluir
          </button>
          <div className="modal-actions-right">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
