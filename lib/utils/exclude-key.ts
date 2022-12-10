import { convertToPrice } from "./convert-to-price";

export function excludeKeys<
  T extends Record<string, unknown>,
  U extends keyof T
>(obj: T, keys: U[]) {
  // create a new object with the same properties as the original object
  const newObj = { ...obj };
  // loop through the array of keys
  for (const key of keys) {
    // delete the property with the given key from the new object
    delete newObj[key];
  }
  // loop over newObj and format the price
  for (const key in newObj) {
    if (key === "price") {
      newObj[key] = convertToPrice(newObj[key] as number);
    }
  }

  // return the new object
  return newObj;
}
