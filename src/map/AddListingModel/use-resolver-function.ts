import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useEffect } from "react";
import { resolveDataStructure } from "../../../lib/spreadsheet/resolve-data-structure";
import { SheetData } from "../../../pages/api/spreadsheet";
import Cookies from "js-cookie";
import { Listing } from "../../../lib/types/listings";
import { transformHeader } from "../../../lib/spreadsheet/transform-header";

type UseResolverFunctionProps<T> = {
  crucialKeys: (keyof Listing)[];
};

export function useResolverFunction<T>({
  crucialKeys,
}: UseResolverFunctionProps<T>) {
  const [sheetData, setSheetData] = useLocalStorage<SheetData[]>({
    key: "sheetData",
    defaultValue: [],
    getInitialValueInEffect: false
  });

  const resolve = useCallback(
    (data: Listing) => {
      const headerRow = sheetData.find(
        (sheet) => sheet.name === Cookies.get("range")
      )?.headerRow;

      if (!headerRow) {
        throw new Error("Could not find the header a row of the target sheet.");
      }

      return resolveDataStructure(data, {
        mold: transformHeader(headerRow),
        crucialKeys,
      });
    },
    [sheetData]
  );

  return resolve;
}
