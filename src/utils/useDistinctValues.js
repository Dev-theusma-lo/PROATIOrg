import { useMemo } from 'react'

// Retorna valores únicos e ordenados de um campo, sempre incluindo os
// "extras" (ex.: Notebook/Tablet) mesmo que ainda não existam no banco.
export function useDistinctValues(devices, field, extras = []) {
  return useMemo(() => {
    const set = new Set(extras)
    devices.forEach((d) => {
      const value = (d[field] || '').trim()
      if (value) set.add(value)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [devices, field, extras])
}
