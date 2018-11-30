import HPVector from '../../engine/physics/vector';
import HPUIGraphicElement from '../../engine/ui/elements/ui-graphic-element';

const RADIUS = 16;
const MARGIN_RIGHT = 4;

export default class TGAbilityIcon extends HPUIGraphicElement {

  get size() { return new HPVector(RADIUS * 2 + MARGIN_RIGHT, RADIUS * 2); }
  
  constructor() {
    super({});
  }

  paint() {
    this.sprite.clear();

    this.sprite.beginFill(0xFFFFFF);
    this.sprite.lineStyle(2, 0x000000);

    this.sprite.drawCircle(RADIUS, RADIUS, RADIUS);

    this.sprite.endFill();
  }

}
