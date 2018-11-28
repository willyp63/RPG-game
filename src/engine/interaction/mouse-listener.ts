import HPDestroyable from "../util/destroyer";

export default class HPMouseListener implements HPDestroyable {

  constructor(private options: {
    onDown?: () => void,
    onMove?: () => void,
    onUp?: () => void,
  } = {}) {
    if (options.onDown) window.addEventListener('mousedown', options.onDown);
    if (options.onMove) window.addEventListener('mousemove', options.onMove);
    if (options.onUp) window.addEventListener('mouseup', options.onUp);
  }

  destroy() {
    if (this.options.onDown) window.removeEventListener('mousedown', this.options.onDown);
    if (this.options.onMove) window.removeEventListener('mousemove', this.options.onMove);
    if (this.options.onUp) window.removeEventListener('mouseup', this.options.onUp);
  }

}
