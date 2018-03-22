import autoresizeTextarea from './src/textarea/autoresize';
import autoresizeInput from './src/input/autoresize';

export default function autoresize(element, options = {}) {
  if (element instanceof HTMLTextAreaElement) {
    return autoresizeTextarea(element, options);
  } else if (element instanceof HTMLInputElement) {
    return autoresizeInput(element, options);
  }
  // eslint-disable-next-line
  console.error('Element type is not supported. Supported item types are: HTMLTextAreaElement, HTMLInputElement.');

  return null;
}
