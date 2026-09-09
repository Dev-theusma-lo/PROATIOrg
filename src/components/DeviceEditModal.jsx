import { useState } from 'react'
import { deleteDevice, updateDevice } from '../utils/deviceService'
import { useDistinctValues } from '../utils/useDistinctValues'
import DatalistField from './DatalistField'

export default function DeviceEditModal({ device, devices, onClose }) {
  const [form, setForm] = useState({
    tipo: device.tipo,
    modelo: device.modelo,
    numeracao: device.numeracao,
    sala: device.sala || '',
    funcionando: device.funcionando || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const tipos = useDistinctValues(devices, 'tipo', ['Notebook', 'Tablet'])
  const modelos = useDistinctValues(devices, 'modelo')
  const salas = useDistinctValues(devices, 'sala')
  const problemas = useDistinctValues(devices, 'funcionando')

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.tipo.trim() || !form.modelo.trim() || !form.numeracao.trim() || !form.sala.trim()) {
      setError('Preencha tipo, modelo, numeração e sala.')
      return
    }
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
          <DatalistField
            label="Tipo de aparelho"
            value={form.tipo}
            onChange={handleChange('tipo')}
            options={tipos}
            required
          />

          <DatalistField
            label="Modelo"
            value={form.modelo}
            onChange={handleChange('modelo')}
            options={modelos}
            required
          />

          <label className="field">
            <span>Numeração</span>
            <input
              type="text"
              value={form.numeracao}
              onChange={handleChange('numeracao')}
              required
            />
          </label>

          <DatalistField
            label="Sala"
            value={form.sala}
            onChange={handleChange('sala')}
            options={salas}
            required
          />

          <DatalistField
            label="Funcionando"
            value={form.funcionando}
            onChange={handleChange('funcionando')}
            options={problemas}
            placeholder="Deixe em branco se estiver OK."
            wide
          />
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
