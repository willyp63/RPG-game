import HPActor from "../core/actor";
import HPVector from "../physics/vector";
import { Graphics } from "pixi.js";

export default abstract class HPStaticShapeActor extends HPActor {

  /* @override */
  get color() { return 0xFFFFFF; }
  get borderWidth() { return 0; }
  get borderColor() { return 0x000000; }
  get cornerRadius() { return 0; }
  get isRound() { return false; }

  constructor(
    position: HPVector,
  ) {
    super(
      position,
      new Graphics(),
    );
  }

  init() {
    this._sprite.beginFill(this.color);

    let adjustedSize = this.size;
    if (this.borderWidth > 0) {
      this._sprite.lineStyle(this.borderWidth, this.borderColor);
      const borderSize = new HPVector(this.borderWidth, this.borderWidth);
      adjustedSize = this.size.minus(borderSize);
    }

    if (this.isRound) {
      this._sprite.drawEllipse(0, 0, adjustedSize.x / 2, adjustedSize.y / 2);
    } else {
      this.cornerRadius > 0
        ? this._sprite.drawRoundedRect(adjustedSize.x / -2, adjustedSize.y / -2, adjustedSize.x, adjustedSize.y, this.cornerRadius)
        : this._sprite.drawRect(adjustedSize.x / -2, adjustedSize.y / -2, adjustedSize.x, adjustedSize.y);
    }
    
    this._sprite.endFill();
  }

  private get _sprite() { return <Graphics>this.sprite; }

}
