/* eslint-disable no-unused-vars */
import defaultOptions from './options';
import { getStyles, getPropertyValue } from '../utils';

export default function autoresize(input, options) {
  const fullOptions = Object.assign({}, defaultOptions, options);
  const styles = getStyles(input);

  return () => {};
}
