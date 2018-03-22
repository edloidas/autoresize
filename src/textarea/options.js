export const defaultOptions = Object.freeze({
  minimumRows: 1,
  maximumRows: Infinity,
  rowHeight: null
});

export function isDynamic(options) {
  return options.rowHeight == null;
}
