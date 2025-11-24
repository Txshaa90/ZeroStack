import { Table, Row, Column } from '@/store/useTableStore'

export function exportTableToCSV(table: Table): string {
  const headers = table.columns.map((c) => c.name).join(',')
  const rows = table.rows.map((row) =>
    table.columns
      .map((col) => {
        const value = row[col.id] || ''
        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  )

  return [headers, ...rows].join('\n')
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function parseCSV(csvContent: string): { headers: string[]; rows: string[][] } {
  const lines = csvContent.split('\n').filter((line) => line.trim())
  if (lines.length === 0) {
    return { headers: [], rows: [] }
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(parseCSVLine)

  return { headers, rows }
}

export function importCSVToTable(
  table: Table,
  csvContent: string
): { newRows: Row[]; errors: string[] } {
  const { headers, rows } = parseCSV(csvContent)
  const errors: string[] = []
  const newRows: Row[] = []

  if (headers.length === 0) {
    errors.push('CSV file is empty')
    return { newRows, errors }
  }

  // Map CSV headers to table columns
  const columnMap = new Map<number, string>()
  headers.forEach((header, index) => {
    const column = table.columns.find(
      (c) => c.name.toLowerCase() === header.toLowerCase()
    )
    if (column) {
      columnMap.set(index, column.id)
    }
  })

  if (columnMap.size === 0) {
    errors.push('No matching columns found in CSV')
    return { newRows, errors }
  }

  // Convert CSV rows to table rows
  rows.forEach((row, rowIndex) => {
    const newRow: Row = { id: `r${Date.now()}_${rowIndex}` }
    
    row.forEach((value, colIndex) => {
      const columnId = columnMap.get(colIndex)
      if (columnId) {
        newRow[columnId] = value
      }
    })

    // Fill in empty values for unmapped columns
    table.columns.forEach((col) => {
      if (!(col.id in newRow)) {
        newRow[col.id] = ''
      }
    })

    newRows.push(newRow)
  })

  return { newRows, errors }
}

export function exportTableToJSON(table: Table): string {
  const data = table.rows.map((row) => {
    const obj: Record<string, any> = {}
    table.columns.forEach((col) => {
      obj[col.name] = row[col.id] || ''
    })
    return obj
  })

  return JSON.stringify(data, null, 2)
}

export function downloadJSON(jsonContent: string, filename: string) {
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
