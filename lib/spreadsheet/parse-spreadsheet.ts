// A function to parse a 2D array into an object
export function parseSpreadsheet<T>(
  spreadsheet: any[][] | undefined | null,
  transformHeader: (headers: string[]) => string[]
): T[] {
  if (!spreadsheet) {
    throw new Error("The spreadsheet is empty");
  }
  const [headers, ...rows] = spreadsheet;

  const transformedHeaders = transformHeader(headers);

  return rows.map((row) => {
    return row.reduce((acc, cell, i) => {
      const key = transformedHeaders[i];
      acc[key] = isNaN(+cell) ? cell : +cell;
      return acc;
    }, {} as T);
  });
}
