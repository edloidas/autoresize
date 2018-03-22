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

export function throttle(callback) {
  let ticking = false;

  return function requestTick() {
    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;
        callback();
      });
    }
    ticking = true;
  };
}

export function middleValue(first, second, third) {
  if (first < second) {
    if (second < third) {
      return second;
    }
    return first < third ? third : first;
  }
  if (second > third) {
    return second;
  }
  return first > third ? third : first;
}
