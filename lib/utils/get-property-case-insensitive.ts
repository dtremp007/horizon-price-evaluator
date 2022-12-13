export default function getPropertyCaseInsensitive(obj: any, key: string) {
  const keys = Object.keys(obj);
  return obj[keys.find((k) => k.toLowerCase() === key.toLowerCase())!];
}
