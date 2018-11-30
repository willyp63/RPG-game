import HPUIElement from '../../engine/ui/ui-element';
import HPVector from '../../engine/physics/vector';
import { Graphics } from 'pixi.js';

const RADIUS = 16;
const MARGIN_RIGHT = 4;

export default class TGAbilityIcon extends HPUIElement {

  get size() { return new HPVector(RADIUS * 2 + MARGIN_RIGHT, RADIUS * 2); }
  
  constructor() {
    super({
      sprite: new Graphics(),
    });
  }

  paint() {
    this._sprite.clear();

    this._sprite.beginFill(0xFFFFFF);
    this._sprite.lineStyle(2, 0x000000);

    this._sprite.drawCircle(RADIUS, RADIUS, RADIUS);

    this._sprite.endFill();
  }

  private get _sprite() { return <Graphics>this.sprite; }

}
