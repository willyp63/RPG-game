import HPVector from '../../engine/physics/vector';
import HPUIGraphicElement from '../../engine/ui/elements/ui-graphic-element';

const SIZE = new HPVector(240, 16);
const MARGIN_TOP = 4;

export default class TGStatusBar extends HPUIGraphicElement {

  get size() { return SIZE.plus(new HPVector(0, MARGIN_TOP)); }
  
  constructor(private color: number) {
    super({});
  }

  paint() {
    this.sprite.clear();

    this.sprite.beginFill(this.color);
    this.sprite.lineStyle(2, 0x000000);

    this.sprite.drawRect(0,  MARGIN_TOP, SIZE.x, SIZE.y);

    this.sprite.endFill();
  }

}
