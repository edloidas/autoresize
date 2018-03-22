import { defaultOptions, isDynamic } from './options';
import { getStyles, getPropertyValue, throttle, middleValue } from '../utils';

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

function dynamicAutoResize(textarea, options) {
  const { minimumRows, maximumRows } = options;
  const baseScrollHeight = getBaseScrollHeight(textarea, options.minimumRows);

  let rowHeight = getPropertyValue('lineHeight', getStyles(textarea));

  const updateRowCount = () => {
    textarea.rows = 1;
    const rowsHeight = textarea.scrollHeight - baseScrollHeight + rowHeight;
    const rows = Math.ceil(rowsHeight / rowHeight);
    textarea.rows = middleValue(minimumRows, rows, maximumRows);
  };

  const updateStyles = () => {
    rowHeight = getPropertyValue('lineHeight', getStyles(textarea));
    updateRowCount();
  };

  // eslint-disable-next-line prettier/prettier
  const keydownListener = throttle(updateRowCount);
  const scrollListener = createScrollListener(maximumRows);
  const resizeListener = throttle(updateStyles);

  textarea.addEventListener('keydown', keydownListener);
  textarea.addEventListener('scroll', scrollListener);
  window.addEventListener('resize', resizeListener);

  return () => {
    textarea.removeEventListener(keydownListener);
    textarea.removeEventListener(scrollListener);
    window.removeEventListener(resizeListener);
  };
}

function staticAutoResize(textarea, options) {
  const { minimumRows, maximumRows, rowHeight } = options;
  const baseScrollHeight = getBaseScrollHeight(textarea, options.minimumRows);

  const updateRowCount = () => {
    textarea.rows = 1;
    const rowsHeight = textarea.scrollHeight - baseScrollHeight + rowHeight;
    const rows = Math.ceil(rowsHeight / rowHeight);
    textarea.rows = middleValue(minimumRows, rows, maximumRows);
  };

  // eslint-disable-next-line prettier/prettier
  const keydownListener = throttle(updateRowCount);
  const scrollListener = createScrollListener(maximumRows);

  textarea.addEventListener('keydown', keydownListener);
  textarea.addEventListener('scroll', scrollListener);

  return () => {
    textarea.removeEventListener(keydownListener);
    textarea.removeEventListener(scrollListener);
  };
}

export default function autoresize(textarea, options) {
  const fullOptions = Object.assign({}, defaultOptions, options);
  const dynamic = isDynamic(fullOptions);

  return dynamic
    ? dynamicAutoResize(textarea, fullOptions)
    : staticAutoResize(textarea, fullOptions);
}
