// A function to parse a 2D array into an object
export function parseSpreadsheet<T>(
  rows: any[][],
  headerRow: string[]
): T[] {

  return rows.map((row) => {
    return row.reduce((acc, cell, i) => {
      const key = headerRow[i];
      acc[key] = isNaN(+cell) ? cell : +cell;
      return acc;
    }, {} as T);
  });
}
