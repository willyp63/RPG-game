import HPActor from "../core/actor";
import HPVector from "../physics/vector";
import { Graphics } from "pixi.js";

export default abstract class HPStaticShapeActor extends HPActor {

  abstract get color(): number;

  /* override */
  get cornerRadius() { return 0; };
  get borderWidth() { return 0; };
  get borderColor() { return 0x000000; };

  get sprite() { return this._sprite; }

  private _sprite: Graphics;

  constructor(
    position: HPVector,
  ) {
    super(position);

    this._sprite = new Graphics();
  }

  init() {
    if (this.borderWidth > 0) this._sprite.lineStyle(this.borderWidth, this.borderColor);
    this._sprite.beginFill(this.color);
    this.cornerRadius > 0
      ? this._sprite.drawRoundedRect(this.size.x / -2, this.size.y / -2, this.size.x, this.size.y, this.cornerRadius)
      : this._sprite.drawRect(this.size.x / -2, this.size.y / -2, this.size.x, this.size.y);
    this._sprite.endFill();
  }

}
