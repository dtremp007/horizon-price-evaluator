// A function to parse a 2D array into an object
export function parseSpreadsheet<T>(spreadsheet: any[][]): T[] {
  const [headers, ...rows] = spreadsheet
  return rows.map((row) => {
    return row.reduce((acc, cell, i) => {
      const key = headers[i]
      acc[key] = isNaN(+cell) ? cell : +cell
      return acc
    }, {} as T)
  })
}
