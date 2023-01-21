export function exclude<T, Key extends keyof T>(
  t: T,
  keys: Key[],
): Omit<T, Key> {
  for (const key of keys) {
    delete t[key];
  }
  return t;
}
