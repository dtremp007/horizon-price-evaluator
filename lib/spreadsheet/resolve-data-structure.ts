export function compareHeaderRows(
  header1: string[],
  header2: string[]
): boolean {
  if (header1.length !== header2.length) {
    return false;
  }

  for (let i = 0; i < header1.length; i++) {
    if (header1[i].toLowerCase() !== header2[i].toLowerCase()) {
      return false;
    }
  }

  return true;
}

export function headerRowIntersection(
  header1: string[],
  header2: string[]
): string[] {
  const header1Lower = header1.map((key) => key.toLowerCase());
  const header2Lower = header2.map((key) => key.toLowerCase());
  return header1Lower.filter((key) => header2Lower.includes(key));
}

/**
 * Creates a function that aligns a row to a mold.
 *
 * The function will fill in missing values with an empty string, and
 * truncate extra values.
 */
export function createAlignFunction(mold: string[], clay: string[]) {
  clay = clay.map((key) => key.toLowerCase());
  /**
   * An array of indexes that correspond to the mold.
   * Example:
   * ```
   * mold = ["id", "title", "price"]
   * clay = ["title", "id", "price", "category"]
   * alignmentKeys = [1, 0, 2]
   * ```
   */
  const alignmentKeys = mold.map((key) => clay.indexOf(key.toLowerCase()));

  const align = (row: any[]) => {
    return alignmentKeys.map((key) => row[key] || "");
  };
  return align;
}

type DataStructureTypes = "ARRAY OF OBJECTS" | "OBJECT";

type ResolveDataStructureOptions<T extends Record<string, any>> = {
  mold: string[];
  crucialKeys: (keyof T)[];
};

export function formatData(
  data: any,
  structure: DataStructureTypes,
  align?: (row: any[]) => any[]
): any[][] {
  switch (structure) {
    case "ARRAY OF OBJECTS":
      if (!align) return data.map((row: any) => Object.values(row));

      return data.map((row: any) => align(Object.values(row)));
    case "OBJECT":
      if (!align) return [Object.values(data)];

      return [align(Object.values<any>(data))];
  }
}

export function resolveDataStructure<T extends Record<string, any>>(
  dataset: T[] | T,
  { mold, crucialKeys }: ResolveDataStructureOptions<T>
) {
  const dataStructure = Array.isArray(dataset) ? "ARRAY OF OBJECTS" : "OBJECT";
  const dataHeaderRow = Object.keys(
    Array.isArray(dataset) ? dataset[0] : dataset
  );

  if (compareHeaderRows(mold, dataHeaderRow)) {
    // The data is already in the correct format.
    return formatData(dataset, dataStructure);
  }

  /** The elements common to both the mold and the dataHeaderRow */
  const intersection = headerRowIntersection(mold, dataHeaderRow);
  const align = createAlignFunction(mold, dataHeaderRow);

  if (crucialKeys?.every((key) => intersection.includes(key as string))) {
    return formatData(dataset, dataStructure, align);
  }

  throw new Error("Could not resolve data with this spreadsheet.");
}
