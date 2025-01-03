type Capitalized<T extends string> = T extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${Lowercase<R>}`
  : never;

function toCapitalized<T extends string>(str: T): Capitalized<T> {
  if (!str) {
    throw new Error("Input cannot be an empty string");
  }
  return (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()) as Capitalized<T>;
}

export default toCapitalized