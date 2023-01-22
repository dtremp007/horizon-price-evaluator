import { convertToPrice } from "./convert-to-price";

export function excludeKeys<
  T extends Record<string, unknown>,
  U extends keyof T
>(obj: T, keys?: U[]) {
  // create a new object with the same properties as the original object
  const newObj = { ...obj };
  // loop through the array of keys
  if (keys) {
    for (const key of keys) {
      // delete the property with the given key from the new object
      delete newObj[key];
    }
  }
  // return the new object
  return newObj;
}
