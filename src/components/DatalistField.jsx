import { useRef } from 'react'

let uid = 0
function nextId() {
  uid += 1
  return `datalist-${uid}`
}

function useConstantId() {
  // gera um id estável por instância do componente
  const ref = useRef()
  if (!ref.current) ref.current = nextId()
  return ref.current
}

export default function DatalistField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  hint,
  wide,
}) {
  const listId = useConstantId()

  return (
    <label className={`field ${wide ? 'field--wide' : ''}`}>
      <span>{label}</span>
      <input
        type="text"
        list={listId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      <datalist id={listId}>
        {options.map((opt) => (
          <option value={opt} key={opt} />
        ))}
      </datalist>
      {hint && <small>{hint}</small>}
    </label>
  )
}
