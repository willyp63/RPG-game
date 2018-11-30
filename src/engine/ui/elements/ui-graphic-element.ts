import { Graphics } from 'pixi.js';
import HPUIElement, { HPUIElementOptions } from '../ui-element';

export default class HPUIGraphicElement extends HPUIElement {

  get sprite(): Graphics { return <Graphics>this._sprite; }

  constructor(_options: HPUIElementOptions) {
    const options = Object.assign({ sprite: new Graphics() }, _options); 
    super(options);
  }

}
