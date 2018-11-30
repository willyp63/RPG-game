import HPUIElement from '../../engine/ui/ui-element';
import HPVector from '../../engine/physics/vector';
import { Graphics } from 'pixi.js';

const SIZE = new HPVector(240, 16);
const MARGIN_TOP = 4;

export default class TGStatusBar extends HPUIElement {

  get size() { return SIZE.plus(new HPVector(0, MARGIN_TOP)); }
  
  constructor(
    private color: number,
  ) {
    super({
      sprite: new Graphics(),
    });
  }

  paint() {
    this._sprite.clear();

    this._sprite.beginFill(this.color);
    this._sprite.lineStyle(2, 0x000000);

    this._sprite.drawRect(0,  MARGIN_TOP, SIZE.x, SIZE.y);

    this._sprite.endFill();
  }

  private get _sprite() { return <Graphics>this.sprite; }

}
