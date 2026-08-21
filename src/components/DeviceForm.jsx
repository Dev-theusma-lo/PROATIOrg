import { useState } from 'react'
import { createDevice } from '../utils/deviceService'

const EMPTY_FORM = { tipo: 'Notebook', modelo: '', numeracao: '', funcionando: '' }

export default function DeviceForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.modelo.trim() || !form.numeracao.trim()) return

    setSaving(true)
    setFeedback(null)
    try {
      await createDevice(form)
      setForm(EMPTY_FORM)
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
        <label className="field">
          <span>Tipo de aparelho</span>
          <select value={form.tipo} onChange={handleChange('tipo')}>
            <option value="Notebook">Notebook</option>
            <option value="Tablet">Tablet</option>
          </select>
        </label>

        <label className="field">
          <span>Modelo</span>
          <input
            type="text"
            placeholder="Ex.: Dell Latitude 5420"
            value={form.modelo}
            onChange={handleChange('modelo')}
            required
          />
        </label>

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

        <label className="field field--wide">
          <span>Funcionando</span>
          <input
            type="text"
            placeholder="Deixe em branco se estiver OK. Se tiver defeito, descreva aqui."
            value={form.funcionando}
            onChange={handleChange('funcionando')}
          />
          <small>Qualquer texto aqui marca o aparelho como estragado.</small>
        </label>
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
