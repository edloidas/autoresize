import defaultOptions from './options';
import {
  getStyles,
  getPropertyValue,
  throttle,
  middleValue,
  isPresent
} from '../utils';

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

export default function waitForRendered(textarea, options) {
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
