// Convert a string to CamelCase (each word capitalized, rest lowercase)
export function camelCaseName(str) {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
