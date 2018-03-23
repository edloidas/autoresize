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

  return function requestTick(...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;
        callback(...args);
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

export function isPresent(element) {
  const { id, className, type } = element;
  if (id) {
    return document.getElementById(id) != null;
  }
  const classes = className.replace(/\s/, '.');
  const query = classes ? `${type}.${classes}` : type;
  const elements = document.querySelectorAll(query);
  return [...elements].some(el => el === element);
}
