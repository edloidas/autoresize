(function () {
  'use strict';

  var defaultOptions = Object.freeze({
    minimumRows: 1,
    maximumRows: Infinity,
    rowHeight: null,
    assumeRendered: false
  });

  function getStyles(element) {
    return window.getComputedStyle(element);
  }

  function getPropertyValue(name, styles) {
    const property = styles[name];
    if (property && property.endsWith('px')) {
      return parseInt(property.slice(0, -2), 10);
    }
    return property;
  }

  function throttle(callback) {
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

  function middleValue(first, second, third) {
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

  function isPresent(element) {
    const { id, className, type } = element;
    if (id) {
      return document.getElementById(id) != null;
    }
    const classes = className.replace(/\s/, '.');
    const query = classes ? `${type}.${classes}` : type;
    const elements = document.querySelectorAll(query);
    return [...elements].some(el => el === element);
  }

  function getBaseScrollHeight(textarea, rows) {
    const { value } = textarea;
    textarea.value = '';
    textarea.rows = 1;
    const { scrollHeight } = textarea;
    textarea.value = value;
    textarea.rows = rows;
    return scrollHeight;
  }

  function createScrollListener(maximumRows) {
    return event => {
      // Forcefully update scroll before the row counter update to prevent text
      // jumps inside the textarea, when the limit is not yet reached
      if (event.target.rows < maximumRows) {
        event.target.scrollTop = 0;
      }
    };
  }

  function createRowCountUpdater(textarea, options) {
    const baseScrollHeight = getBaseScrollHeight(textarea, options.minimumRows);
    const { minimumRows, maximumRows } = options;

    return rowHeight => {
      textarea.rows = 1;
      const rowsHeight = textarea.scrollHeight - baseScrollHeight + rowHeight;
      const rows = Math.ceil(rowsHeight / rowHeight);
      textarea.rows = middleValue(minimumRows, rows, maximumRows);
    };
  }

  function autoresize(textarea, options) {
    const { maximumRows } = options;
    let { rowHeight } = options;
    let resizeListener;

    const dynamic = rowHeight == null;

    const rowCountUpdater = createRowCountUpdater(textarea, options);
    const updateRowCount = () => rowCountUpdater(rowHeight);

    if (dynamic) {
      rowHeight = getPropertyValue('lineHeight', getStyles(textarea));
      const updateStyles = () => {
        rowHeight = getPropertyValue('lineHeight', getStyles(textarea));
        updateRowCount();
      };

      resizeListener = throttle(updateStyles);
      window.addEventListener('resize', resizeListener);
    }

    const keydownListener = throttle(updateRowCount);
    textarea.addEventListener('keydown', keydownListener);

    const scrollListener = createScrollListener(maximumRows);
    textarea.addEventListener('scroll', scrollListener);

    return () => {
      textarea.removeEventListener('keydown', keydownListener);
      textarea.removeEventListener('scroll', scrollListener);
      if (dynamic) {
        window.removeEventListener('resize', resizeListener);
      }
    };
  }

  function waitForRendered(textarea, options) {
    const fullOptions = Object.assign({}, defaultOptions, options);
    let intervalID;
    let remove = () => {};

    if (fullOptions.assumeRendered || isPresent(textarea)) {
      remove = autoresize(textarea, fullOptions);
    } else {
      intervalID = setInterval(() => {
        if (isPresent(textarea)) {
          clearInterval(intervalID);
          remove = autoresize(textarea, fullOptions);
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalID);
      remove();
    };
  }

  var defaultOptions$1 = Object.freeze({
    maxWidth: null,
    assumeRendered: false
  });

  /* eslint-disable no-unused-vars */

  function autoresize$1(input, options) {
    const fullOptions = Object.assign({}, defaultOptions$1, options);
    const styles = getStyles(input);

    return () => {};
  }

  function autoresize$2(element, options = {}) {
    if (element instanceof HTMLTextAreaElement) {
      return waitForRendered(element, options);
    } else if (element instanceof HTMLInputElement) {
      return autoresize$1(element, options);
    }
    // eslint-disable-next-line
    console.error('Element type is not supported. Supported item types are: HTMLTextAreaElement, HTMLInputElement.');

    return null;
  }

  window.autoresize = autoresize$2;

}());
