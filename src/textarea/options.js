export const throttleOptions = Object.freeze({
  leading: false,
  trailing: true
});

export const defaultOptions = Object.freeze({
  updateDelay: 50,
  minimumRows: 1,
  maximumRows: Infinity,
  rowHeight: null
});

export function isDynamic(options) {
  return options.rowHeight == null;
}
