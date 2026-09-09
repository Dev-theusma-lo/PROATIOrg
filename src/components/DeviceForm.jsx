import { useState } from 'react'
import { createDevice } from '../utils/deviceService'
import { useDistinctValues } from '../utils/useDistinctValues'
import DatalistField from './DatalistField'

const EMPTY_FORM = { tipo: '', modelo: '', numeracao: '', sala: '', funcionando: '' }

export default function DeviceForm({ devices }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const tipos = useDistinctValues(devices, 'tipo', ['Notebook', 'Tablet'])
  const modelos = useDistinctValues(devices, 'modelo')
  const salas = useDistinctValues(devices, 'sala')
  const problemas = useDistinctValues(devices, 'funcionando')

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.tipo.trim() || !form.modelo.trim() || !form.numeracao.trim() || !form.sala.trim()) {
      return
    }

    setSaving(true)
    setFeedback(null)
    try {
      await createDevice(form)
      setForm((prev) => ({ ...EMPTY_FORM, tipo: prev.tipo, sala: prev.sala }))
      setFeedback({ type: 'success', text: 'Aparelho cadastrado.' })
    } catch (err) {
      setFeedback({ type: 'error', text: 'Não foi possível cadastrar. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="card device-form" onSubmit={handleSubmit}>
      <h2>Cadastrar aparelho</h2>

      <div className="form-grid">
        <DatalistField
          label="Tipo de aparelho"
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

        <label className="field">
          <span>Numeração (patrimônio / série)</span>
          <input
            type="text"
            placeholder="Ex.: NB-0032"
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
          placeholder="Ex.: Sala 12 / Laboratório"
          required
          hint="Pode ser alterada depois, a qualquer momento."
        />

        <DatalistField
          label="Funcionando"
          value={form.funcionando}
          onChange={handleChange('funcionando')}
          options={problemas}
          placeholder="Deixe em branco se estiver OK"
          hint="Qualquer texto aqui marca o aparelho como estragado."
          wide
        />
      </div>

      {feedback && (
        <p className={feedback.type === 'error' ? 'form-error' : 'form-success'}>
          {feedback.text}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Salvando…' : 'Cadastrar aparelho'}
      </button>
    </form>
  )
}
