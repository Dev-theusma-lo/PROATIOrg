import { useState } from 'react'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { isBroken } from '../utils/deviceService'

const HEADER_FILL = 'FF1F2A44'
const OK_FILL = 'FFE3F5EA'
const BROKEN_FILL = 'FFFCE4E4'

export default function ExportButton({ devices }) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'Inventário de Aparelhos'
      workbook.created = new Date()

      const sheet = workbook.addWorksheet('Aparelhos', {
        views: [{ state: 'frozen', ySplit: 1 }],
      })

      sheet.columns = [
        { header: 'Tipo', key: 'tipo', width: 14 },
        { header: 'Modelo', key: 'modelo', width: 32 },
        { header: 'Numeração', key: 'numeracao', width: 18 },
        { header: 'Situação', key: 'situacao', width: 34 },
      ]

      const headerRow = sheet.getRow(1)
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } }
        cell.alignment = { vertical: 'middle', horizontal: 'left' }
        cell.border = { bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } } }
      })
      headerRow.height = 22

      devices.forEach((device) => {
        const broken = isBroken(device)
        const row = sheet.addRow({
          tipo: device.tipo,
          modelo: device.modelo,
          numeracao: device.numeracao,
          situacao: broken ? device.funcionando : 'Funcionando',
        })
        const fill = broken ? BROKEN_FILL : OK_FILL
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } }
          cell.alignment = { vertical: 'middle' }
          cell.border = { bottom: { style: 'hair', color: { argb: 'FFE0E0E0' } } }
        })
        row.getCell('numeracao').font = { name: 'Consolas', size: 11 }
      })

      sheet.autoFilter = { from: 'A1', to: 'D1' }

      // Aba de resumo
      const summary = workbook.addWorksheet('Resumo')
      summary.columns = [
        { header: 'Indicador', key: 'label', width: 24 },
        { header: 'Quantidade', key: 'value', width: 16 },
      ]
      summary.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } }
      })
      summary.addRows([
        { label: 'Total de aparelhos', value: devices.length },
        { label: 'Notebooks', value: devices.filter((d) => d.tipo === 'Notebook').length },
        { label: 'Tablets', value: devices.filter((d) => d.tipo === 'Tablet').length },
        { label: 'Com defeito', value: devices.filter(isBroken).length },
      ])

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const dataAtual = new Date().toISOString().slice(0, 10)
      saveAs(blob, `aparelhos-${dataAtual}.xlsx`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button className="btn btn-secondary" onClick={handleExport} disabled={exporting || devices.length === 0}>
      {exporting ? 'Gerando…' : 'Exportar Excel'}
    </button>
  )
}
