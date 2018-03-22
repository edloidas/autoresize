export function getStyles(element) {
  return window.getComputedStyle(element);
}

export function getPropertyValue(name, styles) {
  const property = styles[name];
  if (property && property.endsWith('px')) {
    return parseInt(property.slice(0, -2), 10);
  }
  return property;
}
